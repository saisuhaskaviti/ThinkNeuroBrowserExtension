// ── Timer Overlay Content Script ──
// Injected into pages when a timed session is active.
// Shows a draggable floating pill with time remaining.

(function () {
  // Prevent double injection
  if (document.getElementById('pp-timer-overlay')) return;

  let intervalId = null;

  function createOverlay(expiryTime, domain) {
    const overlay = document.createElement('div');
    overlay.id = 'pp-timer-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 100px;
      background: rgba(30, 30, 37, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);
      cursor: grab;
      user-select: none;
      transition: opacity 0.3s ease;
      letter-spacing: 0.01em;
    `;

    // Blob dot (themed)
    const dot = document.createElement('span');
    dot.style.cssText = `
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #C8E158;
      flex-shrink: 0;
      display: inline-block;
    `;

    const label = document.createElement('span');
    label.id = 'pp-timer-label';
    label.textContent = 'Loading...';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: rgba(255,255,255,0.5);
      font-size: 16px;
      line-height: 1;
      padding: 0 0 0 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
    `;
    closeBtn.title = 'Hide timer';
    closeBtn.onclick = () => overlay.remove();

    overlay.appendChild(dot);
    overlay.appendChild(label);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // ── Dragging ──
    let isDragging = false, startX, startY, startRight, startTop;

    overlay.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
      isDragging = true;
      overlay.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startTop   = rect.top;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      const dy = e.clientY - startY;
      overlay.style.right = Math.max(8, startRight + dx) + 'px';
      overlay.style.top   = Math.max(8, startTop  + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      overlay.style.cursor = 'grab';
    });

    // ── Countdown ──
    function updateLabel() {
      const remaining = Math.max(0, expiryTime - Date.now());
      if (remaining <= 0) {
        label.textContent = 'Time\'s up!';
        overlay.style.background = 'rgba(186, 26, 26, 0.95)';
        dot.style.background = '#FFB4AB';
        clearInterval(intervalId);
        
        // Immediately notify background to expire session and redirect tab!
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: 'EXPIRE_TAB_SESSION' }, () => {
            const pauseUrl = chrome.runtime.getURL(
              `pause.html?target=${encodeURIComponent(location.href)}&domain=${encodeURIComponent(domain)}&expired=true`
            );
            location.href = pauseUrl;
          });
        }, 1000);
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      label.textContent = `${mins}:${secs.toString().padStart(2, '0')} left`;
    }

    updateLabel();
    intervalId = setInterval(updateLabel, 1000);
  }

  // ── Check if this tab has an active session ──
  function checkSession() {
    chrome.runtime.sendMessage({ type: 'GET_TAB_SESSION' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response && response.active && response.expiry) {
        createOverlay(response.expiry, response.domain || location.hostname);
      }
    });
  }

  // Small delay so DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSession);
  } else {
    checkSession();
  }
})();
