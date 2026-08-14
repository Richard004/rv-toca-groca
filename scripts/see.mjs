#!/usr/bin/env node
/**
 * Photograph the real game so Grok can look.
 * Usage: node scripts/see.mjs [shotName]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'audit', 'see');
const BASE = process.env.SEE_URL || 'http://127.0.0.1:5173/rv-toca-groca/';
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ALL_SHOTS = [
  { id: 'splash', title: 'First impression' },
  { id: 'living', title: 'Furnished living — hero' },
  { id: 'kitchen', title: 'Kitchen' },
  { id: 'bedroom', title: 'Bedroom' },
  { id: 'bathroom', title: 'Bathroom' },
  { id: 'garden', title: 'Garden' },
  { id: 'cottage', title: 'Cottage' },
  { id: 'sketch', title: 'Anetčin svět' },
  { id: 'empty', title: 'Empty living' },
  { id: 'tools', title: 'Tools drawer' }
];

async function waitForServer(url, ms = 20000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not up */ }
    await sleep(250);
  }
  throw new Error(`See: ${url} did not come up`);
}

function startPreview() {
  const child = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5173'], {
    cwd: root,
    stdio: 'ignore',
    shell: true,
    windowsHide: true
  });
  return child;
}

async function hook(page) {
  return page.evaluate(() => window.__tocaSee?.ready === true);
}

async function call(page, name, ...args) {
  return page.evaluate(({ name, args }) => {
    const api = window.__tocaSee;
    if (!api || typeof api[name] !== 'function') throw new Error(`no hook ${name}`);
    return api[name](...args);
  }, { name, args });
}

async function ready(page) {
  await page.waitForFunction(() => window.__tocaSee?.ready === true, { timeout: 15000 });
}

async function afterPaint(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await sleep(220);
}

async function shoot(page, id) {
  const file = path.join(OUT, `${id}.png`);
  await page.screenshot({ path: file, fullPage: false });
  const facts = await call(page, 'inspectScene').catch(() => ({ error: 'inspect failed' }));
  return { id, file, facts };
}

async function runShot(page, id) {
  if (id === 'splash') {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await ready(page);
    return shoot(page, id);
  }

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await ready(page);

  if (id === 'empty') {
    await call(page, 'startWorld', 'empty');
    await call(page, 'showGame');
    await afterPaint(page);
    return shoot(page, id);
  }

  await call(page, 'startWorld', 'furnished');
  await call(page, 'showGame');
  await afterPaint(page);

  if (id === 'living') return shoot(page, id);
  if (id === 'kitchen') { await call(page, 'goRoom', 'kitchen', false); await afterPaint(page); return shoot(page, id); }
  if (id === 'bedroom') { await call(page, 'goRoom', 'bedroom', false); await afterPaint(page); return shoot(page, id); }
  if (id === 'bathroom') { await call(page, 'goRoom', 'bathroom', false); await afterPaint(page); return shoot(page, id); }
  if (id === 'garden') { await call(page, 'goRoom', 'garden', false); await afterPaint(page); return shoot(page, id); }
  if (id === 'cottage') { await call(page, 'travel', 'cottage'); await sleep(2600); await afterPaint(page); return shoot(page, id); }
  if (id === 'sketch') { await call(page, 'travel', 'anetka'); await sleep(2600); await afterPaint(page); return shoot(page, id); }
  if (id === 'tools') {
    await page.evaluate(() => document.getElementById('tools-drawer')?.classList.add('open'));
    await sleep(280);
    return shoot(page, id);
  }
  throw new Error(`unknown shot ${id}`);
}

async function launchBrowser() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch { /* try next */ }
  }
  return chromium.launch({ headless: true });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const only = process.argv[2];
  const shots = only ? ALL_SHOTS.filter((s) => s.id === only) : ALL_SHOTS;
  if (!shots.length) throw new Error(`unknown shot ${only}`);

  let preview;
  try {
    await waitForServer(BASE, 1500);
  } catch {
    preview = startPreview();
    await waitForServer(BASE, 25000);
  }

  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: PHONE.width, height: PHONE.height },
    deviceScaleFactor: PHONE.deviceScaleFactor,
    isMobile: PHONE.isMobile,
    hasTouch: PHONE.hasTouch,
    locale: 'cs-CZ'
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  const report = { at: new Date().toISOString(), base: BASE, shots: [] };
  try {
    for (const shot of shots) {
      const row = await runShot(page, shot.id);
      report.shots.push({ ...shot, ...row });
      console.log(`see ${shot.id} → ${path.relative(root, row.file)}`);
    }
  } finally {
    await browser.close();
    if (preview) preview.kill();
  }

  fs.writeFileSync(path.join(OUT, 'facts.json'), JSON.stringify(report, null, 2));
  console.log(`wrote ${path.relative(root, path.join(OUT, 'facts.json'))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
