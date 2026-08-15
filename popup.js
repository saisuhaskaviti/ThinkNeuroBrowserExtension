document.addEventListener('DOMContentLoaded', async () => {
  const domainEl   = document.getElementById('current-domain');
  const toggleBtn  = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggle-text');
  const settingsBtn= document.getElementById('settings-btn');

  let currentDomain = '';
  let isBlacklisted = false;
  let blacklist = [];

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
        return;
      }
    } catch {
      domainEl.textContent = 'Invalid URL';
      return;
    }
  }

  // ── Load blacklist ──
  const storage = await chrome.storage.local.get(['blacklist']);
  blacklist = storage.blacklist || [];

  const updateUI = () => {
    isBlacklisted = blacklist.some(d => currentDomain.includes(d));
    toggleBtn.disabled = false;

    if (isBlacklisted) {
      toggleText.textContent = '✓ On Pause List — Remove';
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

  // ── Settings ──
  settingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
});
