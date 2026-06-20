/**
 * Illustrated bitmap sprites — replaces procedural SVG when available.
 */

const BASE = 'assets/bitmaps';

let manifest = null;

export async function loadBitmapManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch(`${BASE}/manifest.json?v=2.0.2`);
    if (!res.ok) return null;
    manifest = await res.json();
    return manifest;
  } catch {
    return null;
  }
}

export function getBitmapManifestSync() {
  return manifest;
}

export function setBitmapManifest(m) {
  manifest = m;
}

export function bitmapUrl(relPath) {
  return `${BASE}/${relPath}`;
}

export function getRoomBitmap(roomId) {
  if (!manifest?.rooms) return null;
  const rel = manifest.rooms[roomId];
  return rel ? bitmapUrl(rel) : null;
}

/** Native width/height ratio of illustrated room art (null = use SVG aspect). */
export function getRoomBitmapAspect(roomId) {
  if (!manifest?.rooms || !manifest?.meta) return null;
  const rel = manifest.rooms[roomId];
  if (!rel) return null;
  const meta = manifest.meta[rel];
  if (!meta?.w || !meta?.h) return null;
  return meta.w / meta.h;
}

export function getCharacterBitmap(charId) {
  if (!manifest?.characters) return null;
  const rel = manifest.characters[charId];
  return rel ? bitmapUrl(rel) : null;
}

export function getFurnitureBitmapByType(type) {
  if (!manifest?.furnitureTypes) return null;
  const rel = manifest.furnitureTypes[type];
  return rel ? bitmapUrl(rel) : null;
}

export function getItemBitmap(itemId) {
  if (!manifest?.items) return null;
  const key = itemId.replace(/^toy-/, '');
  const rel = manifest.items[key] || manifest.items[itemId];
  return rel ? bitmapUrl(rel) : null;
}

export function getFoodBitmap(foodId) {
  return null;
}

/** Resolve bitmap for any entity; null = fallback to SVG. */
export function resolveBitmap(entity, def) {
  if (!manifest) return null;
  if (entity.kind === 'character') return getCharacterBitmap(entity.id);
  if (entity.kind === 'food') return getFoodBitmap(entity.id);
  if (entity.kind === 'item') return getItemBitmap(entity.id);
  const cat = def?.type;
  if (cat === 'toy') return getItemBitmap(entity.id);
  if (cat) return getFurnitureBitmapByType(cat);
  return null;
}

export function createBitmapHTML(src, alt = '') {
  return `<img class="entity-bitmap" src="${src}" alt="${alt}" draggable="false" loading="eager"/>`;
}

export function createRoomBitmapHTML(src) {
  return `<img class="room-bg-bitmap" src="${src}" alt="" draggable="false"/>`;
}

/** Portrait viewport — same scale as phone (user-approved). */
export function isPortraitFit(innerW, vpW) {
  return vpW > 0 && innerW > 0 && innerW <= vpW * 1.08;
}

const HEIGHT_REL = {
  character: 0.36,
  rug: 0.13,
  sofa: 0.24,
  bed: 0.22,
  lamp: 0.30,
  table: 0.16,
  tv: 0.13,
  plant: 0.22,
  tree: 0.35,
  pool: 0.18,
  swing: 0.28,
  food: 0.06,
  toy: 0.10,
  default: 0.18
};

/** Per-character height from catalog proportions (Zuzana = baseline). */
const CHAR_HEIGHT_REL = {
  zuzana: 0.36,
  richard: 0.376,
  klarka: 0.365,
  anetka: 0.31,
  tanicka: 0.304,
  risa: 0.243,
  liza: 0.13,
  cookie: 0.15,
  puffy: 0.17,
  dart: 0.19,
  mikie: 0.14
};

/** Depth layers — small props always above furniture/characters at similar Y. */
const DEPTH_LAYER = {
  wall: 0,
  rug: 80,
  floor: 120,
  furniture: 200,
  character: 400,
  tabletop: 600
};

const WALL_TYPES = new Set(['tv', 'poster', 'picture', 'clock', 'mirror']);
const FLOOR_TYPES = new Set(['lamp', 'plant']);

export function bitmapDepthLayer(entity, def) {
  if (entity.kind === 'food' || entity.kind === 'item') return DEPTH_LAYER.tabletop;
  if (entity.kind === 'character') return DEPTH_LAYER.character;
  const t = def?.type;
  if (t === 'rug') return DEPTH_LAYER.rug;
  if (t && WALL_TYPES.has(t)) return DEPTH_LAYER.wall;
  if (t && FLOOR_TYPES.has(t)) return DEPTH_LAYER.floor;
  return DEPTH_LAYER.furniture;
}

/** Feet-based z-index: higher Y = closer to camera. */
export function bitmapEntityZIndex(entity, def, pos, size) {
  const feetPx = pos.y + size.h;
  return Math.round(bitmapDepthLayer(entity, def) + feetPx);
}

function metaForUrl(url) {
  if (!manifest?.meta || !url) return null;
  const rel = url.replace(`${BASE}/`, '');
  return manifest.meta[rel] || null;
}

function heightRelFor(entity, def) {
  if (entity.kind === 'character' && CHAR_HEIGHT_REL[entity.id]) {
    return CHAR_HEIGHT_REL[entity.id];
  }
  if (entity.kind === 'character') return HEIGHT_REL.character;
  if (entity.kind === 'food') return HEIGHT_REL.food;
  if (entity.kind === 'item') return HEIGHT_REL.toy;
  if (def?.type && HEIGHT_REL[def.type]) return HEIGHT_REL[def.type];
  return HEIGHT_REL.default;
}

/** Size from native bitmap aspect + room-relative height (portrait-tuned). */
export function bitmapEntitySize(entity, def, innerH, innerW, vpW) {
  const src = resolveBitmap(entity, def);
  const meta = metaForUrl(src);
  if (!meta) return null;
  const hRel = heightRelFor(entity, def);
  const targetH = innerH * hRel;
  const aspect = meta.w / meta.h;
  return { w: Math.round(targetH * aspect), h: Math.round(targetH), anchorBottom: true };
}

export function useBitmapRenderer() {
  return !!manifest?.version;
}