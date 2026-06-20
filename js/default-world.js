/**
 * Curated default world — screen-aware zones:
 *   wall decor  yRel 0.04–0.20
 *   standing    yRel 0.34–0.48
 *   floor       yRel 0.54–0.68
 *   hero band   xRel 0.38–0.62 (visible at pan 0.5 on portrait)
 */

import { WALLPAPERS } from './rooms.js';

let uidSeq = 0;
function uid(tag) {
  uidSeq += 1;
  return `default-${tag}-${uidSeq}`;
}

function themeFromPreset(presetId) {
  const p = WALLPAPERS.find((w) => w.id === presetId);
  if (!p || presetId === 'default') return null;
  return { bg: p.bg, wall: p.wall, floor: p.floor };
}

function furn(id, room, xRel, yRel) {
  return { uid: uid('f'), kind: 'furniture', id, room, xRel, yRel };
}
function toy(id, room, xRel, yRel) {
  return { uid: uid('t'), kind: 'item', id, room, xRel, yRel };
}
function chr(id, room, xRel, yRel, extra = {}) {
  return { uid: uid('c'), kind: 'character', id, room, xRel, yRel, ...extra };
}
function meal(id, room, xRel, yRel) {
  return { uid: uid('fd'), kind: 'food', id, room, xRel, yRel };
}

/** @returns {{ entities, roomThemes, fridgeItems, worldMode, roomPans }} */
export function buildFurnishedDefaultWorld() {
  uidSeq = 0;

  const entities = [
    // —— Obývák ——
    furn('posters-poster-0', 'living', 0.42, 0.06),
    furn('pictures-picture-1', 'living', 0.56, 0.08),
    furn('tv-tv-0', 'living', 0.48, 0.18),
    furn('clocks-clock-1', 'living', 0.58, 0.10),
    furn('lamp-lamp-0', 'living', 0.40, 0.36),
    furn('plants-plant-0', 'living', 0.54, 0.34),
    furn('sofa-sofa-0', 'living', 0.38, 0.56),
    furn('rug-rug-0', 'living', 0.42, 0.66),
    furn('table-table-0', 'living', 0.48, 0.60),
    furn('chair-chair-3', 'living', 0.54, 0.58),
    furn('vases-vases-1', 'living', 0.51, 0.58),
    toy('toy-book', 'living', 0.46, 0.62),
    toy('toy-teddy', 'living', 0.44, 0.60),
    chr('zuzana', 'living', 0.40, 0.44, { emotion: 'happy' }),
    chr('anetka', 'living', 0.48, 0.46, { emotion: 'happy' }),
    chr('liza', 'living', 0.52, 0.54),
    chr('cookie', 'living', 0.56, 0.52),
    furn('posters-poster-1', 'living', 0.08, 0.06),
    furn('clocks-clock-0', 'living', 0.16, 0.10),
    furn('plants-plant-1', 'living', 0.10, 0.36),
    furn('rug-rug-1', 'living', 0.12, 0.66),
    furn('chair-chair-0', 'living', 0.14, 0.58),
    toy('toy-paint', 'living', 0.18, 0.60),
    furn('lamp-lamp-1', 'living', 0.84, 0.36),
    furn('pictures-picture-0', 'living', 0.88, 0.08),
    furn('sofa-sofa-1', 'living', 0.78, 0.56),
    furn('table-table-1', 'living', 0.82, 0.60),

    // —— Kuchyně ——
    furn('clocks-clock-1', 'kitchen', 0.48, 0.08),
    furn('plants-plant-2', 'kitchen', 0.42, 0.34),
    furn('fridge-fridge-0', 'kitchen', 0.38, 0.38),
    furn('cabinet-cabinet-1', 'kitchen', 0.46, 0.36),
    furn('stove-stove-0', 'kitchen', 0.52, 0.42),
    furn('ksink-sink-0', 'kitchen', 0.58, 0.40),
    furn('ktable-table-0', 'kitchen', 0.46, 0.58),
    furn('kchair-chair-0', 'kitchen', 0.42, 0.60),
    furn('kchair-chair-2', 'kitchen', 0.54, 0.60),
    meal('food-apple', 'kitchen', 0.44, 0.56),
    meal('food-banana', 'kitchen', 0.56, 0.56),
    meal('food-pizza', 'kitchen', 0.50, 0.58),
    chr('richard', 'kitchen', 0.40, 0.44, { emotion: 'happy' }),
    furn('cabinet-cabinet-2', 'kitchen', 0.08, 0.36),
    furn('ktable-table-1', 'kitchen', 0.12, 0.58),
    furn('vases-vases-0', 'kitchen', 0.16, 0.56),
    furn('fridge-fridge-1', 'kitchen', 0.86, 0.38),
    furn('stove-stove-1', 'kitchen', 0.80, 0.42),
    furn('plants-plant-3', 'kitchen', 0.84, 0.34),

    // —— Pokoj ——
    furn('pictures-picture-0', 'bedroom', 0.44, 0.06),
    furn('posters-poster-1', 'bedroom', 0.54, 0.08),
    furn('blamp-blamp-0', 'bedroom', 0.38, 0.34),
    furn('blamp-blamp-2', 'bedroom', 0.52, 0.34),
    furn('bed-bed-0', 'bedroom', 0.38, 0.54),
    furn('nightstand-nightstand-0', 'bedroom', 0.34, 0.56),
    furn('bed-bed-2', 'bedroom', 0.52, 0.54),
    furn('desk-desk-2', 'bedroom', 0.56, 0.52),
    furn('rug-rug-2', 'bedroom', 0.44, 0.66),
    furn('toybox-toybox-1', 'bedroom', 0.58, 0.58),
    toy('toy-robot', 'bedroom', 0.54, 0.48),
    toy('toy-blocks', 'bedroom', 0.48, 0.60),
    toy('toy-crown', 'bedroom', 0.60, 0.54),
    toy('toy-ball', 'bedroom', 0.42, 0.62),
    chr('klarka', 'bedroom', 0.44, 0.44, { emotion: 'happy' }),
    chr('tanicka', 'bedroom', 0.50, 0.46, { emotion: 'happy' }),
    furn('wardrobe-wardrobe-2', 'bedroom', 0.08, 0.36),
    furn('posters-poster-2', 'bedroom', 0.12, 0.08),
    furn('toybox-toybox-0', 'bedroom', 0.14, 0.58),
    furn('wardrobe-wardrobe-0', 'bedroom', 0.82, 0.36),
    furn('bed-bed-1', 'bedroom', 0.78, 0.54),
    toy('toy-phone', 'bedroom', 0.84, 0.56),

    // —— Koupelna ——
    furn('mirror-mirror-0', 'bathroom', 0.46, 0.06),
    furn('towelrack-towelrack-1', 'bathroom', 0.54, 0.14),
    furn('plants-plant-0', 'bathroom', 0.42, 0.34),
    furn('shower-shower-0', 'bathroom', 0.56, 0.36),
    furn('bsink-sink-0', 'bathroom', 0.48, 0.40),
    furn('bathtub-bathtub-0', 'bathroom', 0.40, 0.54),
    furn('toilet-toilet-0', 'bathroom', 0.54, 0.56),
    furn('rug-rug-3', 'bathroom', 0.44, 0.66),
    furn('mirror-mirror-1', 'bathroom', 0.10, 0.08),
    furn('towelrack-towelrack-0', 'bathroom', 0.86, 0.12),
    furn('bathtub-bathtub-1', 'bathroom', 0.82, 0.54),

    // —— Zahrada ——
    furn('gtree-tree-0', 'garden', 0.40, 0.28),
    furn('swing-swing-0', 'garden', 0.38, 0.44),
    furn('slide-slide-0', 'garden', 0.52, 0.46),
    furn('sandbox-sandbox-0', 'garden', 0.44, 0.58),
    furn('pool-pool-0', 'garden', 0.50, 0.62),
    furn('bench-bench-0', 'garden', 0.56, 0.56),
    furn('grill-grill-0', 'garden', 0.42, 0.52),
    furn('trampoline-trampoline-0', 'garden', 0.58, 0.60),
    chr('risa', 'garden', 0.46, 0.48, { emotion: 'happy' }),
    chr('puffy', 'garden', 0.50, 0.52),
    chr('dart', 'garden', 0.54, 0.50),
    toy('toy-ball', 'garden', 0.48, 0.56),
    furn('doghouse-doghouse-0', 'garden', 0.08, 0.52),
    furn('gflowers-flowers-0', 'garden', 0.12, 0.54),
    furn('climbing-climbing-0', 'garden', 0.88, 0.42),
    furn('gtree-tree-2', 'garden', 0.92, 0.26),
    furn('gflowers-flowers-2', 'garden', 0.82, 0.54),
    furn('bench-bench-1', 'garden', 0.78, 0.56),
    furn('slide-slide-1', 'garden', 0.14, 0.46),

    // —— Chalupa ——
    furn('posters-poster-1', 'cottage-living', 0.46, 0.06),
    furn('lamp-lamp-1', 'cottage-living', 0.40, 0.34),
    furn('plants-plant-3', 'cottage-living', 0.54, 0.34),
    furn('sofa-sofa-2', 'cottage-living', 0.40, 0.56),
    furn('rug-rug-2', 'cottage-living', 0.44, 0.66),
    furn('table-table-1', 'cottage-living', 0.50, 0.60),
    toy('toy-guitar', 'cottage-living', 0.46, 0.58),
    chr('mikie', 'cottage-living', 0.44, 0.46),
    furn('clocks-clock-1', 'cottage-living', 0.10, 0.10),
    furn('pictures-picture-2', 'cottage-living', 0.86, 0.08),

    furn('gtree-tree-1', 'cottage-garden', 0.48, 0.28),
    furn('bench-bench-1', 'cottage-garden', 0.44, 0.52),
    furn('gflowers-flowers-1', 'cottage-garden', 0.40, 0.54),
    furn('grill-grill-1', 'cottage-garden', 0.52, 0.50),
    furn('gflowers-flowers-0', 'cottage-garden', 0.08, 0.54),
    furn('doghouse-doghouse-1', 'cottage-garden', 0.86, 0.50)
  ];

  const roomThemes = {
    living: themeFromPreset('pink'),
    kitchen: themeFromPreset('mint'),
    bedroom: themeFromPreset('lavender'),
    bathroom: themeFromPreset('mint'),
    garden: themeFromPreset('default'),
    'cottage-living': themeFromPreset('sunset')
  };

  const fridgeItems = {
    kitchen: [
      { id: 'food-milk', at: Date.now() },
      { id: 'food-egg', at: Date.now() },
      { id: 'food-carrot', at: Date.now() },
      { id: 'food-juice', at: Date.now() },
      { id: 'food-cake', at: Date.now() }
    ]
  };

  const roomPans = {
    living: 0.5,
    kitchen: 0.5,
    bedroom: 0.5,
    bathroom: 0.5,
    garden: 0.5,
    'cottage-living': 0.5,
    'cottage-garden': 0.5
  };

  return {
    entities,
    roomThemes,
    fridgeItems,
    roomPans,
    worldMode: 'furnished',
    currentBuilding: 'home',
    currentRoom: 'living'
  };
}

export function buildEmptyWorld() {
  return {
    entities: [],
    roomThemes: {},
    fridgeItems: {},
    roomPans: {},
    worldMode: 'empty',
    currentBuilding: 'home',
    currentRoom: 'living'
  };
}