document.addEventListener('DOMContentLoaded', async () => {
  const newDomainInput = document.getElementById('new-domain');
  const addBtn         = document.getElementById('add-btn');
  const blacklistContainer = document.getElementById('blacklist-container');
  const errorMsg       = document.getElementById('error-msg');
  const escapeTitleInput = document.getElementById('escape-title');
  const escapeUrlInput   = document.getElementById('escape-url');
  const saveUrlBtn       = document.getElementById('save-url-btn');
  const escapeUrlsList   = document.getElementById('escape-urls-container');
  const urlMsg           = document.getElementById('url-msg');
  const themeBtns        = document.querySelectorAll('#theme-chooser button');
  const themeSavedMsg    = document.getElementById('theme-saved-msg');
  const modeLightBtn     = document.getElementById('mode-light');
  const modeDarkBtn      = document.getElementById('mode-dark');

  // ── Load settings ──
  let blacklist = [];
  let escapeUrls = [];
  let activeTheme = 'lime';
  let isDarkMode = false;

  try {
    const storage = await chrome.storage.local.get(['blacklist', 'escapeUrls', 'escapeUrl', 'themeColor', 'darkMode']);
    blacklist = storage.blacklist || ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'reddit.com', 'tiktok.com'];
    
    // Support legacy single escapeUrl migration
    if (storage.escapeUrls && storage.escapeUrls.length > 0) {
      escapeUrls = storage.escapeUrls;
    } else if (storage.escapeUrl) {
      escapeUrls = [{ title: 'Custom Destination', url: storage.escapeUrl }];
    } else {
      escapeUrls = [
        { title: 'Wikipedia Random', url: 'https://en.wikipedia.org/wiki/Special:Random' },
        { title: 'Google Search', url: 'https://www.google.com' }
      ];
    }

    activeTheme = storage.themeColor || 'lime';
    isDarkMode = storage.darkMode === true;
    highlightActiveTheme(activeTheme);
    highlightActiveMode(isDarkMode);
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  // ── Helpers ──
  function highlightActiveTheme(name) {
    themeBtns.forEach(btn => {
      const isActive = btn.dataset.theme === name;
      btn.style.outline = isActive ? '3px solid var(--on-surface)' : '3px solid transparent';
      btn.style.outlineOffset = '3px';
    });
  }

  function highlightActiveMode(dark) {
    const activeStyle = 'background-color: var(--secondary); color: var(--on-secondary);';
    const inactiveStyle = 'background-color: var(--surface-container-high); color: var(--on-surface);';
    modeLightBtn.style.cssText = dark ? inactiveStyle : activeStyle;
    modeDarkBtn.style.cssText  = dark ? activeStyle : inactiveStyle;
  }

  // ── Stats Elements ──
  const statRescued  = document.getElementById('stat-rescued');
  const statTriggers = document.getElementById('stat-triggers');
  const statRate     = document.getElementById('stat-rate');
  const statPhantom  = document.getElementById('stat-phantom');
  const phantomToggleBtn = document.getElementById('phantom-toggle-btn');

  let isPhantomEnabled = true;

  // ── Anti-Bypass Modal Elements ──
  const antiBypassModal  = document.getElementById('antibypass-modal');
  const targetDomainName = document.getElementById('target-domain-name');
  const mathProblemEl    = document.getElementById('math-problem');
  const mathAnswerInput  = document.getElementById('math-answer');
  const cancelAntiBypass = document.getElementById('cancel-antibypass-btn');
  const confirmAntiBypass= document.getElementById('confirm-antibypass-btn');
  const antiBypassError  = document.getElementById('antibypass-error');

  let pendingDeleteIndex = null;
  let expectedMathAnswer = 0;

  // ── Render Mindful Progress Stats ──
  const renderStats = async () => {
    const { stats, phantomTabKiller } = await chrome.storage.local.get(['stats', 'phantomTabKiller']);
    const rescued  = stats?.rescued || 0;
    const triggers = stats?.triggers || 0;
    const rate     = triggers > 0 ? Math.round((rescued / triggers) * 100) : 0;
    const phantom  = stats?.phantomKilled || 0;

    if (statRescued)  statRescued.textContent  = rescued;
    if (statTriggers) statTriggers.textContent = triggers;
    if (statRate)     statRate.textContent     = `${rate}%`;
    if (statPhantom)  statPhantom.textContent  = phantom;

    isPhantomEnabled = phantomTabKiller !== false;
    updatePhantomBtn(isPhantomEnabled);
  };

  function updatePhantomBtn(enabled) {
    if (!phantomToggleBtn) return;
    if (enabled) {
      phantomToggleBtn.textContent = 'Enabled';
      phantomToggleBtn.style.cssText = 'background-color: var(--secondary); color: var(--on-secondary);';
    } else {
      phantomToggleBtn.textContent = 'Disabled';
      phantomToggleBtn.style.cssText = 'background-color: var(--surface-container-high); color: var(--on-surface-variant);';
    }
  }

  if (phantomToggleBtn) {
    phantomToggleBtn.addEventListener('click', async () => {
      isPhantomEnabled = !isPhantomEnabled;
      await chrome.storage.local.set({ phantomTabKiller: isPhantomEnabled });
      updatePhantomBtn(isPhantomEnabled);
    });
  }

  const openAntiBypassModal = (domain, index) => {
    pendingDeleteIndex = index;
    if (targetDomainName) targetDomainName.textContent = domain;
    
    // Generate Math Challenge
    const num1 = Math.floor(Math.random() * 40) + 12;
    const num2 = Math.floor(Math.random() * 40) + 12;
    expectedMathAnswer = num1 + num2;
    if (mathProblemEl) mathProblemEl.textContent = `${num1} + ${num2} = ?`;
    if (mathAnswerInput) mathAnswerInput.value = '';
    if (antiBypassError) antiBypassError.classList.add('hidden');
    
    if (antiBypassModal) antiBypassModal.classList.remove('hidden');
  };

  if (cancelAntiBypass && antiBypassModal) {
    cancelAntiBypass.addEventListener('click', () => {
      antiBypassModal.classList.add('hidden');
      pendingDeleteIndex = null;
    });
  }

  if (confirmAntiBypass && antiBypassModal) {
    confirmAntiBypass.addEventListener('click', () => {
      const userAnswer = parseInt(mathAnswerInput.value, 10);
      if (userAnswer === expectedMathAnswer) {
        if (pendingDeleteIndex !== null && pendingDeleteIndex >= 0) {
          blacklist.splice(pendingDeleteIndex, 1);
          saveAndRender();
        }
        antiBypassModal.classList.add('hidden');
        pendingDeleteIndex = null;
      } else {
        if (antiBypassError) antiBypassError.classList.remove('hidden');
      }
    });
  }

  // ── Render blacklist ──
  const renderList = () => {
    blacklistContainer.innerHTML = '';
    if (blacklist.length === 0) {
      const li = document.createElement('li');
      li.className = 'text-sm italic px-2 py-4';
      li.style.color = 'var(--on-surface-variant)';
      li.textContent = 'No sites paused — add one above.';
      blacklistContainer.appendChild(li);
      return;
    }

    blacklist.forEach((domain, index) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center px-4 py-3 rounded-2xl transition-all';
      li.style.backgroundColor = 'var(--surface-container-high)';

      const span = document.createElement('span');
      span.className = 'text-sm font-medium';
      span.style.color = 'var(--on-surface)';
      span.textContent = domain;

      const del = document.createElement('button');
      del.className = 'text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:brightness-110 active:scale-95';
      del.style.cssText = 'background-color: var(--surface-container); color: var(--on-surface-variant);';
      del.textContent = 'Remove';
      del.onclick = () => openAntiBypassModal(domain, index);

      li.appendChild(span);
      li.appendChild(del);
      blacklistContainer.appendChild(li);
    });
  };

  // ── Render Escape URLs ──
  const renderEscapeUrls = () => {
    if (!escapeUrlsList) return;
    escapeUrlsList.innerHTML = '';

    if (escapeUrls.length === 0) {
      const li = document.createElement('li');
      li.className = 'text-sm italic px-2 py-3';
      li.style.color = 'var(--on-surface-variant)';
      li.textContent = 'No escape destinations set.';
      escapeUrlsList.appendChild(li);
      return;
    }

    escapeUrls.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center px-4 py-3 rounded-2xl transition-all';
      li.style.backgroundColor = 'var(--surface-container-high)';

      const infoDiv = document.createElement('div');
      infoDiv.className = 'flex flex-col';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'text-sm font-semibold';
      titleSpan.style.color = 'var(--on-surface)';
      titleSpan.textContent = item.title || item.url;

      const urlSpan = document.createElement('span');
      urlSpan.className = 'text-xs truncate max-w-xs';
      urlSpan.style.color = 'var(--on-surface-variant)';
      urlSpan.textContent = item.url;

      infoDiv.appendChild(titleSpan);
      infoDiv.appendChild(urlSpan);

      const del = document.createElement('button');
      del.className = 'text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:brightness-110 active:scale-95';
      del.style.cssText = 'background-color: var(--surface-container); color: var(--on-surface-variant);';
      del.textContent = 'Remove';
      del.onclick = async () => {
        escapeUrls.splice(index, 1);
        await chrome.storage.local.set({ escapeUrls });
        renderEscapeUrls();
      };

      li.appendChild(infoDiv);
      li.appendChild(del);
      escapeUrlsList.appendChild(li);
    });
  };

  const saveAndRender = async () => {
    await chrome.storage.local.set({ blacklist });
    renderList();
  };

  // ── Add domain ──
  const addDomain = () => {
    const raw = newDomainInput.value.trim().toLowerCase();
    if (!raw) { showError('Please enter a domain.'); return; }
    let clean = raw.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (!clean.includes('.')) { showError('Enter a valid domain (e.g. reddit.com)'); return; }
    if (blacklist.includes(clean)) { showError('Already in your list.'); return; }
    blacklist.push(clean);
    newDomainInput.value = '';
    hideError();
    saveAndRender();
  };

  const showError = (msg) => { errorMsg.textContent = msg; errorMsg.classList.remove('hidden'); };
  const hideError = ()    => { errorMsg.classList.add('hidden'); };

  addBtn.addEventListener('click', addDomain);
  newDomainInput.addEventListener('keypress', e => { if (e.key === 'Enter') addDomain(); });

  // ── Theme chooser ──
  themeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = btn.dataset.theme;
      await chrome.storage.local.set({ themeColor: name });
      highlightActiveTheme(name);
      showMsg(themeSavedMsg);
      setTimeout(() => window.location.reload(), 600);
    });
  });

  // ── Dark / Light mode ──
  modeLightBtn.addEventListener('click', async () => {
    await chrome.storage.local.set({ darkMode: false });
    highlightActiveMode(false);
    setTimeout(() => window.location.reload(), 400);
  });

  modeDarkBtn.addEventListener('click', async () => {
    await chrome.storage.local.set({ darkMode: true });
    highlightActiveMode(true);
    setTimeout(() => window.location.reload(), 400);
  });

  // ── Escape URLs Save ──
  saveUrlBtn.addEventListener('click', async () => {
    let url = escapeUrlInput.value.trim();
    let title = escapeTitleInput.value.trim() || 'Escape Target';
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;

    escapeUrls.push({ title, url });
    await chrome.storage.local.set({ escapeUrls, escapeUrl: url });

    escapeUrlInput.value = '';
    escapeTitleInput.value = '';
    showMsg(urlMsg);
    renderEscapeUrls();
  });

  renderList();
  renderEscapeUrls();
  renderStats();
});
