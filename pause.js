document.addEventListener('DOMContentLoaded', async () => {
  const urlParams   = new URLSearchParams(window.location.search);
  const targetUrl   = urlParams.get('target');
  const targetDomain = urlParams.get('domain');

  const storage = await chrome.storage.local.get(['escapeUrl', 'bypassedUrls']);
  const customEscapeUrl = storage.escapeUrl || 'https://en.wikipedia.org/wiki/Special:Random';

  if (!targetUrl || !targetDomain) {
    window.location.href = customEscapeUrl;
    return;
  }

  // Show the domain in the pill
  const domainLabel = document.getElementById('domain-label');
  if (domainLabel) {
    domainLabel.textContent = targetDomain.replace(/^www\./, '');
  }

  const countdownEl   = document.getElementById('countdown');
  const continueBtn   = document.getElementById('continue-btn');
  const escapeBtn     = document.getElementById('escape-btn');
  const breathingText = document.getElementById('breathing-text');

  let timeLeft = 10;

  // ── Breathing text sync ──
  // The CSS breathe animation is 4s per cycle (expand = breathe in, contract = breathe out)
  // We alternate the label every 4 seconds to match
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

  // Kick off breath cycling (every 4s, matches CSS animation)
  const breathInterval = setInterval(rotateBreathe, 4000);

  // ── 10-second countdown ──
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (countdownEl) countdownEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(breathInterval);

      // Fade to "Ready"
      breathingText.style.opacity = '0';
      setTimeout(() => {
        breathingText.textContent = 'Ready';
        breathingText.style.opacity = '1';
      }, 250);

      // Unlock continue button
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      continueBtn.style.cursor = 'pointer';

      // Remove countdown line
      const countdownWrap = countdownEl?.closest('p');
      if (countdownWrap) countdownWrap.style.display = 'none';
    }
  }, 1000);

  // ── Continue (proceed to site) ──
  continueBtn.addEventListener('click', async () => {
    if (continueBtn.disabled) return;
    const bypassedUrls = storage.bypassedUrls || {};
    bypassedUrls[targetDomain] = Date.now();
    await chrome.storage.local.set({ bypassedUrls });
    window.location.href = targetUrl;
  });

  // ── Escape (go to productive site) ──
  escapeBtn.addEventListener('click', () => {
    window.location.href = customEscapeUrl;
  });
});
