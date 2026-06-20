#!/usr/bin/env node
/**
 * Sync release fingerprint across index.html, boot.js, sw.js, version.json, version.js.
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

write('js/version.js', `/** Bumped by scripts/sync-version.mjs on each release — do not edit by hand. */
export const ASSET_VERSION = '${version}';
export const BUILD_ID = '${build}';

export const JS_MODULES = [
  'main.js',
  'game.js',
  'rooms.js',
  'world-map.js',
  'characters.js',
  'sprites.js',
  'food-catalog.js',
  'catalog.js',
  'furniture-sprites.js',
  'storage.js',
  'updates.js',
  'fullscreen.js',
  'version.js'
];
`);

let boot = read('js/boot.js');
boot = boot.replace(/const BOOT_VERSION = '[^']+'/, `const BOOT_VERSION = '${version}'`);
write('js/boot.js', boot);

let sw = read('sw.js');
sw = sw.replace(/const CACHE_VERSION = '[^']+'/, `const CACHE_VERSION = '${version}'`);
write('sw.js', sw);

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
index = index.replace(/href="css\/styles\.css[^"]*"/, `href="css/styles.css?v=${version}"`);
index = index.replace(/href="manifest\.json[^"]*"/, `href="manifest.json?v=${version}"`);
index = index.replace(/href="icons\/app-icon\.svg[^"]*"/g, `href="icons/app-icon.svg?v=${version}"`);
index = index.replace(/src="js\/boot\.js[^"]*"/, `src="js/boot.js?v=${version}"`);
write('index.html', index);

let manifest = read('manifest.json');
manifest = manifest.replace(/"start_url": "[^"]*"/, `"start_url": "./?v=${version}"`);
write('manifest.json', manifest);

console.log(`Synced asset fingerprint: v${version} (${build})`);