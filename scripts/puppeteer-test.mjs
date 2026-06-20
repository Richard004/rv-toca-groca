#!/usr/bin/env node
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'https://richard004.github.io/rv-toca-groca/';
const PORTRAIT = { width: 390, height: 844, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function collectPage(page, label) {
  const errors = [];
  const pageErrors = [];
  const onConsole = (msg) => { if (msg.type() === 'error') errors.push(msg.text()); };
  const onPageError = (err) => pageErrors.push(err.message);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  await sleep(2000);

  const state = await page.evaluate(() => ({
    href: location.href,
    hasMainModule: !!document.querySelector('script[type="module"][src*="main.js"]'),
    hasImportMap: !!document.getElementById('toca-importmap'),
    storedVersion: localStorage.getItem('toca-groca-asset-version'),
    metaVersion: document.querySelector('meta[name="toca-version"]')?.content,
    hasTocaGroca: typeof window.__tocaGroca !== 'undefined',
    swControlled: !!navigator.serviceWorker?.controller,
    gameActive: document.getElementById('game')?.classList.contains('active'),
    layout: (() => {
      const vp = document.querySelector('.room-pan-viewport');
      const inner = document.querySelector('.room-pan-inner');
      const world = document.getElementById('game-world');
      if (!vp || !inner || !world) return null;
      const vpR = vp.getBoundingClientRect();
      const worldR = world.getBoundingClientRect();
      return {
        worldH: Math.round(worldR.height),
        vpH: Math.round(vpR.height),
        vpW: Math.round(vpR.width),
        innerW: inner.offsetWidth,
        heightFillRatio: vpR.height / worldR.height,
        widthCropRatio: inner.offsetWidth / vpR.width
      };
    })()
  }));

  page.off('console', onConsole);
  page.off('pageerror', onPageError);

  return { label, errors, pageErrors, state };
}

async function scenario(browser, name, fn) {
  const page = await browser.newPage();
  await page.setViewport(PORTRAIT);
  try {
    return { name, ...(await fn(page)) };
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  results.push(await scenario(browser, 'fresh-portrait', async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.click('#btn-play');
    await sleep(1000);
    return collectPage(page, 'fresh');
  }));

  results.push(await scenario(browser, 'furnished-new-world', async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.click('#btn-new-world');
    await sleep(400);
    await page.click('[data-world="furnished"]');
    await sleep(1500);
    const collected = await collectPage(page, 'furnished');
    const entityCount = await page.evaluate(() =>
      document.querySelectorAll('.entity').length
    );
    return { ...collected, entityCount, furnishedOk: entityCount >= 40 };
  }));

  results.push(await scenario(browser, 'stale-localStorage-1.6.0', async (page) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('toca-groca-asset-version', '1.6.0'));
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(2500);
    await page.click('#btn-play').catch(() => {});
    await sleep(1000);
    return collectPage(page, 'stale-ls');
  }));

  results.push(await scenario(browser, 'iphone-safari-ua', async (page) => {
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.click('#btn-play');
    await sleep(1200);
    return collectPage(page, 'safari');
  }));

  results.push(await scenario(browser, 'with-fake-service-worker', async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await page.evaluate(async () => {
      try {
        await navigator.serviceWorker.register('/rv-toca-groca/sw.js?v=1.6.1');
        await new Promise((r) => setTimeout(r, 500));
      } catch (e) { /* ignore */ }
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.click('#btn-play').catch(() => {});
    await sleep(1000);
    return collectPage(page, 'with-sw');
  }));

  await browser.close();

  console.log('\n=== PUPPETEER SCENARIOS ===');
  for (const r of results) {
    console.log(`\n--- ${r.name} ---`);
    console.log(JSON.stringify({ errors: r.errors, pageErrors: r.pageErrors, state: r.state }, null, 2));
  }

  const failures = results.filter((r) =>
    r.pageErrors?.length > 0 ||
    r.errors?.length > 0 ||
    !r.state?.hasTocaGroca ||
    !r.state?.hasMainModule ||
    (r.state?.layout && r.state.layout.heightFillRatio < 0.9) ||
    (r.name === 'furnished-new-world' && !r.furnishedOk)
  );

  if (failures.length) {
    console.log('\nFAILED:', failures.map((f) => f.name).join(', '));
    process.exit(1);
  }
  console.log('\nAll scenarios passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});