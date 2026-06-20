/**
 * Cache-safe bootstrap — kids only need a normal reload.
 * Fetches version.json (never cached), busts stale HTML/JS/CSS on mismatch.
 */
(function () {
  const BOOT_VERSION = '1.6.1';
  const BOOT_BUILD = '1e2b2e2';
  const RELOAD_KEY = 'toca-groca-reload-attempt';

  const JS_MODULES = [
    'main.js', 'game.js', 'rooms.js', 'world-map.js', 'characters.js',
    'sprites.js', 'food-catalog.js', 'catalog.js', 'furniture-sprites.js',
    'storage.js', 'updates.js', 'fullscreen.js', 'version.js'
  ];

  function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
      if (s.src && /\/js\/boot\.js/.test(s.src)) {
        const url = new URL(s.src, location.href);
        return url.pathname.replace(/js\/boot\.js.*$/, '');
      }
    }
    const match = location.pathname.match(/^(.*\/rv-toca-groca\/)/);
    if (match) return match[1];
    if (location.pathname.endsWith('/')) return location.pathname;
    const slash = location.pathname.lastIndexOf('/');
    return slash >= 0 ? location.pathname.slice(0, slash + 1) : '/';
  }

  const BASE = getBasePath();

  async function fetchVersionMeta() {
    const res = await fetch(`${BASE}version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
    });
    if (!res.ok) throw new Error(`version.json ${res.status}`);
    return res.json();
  }

  async function clearAllCaches() {
    if (!('caches' in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  function buildImportMap(version) {
    const jsBase = `${BASE}js/`;
    const scope = {};
    JS_MODULES.forEach((file) => {
      scope[`./${file}`] = `${jsBase}${file}?v=${version}`;
    });
    return { scopes: { [jsBase]: scope } };
  }

  function injectImportMap(map) {
    document.getElementById('toca-importmap')?.remove();
    const el = document.createElement('script');
    el.type = 'importmap';
    el.id = 'toca-importmap';
    el.textContent = JSON.stringify(map);
    document.head.prepend(el);
  }

  function versionStylesheet(version) {
    const href = `${BASE}css/styles.css?v=${version}`;
    let link = document.getElementById('toca-styles');
    if (!link) {
      link = document.createElement('link');
      link.id = 'toca-styles';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== href) link.href = href;
  }

  async function registerServiceWorker(version) {
    if (!('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.register(`${BASE}sw.js?v=${version}`, { scope: BASE });
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            location.reload();
          }
        });
      });
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    } catch (err) {
      console.warn('[Toca Groca] Service worker registration failed', err);
    }
  }

  function loadMainModule(version) {
    if (document.getElementById('toca-main')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.id = 'toca-main';
    script.src = `${BASE}js/main.js?v=${version}`;
    document.body.appendChild(script);
  }

  async function hardRefreshTo(version, build) {
    await clearAllCaches();
    const url = new URL(location.href);
    url.searchParams.set('_v', version);
    url.searchParams.set('_b', build);
    location.replace(url.toString());
  }

  async function boot() {
    let meta = { version: BOOT_VERSION, build: BOOT_BUILD };
    try {
      meta = await fetchVersionMeta();
    } catch (err) {
      console.warn('[Toca Groca] Using embedded version metadata', err);
    }

    const storedVersion = localStorage.getItem('toca-groca-asset-version');
    const storedBuild = localStorage.getItem('toca-groca-asset-build');
    const fingerprint = `${meta.version}:${meta.build}`;
    const storedFingerprint = `${storedVersion}:${storedBuild}`;
    const needsRefresh = storedFingerprint !== fingerprint;

    if (needsRefresh) {
      localStorage.setItem('toca-groca-asset-version', meta.version);
      localStorage.setItem('toca-groca-asset-build', meta.build);
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        await hardRefreshTo(meta.version, meta.build);
        return;
      }
      sessionStorage.removeItem(RELOAD_KEY);
    } else {
      sessionStorage.removeItem(RELOAD_KEY);
    }

    injectImportMap(buildImportMap(meta.version));
    versionStylesheet(meta.version);
    await registerServiceWorker(meta.version);
    loadMainModule(meta.version);
  }

  window.__tocaRefreshApp = async function refreshApp() {
    localStorage.removeItem('toca-groca-asset-version');
    localStorage.removeItem('toca-groca-asset-build');
    sessionStorage.removeItem(RELOAD_KEY);
    await clearAllCaches();
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
    try {
      const meta = await fetchVersionMeta();
      await hardRefreshTo(meta.version, meta.build);
    } catch {
      const url = new URL(location.href);
      url.searchParams.set('_v', String(Date.now()));
      location.replace(url.toString());
    }
  };

  boot();
})();