import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.SESIT_SRC
  || 'C:/Users/richa/.grok/sessions/d%3A%5CGitHub%5Crv-toca-groca/019ffdae-c137-70a0-a64f-30a574de4695/images';
const OUT = path.join(root, 'public');

const MAP = [
  { src: '3.jpg', dest: 'characters/richard.webp' },
  { src: '4.jpg', dest: 'characters/zuzana.webp' },
  { src: '2.jpg', dest: 'characters/anetka.webp' },
  { src: '12.jpg', dest: 'characters/klarka.webp' },
  { src: '9.jpg', dest: 'characters/tanicka.webp' },
  { src: '10.jpg', dest: 'characters/risa.webp' },
  { src: '6.jpg', dest: 'characters/puffy.webp' },
  { src: '7.jpg', dest: 'characters/dart.webp' },
  { src: '5.jpg', dest: 'characters/liza.webp' },
  { src: '1.jpg', dest: 'characters/cookie.webp' },
  { src: '8.jpg', dest: 'characters/berta.webp' }
];

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function flood(data, width, height, threshold = 46) {
  const corners = [0, (width - 1) * 4, (height - 1) * width * 4, ((height - 1) * width + (width - 1)) * 4];
  let bgR = 0, bgG = 0, bgB = 0;
  for (const i of corners) { bgR += data[i]; bgG += data[i + 1]; bgB += data[i + 2]; }
  bgR = Math.round(bgR / 4); bgG = Math.round(bgG / 4); bgB = Math.round(bgB / 4);
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0, tail = 0;
  const push = (idx) => {
    if (idx < 0 || idx >= total || visited[idx]) return;
    const i = idx * 4;
    if (colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) > threshold) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };
  for (let x = 0; x < width; x++) { push(x); push((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { push(y * width); push(y * width + width - 1); }
  while (head < tail) {
    const idx = queue[head++];
    data[idx * 4 + 3] = 0;
    push(idx - 1); push(idx + 1); push(idx - width); push(idx + width);
  }
}

async function cutout(src, dest) {
  const input = path.join(SRC, src);
  if (!fs.existsSync(input)) throw new Error(`missing ${input}`);
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  flood(buf, info.width, info.height);
  const out = path.join(OUT, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 12 })
    .webp({ quality: 90 })
    .toFile(out);
  console.log('wrote', dest);
}

async function sketch() {
  const src = path.join(root, 'example-drawings', '20240331_214106.jpg');
  const dest = path.join(OUT, 'sketches', 'sketch-catgirl.webp');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(src)) {
    console.warn('no example drawing');
    return;
  }
  await sharp(src).rotate().resize({ width: 900 }).webp({ quality: 86 }).toFile(dest);
  console.log('wrote sketches/sketch-catgirl.webp');
}

for (const row of MAP) await cutout(row.src, row.dest);
await sketch();

const mikieSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <ellipse cx="100" cy="130" rx="48" ry="40" fill="#f0d9a0" stroke="#3a3128" stroke-width="5"/>
  <ellipse cx="78" cy="62" rx="12" ry="28" fill="#f0d9a0" stroke="#3a3128" stroke-width="5"/>
  <ellipse cx="122" cy="62" rx="12" ry="28" fill="#f0d9a0" stroke="#3a3128" stroke-width="5"/>
  <circle cx="88" cy="122" r="4" fill="#3a3128"/>
  <circle cx="112" cy="122" r="4" fill="#3a3128"/>
</svg>`);
await sharp(mikieSvg).webp({ quality: 90 }).toFile(path.join(OUT, 'characters', 'mikie.webp'));
console.log('wrote characters/mikie.webp');
