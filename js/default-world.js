/**
 * Curated default world — artistically composed, fully playable.
 * Every item remains movable / removable (Toca-style).
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

/** @returns {{ entities, roomThemes, fridgeItems, worldMode }} */
export function buildFurnishedDefaultWorld() {
  uidSeq = 0;

  const entities = [
    // —— Obývák: útulný rodinný obývák ——
    furn('posters-poster-0', 'living', 0.10, 0.30),
    furn('clock-clocks-0', 'living', 0.68, 0.28),
    furn('plants-plant-0', 'living', 0.05, 0.48),
    furn('lamp-lamp-0', 'living', 0.16, 0.40),
    furn('rug-rug-0', 'living', 0.34, 0.60),
    furn('sofa-sofa-0', 'living', 0.28, 0.50),
    furn('chair-chair-3', 'living', 0.46, 0.52),
    furn('table-table-0', 'living', 0.40, 0.58),
    furn('vases-vases-1', 'living', 0.43, 0.54),
    furn('tv-tv-0', 'living', 0.58, 0.42),
    furn('pictures-picture-1', 'living', 0.75, 0.30),
    toy('toy-book', 'living', 0.38, 0.56),
    chr('zuzana', 'living', 0.32, 0.46, { emotion: 'happy' }),
    chr('anetka', 'living', 0.44, 0.48, { emotion: 'happy' }),
    chr('liza', 'living', 0.36, 0.62),
    chr('cookie', 'living', 0.52, 0.56),

    // —— Kuchyně: funkční kuchyně ——
    furn('fridge-fridge-0', 'kitchen', 0.07, 0.40),
    furn('cabinet-cabinet-1', 'kitchen', 0.14, 0.36),
    furn('stove-stove-0', 'kitchen', 0.22, 0.44),
    furn('ksink-sink-0', 'kitchen', 0.30, 0.43),
    furn('ktable-table-0', 'kitchen', 0.46, 0.54),
    furn('kchair-chair-0', 'kitchen', 0.40, 0.56),
    furn('kchair-chair-2', 'kitchen', 0.52, 0.56),
    furn('plants-plant-1', 'kitchen', 0.34, 0.36),
    meal('food-apple', 'kitchen', 0.28, 0.50),
    meal('food-banana', 'kitchen', 0.48, 0.50),
    chr('richard', 'kitchen', 0.24, 0.46, { emotion: 'happy' }),

    // —— Pokoj: dětský + Klárčin koutek ——
    furn('wardrobe-wardrobe-2', 'bedroom', 0.07, 0.36),
    furn('bed-bed-0', 'bedroom', 0.14, 0.52),
    furn('nightstand-nightstand-0', 'bedroom', 0.10, 0.54),
    furn('blamp-blamp-0', 'bedroom', 0.12, 0.40),
    furn('bed-bed-2', 'bedroom', 0.32, 0.52),
    furn('blamp-blamp-2', 'bedroom', 0.30, 0.40),
    furn('rug-rug-1', 'bedroom', 0.22, 0.62),
    furn('desk-desk-2', 'bedroom', 0.54, 0.50),
    furn('pictures-picture-0', 'bedroom', 0.60, 0.30),
    furn('toybox-toybox-1', 'bedroom', 0.68, 0.54),
    toy('toy-robot', 'bedroom', 0.57, 0.46),
    toy('toy-blocks', 'bedroom', 0.72, 0.58),
    toy('toy-crown', 'bedroom', 0.64, 0.52),
    chr('klarka', 'bedroom', 0.56, 0.44, { emotion: 'happy' }),
    chr('tanicka', 'bedroom', 0.18, 0.48, { emotion: 'happy' }),

    // —— Koupelna ——
    furn('bathtub-bathtub-0', 'bathroom', 0.12, 0.52),
    furn('toilet-toilet-0', 'bathroom', 0.32, 0.54),
    furn('bsink-sink-0', 'bathroom', 0.48, 0.46),
    furn('mirror-mirror-0', 'bathroom', 0.50, 0.32),
    furn('shower-shower-0', 'bathroom', 0.64, 0.40),
    furn('towelrack-towelrack-1', 'bathroom', 0.56, 0.38),
    furn('plants-plant-2', 'bathroom', 0.42, 0.40),

    // —— Zahrada: hřiště snů ——
    furn('gtree-tree-0', 'garden', 0.04, 0.38),
    furn('doghouse-doghouse-0', 'garden', 0.08, 0.54),
    furn('swing-swing-0', 'garden', 0.16, 0.46),
    furn('sandbox-sandbox-0', 'garden', 0.26, 0.58),
    furn('slide-slide-0', 'garden', 0.38, 0.48),
    furn('bench-bench-0', 'garden', 0.48, 0.52),
    furn('grill-grill-0', 'garden', 0.60, 0.46),
    furn('pool-pool-0', 'garden', 0.58, 0.58),
    furn('trampoline-trampoline-0', 'garden', 0.74, 0.60),
    furn('climbing-climbing-0', 'garden', 0.86, 0.44),
    furn('gtree-tree-2', 'garden', 0.92, 0.36),
    furn('gflowers-flowers-0', 'garden', 0.30, 0.54),
    furn('gflowers-flowers-2', 'garden', 0.70, 0.52),
    chr('risa', 'garden', 0.32, 0.54, { emotion: 'happy' }),
    chr('puffy', 'garden', 0.50, 0.58),
    chr('dart', 'garden', 0.14, 0.56),

    // —— Chalupa ——
    furn('rug-rug-2', 'cottage-living', 0.36, 0.60),
    furn('sofa-sofa-2', 'cottage-living', 0.32, 0.50),
    furn('lamp-lamp-1', 'cottage-living', 0.18, 0.40),
    furn('table-table-1', 'cottage-living', 0.44, 0.56),
    furn('posters-poster-1', 'cottage-living', 0.12, 0.30),
    furn('plants-plant-3', 'cottage-living', 0.06, 0.46),
    toy('toy-guitar', 'cottage-living', 0.40, 0.52),
    chr('mikie', 'cottage-living', 0.38, 0.46),

    furn('bench-bench-1', 'cottage-garden', 0.35, 0.52),
    furn('gflowers-flowers-1', 'cottage-garden', 0.22, 0.54),
    furn('gtree-tree-1', 'cottage-garden', 0.08, 0.40),
    furn('grill-grill-1', 'cottage-garden', 0.55, 0.48)
  ];

  const roomThemes = {
    living: themeFromPreset('pink'),
    kitchen: themeFromPreset('mint'),
    bedroom: themeFromPreset('lavender'),
    bathroom: themeFromPreset('mint'),
    'cottage-living': themeFromPreset('sunset')
  };

  const fridgeItems = {
    kitchen: [
      { id: 'food-milk', at: Date.now() },
      { id: 'food-egg', at: Date.now() },
      { id: 'food-carrot', at: Date.now() },
      { id: 'food-juice', at: Date.now() }
    ]
  };

  return {
    entities,
    roomThemes,
    fridgeItems,
    worldMode: 'furnished',
    currentBuilding: 'home',
    currentRoom: 'living'
  };
}

/** Empty world — same as v1.5+ blank start */
export function buildEmptyWorld() {
  return {
    entities: [],
    roomThemes: {},
    fridgeItems: {},
    worldMode: 'empty',
    currentBuilding: 'home',
    currentRoom: 'living'
  };
}