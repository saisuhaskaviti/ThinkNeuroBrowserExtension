document.addEventListener('DOMContentLoaded', async () => {
  const newDomainInput = document.getElementById('new-domain');
  const addBtn         = document.getElementById('add-btn');
  const blacklistContainer = document.getElementById('blacklist-container');
  const errorMsg       = document.getElementById('error-msg');
  const emptyState     = document.getElementById('empty-state');
  const escapeUrlInput = document.getElementById('escape-url');
  const saveUrlBtn     = document.getElementById('save-url-btn');
  const urlMsg         = document.getElementById('url-msg');
  const themeBtns      = document.querySelectorAll('#theme-chooser button');
  const themeSavedMsg  = document.getElementById('theme-saved-msg');

  // ── Load all settings ──
  let blacklist = [];
  let activeTheme = 'lime';
  try {
    const storage = await chrome.storage.local.get(['blacklist', 'escapeUrl', 'themeColor']);
    blacklist = storage.blacklist || ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'reddit.com', 'tiktok.com'];
    if (storage.escapeUrl) escapeUrlInput.value = storage.escapeUrl;
    activeTheme = storage.themeColor || 'lime';
    highlightActiveTheme(activeTheme);
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

  function showMsg(el, ms = 2000) {
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), ms);
  }

  // ── Render blacklist ──
  const renderList = () => {
    blacklistContainer.innerHTML = '';

    if (blacklist.length === 0) {
      emptyState.style.display = 'block';
      emptyState.textContent = 'No sites paused — add one above.';
      blacklistContainer.appendChild(emptyState);
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
      del.onclick = () => { blacklist.splice(index, 1); saveAndRender(); };

      li.appendChild(span);
      li.appendChild(del);
      blacklistContainer.appendChild(li);
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
      // Reload so theme.js picks up the new value and updates CSS vars
      setTimeout(() => window.location.reload(), 800);
    });
  });

  // ── Escape URL ──
  saveUrlBtn.addEventListener('click', async () => {
    let url = escapeUrlInput.value.trim();
    if (url && !url.startsWith('http')) url = 'https://' + url;
    escapeUrlInput.value = url;
    await chrome.storage.local.set({ escapeUrl: url });
    showMsg(urlMsg);
  });

  // Initial render
  renderList();
});
