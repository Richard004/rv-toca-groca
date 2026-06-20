/**
 * Cache-safe bootstrap — one reload picks up a new release.
 */
(function () {
  const BOOT_VERSION = '1.6.4';
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

  async function unregisterServiceWorkers() {
    if (!('serviceWorker' in navigator)) return;
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
  }

  function buildImportMap(version) {
    const jsBase = new URL('js/', new URL(BASE, location.origin)).href;
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
    const link = document.getElementById('toca-styles');
    if (link && link.getAttribute('href') !== href) link.href = href;
  }

  function loadMainModule(version) {
    if (document.getElementById('toca-main')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.id = 'toca-main';
    script.src = `${BASE}js/main.js?v=${version}`;
    script.onerror = () => console.error('[Toca Groca] Failed to load main.js');
    document.body.appendChild(script);
  }

  async function hardRefreshTo(version) {
    await clearAllCaches();
    await unregisterServiceWorkers();
    const url = new URL(BASE, location.origin);
    url.searchParams.set('_v', version);
    location.replace(url.toString());
  }

  async function boot() {
    let meta = { version: BOOT_VERSION };
    try {
      meta = await fetchVersionMeta();
    } catch (err) {
      console.warn('[Toca Groca] Using embedded version metadata', err);
    }

    const storedVersion = localStorage.getItem('toca-groca-asset-version');
    const needsRefresh = storedVersion !== meta.version;

    if (needsRefresh) {
      localStorage.setItem('toca-groca-asset-version', meta.version);
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        await hardRefreshTo(meta.version);
        return;
      }
      sessionStorage.removeItem(RELOAD_KEY);
    } else {
      sessionStorage.removeItem(RELOAD_KEY);
    }

    if (!document.getElementById('toca-importmap')) {
      injectImportMap(buildImportMap(meta.version));
    }
    versionStylesheet(meta.version);
    loadMainModule(meta.version);
  }

  window.__tocaRefreshApp = async function refreshApp() {
    localStorage.removeItem('toca-groca-asset-version');
    sessionStorage.removeItem(RELOAD_KEY);
    await clearAllCaches();
    await unregisterServiceWorkers();
    try {
      const meta = await fetchVersionMeta();
      await hardRefreshTo(meta.version);
    } catch {
      const url = new URL(BASE, location.origin);
      url.searchParams.set('_v', String(Date.now()));
      location.replace(url.toString());
    }
  };

  boot();
})();