#!/usr/bin/env node
/**
 * Design iteration loop — screenshot + score until Toca-like thresholds met.
 * Usage: node scripts/design-loop.mjs [baseUrl] [maxRounds]
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://localhost:3000/';
const MAX_ROUNDS = Number(process.argv[3]) || 1;
const OUT = path.join(root, 'feedback', 'out');
const PORTRAIT = { width: 390, height: 844, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const THRESHOLDS = {
  minEntities: 16,
  minCoverage: 0.48,
  minMaxHeight: 0.30,
  portraitFit: true
};

async function scoreLiving(page) {
  return page.evaluate(() => {
    const panel = document.querySelector('.room-panel[data-room="living"]')
      || document.querySelector('.room-panel');
    const inner = panel?.querySelector('.room-pan-inner');
    const vp = panel?.querySelector('.room-pan-viewport');
    const vpW = vp?.clientWidth || 1;
    const vpH = vp?.clientHeight || 1;
    const innerW = inner?.offsetWidth || 1;
    const portraitFit = innerW <= vpW * 1.08;
    const hasPortraitArt = !!panel?.querySelector('.room-bg--portrait');
    const entities = [...(panel?.querySelectorAll('.entity') || [])];
    const boxes = entities.map((el) => {
      const l = parseFloat(el.style.left) || 0;
      const t = parseFloat(el.style.top) || 0;
      return { l, t, w: el.offsetWidth, h: el.offsetHeight, r: l + el.offsetWidth, b: t + el.offsetHeight };
    });
    const covered = new Set();
    const grid = 8;
    for (const b of boxes) {
      for (let gx = 0; gx < grid; gx++) {
        for (let gy = 0; gy < grid; gy++) {
          const px = (gx + 0.5) / grid * innerW;
          const py = (gy + 0.5) / grid * vpH;
          if (px >= b.l && px <= b.r && py >= b.t && py <= b.b) covered.add(`${gx},${gy}`);
        }
      }
    }
    const heights = boxes.map((b) => b.h).sort((a, b) => b - a);
    return {
      entityCount: entities.length,
      coverage: covered.size / (grid * grid),
      maxHeightRatio: heights[0] ? heights[0] / vpH : 0,
      portraitFit,
      hasPortraitArt,
      innerW,
      vpW
    };
  });
}

async function capture(page, name) {
  fs.mkdirSync(OUT, { recursive: true });
  const panel = await page.$('.room-panel[data-room="living"]') || await page.$('.room-panel');
  const file = path.join(OUT, name);
  if (panel) await panel.screenshot({ path: file });
  else await page.screenshot({ path: file });
  return file;
}

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(PORTRAIT);

  let passed = false;
  const log = [];

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.click('#btn-new-world');
    await sleep(400);
    await page.click('[data-world="furnished"]');
    await sleep(2200);

    const metrics = await scoreLiving(page);
    const shot = await capture(page, `design-loop-r${round}-living.png`);
    const ok =
      metrics.entityCount >= THRESHOLDS.minEntities &&
      metrics.coverage >= THRESHOLDS.minCoverage &&
      metrics.maxHeightRatio >= THRESHOLDS.minMaxHeight &&
      metrics.portraitFit === THRESHOLDS.portraitFit &&
      metrics.hasPortraitArt;

    const entry = { round, metrics, shot, ok, thresholds: THRESHOLDS };
    log.push(entry);
    console.log(`\n=== ROUND ${round} ===`);
    console.log(JSON.stringify(entry, null, 2));

    if (ok) {
      passed = true;
      fs.copyFileSync(shot, path.join(OUT, 'DESIGN-APPROVED-living.png'));
      break;
    }
  }

  fs.writeFileSync(path.join(OUT, 'design-loop-log.json'), `${JSON.stringify({ passed, log }, null, 2)}\n`);
  await browser.close();
  process.exit(passed ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });