document.addEventListener('DOMContentLoaded', async () => {
  const domainEl   = document.getElementById('current-domain');
  const toggleBtn  = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggle-text');
  const settingsBtn= document.getElementById('settings-btn');

  let currentDomain = '';
  let isBlacklisted = false;
  let blacklist = [];

  // ── Settings (Setup immediately so it works even if url check returns early) ──
  settingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

  // ── Get current tab domain ──
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0 && tabs[0].url) {
    try {
      const url = new URL(tabs[0].url);
      if (url.protocol.startsWith('http')) {
        currentDomain = url.hostname.replace(/^www\./, '');
        domainEl.textContent = currentDomain;
      } else {
        domainEl.textContent = 'Not a web page';
        toggleBtn.disabled = true;
        toggleText.textContent = 'Unavailable';
        return;
      }
    } catch {
      domainEl.textContent = 'Invalid URL';
      toggleBtn.disabled = true;
      toggleText.textContent = 'Unavailable';
      return;
    }
  }

  const activeTabId = tabs.length > 0 ? tabs[0].id : null;

  // ── Load storage & check active tab timer & stats ──
  const storage = await chrome.storage.local.get(['blacklist', 'tabBypasses', 'stats']);
  blacklist = storage.blacklist || [];
  const tabBypasses = storage.tabBypasses || {};
  const stats = storage.stats || { triggers: 0, rescued: 0 };

  const rescuedBadge = document.getElementById('popup-rescued-badge');
  if (rescuedBadge) {
    rescuedBadge.textContent = `${stats.rescued || 0} Rescued`;
  }

  const updateUI = () => {
    isBlacklisted = blacklist.some(d => currentDomain.includes(d));
    toggleBtn.disabled = false;

    // Check if active tab has a session timer
    const entry = activeTabId ? tabBypasses[activeTabId] : null;
    let timerText = '';

    if (entry && entry.expiry && Date.now() < entry.expiry) {
      const minsLeft = Math.ceil((entry.expiry - Date.now()) / 60000);
      timerText = ` (${minsLeft}m left)`;
    }

    if (isBlacklisted) {
      toggleText.textContent = `✓ On Pause List${timerText} — Remove`;
      toggleBtn.style.backgroundColor = 'var(--surface-container-high)';
      toggleBtn.style.color           = 'var(--on-surface)';
    } else {
      toggleText.textContent = 'Add to Pause List';
      toggleBtn.style.backgroundColor = 'var(--secondary)';
      toggleBtn.style.color           = 'var(--on-secondary)';
    }
  };

  updateUI();

  // ── Toggle domain ──
  toggleBtn.addEventListener('click', async () => {
    toggleBtn.disabled = true;
    if (isBlacklisted) {
      blacklist = blacklist.filter(d => !currentDomain.includes(d));
    } else {
      blacklist.push(currentDomain);
    }
    await chrome.storage.local.set({ blacklist });
    updateUI();
  });

  // Event listeners are set up above
});
