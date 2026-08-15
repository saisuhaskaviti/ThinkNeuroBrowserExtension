// ── Background Service Worker ──
// Intercepts navigation to blacklisted URLs.
// Enforces TAB-BOUND bypass sessions: Closing a tab or opening a new tab forces a fresh pause screen!

// ── Daily EST Reset Helper ──
async function checkDailyESTReset() {
  try {
    const estDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
    const storage = await chrome.storage.local.get(['lastResetESTDate']);
    if (storage.lastResetESTDate !== estDate) {
      await chrome.storage.local.set({
        stats: { triggers: 0, rescued: 0, phantomKilled: 0 },
        lastResetESTDate: estDate
      });
    }
  } catch {}
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  await checkDailyESTReset();

  const url = new URL(details.url);
  if (!url.protocol.startsWith('http')) return;

  const storage = await chrome.storage.local.get(['blacklist', 'tabBypasses']);
  const blacklist = storage.blacklist || [];
  const tabBypasses = storage.tabBypasses || {};

  const hostname = url.hostname.replace(/^www\./, '');
  const isBlacklisted = blacklist.some(domain => hostname.includes(domain));

  if (!isBlacklisted) return;

  // Check tab-specific bypass
  const tabId = details.tabId;
  const tabEntry = tabBypasses[tabId];

  if (tabEntry && tabEntry.domain && hostname.includes(tabEntry.domain)) {
    if (tabEntry.expiry) {
      if (Date.now() < tabEntry.expiry) {
        return; // Valid tab-specific session
      }
    }
    // Expired — clean it up for this tab
    delete tabBypasses[tabId];
    await chrome.storage.local.set({ tabBypasses });
  }

  // Intercept navigation & redirect to pause screen with tabId
  const pauseUrl = chrome.runtime.getURL(
    `pause.html?target=${encodeURIComponent(details.url)}&domain=${encodeURIComponent(hostname)}&tabId=${tabId}`
  );
  chrome.tabs.update(tabId, { url: pauseUrl });
});

// ── Tab Closure Cleanup ──
// Immediately destroy bypass/timer state when a tab is closed!
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const storage = await chrome.storage.local.get(['tabBypasses']);
  const tabBypasses = storage.tabBypasses || {};
  if (tabBypasses[tabId]) {
    delete tabBypasses[tabId];
    await chrome.storage.local.set({ tabBypasses });
  }
});

// ── Content Script Session Query Message Handler ──
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_TAB_SESSION') {
    const tabId = sender.tab ? sender.tab.id : null;
    if (!tabId) {
      sendResponse({ active: false });
      return false;
    }

    chrome.storage.local.get(['tabBypasses'], (res) => {
      const tabBypasses = res.tabBypasses || {};
      const entry = tabBypasses[tabId];

      if (entry && entry.expiry && Date.now() < entry.expiry) {
        sendResponse({ active: true, expiry: entry.expiry, domain: entry.domain, tabId });
      } else {
        sendResponse({ active: false });
      }
    });
    return true; // Keeps messaging channel open for async response
  }

  if (request.type === 'EXPIRE_TAB_SESSION') {
    const tabId = sender.tab ? sender.tab.id : null;
    if (tabId) {
      chrome.storage.local.get(['tabBypasses'], (res) => {
        const tabBypasses = res.tabBypasses || {};
        delete tabBypasses[tabId];
        chrome.storage.local.set({ tabBypasses }, () => {
          sendResponse({ success: true });
        });
      });
      return true;
    }
  }
});

// ── PHANTOM TAB KILLER ENGINE ──
// Tracks inactive background tabs. If a blacklisted tab is left inactive for > 3 mins, silently closes it!
const tabLastActive = {};
const PHANTOM_INACTIVE_LIMIT_MS = 3 * 60 * 1000; // 3 minutes

// Track tab activations
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabLastActive[activeInfo.tabId] = Date.now();
});

// Track tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    tabLastActive[tabId] = Date.now();
  }
});

// Setup background check alarm (runs every 30 seconds)
chrome.alarms.create('phantomCheck', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'phantomCheck') return;

  const storage = await chrome.storage.local.get(['blacklist', 'phantomTabKiller', 'stats']);
  if (storage.phantomTabKiller === false) return; // Feature disabled by user

  const blacklist = storage.blacklist || [];
  const stats = storage.stats || { triggers: 0, rescued: 0, phantomKilled: 0 };
  const now = Date.now();

  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    if (!tab.url || tab.active) {
      if (tab.active) tabLastActive[tab.id] = now;
      return;
    }

    try {
      const url = new URL(tab.url);
      const host = url.hostname.replace(/^www\./, '');
      const isBlacklisted = blacklist.some((b) => host.includes(b));

      if (isBlacklisted) {
        const lastActive = tabLastActive[tab.id];
        if (lastActive && now - lastActive > PHANTOM_INACTIVE_LIMIT_MS) {
          // Silently close tab to prevent tab hoarding!
          chrome.tabs.remove(tab.id);
          delete tabLastActive[tab.id];
          stats.phantomKilled = (stats.phantomKilled || 0) + 1;
          chrome.storage.local.set({ stats });
        } else if (!lastActive) {
          tabLastActive[tab.id] = now;
        }
      }
    } catch {}
  });
});

// Default configuration on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({
      blacklist: ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'reddit.com', 'tiktok.com'],
      darkMode: false,
      themeColor: 'lime',
      phantomTabKiller: true,
      tabBypasses: {}
    });
  }
});
