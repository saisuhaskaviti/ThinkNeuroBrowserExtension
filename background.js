chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only intercept top-level frame navigation
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  // Ignore chrome-extension:// and other internal schemas
  if (!url.protocol.startsWith('http')) return;

  const storage = await chrome.storage.local.get(['blacklist', 'bypassedUrls']);
  const blacklist = storage.blacklist || [];
  const bypassedUrls = storage.bypassedUrls || {};

  // Check if current hostname matches any blacklist entry
  const isBlacklisted = blacklist.some(domain => url.hostname.includes(domain));
  
  if (isBlacklisted) {
    // Check if this domain is currently bypassed (e.g. within the last 15 minutes)
    const bypassTime = bypassedUrls[url.hostname];
    const now = Date.now();
    const BYPASS_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    if (bypassTime && (now - bypassTime) < BYPASS_DURATION_MS) {
      // User is in the bypassed window, let them proceed
      return;
    }

    // Redirect to pause screen
    const pauseUrl = chrome.runtime.getURL(`pause.html?target=${encodeURIComponent(details.url)}&domain=${encodeURIComponent(url.hostname)}`);
    chrome.tabs.update(details.tabId, { url: pauseUrl });
  }
});

// Setup default blacklist on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.local.set({
      blacklist: ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'reddit.com', 'tiktok.com']
    });
  }
});
