#!/usr/bin/env node
/**
 * Import AI-generated JPGs → PNG with transparency for sprites.
 * Edge flood-fill background removal (better than global white threshold).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SESSION_IMAGES = path.resolve(
  process.env.GROK_IMAGES || 'C:/Users/richa/.grok/sessions/D%3A%5CGitHub%5Crv-toca-groca/019ee4c9-85b6-7722-b5bf-73bb5664268d/images'
);
const OUT = path.join(root, 'assets', 'bitmaps');

/** Generated image index → asset path (order matches generation batches). */
const MAP = [
  { src: '1.jpg', dest: 'chars/zuzana.png', cutout: true },
  { src: '2.jpg', dest: 'furniture/sofa.png', cutout: true },
  { src: '3.jpg', dest: 'chars/anetka.png', cutout: true },
  { src: '4.jpg', dest: 'rooms/living.png', cutout: false },
  { src: '5.jpg', dest: 'chars/cookie.png', cutout: true },
  { src: '6.jpg', dest: 'chars/liza.png', cutout: true },
  { src: '7.jpg', dest: 'furniture/rug.png', cutout: true },
  { src: '8.jpg', dest: 'furniture/tv.png', cutout: true },
  { src: '9.jpg', dest: 'furniture/lamp.png', cutout: true },
  { src: '10.jpg', dest: 'furniture/table.png', cutout: true },
  { src: '11.jpg', dest: 'furniture/plant.png', cutout: true },
  { src: '12.jpg', dest: 'chars/richard.png', cutout: true },
  { src: '13.jpg', dest: 'items/teddy.png', cutout: true },
  { src: '14.jpg', dest: 'rooms/garden.png', cutout: false },
  { src: '15.jpg', dest: 'rooms/bedroom.png', cutout: false },
  { src: '16.jpg', dest: 'rooms/kitchen.png', cutout: false }
];

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

/** Flood-fill background from image edges using corner-sampled bg color. */
function floodFillBackground(data, width, height, threshold = 42) {
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4
  ];
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const i of corners) {
    bgR += data[i];
    bgG += data[i + 1];
    bgB += data[i + 2];
  }
  bgR = Math.round(bgR / 4);
  bgG = Math.round(bgG / 4);
  bgB = Math.round(bgB / 4);

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const tryPush = (idx) => {
    if (idx < 0 || idx >= total || visited[idx]) return;
    const i = idx * 4;
    if (colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) > threshold) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    tryPush(x);
    tryPush((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    tryPush(y * width);
    tryPush(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const i = idx * 4;
    data[i + 3] = 0;
    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) tryPush(idx - 1);
    if (x < width - 1) tryPush(idx + 1);
    if (y > 0) tryPush(idx - width);
    if (y < height - 1) tryPush(idx + width);
  }

  // De-fringe: soften pixels adjacent to transparency
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const i = idx * 4;
      if (data[i + 3] === 0) continue;
      let nearClear = false;
      for (let dy = -1; dy <= 1 && !nearClear; dy++) {
        for (let dx = -1; dx <= 1 && !nearClear; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            nearClear = true;
            continue;
          }
          if (data[(ny * width + nx) * 4 + 3] === 0) nearClear = true;
        }
      }
      if (nearClear && colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) < threshold + 20) {
        data[i + 3] = Math.min(data[i + 3], 200);
      }
    }
  }
}

async function removeBackground(input, output) {
  const trimmed = input + '.trim.png';
  await sharp(input).trim({ threshold: 12 }).png().toFile(trimmed);

  const img = sharp(trimmed).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  floodFillBackground(data, info.width, info.height);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png({ compressionLevel: 9 }).toFile(output);

  try { fs.unlinkSync(trimmed); } catch { /* ok */ }
}

async function toRoomPng(input, output, maxW = 780) {
  await sharp(input)
    .resize({ width: maxW, withoutEnlargement: false })
    .jpeg({ quality: 92 })
    .toFile(output.replace(/\.png$/, '.jpg'));
  await sharp(input)
    .resize({ width: maxW, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(output);
}

async function toSpritePng(input, output, maxH = 520) {
  const resized = output + '.resized.png';
  await sharp(input).resize({ height: maxH, withoutEnlargement: false }).png().toFile(resized);
  await removeBackground(resized, output);
  try { fs.unlinkSync(resized); } catch { /* ok */ }
}

async function run() {
  const manifest = { version: 2, rooms: {}, characters: {}, furnitureTypes: {}, items: {}, meta: {} };

  for (const entry of MAP) {
    const srcPath = path.join(SESSION_IMAGES, entry.src);
    const destPath = path.join(OUT, entry.dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (!fs.existsSync(srcPath)) {
      console.warn(`Missing: ${srcPath}`);
      continue;
    }

    if (entry.cutout) {
      await toSpritePng(srcPath, destPath);
    } else {
      await toRoomPng(srcPath, destPath);
    }

    const rel = entry.dest.replace(/\\/g, '/');
    const meta = await sharp(destPath).metadata();
    manifest.meta[rel] = { w: meta.width, h: meta.height };

    if (rel.startsWith('rooms/')) {
      manifest.rooms[rel.replace('rooms/', '').replace('.png', '')] = rel;
    } else if (rel.startsWith('chars/')) {
      manifest.characters[rel.replace('chars/', '').replace('.png', '')] = rel;
    } else if (rel.startsWith('furniture/')) {
      manifest.furnitureTypes[rel.replace('furniture/', '').replace('.png', '')] = rel;
    } else if (rel.startsWith('items/')) {
      manifest.items[rel.replace('items/', '').replace('.png', '')] = rel;
    }
    console.log(`✓ ${rel} (${meta.width}×${meta.height})`);
  }

  fs.writeFileSync(
    path.join(OUT, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  console.log('\nWrote assets/bitmaps/manifest.json');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});