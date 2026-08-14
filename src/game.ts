import {
  type Entity,
  type Emotion,
  BUILDINGS,
  FAMILY,
  SKETCHES,
  FURNITURE,
  FOODS,
  WALLPAPERS,
  CATALOG_GROUPS,
  REACTIONS,
  furnishedWorld,
  getBuilding,
  getRoom,
  getCharacter,
  getFurniture,
  getFood,
  resolveDef,
  uid
} from './data';
import { type SaveV3, loadSave, writeSave, downloadBackup, importBackup, emptySave } from './save';
import { roomShellHTML, entityVisual, furnitureSVG, foodSVG, assetUrl } from './art';

const ASPECT = 1.6;
const MIN_PAN = 1.45;
const DRAG_PX = 6;
const DOUBLE_MS = 400;
const MOUTH_PX = 58;

function firstHouse(): SaveV3 {
  const entities = furnishedWorld();
  return {
    ...emptySave(),
    worldMode: 'furnished',
    entities,
    containers: {
      [entities.find((e) => e.id === 'fridge')?.uid || 'fridge']: {
        type: 'fridge',
        items: [
          { id: 'food-milk', at: Date.now() },
          { id: 'food-egg', at: Date.now() },
          { id: 'food-carrot', at: Date.now() }
        ]
      }
    }
  };
}

let save: SaveV3 = loadSave() ?? firstHouse();
let selected: string | null = null;
let persistTimer = 0;
let lastTap = { t: 0, uid: '' };
let lastSpawn = { key: '', at: 0 };
let drag: {
  uid: string;
  pointerId: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
  moved: boolean;
} | null = null;
let pan: {
  room: string;
  pointerId: number;
  startX: number;
  startOff: number;
  max: number;
  moved: boolean;
} | null = null;

export function currentRoom() { return save.currentRoom; }
export function currentBuilding() { return save.currentBuilding; }

export function bootGame() {
  if (save.worldMode === 'furnished' && save.entities.length === 0) {
    save.entities = furnishedWorld();
    save.containers = seedFridge(save.entities);
  }
  bindChrome();
  renderSplashChars();
  renderFamily();
  renderFood();
  renderCatalog('groups');
  renderWallpapers();
  renderMap();
  renderUpdates();
  installSeeHook();
  setInterval(() => persist(), 10000);
}

export function startWorld(mode: 'furnished' | 'empty') {
  const next = emptySave();
  next.worldMode = mode;
  next.entities = mode === 'furnished' ? furnishedWorld() : [];
  if (mode === 'furnished') {
    next.containers = seedFridge(next.entities);
  }
  save = next;
  persist();
  buildStrip();
  goRoom('living', false);
  toast(mode === 'empty' ? 'Prázdný dům. Přidej rodinu z pluska.' : 'Krásný dům od Táty. Všechno můžeš posunout.');
}

function seedFridge(entities: Entity[]) {
  const fridge = entities.find((e) => e.id === 'fridge');
  if (!fridge) return {};
  return {
    [fridge.uid]: {
      type: 'fridge',
      items: [
        { id: 'food-milk', at: Date.now() },
        { id: 'food-egg', at: Date.now() },
        { id: 'food-carrot', at: Date.now() }
      ]
    }
  };
}

function persist() {
  save.savedAt = Date.now();
  writeSave(save);
}

function schedulePersist() {
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(persist, 400);
}

function rooms() {
  return getBuilding(save.currentBuilding).rooms;
}

function viewport() {
  const world = document.getElementById('game-world');
  const vv = window.visualViewport;
  const w = world?.clientWidth || vv?.width || window.innerWidth || 390;
  const h = world?.clientHeight || vv?.height || window.innerHeight || 844;
  return { w: Math.max(Math.round(w), 320), h: Math.max(Math.round(h), 480) };
}

function roomSize() {
  const { w, h } = viewport();
  const innerH = h;
  const innerW = Math.max(Math.round(innerH * ASPECT), Math.round(w * MIN_PAN));
  return { innerW, innerH, maxPan: Math.max(0, innerW - w), vpW: w, vpH: h };
}

export function buildStrip() {
  const strip = document.getElementById('rooms-strip')!;
  const { w } = viewport();
  const list = rooms();
  strip.style.width = `${w * list.length}px`;
  strip.innerHTML = list.map((id) => {
    const room = getRoom(id)!;
    const theme = save.roomThemes[id] || room.theme;
    return `<div class="room-panel" data-room="${id}" style="width:${w}px">
      <div class="room-pan-viewport">
        <div class="room-pan-inner">
          ${roomShellHTML(room, theme)}
          <div class="entities-layer" data-room="${id}"></div>
        </div>
      </div>
    </div>`;
  }).join('');
  applyDims();
  applyPans();
  renderEntities();
  bindPan();
  renderDots();
}

function applyDims() {
  const { innerW, innerH } = roomSize();
  document.querySelectorAll<HTMLElement>('.room-pan-inner').forEach((inner) => {
    inner.style.width = `${innerW}px`;
    inner.style.height = `${innerH}px`;
  });
}

function applyPans() {
  if (!save.roomPans) save.roomPans = {};
  const { maxPan } = roomSize();
  rooms().forEach((id) => {
    const inner = document.querySelector<HTMLElement>(`.room-panel[data-room="${id}"] .room-pan-inner`);
    if (!inner) return;
    const rel = save.roomPans[id] ?? 0.5;
    inner.style.transform = `translate3d(${-(rel * maxPan)}px,0,0)`;
  });
}

function renderEntities() {
  const { innerW, innerH } = roomSize();
  document.querySelectorAll<HTMLElement>('.entities-layer').forEach((layer) => {
    const roomId = layer.dataset.room!;
    const list = save.entities.filter((e) => e.room === roomId);
    layer.innerHTML = list.map((entity) => {
      const def = resolveDef(entity);
      if (!def) return '';
      const hRel = 'heightRel' in def ? def.heightRel : 0.12;
      const h = Math.round(innerH * hRel);
      const aspect = entity.kind === 'character' || entity.kind === 'sketch' ? 0.62 : 1;
      const w = Math.round(h * (entity.kind === 'food' ? 1 : aspect < 1 ? 0.72 : 1.05));
      const x = entity.xRel * innerW - w / 2;
      const y = entity.yRel * innerH - h;
      const wall = 'wall' in def && def.wall;
      const z = wall ? 120 + y : 300 + entity.yRel * innerH;
      const eating = !!(entity.eatingUntil && entity.eatingUntil > Date.now());
      return `<div class="entity${entity.uid === selected ? ' selected' : ''}" data-uid="${entity.uid}"
        style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${Math.round(z)}">
        ${entityVisual(entity, def as any, eating)}
        <span class="entity-label">${def.name}</span>
      </div>`;
    }).join('');
  });
  bindEntities();
  updateInspector();
}

function bindEntities() {
  document.querySelectorAll<HTMLElement>('.entity').forEach((el) => {
    el.addEventListener('pointerdown', onEntityDown);
  });
}

function onEntityDown(ev: PointerEvent) {
  if (ev.button !== 0 && ev.pointerType === 'mouse') return;
  ev.preventDefault();
  ev.stopPropagation();
  const el = ev.currentTarget as HTMLElement;
  const id = el.dataset.uid!;
  selected = id;
  document.querySelectorAll('.entity').forEach((n) => n.classList.toggle('selected', (n as HTMLElement).dataset.uid === id));
  updateInspector();
  const rect = el.getBoundingClientRect();
  drag = {
    uid: id,
    pointerId: ev.pointerId,
    dx: ev.clientX - rect.left,
    dy: ev.clientY - rect.top,
    startX: ev.clientX,
    startY: ev.clientY,
    moved: false
  };
  el.setPointerCapture(ev.pointerId);
  el.addEventListener('pointermove', onEntityMove);
  el.addEventListener('pointerup', onEntityUp);
  el.addEventListener('pointercancel', onEntityUp);
}

function onEntityMove(ev: PointerEvent) {
  if (!drag || ev.pointerId !== drag.pointerId) return;
  const el = ev.currentTarget as HTMLElement;
  if (Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY) > DRAG_PX) {
    drag.moved = true;
    el.classList.add('dragging');
  }
  if (!drag.moved) return;
  ev.preventDefault();
  const panel = el.closest('.room-panel') as HTMLElement;
  const vp = panel.querySelector('.room-pan-viewport') as HTMLElement;
  const inner = panel.querySelector('.room-pan-inner') as HTMLElement;
  const vr = vp.getBoundingClientRect();
  const panOff = -(parseFloat(inner.style.transform.split('(')[1]) || 0);
  const x = ev.clientX - vr.left + panOff - drag.dx;
  const y = ev.clientY - vr.top - drag.dy;
  el.style.left = `${Math.max(0, Math.min(x, inner.offsetWidth - el.offsetWidth))}px`;
  el.style.top = `${Math.max(0, Math.min(y, vp.clientHeight - el.offsetHeight))}px`;
}

function onEntityUp(ev: PointerEvent) {
  if (!drag || ev.pointerId !== drag.pointerId) return;
  const el = ev.currentTarget as HTMLElement;
  const entity = save.entities.find((e) => e.uid === drag!.uid);
  const now = Date.now();
  if (!drag.moved) {
    if (drag.uid === lastTap.uid && now - lastTap.t < DOUBLE_MS) {
      removeEntity(drag.uid);
      lastTap = { t: 0, uid: '' };
    } else {
      lastTap = { t: now, uid: drag.uid };
      if (entity?.kind === 'furniture') react(entity);
    }
  } else if (entity) {
    if (entity.kind === 'food' && tryFeed(entity, el)) {
      /* consumed */
    } else {
      const inner = el.closest('.room-pan-inner') as HTMLElement;
      const { innerW, innerH } = roomSize();
      entity.xRel = (parseFloat(el.style.left) + el.offsetWidth / 2) / Math.max(inner.offsetWidth, innerW);
      entity.yRel = (parseFloat(el.style.top) + el.offsetHeight) / Math.max(innerH, 1);
      entity.room = save.currentRoom;
      persist();
      renderEntities();
    }
  }
  el.classList.remove('dragging');
  el.removeEventListener('pointermove', onEntityMove);
  el.removeEventListener('pointerup', onEntityUp);
  el.removeEventListener('pointercancel', onEntityUp);
  drag = null;
}

function tryFeed(food: Entity, el: HTMLElement) {
  const def = getFood(food.id);
  if (!def) return false;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (const ch of save.entities.filter((e) => e.kind === 'character' && e.room === save.currentRoom)) {
    const node = document.querySelector<HTMLElement>(`[data-uid="${ch.uid}"]`);
    if (!node) continue;
    const cr = node.getBoundingClientRect();
    if (Math.hypot(cx - (cr.left + cr.width / 2), cy - (cr.top + cr.height * 0.25)) < MOUTH_PX) {
      const who = getCharacter(ch.id)!;
      const masc = ['richard', 'risa', 'puffy', 'dart', 'mikie'].includes(who.id);
      const verb = def.drink ? (masc ? 'vypil' : 'vypila') : (masc ? 'snědl' : 'snědla');
      save.entities = save.entities.filter((e) => e.uid !== food.uid);
      ch.emotion = 'happy';
      ch.eatingUntil = Date.now() + 2200;
      selected = ch.uid;
      renderEntities();
      toast(`${who.name} ${verb} ${def.name}.`);
      persist();
      return true;
    }
  }
  const fridge = save.entities.find((e) => e.id === 'fridge' && e.room === save.currentRoom);
  if (fridge) {
    const node = document.querySelector<HTMLElement>(`[data-uid="${fridge.uid}"]`);
    if (node) {
      const fr = node.getBoundingClientRect();
      if (Math.hypot(cx - (fr.left + fr.width / 2), cy - (fr.top + fr.height / 2)) < 70) {
        if (!save.containers[fridge.uid]) save.containers[fridge.uid] = { type: 'fridge', items: [] };
        save.containers[fridge.uid].items.push({ id: food.id, at: Date.now() });
        save.entities = save.entities.filter((e) => e.uid !== food.uid);
        renderEntities();
        toast(`${def.name} je v lednici.`);
        persist();
        return true;
      }
    }
  }
  return false;
}

function react(entity: Entity) {
  const def = getFurniture(entity.id);
  if (!def) return;
  const lines = REACTIONS[def.type] || ['si hraje.'];
  const line = lines[Math.floor(Math.random() * lines.length)];
  const who = save.entities.find((e) => e.uid === selected && e.kind === 'character');
  const name = who ? getCharacter(who.id)?.name : null;
  toast(name ? `${name} ${line}` : line[0].toUpperCase() + line.slice(1));
}

function removeEntity(id: string) {
  const entity = save.entities.find((e) => e.uid === id);
  if (!entity) return;
  const def = resolveDef(entity);
  save.entities = save.entities.filter((e) => e.uid !== id);
  if (selected === id) selected = null;
  renderEntities();
  toast(`${def?.name || 'Věc'} je pryč.`);
  persist();
}

export function spawn(kind: Entity['kind'], id: string) {
  const key = `${kind}:${id}`;
  const now = Date.now();
  if (key === lastSpawn.key && now - lastSpawn.at < 400) return;
  lastSpawn = { key, at: now };
  const def = kind === 'character' || kind === 'sketch' ? getCharacter(id) : kind === 'food' ? getFood(id) : getFurniture(id);
  if (!def) return;
  if (kind === 'character') {
    const existing = save.entities.find((e) => e.kind === 'character' && e.id === id);
    if (existing) {
      existing.room = save.currentRoom;
      existing.xRel = 0.48;
      existing.yRel = 0.82;
      selected = existing.uid;
      renderEntities();
      toast(`${def.name} jde do ${getRoom(save.currentRoom)?.name}.`);
      persist();
      closeDrawers();
      return;
    }
  }
  const entity: Entity = {
    uid: uid(kind),
    kind,
    id,
    room: save.currentRoom,
    xRel: 0.42 + Math.random() * 0.16,
    yRel: 0.72 + Math.random() * 0.12,
    emotion: kind === 'character' ? 'happy' : undefined
  };
  save.entities.push(entity);
  selected = entity.uid;
  if (save.worldMode === 'furnished' || save.worldMode === 'empty') save.worldMode = 'custom';
  renderEntities();
  toast(`${def.name} je tady.`);
  persist();
  closeDrawers();
}

function bindPan() {
  document.querySelectorAll<HTMLElement>('.room-pan-viewport').forEach((vp) => {
    vp.addEventListener('pointerdown', onPanDown);
  });
}

function onPanDown(ev: PointerEvent) {
  if ((ev.target as HTMLElement).closest('.entity')) return;
  if (ev.button !== 0 && ev.pointerType === 'mouse') return;
  const panel = (ev.currentTarget as HTMLElement).closest('.room-panel') as HTMLElement;
  const roomId = panel.dataset.room!;
  save.currentRoom = roomId;
  updateChrome();
  const { maxPan } = roomSize();
  pan = {
    room: roomId,
    pointerId: ev.pointerId,
    startX: ev.clientX,
    startOff: (save.roomPans[roomId] ?? 0.5) * maxPan,
    max: maxPan,
    moved: false
  };
  const target = ev.currentTarget as HTMLElement;
  target.setPointerCapture(ev.pointerId);
  target.addEventListener('pointermove', onPanMove);
  target.addEventListener('pointerup', onPanUp);
}

function onPanMove(ev: PointerEvent) {
  if (!pan || ev.pointerId !== pan.pointerId) return;
  const dx = ev.clientX - pan.startX;
  if (Math.abs(dx) > 5) pan.moved = true;
  if (!pan.moved) return;
  ev.preventDefault();
  const next = pan.startOff - dx;
  const scroll = document.getElementById('world-scroll')!;
  if (next < 0 && dx > 0) {
    setPan(pan.room, 0);
    scroll.scrollLeft = Math.max(0, scroll.scrollLeft - dx);
    return;
  }
  if (next > pan.max && dx < 0) {
    setPan(pan.room, pan.max);
    scroll.scrollLeft += -dx;
    return;
  }
  setPan(pan.room, next);
}

function onPanUp(ev: PointerEvent) {
  if (!pan || ev.pointerId !== pan.pointerId) return;
  if (pan.moved) persist();
  const target = ev.currentTarget as HTMLElement | null;
  target?.removeEventListener('pointermove', onPanMove);
  target?.removeEventListener('pointerup', onPanUp);
  pan = null;
}

function setPan(room: string, px: number) {
  const { maxPan } = roomSize();
  save.roomPans[room] = maxPan > 0 ? Math.max(0, Math.min(maxPan, px)) / maxPan : 0.5;
  applyPans();
}

export function goRoom(id: string, smooth = true) {
  const list = rooms();
  const i = list.indexOf(id);
  if (i < 0) return;
  save.currentRoom = id;
  const scroll = document.getElementById('world-scroll')!;
  scroll.scrollTo({ left: i * viewport().w, behavior: smooth ? 'smooth' : 'auto' });
  updateChrome();
  persist();
}

export function travel(buildingId: string) {
  if (buildingId === save.currentBuilding) {
    closeDrawers();
    return;
  }
  const overlay = document.getElementById('travel-overlay')!;
  overlay.hidden = false;
  overlay.classList.add('is-on');
  overlay.innerHTML = `<div class="travel-plane">✈</div><p>Letíme…</p>`;
  window.setTimeout(() => {
    save.currentBuilding = buildingId;
    save.currentRoom = getBuilding(buildingId).rooms[0];
    buildStrip();
    goRoom(save.currentRoom, false);
    overlay.hidden = true;
    overlay.classList.remove('is-on');
    overlay.innerHTML = '';
    toast(`Jsme v ${getBuilding(buildingId).name}.`);
    persist();
  }, 2400);
  closeDrawers();
}

export function applyWallpaper(id: string) {
  save.roomThemes[save.currentRoom] = id;
  buildStrip();
  goRoom(save.currentRoom, false);
  toast(`Tapeta: ${WALLPAPERS.find((w) => w.id === id)?.name}`);
  persist();
  closeDrawers();
}

export function applyEmotion(id: Emotion) {
  const e = save.entities.find((x) => x.uid === selected && x.kind === 'character');
  if (!e) return;
  e.emotion = id;
  e.eatingUntil = undefined;
  renderEntities();
  persist();
}

export function applyShirt(color: string) {
  const e = save.entities.find((x) => x.uid === selected && x.kind === 'character');
  if (!e) return;
  e.outfit = { shirt: color };
  renderEntities();
  persist();
}

function updateInspector() {
  const bars = document.getElementById('character-bars')!;
  const e = save.entities.find((x) => x.uid === selected && x.kind === 'character');
  bars.hidden = !e;
  if (!e) return;
  document.querySelectorAll<HTMLElement>('.emotion-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.emotion === e.emotion);
  });
}

function updateChrome() {
  const room = getRoom(save.currentRoom);
  const name = document.getElementById('overlay-room-name');
  if (name && room) name.textContent = room.name;
  document.querySelectorAll<HTMLElement>('.overlay-dot').forEach((d) => {
    d.classList.toggle('active', d.dataset.room === save.currentRoom);
  });
}

function renderDots() {
  const dots = document.getElementById('room-dots')!;
  dots.innerHTML = rooms().map((id) => {
    const room = getRoom(id)!;
    return `<button class="overlay-dot${id === save.currentRoom ? ' active' : ''}" data-room="${id}" title="${room.name}"></button>`;
  }).join('');
  dots.querySelectorAll<HTMLElement>('.overlay-dot').forEach((b) => {
    b.addEventListener('click', () => goRoom(b.dataset.room!));
  });
}

function renderSplashChars() {
  const row = document.getElementById('splash-chars');
  if (!row) return;
  row.innerHTML = ['anetka', 'puffy', 'cookie', 'liza', 'risa']
    .map((id) => {
      const c = getCharacter(id);
      return c?.src ? `<img src="${assetUrl(c.src)}" alt="${c.name}"/>` : '';
    })
    .join('');
}

function renderFamily() {
  const el = document.getElementById('char-list')!;
  el.innerHTML = [...FAMILY, ...SKETCHES].map((c) => `
    <button class="card" data-spawn="character" data-id="${c.id}">
      ${c.src ? `<img src="${assetUrl(c.src)}" alt=""/>` : c.name}
      <span>${c.name}</span>
    </button>`).join('');
}

function renderFood() {
  const el = document.getElementById('food-list')!;
  el.innerHTML = FOODS.map((f) => `
    <button class="card" data-spawn="food" data-id="${f.id}">
      ${foodSVG(f)}<span>${f.name}</span>
    </button>`).join('');
}

let catalogLevel: 'groups' | 'sub' | 'items' = 'groups';
let catalogGroup = '';

export function renderCatalog(level: typeof catalogLevel, group?: string) {
  catalogLevel = level;
  if (group) catalogGroup = group;
  const list = document.getElementById('items-list')!;
  const title = document.getElementById('catalog-title')!;
  const back = document.getElementById('catalog-back') as HTMLButtonElement;
  const crumb = document.getElementById('catalog-breadcrumb')!;
  back.hidden = level === 'groups';
  if (level === 'groups') {
    title.textContent = 'Přidat věci';
    crumb.textContent = '1/3 — místnost nebo druh';
    list.innerHTML = CATALOG_GROUPS.map((g) => `<button class="card" data-cat="group" data-id="${g.id}"><span>${g.name}</span></button>`).join('');
  } else if (level === 'sub') {
    const subs = [...new Set(FURNITURE.filter((f) => f.group === catalogGroup).map((f) => f.subgroup))];
    title.textContent = CATALOG_GROUPS.find((g) => g.id === catalogGroup)?.name || '';
    crumb.textContent = '2/3 — druh';
    list.innerHTML = subs.map((s) => `<button class="card" data-cat="sub" data-id="${s}"><span>${s}</span></button>`).join('');
  } else {
    const items = FURNITURE.filter((f) => f.group === catalogGroup && f.subgroup === group);
    title.textContent = group || '';
    crumb.textContent = '3/3 — vyber kus';
    list.innerHTML = items.map((f) => `<button class="card" data-cat="spawn" data-id="${f.id}">${furnitureSVG(f)}<span>${f.name}</span></button>`).join('');
  }
}

function renderWallpapers() {
  const el = document.getElementById('wallpaper-list')!;
  el.innerHTML = WALLPAPERS.map((w) => `
    <button class="wallpaper-swatch" data-wallpaper="${w.id}">
      <span class="swatch-preview" style="background:linear-gradient(180deg,${w.wall} 50%,${w.floor} 50%)"></span>
      <span>${w.name}</span>
    </button>`).join('');
}

function renderMap() {
  const el = document.getElementById('world-map-list')!;
  el.innerHTML = BUILDINGS.map((b) => `
    <button class="world-map-card" data-building="${b.id}">
      <span class="world-map-name">${b.name}</span>
      <span class="world-map-meta">${b.rooms.length} místností</span>
    </button>`).join('');
}

function renderUpdates() {
  const el = document.getElementById('updates-list');
  if (!el) return;
  el.innerHTML = `
    <section class="update-round">
      <span class="update-badge">Hotovo v3.0.0</span>
      <h4 class="update-title">Táta hru nakreslil znovu</h4>
      <p>Dům je jako v sešitu. Postavy vypadají jako my. A tvoje kresby bydlí v Anetčině světě.</p>
      <div class="update-item"><strong>Vy jste říkali:</strong> pořád to není jako Toca.<br/><strong>My jsme udělali:</strong> nový dům na papíře, opravdové postavy, prázdné místnosti, mapa i letadlo.</div>
    </section>`;
}

export function toast(message: string) {
  const el = document.getElementById('toast')!;
  el.textContent = message;
  el.classList.add('show');
  window.setTimeout(() => el.classList.remove('show'), 2600);
}

export function toggleDrawer(id: string) {
  const d = document.getElementById(id)!;
  const open = d.classList.contains('open');
  closeDrawers();
  if (!open) d.classList.add('open');
}

export function closeDrawers() {
  document.querySelectorAll('.drawer').forEach((d) => d.classList.remove('open'));
}

function bindChrome() {
  document.getElementById('btn-play')!.addEventListener('click', () => showGame());
  document.getElementById('btn-new-world')!.addEventListener('click', () => {
    document.getElementById('splash')!.classList.add('active');
    toggleDrawer('world-start-drawer');
  });
  document.getElementById('btn-updates-splash')!.addEventListener('click', () => {
    showGame();
    toggleDrawer('updates-drawer');
  });
  document.querySelectorAll<HTMLElement>('[data-world]').forEach((b) => {
    b.addEventListener('click', () => {
      closeDrawers();
      showGame();
      startWorld(b.dataset.world as 'furnished' | 'empty');
    });
  });
  document.getElementById('btn-home')!.addEventListener('click', () => {
    document.getElementById('game')!.classList.remove('active');
    document.getElementById('splash')!.classList.add('active');
    closeDrawers();
  });
  document.getElementById('btn-tools')!.addEventListener('click', () => toggleDrawer('tools-drawer'));
  document.getElementById('btn-room-picker')!.addEventListener('click', () => {
    renderRoomPicker();
    toggleDrawer('room-picker-drawer');
  });
  document.getElementById('btn-world-map')!.addEventListener('click', () => toggleDrawer('world-map-drawer'));
  document.getElementById('btn-world-map-tools')?.addEventListener('click', () => toggleDrawer('world-map-drawer'));
  document.getElementById('btn-characters')!.addEventListener('click', () => toggleDrawer('char-drawer'));
  document.getElementById('btn-items')!.addEventListener('click', () => {
    renderCatalog('groups');
    toggleDrawer('items-drawer');
  });
  document.getElementById('btn-food')!.addEventListener('click', () => toggleDrawer('food-drawer'));
  document.getElementById('btn-wallpaper')!.addEventListener('click', () => toggleDrawer('wallpaper-drawer'));
  document.getElementById('btn-updates')!.addEventListener('click', () => toggleDrawer('updates-drawer'));
  document.getElementById('btn-new-world-tools')!.addEventListener('click', () => toggleDrawer('world-start-drawer'));
  document.getElementById('catalog-back')!.addEventListener('click', () => {
    if (catalogLevel === 'items') renderCatalog('sub', catalogGroup);
    else renderCatalog('groups');
  });
  document.getElementById('char-list')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-spawn="character"]');
    if (t) spawn(t.dataset.id!.startsWith('sketch-') ? 'sketch' : 'character', t.dataset.id!);
  });
  document.getElementById('food-list')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-spawn="food"]');
    if (t) spawn('food', t.dataset.id!);
  });
  document.getElementById('items-list')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cat]');
    if (!t) return;
    if (t.dataset.cat === 'group') renderCatalog('sub', t.dataset.id);
    else if (t.dataset.cat === 'sub') renderCatalog('items', t.dataset.id);
    else spawn(getFurniture(t.dataset.id!)?.type === 'toy' ? 'item' : 'furniture', t.dataset.id!);
  });
  document.getElementById('wallpaper-list')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-wallpaper]');
    if (t) applyWallpaper(t.dataset.wallpaper!);
  });
  document.getElementById('world-map-list')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-building]');
    if (t) travel(t.dataset.building!);
  });
  document.querySelectorAll<HTMLElement>('.drawer-close').forEach((b) => {
    b.addEventListener('click', () => closeDrawers());
  });
  document.getElementById('emotion-buttons')!.innerHTML = ['happy', 'sad', 'angry', 'surprised', 'sleepy', 'love']
    .map((id) => `<button class="emotion-btn" data-emotion="${id}">${id === 'love' ? '♥' : id[0]}</button>`)
    .join('');
  document.getElementById('emotion-buttons')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-emotion]');
    if (t) applyEmotion(t.dataset.emotion as Emotion);
  });
  document.getElementById('outfit-colors')!.innerHTML = ['#c45c3e', '#3d7a73', '#d4a04a', '#7a9b6a', '#5a4e42', '#d9897a']
    .map((c) => `<button class="swatch" data-color="${c}" style="background:${c}"></button>`)
    .join('');
  document.getElementById('outfit-colors')!.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-color]');
    if (t) applyShirt(t.dataset.color!);
  });
  document.getElementById('btn-save')!.addEventListener('click', async () => {
    await downloadBackup(save);
    toast('Záloha stažena.');
  });
  const file = document.getElementById('file-input') as HTMLInputElement;
  document.getElementById('btn-load')!.addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      save = await importBackup(f);
      buildStrip();
      goRoom(save.currentRoom, false);
      toast('Hra načtena.');
    } catch {
      toast('Tohle není záloha.');
    }
    file.value = '';
  });
  document.getElementById('world-scroll')!.addEventListener('scroll', () => {
    const i = Math.round((document.getElementById('world-scroll')!.scrollLeft) / viewport().w);
    const id = rooms()[i];
    if (id && id !== save.currentRoom) {
      save.currentRoom = id;
      updateChrome();
      persist();
    }
  });
  window.addEventListener('resize', () => {
    buildStrip();
    goRoom(save.currentRoom, false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawers();
  });
}

function renderRoomPicker() {
  const nav = document.getElementById('room-nav')!;
  nav.innerHTML = rooms().map((id) => {
    const room = getRoom(id)!;
    return `<button class="picker-tab${id === save.currentRoom ? ' active' : ''}" data-room="${id}">${room.name}</button>`;
  }).join('');
  nav.querySelectorAll<HTMLElement>('[data-room]').forEach((b) => {
    b.addEventListener('click', () => {
      goRoom(b.dataset.room!);
      closeDrawers();
    });
  });
}

function layoutGame() {
  const building = getBuilding(save.currentBuilding);
  if (!building.rooms.includes(save.currentRoom)) {
    save.currentRoom = building.rooms[0];
  }
  if (!save.roomPans) save.roomPans = {};
  buildStrip();
  goRoom(save.currentRoom, false);
}

export function showGame() {
  const splash = document.getElementById('splash');
  const game = document.getElementById('game');
  if (!game) {
    toast('Hra se nenašla. Obnov stránku.');
    return;
  }
  splash?.classList.remove('active');
  game.classList.add('active');
  const paint = () => {
    try {
      layoutGame();
    } catch (err) {
      console.error(err);
      toast('Dům se neotevřel. Zkus obnovit stránku.');
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(paint));
}

export function inspectScene() {
  const game = document.getElementById('game');
  const world = document.getElementById('game-world');
  const panel = document.querySelector<HTMLElement>(`.room-panel[data-room="${save.currentRoom}"]`)
    || document.querySelector<HTMLElement>('.room-panel');
  const vp = panel?.querySelector<HTMLElement>('.room-pan-viewport');
  const inner = panel?.querySelector<HTMLElement>('.room-pan-inner');
  const vpW = vp?.clientWidth || 0;
  const vpH = vp?.clientHeight || 0;
  const entities = [...(panel?.querySelectorAll<HTMLElement>('.entity') || [])].map((el) => {
    const r = el.getBoundingClientRect();
    const wr = world?.getBoundingClientRect();
    return {
      uid: el.dataset.uid,
      w: el.offsetWidth,
      h: el.offsetHeight,
      top: r.top,
      bottom: r.bottom,
      left: r.left,
      choppedTop: r.top < (wr?.top || 0) - 2,
      choppedBottom: r.bottom > (wr?.bottom || 0) + 2,
      hRatio: vpH ? el.offsetHeight / vpH : 0
    };
  });
  return {
    splashOn: document.getElementById('splash')?.classList.contains('active') || false,
    gameOn: game?.classList.contains('active') || false,
    building: save.currentBuilding,
    room: save.currentRoom,
    worldMode: save.worldMode,
    gameSize: { w: game?.clientWidth || 0, h: game?.clientHeight || 0 },
    worldSize: { w: world?.clientWidth || 0, h: world?.clientHeight || 0 },
    vpW,
    vpH,
    innerW: inner?.offsetWidth || 0,
    entityCount: entities.length,
    choppedHeads: entities.filter((e) => e.choppedTop).length,
    choppedFeet: entities.filter((e) => e.choppedBottom).length,
    entities
  };
}

export function installSeeHook() {
  (window as unknown as { __tocaSee: Record<string, unknown> }).__tocaSee = {
    ready: true,
    showGame,
    startWorld,
    goRoom,
    travel,
    closeDrawers,
    inspectScene
  };
}


