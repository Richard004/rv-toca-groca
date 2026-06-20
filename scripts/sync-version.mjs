#!/usr/bin/env node
/**
 * Sync release fingerprint across index.html, version.json, import map, assets.
 * Run before deploy: node scripts/sync-version.mjs
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

const updates = read('js/updates.js');
const versionMatch = updates.match(/export const APP_VERSION = '([^']+)'/);
if (!versionMatch) {
  console.error('Could not read APP_VERSION from js/updates.js');
  process.exit(1);
}
const version = versionMatch[1];

let build = 'dev';
try {
  build = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  console.warn('git not available — using build id "dev"');
}

const released = new Date().toISOString().slice(0, 10);
write('version.json', `${JSON.stringify({ version, build, released }, null, 2)}\n`);

const modules = [
  'main.js', 'game.js', 'rooms.js', 'world-map.js', 'characters.js',
  'sprites.js', 'food-catalog.js', 'catalog.js', 'furniture-sprites.js',
  'storage.js', 'updates.js', 'fullscreen.js', 'version.js'
];
const scopeEntries = modules.map((m) => `      "./${m}": "js/${m}?v=${version}"`).join(',\n');
const importMapBlock = `  <script type="importmap" id="toca-importmap">
  {
    "scopes": {
      "js/": {
${scopeEntries}
      }
    }
  }
  </script>`;

const inlineBootBlock = `  <script id="toca-boot-inline">
  (function () {
    var V = '${version}';
    var KEY = 'toca-groca-asset-version';
    var RELOAD = 'toca-groca-reload-once';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { r.unregister(); });
      });
    }
    if (localStorage.getItem(KEY) !== V) {
      localStorage.setItem(KEY, V);
      if (!sessionStorage.getItem(RELOAD)) {
        sessionStorage.setItem(RELOAD, '1');
        var u = new URL(location.href);
        u.searchParams.set('_v', V);
        location.replace(u.toString());
      } else {
        sessionStorage.removeItem(RELOAD);
      }
    }
  })();
  </script>`;

write('js/version.js', `/** Bumped by scripts/sync-version.mjs — do not edit by hand. */
export const ASSET_VERSION = '${version}';
export const BUILD_ID = '${build}';
`);

let index = read('index.html');
index = index.replace(/<meta name="toca-version" content="[^"]*">/, `<meta name="toca-version" content="${version}">`);
if (!index.includes('name="toca-version"')) {
  index = index.replace('<title>', `<meta name="toca-version" content="${version}">\n  <title>`);
}
if (index.includes('id="toca-importmap"')) {
  index = index.replace(/<script type="importmap" id="toca-importmap">[\s\S]*?<\/script>/, importMapBlock);
} else {
  index = index.replace('</head>', `${importMapBlock}\n</head>`);
}
if (index.includes('id="toca-boot-inline"')) {
  index = index.replace(/<script id="toca-boot-inline">[\s\S]*?<\/script>/, inlineBootBlock);
} else {
  index = index.replace('</head>', `${inlineBootBlock}\n</head>`);
}
index = index.replace(/href="css\/styles\.css[^"]*"/, `href="css/styles.css?v=${version}"`);
index = index.replace(/href="manifest\.json[^"]*"/, `href="manifest.json?v=${version}"`);
index = index.replace(/href="icons\/app-icon\.svg[^"]*"/g, `href="icons/app-icon.svg?v=${version}"`);
index = index.replace(/<script src="js\/boot\.js[^"]*"><\/script>\s*/g, '');
if (/<script type="module" src="js\/main\.js[^"]*"><\/script>/.test(index)) {
  index = index.replace(/<script type="module" src="js\/main\.js[^"]*"><\/script>/, `<script type="module" src="js/main.js?v=${version}"></script>`);
} else {
  index = index.replace(
    /(<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js"><\/script>)/,
    `$1\n  <script type="module" src="js/main.js?v=${version}"></script>`
  );
}
if (!index.includes('js/main.js?v=')) {
  throw new Error('sync-version: failed to inject main.js module script into index.html');
}
write('index.html', index);

let manifest = read('manifest.json');
manifest = manifest.replace(/"start_url": "[^"]*"/, `"start_url": "./?v=${version}"`);
write('manifest.json', manifest);

console.log(`Synced asset fingerprint: v${version} (${build})`);