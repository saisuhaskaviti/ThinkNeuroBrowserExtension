document.addEventListener('DOMContentLoaded', async () => {
  const urlParams    = new URLSearchParams(window.location.search);
  const targetUrl    = urlParams.get('target');
  const targetDomain = urlParams.get('domain');

  // ── Load storage data & Stats ──
  const storage = await chrome.storage.local.get(['escapeUrls', 'escapeUrl', 'bypassedUrls', 'blacklist', 'stats', 'visitHistory']);
  const blacklist = storage.blacklist || [];
  const stats = storage.stats || { triggers: 0, rescued: 0 };
  const visitHistory = storage.visitHistory || {};

  let escapeUrls = storage.escapeUrls || [];
  if (escapeUrls.length === 0 && storage.escapeUrl) {
    escapeUrls = [{ title: 'Custom Destination', url: storage.escapeUrl }];
  } else if (escapeUrls.length === 0) {
    escapeUrls = [
      { title: 'Wikipedia Random', url: 'https://en.wikipedia.org/wiki/Special:Random' },
      { title: 'Google Search', url: 'https://www.google.com' }
    ];
  }

  if (!targetUrl || !targetDomain) {
    window.location.href = escapeUrls[0]?.url || 'https://www.google.com';
    return;
  }

  // ── Track Impulse Trigger & Calculate Escalating Delay ──
  const now = Date.now();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
  const cleanHost = targetDomain.replace(/^www\./, '');
  
  let recentTimestamps = (visitHistory[cleanHost] || []).filter(ts => now - ts < WINDOW_MS);
  recentTimestamps.push(now);
  visitHistory[cleanHost] = recentTimestamps;

  // Increment total trigger count
  stats.triggers = (stats.triggers || 0) + 1;
  await chrome.storage.local.set({ stats, visitHistory });

  // Calculate escalating pause duration: 1st visit -> 10s, 2nd -> 20s, 3rd -> 30s, 4th+ -> 45s
  let delaySeconds = 10;
  const visitCount = recentTimestamps.length;
  if (visitCount === 2) delaySeconds = 20;
  else if (visitCount === 3) delaySeconds = 30;
  else if (visitCount >= 4) delaySeconds = 45;

  const isExpired = urlParams.get('expired') === 'true';
  const pageTitle = document.getElementById('page-title');
  if (isExpired && pageTitle) {
    pageTitle.textContent = "Time's up!";
  }

  // Show domain in pill with escalation indicator if applicable
  const domainLabel = document.getElementById('domain-label');
  if (domainLabel) {
    if (isExpired) {
      domainLabel.textContent = `${cleanHost} • Session Expired`;
    } else if (delaySeconds > 10) {
      domainLabel.textContent = `${cleanHost} • Escalated Pause (${delaySeconds}s)`;
    } else {
      domainLabel.textContent = cleanHost;
    }
  }

  const countdownEl       = document.getElementById('countdown');
  const countdownLine     = document.getElementById('countdown-line');
  const continueBtn       = document.getElementById('continue-btn');
  const escapeBtn         = document.getElementById('escape-btn');
  const breathingText     = document.getElementById('breathing-text');
  const timerOptions      = document.getElementById('timer-options');
  const customTimerBtn    = document.getElementById('custom-timer-btn');
  const customMinsInput   = document.getElementById('custom-minutes-input');
  const recommendationsEl = document.getElementById('recommendations');
  const recoList          = document.getElementById('reco-list');
  const escapeModal       = document.getElementById('escape-modal');
  const escapeChoicesList = document.getElementById('escape-choices-list');
  const closeEscapeModal  = document.getElementById('close-escape-modal');

  let timeLeft = delaySeconds;
  if (countdownEl) countdownEl.textContent = timeLeft;

  // ── Breathing text cycle (8s total cycle: 4s breathe in, 4s breathe out) ──
  const breathCycle = ['Breathe in', 'Breathe out'];
  let breathIndex = 0;
  const rotateBreathe = () => {
    breathIndex = (breathIndex + 1) % breathCycle.length;
    breathingText.style.opacity = '0';
    setTimeout(() => {
      breathingText.textContent = breathCycle[breathIndex];
      breathingText.style.opacity = '1';
    }, 250);
  };
  const breathInterval = setInterval(rotateBreathe, 4000);

  // ── Physical Micro-Task Rotation (15 prompts, 7s interval, randomized order) ──
  const microTaskTextEl = document.getElementById('microtask-text');
  const microTasks = [
    "💧 Take a slow sip of water",
    "🤲 Stretch your wrists and fingers",
    "👀 Look at an object 20 feet away for 20 seconds",
    "🧍 Roll your shoulders back and sit up straight",
    "🫁 Take 3 deep, slow belly breaths",
    "🧘 Unclench your jaw and relax your facial muscles",
    "🚶 Stand up and do a quick 5-second stretch",
    "💆 Gently tilt your head side to side to loosen your neck",
    "🦶 Wiggle your toes and flex your ankles",
    "☀️ Blink 10 times to rehydrate your eyes",
    "🖐️ Press your palms together to stretch your forearms",
    "🥛 Take a refreshing drink of water",
    "🎧 Remove your headphones and focus on your room",
    "🌴 Drop your shoulders down away from your ears",
    "🙆 Reach both arms straight up toward the ceiling"
  ];

  // Randomize prompt list order on page load
  for (let i = microTasks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [microTasks[i], microTasks[j]] = [microTasks[j], microTasks[i]];
  }

  let microTaskIndex = 0;
  if (microTaskTextEl) {
    microTaskTextEl.textContent = microTasks[0];
  }

  const rotateMicroTask = () => {
    if (!microTaskTextEl) return;
    microTaskIndex = (microTaskIndex + 1) % microTasks.length;
    microTaskTextEl.style.opacity = '0';
    setTimeout(() => {
      microTaskTextEl.textContent = microTasks[microTaskIndex];
      microTaskTextEl.style.opacity = '1';
    }, 500);
  };
  const microTaskInterval = setInterval(rotateMicroTask, 7000);

  // ── Countdown timer ──
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (countdownEl) countdownEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(breathInterval);
      clearInterval(microTaskInterval);

      breathingText.style.opacity = '0';
      setTimeout(() => {
        breathingText.textContent = 'Ready';
        breathingText.style.opacity = '1';
      }, 250);

      // Unlock buttons
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      continueBtn.style.cursor = 'pointer';
      if (countdownLine) countdownLine.style.display = 'none';

      // Show timer options and recommendations
      if (timerOptions) timerOptions.classList.remove('hidden');
      if (recommendationsEl) recommendationsEl.classList.remove('hidden');
    }
  }, 1000);

  // Helper to resolve current tab ID
  const getTabId = async () => {
    let tid = parseInt(urlParams.get('tabId'), 10);
    if (!tid || isNaN(tid)) {
      try {
        const tab = await chrome.tabs.getCurrent();
        if (tab) tid = tab.id;
      } catch {}
    }
    return tid;
  };

  // Helper function to activate tab-bound session timer and redirect
  const startTimedSession = async (mins) => {
    const tid = await getTabId();
    const { tabBypasses } = await chrome.storage.local.get(['tabBypasses']);
    const bypasses = tabBypasses || {};

    if (tid) {
      bypasses[tid] = {
        domain: targetDomain,
        expiry: Date.now() + mins * 60 * 1000,
        timed: true
      };
      await chrome.storage.local.set({ tabBypasses: bypasses });
    }
    window.location.href = targetUrl;
  };

  // ── Continue (untimed/15-min fallback bypass) ──
  continueBtn.addEventListener('click', async () => {
    if (continueBtn.disabled) return;
    const tid = await getTabId();
    const { tabBypasses } = await chrome.storage.local.get(['tabBypasses']);
    const bypasses = tabBypasses || {};

    if (tid) {
      bypasses[tid] = {
        domain: targetDomain,
        expiry: Date.now() + 15 * 60 * 1000, // 15 min fallback for this tab
        timed: true
      };
      await chrome.storage.local.set({ tabBypasses: bypasses });
    }
    window.location.href = targetUrl;
  });

  // ── Preset Timed Access Chips ──
  document.querySelectorAll('.timer-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const mins = parseInt(chip.dataset.minutes, 10);
      startTimedSession(mins);
    });
  });

  // ── Custom Timer Button ──
  if (customTimerBtn && customMinsInput) {
    customTimerBtn.addEventListener('click', () => {
      const mins = parseInt(customMinsInput.value, 10);
      if (isNaN(mins) || mins <= 0) return;
      startTimedSession(mins);
    });
  }

  const recordRescuedSession = async () => {
    stats.rescued = (stats.rescued || 0) + 1;
    await chrome.storage.local.set({ stats });
  };

  // ── Escape Button Modal Handler ──
  escapeBtn.addEventListener('click', async () => {
    await recordRescuedSession();
    if (escapeUrls.length <= 1) {
      window.location.href = escapeUrls[0]?.url || 'https://www.google.com';
      return;
    }

    // Show choice modal if multiple escape URLs exist
    if (escapeChoicesList && escapeModal) {
      escapeChoicesList.innerHTML = '';
      escapeUrls.forEach(item => {
        const choiceBtn = document.createElement('a');
        choiceBtn.href = item.url;
        choiceBtn.className = 'flex flex-col p-3 rounded-2xl transition-all hover:brightness-110';
        choiceBtn.style.cssText = 'background-color: var(--surface-container-high); color: var(--on-surface); text-decoration: none;';
        
        choiceBtn.onclick = async () => {
          await recordRescuedSession();
        };

        const title = document.createElement('span');
        title.className = 'text-sm font-semibold';
        title.textContent = item.title || item.url;
        
        const sub = document.createElement('span');
        sub.className = 'text-xs truncate opacity-70';
        sub.textContent = item.url;

        choiceBtn.appendChild(title);
        choiceBtn.appendChild(sub);
        escapeChoicesList.appendChild(choiceBtn);
      });
      escapeModal.classList.remove('hidden');
    }
  });

  if (closeEscapeModal && escapeModal) {
    closeEscapeModal.addEventListener('click', () => {
      escapeModal.classList.add('hidden');
    });
  }

  // ── Recommendations: Open Tabs & Productivity History ──
  loadRecommendations();

  async function loadRecommendations() {
    try {
      const candidates = [];

      // 1. Check currently open tabs first!
      const openTabs = await chrome.tabs.query({ currentWindow: true });
      openTabs.forEach(tab => {
        if (!tab.url) return;
        try {
          const u = new URL(tab.url);
          const host = u.hostname.replace(/^www\./, '');
          if (host.includes('chrome-extension') || host.includes('newtab')) return;
          if (blacklist.some(b => host.includes(b))) return;
          if (host === targetDomain.replace(/^www\./, '')) return;

          candidates.push({
            title: tab.title || host,
            url: tab.url,
            domain: host,
            isTab: true,
            tabId: tab.id
          });
        } catch {}
      });

      // 2. Query History for productivity sites if we need more recommendations
      if (candidates.length < 4) {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const historyItems = await chrome.history.search({
          text: '',
          startTime: thirtyDaysAgo,
          maxResults: 100
        });

        const domainCounts = {};
        historyItems.forEach(item => {
          try {
            const host = new URL(item.url).hostname.replace(/^www\./, '');
            if (blacklist.some(b => host.includes(b))) return;
            if (host.includes('chrome-extension') || host.includes('newtab')) return;
            if (host === targetDomain.replace(/^www\./, '')) return;
            if (candidates.some(c => c.domain === host)) return; // skip if already in open tabs
            
            domainCounts[host] = (domainCounts[host] || 0) + (item.visitCount || 1);
          } catch {}
        });

        const sortedHosts = Object.entries(domainCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4 - candidates.length);

        sortedHosts.forEach(([domain]) => {
          candidates.push({
            title: domain,
            url: `https://${domain}`,
            domain: domain,
            isTab: false
          });
        });
      }

      if (candidates.length === 0 || !recoList) return;

      recoList.innerHTML = '';
      candidates.slice(0, 4).forEach(item => {
        const btn = document.createElement('a');
        btn.className = 'flex items-center justify-between px-4 py-3 rounded-2xl transition-all hover:brightness-95 active:scale-98 text-left';
        btn.style.cssText = 'background-color: var(--surface-container); color: var(--on-surface); text-decoration: none;';
        
        if (item.isTab) {
          btn.href = '#';
          btn.onclick = (e) => {
            e.preventDefault();
            chrome.tabs.update(item.tabId, { active: true });
          };
        } else {
          btn.href = item.url;
        }

        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center gap-3 overflow-hidden';

        const favicon = document.createElement('img');
        favicon.src = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`;
        favicon.width = 20;
        favicon.height = 20;
        favicon.className = 'rounded shrink-0';
        favicon.alt = '';

        const label = document.createElement('span');
        label.className = 'text-sm font-medium truncate';
        label.textContent = item.title;

        leftDiv.appendChild(favicon);
        leftDiv.appendChild(label);
        btn.appendChild(leftDiv);

        if (item.isTab) {
          const tabBadge = document.createElement('span');
          tabBadge.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2';
          tabBadge.style.cssText = 'background-color: var(--secondary-container); color: var(--on-secondary-container);';
          tabBadge.textContent = 'Open Tab';
          btn.appendChild(tabBadge);
        }

        recoList.appendChild(btn);
      });
    } catch (e) {
      console.warn('Could not load recommendations:', e);
    }
  }
});
