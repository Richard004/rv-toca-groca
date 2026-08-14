import JSZip from 'jszip';
import {
  type Entity,
  BITMAP_V2_IDS,
  V2_ID_MAP,
  WALL_TYPES,
  getFurniture,
  getCharacter
} from './data';

export interface SaveV3 {
  game: 'toca-groca';
  version: 3;
  savedAt: number;
  worldMode: 'empty' | 'furnished' | 'custom';
  currentBuilding: string;
  currentRoom: string;
  roomThemes: Record<string, string>;
  roomPans: Record<string, number>;
  entities: Entity[];
  containers: Record<string, { type: string; items: Array<{ id: string; at: number }> }>;
}

const PROD_KEY = 'toca-groca-save';
const PREVIEW_KEY = 'toca-groca-save-v3-preview';

export function saveKey() {
  return import.meta.env.PROD ? PROD_KEY : PREVIEW_KEY;
}

export function emptySave(): SaveV3 {
  return {
    game: 'toca-groca',
    version: 3,
    savedAt: Date.now(),
    worldMode: 'empty',
    currentBuilding: 'home',
    currentRoom: 'living',
    roomThemes: {},
    roomPans: {},
    entities: [],
    containers: {}
  };
}

export function loadSave(): SaveV3 | null {
  try {
    const raw = localStorage.getItem(saveKey());
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeSave(save: SaveV3) {
  save.savedAt = Date.now();
  save.version = 3;
  save.game = 'toca-groca';
  localStorage.setItem(saveKey(), JSON.stringify(save));
}

export function migrate(raw: any): SaveV3 {
  if (raw?.version === 3 && raw.game === 'toca-groca') return raw as SaveV3;
  if (raw?.version === 2 && raw.game === 'toca-groca' && (raw.containers || raw.avatars)) {
    return { ...emptySave(), ...raw, version: 3, game: 'toca-groca' };
  }
  if (raw?.version === 2 || (raw?.entities && Array.isArray(raw.entities))) {
    return migrateV2(raw);
  }
  return emptySave();
}

function migrateV2(raw: any): SaveV3 {
  const entities: Entity[] = (raw.entities || []).map((e: any) => {
    const mapped = V2_ID_MAP[e.id] || (getCharacter(e.id) ? e.id : getFurniture(e.id) ? e.id : 'box-generic');
    const next: Entity = {
      uid: e.uid,
      kind: e.kind === 'item' ? 'item' : e.kind,
      id: mapped === 'box-generic' && !getFurniture(e.id) && !getCharacter(e.id) ? 'poster' : mapped,
      room: e.room,
      xRel: e.xRel,
      yRel: convertYRel(e),
      emotion: e.emotion,
      outfit: e.outfit,
      eatingUntil: e.eatingUntil
    };
    return next;
  });

  const fridge = raw.fridgeItems?.kitchen || raw.fridgeItems?.['kitchen'] || [];
  const fridgeEntity = entities.find((e) => e.id === 'fridge');
  const containers: SaveV3['containers'] = {};
  if (fridgeEntity && fridge.length) {
    containers[fridgeEntity.uid] = {
      type: 'fridge',
      items: fridge.map((x: any) => ({ id: x.id, at: x.at || Date.now() }))
    };
  }

  return {
    game: 'toca-groca',
    version: 3,
    savedAt: Date.now(),
    worldMode: raw.worldMode || 'custom',
    currentBuilding: raw.currentBuilding || 'home',
    currentRoom: raw.currentRoom || 'living',
    roomThemes: mapThemes(raw.roomThemes || {}),
    roomPans: raw.roomPans || {},
    entities,
    containers
  };
}

function convertYRel(e: any) {
  const y = Number(e.yRel) || 0.8;
  const def = getFurniture(V2_ID_MAP[e.id] || e.id);
  if (def?.wall || WALL_TYPES.has(def?.type || '')) return clamp(y);
  if (BITMAP_V2_IDS.has(e.id)) return clamp(y);
  const h = def?.heightRel || (e.kind === 'character' ? 0.3 : 0.18);
  return clamp(y + h);
}

function mapThemes(old: Record<string, any>) {
  const out: Record<string, string> = {};
  const hexToId: Record<string, string> = {
    '#FFB4C8': 'plum',
    '#FF8FAB': 'plum',
    '#B2EBF2': 'pond',
    '#D1C4E9': 'plum',
    '#FFE0B2': 'honey',
    '#546E7A': 'night'
  };
  for (const [room, val] of Object.entries(old)) {
    if (typeof val === 'string') out[room] = val;
    else if (val?.wall) out[room] = hexToId[val.wall] || 'paper';
  }
  return out;
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

export async function downloadBackup(save: SaveV3) {
  const zip = new JSZip();
  const payload = {
    game: 'toca-groca',
    version: 3,
    exportedAt: new Date().toISOString(),
    state: save
  };
  zip.file('toca-groca-save.json', JSON.stringify(payload, null, 2));
  zip.file('readme.txt', 'Toca Groca — záloha. Otevři hru a klepni Načíst.\n');
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `toca-groca-${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importBackup(file: File): Promise<SaveV3> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    const json = zip.file('toca-groca-save.json');
    if (!json) throw new Error('missing save');
    return migrate(unwrap(JSON.parse(await json.async('text'))));
  }
  return migrate(unwrap(JSON.parse(await file.text())));
}

function unwrap(data: any) {
  return data.state || data;
}
