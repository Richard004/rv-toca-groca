#!/usr/bin/env node
/**
 * Cut paper / magenta backdrops off dolls and furniture.
 * Usage: node scripts/cutout.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SESSION = path.join(
  process.env.USERPROFILE || '',
  '.grok/sessions/d%3A%5CGitHub%5Crv-toca-groca/019ffdae-c137-70a0-a64f-30a574de4695/images'
);

const CHAR_PAPER = [
  'richard', 'anetka', 'klarka', 'tanicka', 'risa',
  'dart', 'liza', 'cookie', 'berta', 'mikie'
];

const CHAR_MAGENTA = [
  { src: '19.jpg', dest: 'zuzana.webp' },
  { src: '21.jpg', dest: 'puffy.webp' },
  { src: '30.jpg', dest: 'anetka.webp' },
  { src: '29.jpg', dest: 'richard.webp' },
  { src: '28.jpg', dest: 'cookie.webp' }
];

const FURNITURE = [
  { src: '16.jpg', dest: 'sofa-clay.webp' },
  { src: '13.jpg', dest: 'table-coffee.webp' },
  { src: '18.jpg', dest: 'lamp-floor.webp' },
  { src: '17.jpg', dest: 'plant-sage.webp' },
  { src: '15.jpg', dest: 'poster.webp' },
  { src: '14.jpg', dest: 'armchair.webp' },
  { src: '20.jpg', dest: 'tv.webp' },
  { src: '24.jpg', dest: 'rug-clay.webp' },
  { src: '23.jpg', dest: 'fridge.webp' },
  { src: '25.jpg', dest: 'stove.webp' },
  { src: '27.jpg', dest: 'sink.webp' },
  { src: '26.jpg', dest: 'bed-plum.webp' }
];

function dist(r1, g1, b1, r2, g2, b2) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function isMagenta(r, g, b) {
  return r > 150 && g < 130 && b > 70 && (r - g) > 40 && (b + r - 2 * g) > 80;
}

function isPaper(r, g, b) {
  const cream = dist(r, g, b, 237, 228, 205);
  const milk = dist(r, g, b, 251, 246, 236);
  const line = dist(r, g, b, 226, 214, 186);
  const tear = dist(r, g, b, 232, 236, 240);
  return Math.min(cream, milk, line, tear) < 48 && Math.max(r, g, b) - Math.min(r, g, b) < 42;
}

function flood(data, width, height, predicate) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  const push = (idx) => {
    if (idx < 0 || idx >= total || visited[idx]) return;
    const i = idx * 4;
    if (data[i + 3] === 0) {
      visited[idx] = 1;
      return;
    }
    if (!predicate(data[i], data[i + 1], data[i + 2])) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };
  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }
  while (head < tail) {
    const idx = queue[head++];
    data[idx * 4 + 3] = 0;
    push(idx - 1);
    push(idx + 1);
    push(idx - width);
    push(idx + width);
  }
}

function chromaMagenta(data, width, height) {
  const n = width * height;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (isMagenta(data[o], data[o + 1], data[o + 2])) data[o + 3] = 0;
  }
}

function despill(data, width, height) {
  const n = width * height;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3] === 0) continue;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (r > 140 && b > 90 && g < r && (r - g) > 25) {
      const bleed = Math.min(r - g, b - Math.min(g, 90));
      data[o] = Math.max(0, r - Math.round(bleed * 0.55));
      data[o + 2] = Math.max(0, b - Math.round(bleed * 0.35));
    }
  }
}

async function processFile(input, dest, mode) {
  if (!fs.existsSync(input)) {
    console.warn('skip missing', path.basename(input));
    return null;
  }
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  if (mode === 'magenta') {
    chromaMagenta(buf, info.width, info.height);
    flood(buf, info.width, info.height, isMagenta);
    despill(buf, info.width, info.height);
  } else {
    flood(buf, info.width, info.height, isPaper);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.tmp.webp`;
  const out = await sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 8 })
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile(tmp);
  fs.copyFileSync(tmp, dest);
  fs.unlinkSync(tmp);
  const aspect = (out.width / out.height).toFixed(2);
  console.log(`${path.relative(root, dest)}  ${out.width}x${out.height}  aspect ${aspect}`);
  return { dest, ...out, aspect: Number(aspect) };
}

async function main() {
  const only = process.argv[2];
  if (!only || only === 'chars') {
    for (const row of CHAR_MAGENTA) {
      await processFile(path.join(SESSION, row.src), path.join(root, 'public/characters', row.dest), 'magenta');
    }
    for (const id of CHAR_PAPER) {
      const input = path.join(root, 'public/characters', `${id}.webp`);
      const dest = path.join(root, 'public/dolls', `${id}.webp`);
      await processFile(input, dest, 'paper');
    }
  }
  if (!only || only === 'furn') {
    for (const row of FURNITURE) {
      const input = path.join(SESSION, row.src);
      const dest = path.join(root, 'public/furniture', row.dest);
      await processFile(input, dest, 'magenta');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
