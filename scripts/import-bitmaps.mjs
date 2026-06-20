#!/usr/bin/env node
/**
 * Import AI-generated JPGs → PNG with transparency for sprites.
 * Run after placing raw files or auto-copy from session images folder.
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

async function removeNearWhite(input, output, threshold = 248) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    } else if (r >= threshold - 15 && g >= threshold - 15 && b >= threshold - 15) {
      data[i + 3] = Math.min(data[i + 3], 80);
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png({ compressionLevel: 9 }).toFile(output);
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
  const tmp = output + '.tmp.png';
  await sharp(input).resize({ height: maxH, withoutEnlargement: false }).png().toFile(tmp);
  await removeNearWhite(tmp, output);
  try { fs.unlinkSync(tmp); } catch { /* ok */ }
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