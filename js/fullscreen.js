const HINT_KEY = 'toca-groca-fullscreen-hint';

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && window.innerWidth < 1200);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function canUseFullscreenApi() {
  return document.fullscreenEnabled && typeof document.documentElement.requestFullscreen === 'function';
}

function updateFullscreenUi() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;

  const active = !!document.fullscreenElement || isStandalone();
  document.body.classList.toggle('is-fullscreen', active);
  btn.classList.toggle('is-active', active);
  btn.title = active ? 'Zmenšit obrazovku' : 'Celá obrazovka';
  btn.setAttribute('aria-label', btn.title);
  btn.textContent = active ? '⤢' : '⛶';

  window.dispatchEvent(new Event('toca-layout-change'));
}

function showInstallHint() {
  const { showToast } = window.__tocaGroca || {};
  if (!showToast) return;

  if (isIOS()) {
    showToast('Na iPhonu: Sdílet → Přidat na plochu 📲 — pak je to celá obrazovka!');
    return;
  }
  showToast('Klepni ⛶ nahoře pro celou obrazovku bez lišty prohlížeče');
}

function maybeShowFirstHint() {
  if (localStorage.getItem(HINT_KEY)) return;
  if (!isMobileDevice() || isStandalone()) return;

  localStorage.setItem(HINT_KEY, '1');
  setTimeout(showInstallHint, 1200);
}

export async function toggleFullscreen() {
  if (isStandalone()) return;

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (canUseFullscreenApi()) {
      await document.documentElement.requestFullscreen();
      return;
    }
    showInstallHint();
  } catch {
    showInstallHint();
  }
}

export function initFullscreen() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;

  const showControl = isMobileDevice() || canUseFullscreenApi();
  btn.hidden = !showControl;

  if (isStandalone()) {
    document.body.classList.add('standalone-mode', 'is-fullscreen');
    btn.hidden = true;
    return;
  }

  btn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenUi);
  updateFullscreenUi();
}

export function onGameStarted() {
  maybeShowFirstHint();
}