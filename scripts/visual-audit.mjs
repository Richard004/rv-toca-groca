#!/usr/bin/env node
/**
 * Visual audit — screenshots + entity size metrics per room.
 * Usage: node scripts/visual-audit.mjs [baseUrl]
 * Output: audit/screenshots/*.png + audit/report.json
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://localhost:3000/';
const OUT_DIR = path.join(root, 'audit', 'screenshots');
const PORTRAIT = { width: 390, height: 844, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ROOMS = ['living', 'kitchen', 'bedroom', 'bathroom', 'garden', 'cottage-living', 'cottage-garden'];

async function collectMetrics(page) {
  return page.evaluate(() => {
    const strip = document.getElementById('world-strip');
    const panels = [...document.querySelectorAll('.room-panel')];
    const scrollLeft = strip?.scrollLeft || 0;
    const panel = panels.find((p) => {
      const left = p.offsetLeft;
      return scrollLeft >= left - 20 && scrollLeft < left + p.offsetWidth - 20;
    }) || panels[0];
    const vp = panel?.querySelector('.room-pan-viewport');
    const inner = panel?.querySelector('.room-pan-inner');
    const vpH = vp?.clientHeight || 0;
    const vpW = vp?.clientWidth || 0;
    const innerW = inner?.offsetWidth || 0;
    const entities = [...(panel?.querySelectorAll('.entity') || [])].map((el) => ({
      w: el.offsetWidth,
      h: el.offsetHeight,
      xRel: parseFloat(el.style.left) / Math.max(innerW, 1),
      hRatio: el.offsetHeight / Math.max(vpH, 1)
    }));
    const heights = entities.map((e) => e.h).sort((a, b) => b - a);
    const inView = entities.filter((e) => e.xRel >= 0.38 && e.xRel <= 0.62);
    return {
      vpH,
      vpW,
      innerW,
      entityCount: entities.length,
      maxHeightRatio: heights[0] ? heights[0] / vpH : 0,
      medianHeightRatio: heights.length
        ? heights[Math.floor(heights.length / 2)] / vpH
        : 0,
      heroBandCount: inView.length,
      entities
    };
  });
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(PORTRAIT);

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.click('#btn-new-world');
  await sleep(400);
  await page.click('[data-world="furnished"]');
  await sleep(2000);

  const report = { base: BASE, rooms: {}, checks: {} };

  for (const roomId of ROOMS) {
    await page.evaluate((id) => {
      const btn = document.querySelector(`.room-tab[data-room="${id}"]`);
      btn?.click();
    }, roomId);
    await sleep(1200);

    const metrics = await collectMetrics(page);
    const shotPath = path.join(OUT_DIR, `${roomId}.png`);
    const panel = await page.$('.room-panel.active, .room-panel');
    if (panel) {
      await panel.screenshot({ path: shotPath });
    } else {
      await page.screenshot({ path: shotPath });
    }

    report.rooms[roomId] = {
      ...metrics,
      screenshot: `audit/screenshots/${roomId}.png`
    };
    console.log(`📸 ${roomId}: ${metrics.entityCount} entities, hero=${metrics.heroBandCount}, maxH=${(metrics.maxHeightRatio * 100).toFixed(0)}%`);
  }

  report.checks = {
    minEntityCount: Math.min(...Object.values(report.rooms).map((r) => r.entityCount)),
    minHeroBand: Math.min(...Object.values(report.rooms).map((r) => r.heroBandCount)),
    minMaxHeightRatio: Math.min(...Object.values(report.rooms).map((r) => r.maxHeightRatio)),
    pass: false
  };
  report.checks.pass =
    report.checks.minEntityCount >= 5 &&
    report.checks.minHeroBand >= 3 &&
    report.checks.minMaxHeightRatio >= 0.18;

  const reportPath = path.join(root, 'audit', 'report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  await browser.close();

  console.log('\n=== VISUAL AUDIT ===');
  console.log(JSON.stringify(report.checks, null, 2));
  console.log(`Report: ${reportPath}`);

  if (!report.checks.pass) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});