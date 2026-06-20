/**
 * Illustrated bitmap sprites — replaces procedural SVG when available.
 */

const BASE = 'assets/bitmaps';

let manifest = null;

export async function loadBitmapManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch(`${BASE}/manifest.json?v=2.0.0`);
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

/** Bitmap sprites are already high-res — gentler scale than SVG. */
export function bitmapDisplayScale(innerH, innerW, vpW) {
  const h = innerH > 0 ? innerH : 700;
  const base = h / 700;
  const portrait = vpW > 0 && innerW > 0 && innerW <= vpW * 1.08;
  return base * (portrait ? 0.95 : 1.1);
}

export function scaleBitmapSize(size, innerH, innerW, vpW) {
  const s = bitmapDisplayScale(innerH, innerW, vpW);
  return {
    w: Math.round(size.w * s),
    h: Math.round(size.h * s)
  };
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

function metaForUrl(url) {
  if (!manifest?.meta || !url) return null;
  const rel = url.replace(`${BASE}/`, '');
  return manifest.meta[rel] || null;
}

/** Size from native bitmap aspect + room-relative height. */
export function bitmapEntitySize(entity, def, innerH, innerW, vpW) {
  const src = resolveBitmap(entity, def);
  const meta = metaForUrl(src);
  if (!meta) return null;
  let hRel = HEIGHT_REL.default;
  if (entity.kind === 'character') hRel = HEIGHT_REL.character;
  else if (entity.kind === 'food') hRel = HEIGHT_REL.food;
  else if (entity.kind === 'item') hRel = HEIGHT_REL.toy;
  else if (def?.type && HEIGHT_REL[def.type]) hRel = HEIGHT_REL[def.type];
  const targetH = innerH * hRel;
  const aspect = meta.w / meta.h;
  return { w: Math.round(targetH * aspect), h: Math.round(targetH) };
}

export function useBitmapRenderer() {
  return !!manifest?.version;
}