/**
 * Portrait-native curated scenes — whole room visible on phone (Toca-style).
 * Zones: wall y 0.04–0.22 | standing 0.30–0.48 | floor 0.52–0.72
 */

import { WALLPAPERS } from './rooms.js';

let uidSeq = 0;
function uid(tag) { uidSeq += 1; return `default-${tag}-${uidSeq}`; }

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

export function buildFurnishedDefaultWorld() {
  uidSeq = 0;

  const entities = [
    // —— Obývák: ilustrované bitmap pozadí + postavy/nábytek navrch ——
    furn('sofa-sofa-0', 'living', 0.58, 0.48),
    furn('table-table-0', 'living', 0.30, 0.56),
    furn('tv-tv-0', 'living', 0.72, 0.08),
    furn('chair-chair-3', 'living', 0.14, 0.52),
    furn('rug-rug-0', 'living', 0.24, 0.68),
    furn('lamp-lamp-0', 'living', 0.04, 0.32),
    furn('plants-plant-0', 'living', 0.86, 0.30),
    furn('vases-vases-1', 'living', 0.34, 0.52),
    furn('posters-poster-0', 'living', 0.48, 0.10),
    toy('toy-teddy', 'living', 0.48, 0.50),
    toy('toy-book', 'living', 0.38, 0.60),
    toy('toy-paint', 'living', 0.42, 0.58),
    meal('food-cookie', 'living', 0.32, 0.56),
    chr('zuzana', 'living', 0.12, 0.38, { emotion: 'happy' }),
    chr('anetka', 'living', 0.28, 0.40, { emotion: 'happy' }),
    chr('liza', 'living', 0.44, 0.42),
    chr('cookie', 'living', 0.66, 0.46),

    // —— Kuchyně ——
    furn('fridge-fridge-0', 'kitchen', 0.02, 0.36),
    furn('cabinet-cabinet-1', 'kitchen', 0.14, 0.34),
    furn('stove-stove-0', 'kitchen', 0.28, 0.38),
    furn('ksink-sink-0', 'kitchen', 0.42, 0.36),
    furn('ktable-table-0', 'kitchen', 0.52, 0.58),
    furn('kchair-chair-0', 'kitchen', 0.46, 0.60),
    furn('kchair-chair-2', 'kitchen', 0.62, 0.60),
    furn('plants-plant-1', 'kitchen', 0.72, 0.30),
    meal('food-apple', 'kitchen', 0.48, 0.54),
    meal('food-banana', 'kitchen', 0.56, 0.54),
    meal('food-pizza', 'kitchen', 0.52, 0.56),
    chr('richard', 'kitchen', 0.34, 0.44, { emotion: 'happy' }),

    // —— Pokoj ——
    furn('blamp-blamp-0', 'bedroom', 0.06, 0.32),
    furn('blamp-blamp-2', 'bedroom', 0.48, 0.32),
    furn('bed-bed-0', 'bedroom', 0.04, 0.52),
    furn('bed-bed-2', 'bedroom', 0.46, 0.52),
    furn('nightstand-nightstand-0', 'bedroom', 0.38, 0.54),
    furn('desk-desk-2', 'bedroom', 0.68, 0.50),
    furn('rug-rug-2', 'bedroom', 0.24, 0.68),
    furn('toybox-toybox-1', 'bedroom', 0.78, 0.56),
    toy('toy-robot', 'bedroom', 0.72, 0.48),
    toy('toy-blocks', 'bedroom', 0.58, 0.60),
    toy('toy-ball', 'bedroom', 0.32, 0.62),
    chr('klarka', 'bedroom', 0.22, 0.44, { emotion: 'happy' }),
    chr('tanicka', 'bedroom', 0.56, 0.46, { emotion: 'happy' }),

    // —— Koupelna ——
    furn('mirror-mirror-0', 'bathroom', 0.42, 0.10),
    furn('shower-shower-0', 'bathroom', 0.68, 0.32),
    furn('bathtub-bathtub-0', 'bathroom', 0.06, 0.52),
    furn('toilet-toilet-0', 'bathroom', 0.38, 0.54),
    furn('bsink-sink-0', 'bathroom', 0.52, 0.38),
    furn('towelrack-towelrack-1', 'bathroom', 0.58, 0.16),
    furn('rug-rug-1', 'bathroom', 0.22, 0.68),
    furn('plants-plant-2', 'bathroom', 0.82, 0.34),

    // —— Zahrada ——
    furn('swing-swing-0', 'garden', 0.06, 0.42),
    furn('slide-slide-0', 'garden', 0.22, 0.44),
    furn('sandbox-sandbox-0', 'garden', 0.38, 0.56),
    furn('pool-pool-0', 'garden', 0.52, 0.60),
    furn('bench-bench-0', 'garden', 0.66, 0.54),
    furn('grill-grill-0', 'garden', 0.78, 0.50),
    furn('gtree-tree-0', 'garden', 0.88, 0.30),
    furn('doghouse-doghouse-0', 'garden', 0.02, 0.52),
    furn('gflowers-flowers-0', 'garden', 0.14, 0.54),
    chr('risa', 'garden', 0.44, 0.48, { emotion: 'happy' }),
    chr('puffy', 'garden', 0.58, 0.52),
    chr('dart', 'garden', 0.32, 0.50),
    toy('toy-ball', 'garden', 0.48, 0.56),

    // —— Chalupa ——
    furn('sofa-sofa-2', 'cottage-living', 0.06, 0.54),
    furn('lamp-lamp-1', 'cottage-living', 0.02, 0.34),
    furn('table-table-1', 'cottage-living', 0.38, 0.60),
    furn('rug-rug-2', 'cottage-living', 0.22, 0.68),
    toy('toy-guitar', 'cottage-living', 0.32, 0.58),
    chr('mikie', 'cottage-living', 0.48, 0.48),
    furn('plants-plant-3', 'cottage-living', 0.82, 0.32),

    furn('bench-bench-1', 'cottage-garden', 0.32, 0.52),
    furn('grill-grill-1', 'cottage-garden', 0.52, 0.50),
    furn('gtree-tree-1', 'cottage-garden', 0.72, 0.28),
    furn('gflowers-flowers-1', 'cottage-garden', 0.12, 0.54)
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

  return {
    entities,
    roomThemes,
    fridgeItems,
    roomPans: {},
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