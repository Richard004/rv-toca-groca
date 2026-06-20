import { FAMILY, getCharacterById } from './characters.js';
import {
  ROOMS, BUILDINGS, WALLPAPERS,
  getRoomById, getBuildingById, getThemedRoom,
  createRoomSVG, ROOM_VIEW_W, ROOM_VIEW_H
} from './rooms.js';
import { createCharacterSprite, createItemSVG, ITEMS, OUTFIT_COLORS } from './sprites.js';
import { CATALOG_GROUPS, getCatalogGroup, getSubgroupsForGroup, getCatalogItem } from './catalog.js';
import { createPlaceableSVG } from './furniture-sprites.js';
import { loadState, saveState } from './storage.js';

let catalogNav = { level: 'groups', groupId: null, subgroupId: null };

let state = loadState();
let currentBuilding = state.currentBuilding || 'home';
let currentRoom = state.currentRoom || 'living';
let roomThemes = { ...(state.roomThemes || {}) };
let entities = [...(state.entities || [])];
let selectedEntity = null;
let dragEntity = null;
let dragOffset = { x: 0, y: 0 };
let dragStartPos = { x: 0, y: 0 };
let hasDragMoved = false;
let worldRect = null;
let autoSaveTimer = null;
let resizeObserver = null;
let scrollSyncTimer = null;

const FURNITURE_REACTIONS = {
  sofa: ['*si sedne na gauč* 😊', '*odpočívá* 💤', '*skáče na gauči* 🎉'],
  tv: ['*kouká na TV* 📺', '*směje se u televize* 😂'],
  fridge: ['*otevírá lednici* 🧊', '*bere svačinu* 🍎'],
  stove: ['*vaří něco dobrého* 👨‍🍳', '*voní to!* 😋'],
  table: ['*sedí u stolu* 🍽️', '*jí oběd* 😋'],
  bed: ['*spí* 💤💤', '*spí jako andílek* 😴'],
  desk: ['*kreslí* 🎨', '*dělá domácí úkoly* 📝', '*staví robota* 🤖'],
  toybox: ['*hraje si s hračkami* 🧸', '*staví z kostek* 🏗️'],
  swing: ['*houpe se* 🎪', '*wheee!* 🎉'],
  sandbox: ['*staví hrad z písku* 🏰', '*hraje si v písku* ⛱️'],
  doghouse: ['*lehá si do boudy* 🐕', '*hlídá zahradu* 🦴'],
  plant: ['*zalévá květinu* 💧', '*květina roste!* 🌱'],
  lamp: ['*zapíná světlo* 💡', '*svítí!* ✨'],
  poster: ['*objímá rodinu* ❤️', '*rodina je nejlepší!* 💕'],
  fruitbowl: ['*bere ovoce* 🍎', '*jablíčko!* 🍏'],
  fireplace: ['*topí v kamnech* 🔥', '*je tu teplo!* ☺️'],
  bathtub: ['*koupe se ve vaně* 🛁', '*bublinky!* 🫧'],
  sink: ['*si myje ruce* 🧼', '*čisté ruce!* ✨'],
  toilet: ['*zavře dveře* 🚪', '*soukromí!* 😊'],
  mirror: ['*česá se* 💇', '*pěkně vypadám!* 😊'],
  shower: ['*sprchuje se* 🚿', '*čumí!* 🫧'],
  pool: ['*plave v bazénu* 🏊', '*cák cák!* 💦'],
  climbing: ['*leze na prolézačku* 🧗', '*jsem nahoře!* 🎉'],
  slide: ['*sjíždí skluzavku* 🛝', '*wheee!* 🎉'],
  trampoline: ['*skáče na trampolíně* 🤸', '*hop hop!* ⬆️']
};

let lastTapTime = 0;
let lastTapUid = null;

export function initGame() {
  buildBuildingNav();
  buildRoomNav();
  buildCharacterDrawer();
  buildItemsDrawer();
  buildWallpaperDrawer();
  buildOutfitBar();
  buildSplashCharacters();
  seedFirstPlay();
  setupInteractions();
  setupResizeObserver();
  scheduleAutoSave();
  waitForLayout(() => {
    buildWorldStrip();
    switchRoom(currentRoom, false);
  });
}

function getBuildingRooms() {
  return getBuildingById(currentBuilding).rooms;
}

function getChromeHeight() {
  const topBar = document.querySelector('.top-bar');
  const buildingNav = document.querySelector('.building-nav');
  const roomNav = document.querySelector('.room-nav');
  return (topBar?.offsetHeight || 58) + (buildingNav?.offsetHeight || 44) + (roomNav?.offsetHeight || 48);
}

function ensureWorldHeight() {
  const world = document.getElementById('game-world');
  if (world.clientHeight >= 100) return;
  const chrome = getChromeHeight();
  world.style.height = `calc(100dvh - ${chrome}px)`;
  world.style.flex = 'none';
}

function waitForLayout(callback, attempts = 20) {
  const tick = (remaining) => {
    ensureWorldHeight();
    const world = document.getElementById('game-world');
    if (world.clientHeight >= 100 && world.clientWidth >= 100) {
      callback();
      return;
    }
    if (remaining > 0) requestAnimationFrame(() => tick(remaining - 1));
    else callback();
  };
  requestAnimationFrame(() => tick(attempts));
}

function getWorldSize() {
  const scroll = document.getElementById('world-scroll');
  ensureWorldHeight();
  const w = scroll?.clientWidth || document.getElementById('game-world').clientWidth || window.innerWidth;
  const h = document.getElementById('game-world').clientHeight || (window.innerHeight - getChromeHeight());
  return { w: Math.max(w, 320), h: Math.max(h, 240) };
}

function setupResizeObserver() {
  const world = document.getElementById('game-world');
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = new ResizeObserver(() => {
    ensureWorldHeight();
    buildWorldStrip();
    scrollToRoom(currentRoom, false);
    renderAllEntities();
    updateWorldRect();
  });
  resizeObserver.observe(world);
  window.addEventListener('toca-layout-change', () => {
    ensureWorldHeight();
    buildWorldStrip();
    scrollToRoom(currentRoom, false);
    renderAllEntities();
    updateWorldRect();
  });
}

function buildWorldStrip() {
  const strip = document.getElementById('rooms-strip');
  const { w, h } = getWorldSize();
  const rooms = getBuildingRooms();

  strip.innerHTML = rooms.map(roomId => {
    const room = getThemedRoom(getRoomById(roomId), 'default', roomThemes);
    return `<div class="room-panel" data-room="${roomId}" style="width:${w}px">
      <div class="room-scene">${createRoomSVG(room, ROOM_VIEW_W, ROOM_VIEW_H)}</div>
      <div class="entities-layer" data-room="${roomId}"></div>
    </div>`;
  }).join('');

  strip.style.width = `${w * rooms.length}px`;

  strip.querySelectorAll('.furniture.interactive').forEach(el => {
    el.addEventListener('click', (e) => {
      const panel = el.closest('.room-panel');
      const roomId = panel?.dataset.room;
      const type = el.closest('[data-furniture]')?.dataset.furniture;
      if (roomId) currentRoom = roomId;
      if (type && selectedEntity) reactToFurniture(selectedEntity, type);
      else if (type) showToast(getRandomReaction(type));
      e.stopPropagation();
    });
  });

  renderAllEntities();
}

function scrollToRoom(roomId, smooth = true) {
  const rooms = getBuildingRooms();
  const index = rooms.indexOf(roomId);
  if (index < 0) return;
  const scroll = document.getElementById('world-scroll');
  const { w } = getWorldSize();
  scroll.scrollTo({ left: index * w, behavior: smooth ? 'smooth' : 'auto' });
}

function seedFirstPlay() {
  if (entities.length > 0) return;
  const placements = [
    { kind: 'character', id: 'risa', room: 'living', xRel: 0.15, yRel: 0.55 },
    { kind: 'character', id: 'anetka', room: 'living', xRel: 0.28, yRel: 0.52 },
    { kind: 'character', id: 'liza', room: 'living', xRel: 0.42, yRel: 0.62 },
    { kind: 'character', id: 'cookie', room: 'bedroom', xRel: 0.55, yRel: 0.58 },
    { kind: 'character', id: 'puffy', room: 'garden', xRel: 0.2, yRel: 0.6 },
    { kind: 'character', id: 'dart', room: 'garden', xRel: 0.35, yRel: 0.55 },
    { kind: 'character', id: 'zuzana', room: 'kitchen', xRel: 0.45, yRel: 0.5 },
    { kind: 'character', id: 'klarka', room: 'bedroom', xRel: 0.2, yRel: 0.5 },
    { kind: 'item', id: 'robot', room: 'bedroom', xRel: 0.65, yRel: 0.55 },
    { kind: 'item', id: 'teddy', room: 'bedroom', xRel: 0.3, yRel: 0.65 },
    { kind: 'item', id: 'ball', room: 'garden', xRel: 0.55, yRel: 0.65 }
  ];
  entities = placements.map((p, i) => ({
    uid: `seed-${p.id}-${i}`,
    kind: p.kind,
    id: p.id,
    room: p.room,
    xRel: p.xRel,
    yRel: p.yRel
  }));
  persist();
}

function entityToPixels(entity, worldW, worldH) {
  return { x: entity.xRel * worldW, y: entity.yRel * worldH };
}

function pixelsToRelative(x, y) {
  const { w, h } = getWorldSize();
  return { xRel: Math.max(0, Math.min(1, x / w)), yRel: Math.max(0, Math.min(1, y / h)) };
}

function getEntityOverrides(entity) {
  if (entity.kind !== 'character' || !entity.outfit) return {};
  return { shirt: entity.outfit.shirt, pants: entity.outfit.pants };
}

function buildSplashCharacters() {
  const el = document.getElementById('splash-chars');
  if (!el) return;
  el.innerHTML = ['risa', 'anetka', 'liza', 'puffy', 'cookie'].map((id, i) => {
    const char = getCharacterById(id);
    return `<div class="splash-char" style="animation-delay:${i * 0.3}s">${createCharacterSprite(char)}</div>`;
  }).join('');
}

function buildBuildingNav() {
  const nav = document.getElementById('building-nav');
  nav.innerHTML = BUILDINGS.map(b => `
    <button class="building-tab ${b.id === currentBuilding ? 'active' : ''}" data-building="${b.id}">
      ${b.icon} ${b.name}
    </button>
  `).join('');
  nav.querySelectorAll('.building-tab').forEach(btn => {
    btn.addEventListener('click', () => switchBuilding(btn.dataset.building));
  });
}

function buildRoomNav() {
  const nav = document.getElementById('room-nav');
  const rooms = getBuildingRooms();
  nav.innerHTML = rooms.map(roomId => {
    const room = getRoomById(roomId);
    return `<button class="room-tab ${roomId === currentRoom ? 'active' : ''}" data-room="${roomId}">
      ${room.icon} ${room.name.split('—').pop().trim()}
    </button>`;
  }).join('');
  nav.querySelectorAll('.room-tab').forEach(btn => {
    btn.addEventListener('click', () => switchRoom(btn.dataset.room));
  });
}

function buildWallpaperDrawer() {
  const list = document.getElementById('wallpaper-list');
  list.innerHTML = WALLPAPERS.map(wp => `
    <button class="wallpaper-swatch" data-wallpaper="${wp.id}" title="${wp.name}">
      <span class="swatch-preview" style="background:linear-gradient(180deg, ${wp.wall || '#fff'} 30%, ${wp.floor || wp.bg || '#eee'} 70%)"></span>
      <span>${wp.name}</span>
    </button>
  `).join('');
  list.querySelectorAll('.wallpaper-swatch').forEach(btn => {
    btn.addEventListener('click', () => applyWallpaper(btn.dataset.wallpaper));
  });
}

function buildOutfitBar() {
  const bar = document.getElementById('outfit-colors');
  bar.innerHTML = OUTFIT_COLORS.map(color =>
    `<button class="outfit-swatch" data-color="${color}" style="background:${color}" title="Změnit tričko"></button>`
  ).join('');
  bar.querySelectorAll('.outfit-swatch').forEach(btn => {
    btn.addEventListener('click', () => applyOutfitColor(btn.dataset.color));
  });
}

function buildCharacterDrawer() {
  document.getElementById('char-list').innerHTML = FAMILY.map(char => `
    <div class="drawer-item" data-spawn="character" data-id="${char.id}">
      ${createCharacterSprite(char)}
      <span>${char.name}</span>
    </div>
  `).join('');
}

function resetCatalogNav() {
  catalogNav = { level: 'groups', groupId: null, subgroupId: null };
}

function buildItemsDrawer() {
  resetCatalogNav();
  renderCatalog();
  const back = document.getElementById('catalog-back');
  if (back && !back.dataset.bound) {
    back.dataset.bound = '1';
    back.addEventListener('click', onCatalogBack);
  }
}

function onCatalogBack() {
  if (catalogNav.level === 'items') {
    catalogNav.level = 'subgroups';
    catalogNav.subgroupId = null;
  } else if (catalogNav.level === 'subgroups') {
    catalogNav.level = 'groups';
    catalogNav.groupId = null;
  }
  renderCatalog();
}

function renderCatalog() {
  const list = document.getElementById('items-list');
  const title = document.getElementById('catalog-title');
  const back = document.getElementById('catalog-back');
  const crumb = document.getElementById('catalog-breadcrumb');
  if (!list) return;

  if (catalogNav.level === 'groups') {
    title.textContent = 'Přidat věci';
    back.hidden = true;
    crumb.textContent = '1/3 — Vyber místnost nebo kategorii';
    list.innerHTML = CATALOG_GROUPS.map(g => `
      <div class="drawer-item catalog-card" data-catalog-action="group" data-id="${g.id}">
        <span class="catalog-icon">${g.icon}</span>
        <span>${g.name}</span>
      </div>`).join('');
    return;
  }

  back.hidden = false;

  if (catalogNav.level === 'subgroups') {
    const group = getCatalogGroup(catalogNav.groupId);
    title.textContent = group?.name || 'Kategorie';
    crumb.textContent = `2/3 — Vyber druh věci (${group?.name})`;
    list.innerHTML = getSubgroupsForGroup(catalogNav.groupId).map(sg => `
      <div class="drawer-item catalog-card" data-catalog-action="subgroup" data-id="${sg.id}">
        <span class="catalog-icon">${sg.icon}</span>
        <span>${sg.name}</span>
        <span class="catalog-count">${sg.items.length}</span>
      </div>`).join('');
    return;
  }

  const group = getCatalogGroup(catalogNav.groupId);
  const subgroup = getSubgroupsForGroup(catalogNav.groupId).find(s => s.id === catalogNav.subgroupId);
  title.textContent = subgroup?.name || 'Varianty';
  crumb.textContent = `3/3 — Vyber konkrétní věc (${group?.name} › ${subgroup?.name})`;
  list.innerHTML = (subgroup?.items || []).map(item => `
    <div class="drawer-item catalog-variant" data-catalog-action="spawn" data-id="${item.id}">
      ${createPlaceableSVG(item)}
      <span>${item.name}</span>
    </div>`).join('');
}

function resolveEntityDef(entity) {
  if (entity.kind === 'character') return getCharacterById(entity.id);
  const catalog = getCatalogItem(entity.id);
  if (catalog) return catalog;
  return ITEMS.find(i => i.id === entity.id);
}

function entitySvg(entity, def) {
  if (entity.kind === 'character') {
    return createCharacterSprite(def, getEntityOverrides(entity));
  }
  if (getCatalogItem(entity.id)) return createPlaceableSVG(def);
  return createItemSVG(def);
}

export function switchBuilding(buildingId) {
  currentBuilding = buildingId;
  const rooms = getBuildingRooms();
  if (!rooms.includes(currentRoom)) currentRoom = rooms[0];
  buildRoomNav();
  document.querySelectorAll('.building-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.building === buildingId));
  buildWorldStrip();
  switchRoom(currentRoom, false);
  showToast(`${getBuildingById(buildingId).name} — pojďme exploreovat! 🏠`);
  persist();
}

export function switchRoom(roomId, smooth = true) {
  const rooms = getBuildingRooms();
  if (!rooms.includes(roomId)) return;
  currentRoom = roomId;
  state.currentRoom = roomId;

  const room = getRoomById(roomId);
  const title = room.name.includes('—') ? room.name.split('—')[1].trim() : room.name;
  document.getElementById('room-title').textContent = title;

  document.querySelectorAll('.room-tab').forEach(tab =>
    tab.classList.toggle('active', tab.dataset.room === roomId));

  scrollToRoom(roomId, smooth);
  updateArrowVisibility();
  persist();
}

function updateArrowVisibility() {
  const rooms = getBuildingRooms();
  const idx = rooms.indexOf(currentRoom);
  document.getElementById('arrow-left').style.visibility = idx > 0 ? 'visible' : 'hidden';
  document.getElementById('arrow-right').style.visibility = idx < rooms.length - 1 ? 'visible' : 'hidden';
}

function applyWallpaper(presetId) {
  const preset = WALLPAPERS.find(w => w.id === presetId);
  if (!preset) return;
  if (preset.id === 'default') delete roomThemes[currentRoom];
  else roomThemes[currentRoom] = { bg: preset.bg, wall: preset.wall, floor: preset.floor };
  buildWorldStrip();
  scrollToRoom(currentRoom, false);
  showToast(`Tapeta změněna! ${preset.name} 🎨`);
  closeDrawers();
  persist();
}

function applyOutfitColor(color) {
  const entity = entities.find(e => e.uid === selectedEntity);
  if (!entity || entity.kind !== 'character') return;
  entity.outfit = { ...(entity.outfit || {}), shirt: color };
  renderAllEntities();
  const char = getCharacterById(entity.id);
  showToast(`${char.name} má nové tričko! 👕`);
  persist();
}

function renderAllEntities() {
  const { w: worldW, h: worldH } = getWorldSize();
  document.querySelectorAll('.room-panel').forEach(panel => {
    const roomId = panel.dataset.room;
    const layer = panel.querySelector('.entities-layer');
    const roomEntities = entities.filter(e => e.room === roomId);

    layer.innerHTML = roomEntities.map(entity => {
      const def = resolveEntityDef(entity);
      if (!def) return '';
      const size = def.size;
      const svg = entitySvg(entity, def);
      const pos = entityToPixels(entity, worldW, worldH);
      return `<div class="entity ${entity.uid === selectedEntity ? 'selected' : ''}"
        data-uid="${entity.uid}"
        style="left:${pos.x}px;top:${pos.y}px;width:${size.w}px;height:${size.h}px">
        ${svg}<span class="entity-label">${def.name}</span></div>`;
    }).join('');
  });
  updateWorldRect();
  attachEntityListeners();
  updateOutfitBar();
}

function updateOutfitBar() {
  const bar = document.getElementById('outfit-bar');
  const entity = entities.find(e => e.uid === selectedEntity);
  bar.hidden = !(entity && entity.kind === 'character');
}

function attachEntityListeners() {
  document.querySelectorAll('.entity').forEach(el => {
    el.addEventListener('pointerdown', onEntityPointerDown, { passive: false });
  });
}

function updateWorldRect() {
  const panel = document.querySelector(`.room-panel[data-room="${currentRoom}"]`);
  worldRect = panel ? panel.getBoundingClientRect() : document.getElementById('game-world').getBoundingClientRect();
}

function onEntityPointerDown(e) {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  e.preventDefault();
  e.stopPropagation();

  const el = e.currentTarget;
  const uid = el.dataset.uid;
  const panel = el.closest('.room-panel');
  if (panel) {
    currentRoom = panel.dataset.room;
    worldRect = panel.getBoundingClientRect();
  }

  selectedEntity = uid;
  hasDragMoved = false;
  dragStartPos = { x: e.clientX, y: e.clientY };

  document.querySelectorAll('.entity').forEach(n => n.classList.remove('selected'));
  el.classList.add('selected');
  updateOutfitBar();

  dragEntity = el;
  const rect = el.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', onEntityPointerMove, { passive: false });
  el.addEventListener('pointerup', onEntityPointerUp);
  el.addEventListener('pointercancel', onEntityPointerUp);
}

function onEntityPointerMove(e) {
  if (!dragEntity || !worldRect) return;
  const dx = Math.abs(e.clientX - dragStartPos.x);
  const dy = Math.abs(e.clientY - dragStartPos.y);
  if (dx > 6 || dy > 6) {
    hasDragMoved = true;
    dragEntity.classList.add('dragging');
  }
  if (!hasDragMoved) return;

  e.preventDefault();
  const x = e.clientX - worldRect.left - dragOffset.x;
  const y = e.clientY - worldRect.top - dragOffset.y;
  const maxX = worldRect.width - dragEntity.offsetWidth;
  const maxY = worldRect.height - dragEntity.offsetHeight;
  dragEntity.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
  dragEntity.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function onEntityPointerUp(e) {
  if (!dragEntity) return;
  const uid = dragEntity.dataset.uid;
  const now = Date.now();

  if (!hasDragMoved && uid === lastTapUid && now - lastTapTime < 400) {
    removeEntity(uid);
    lastTapTime = 0;
    lastTapUid = null;
  } else if (!hasDragMoved) {
    lastTapTime = now;
    lastTapUid = uid;
  } else {
    const entity = entities.find(ent => ent.uid === uid);
    if (entity) {
      const rel = pixelsToRelative(parseFloat(dragEntity.style.left), parseFloat(dragEntity.style.top));
      entity.xRel = rel.xRel;
      entity.yRel = rel.yRel;
      entity.room = currentRoom;
      persist();
    }
    lastTapTime = 0;
    lastTapUid = null;
  }

  dragEntity.classList.remove('dragging');
  dragEntity.releasePointerCapture(e.pointerId);
  dragEntity.removeEventListener('pointermove', onEntityPointerMove);
  dragEntity.removeEventListener('pointerup', onEntityPointerUp);
  dragEntity.removeEventListener('pointercancel', onEntityPointerUp);
  dragEntity = null;
  hasDragMoved = false;
}

function removeEntity(uid) {
  const entity = entities.find(e => e.uid === uid);
  if (!entity) return;
  const def = resolveEntityDef(entity);
  entities = entities.filter(e => e.uid !== uid);
  selectedEntity = null;
  renderAllEntities();
  showToast(`${def?.name || 'Postava'} šel/a domů 👋`);
  persist();
}

function spawnEntity(kind, id) {
  const def = kind === 'character' ? getCharacterById(id) : resolveEntityDef({ kind, id });
  if (!def) return;

  const xRel = 0.32 + Math.random() * 0.2;
  const yRel = 0.42 + Math.random() * 0.18;

  const existing = kind === 'character' ? entities.find(e => e.kind === 'character' && e.id === id) : null;
  if (existing) {
    existing.room = currentRoom;
    existing.xRel = xRel;
    existing.yRel = yRel;
    selectedEntity = existing.uid;
    renderAllEntities();
    switchRoom(currentRoom);
    showToast(`${def.name} jde do ${getRoomById(currentRoom).name}! 👋`);
    persist();
    closeDrawers();
    return;
  }

  const entityKind = kind === 'catalog' ? (def.type === 'toy' ? 'item' : 'furniture') : kind;
  const entity = { uid: `${entityKind}-${id}-${Date.now()}`, kind: entityKind, id, room: currentRoom, xRel, yRel };
  entities.push(entity);
  selectedEntity = entity.uid;
  renderAllEntities();
  document.querySelector(`[data-uid="${entity.uid}"]`)?.classList.add('spawn');
  const placed = entityKind === 'furniture' ? 'je v místnosti' : 'přišel/a';
  showToast(`${def.name} ${placed}! 🎉`);
  persist();
  closeDrawers();
  resetCatalogNav();
}

function spawnCatalogItem(id) {
  spawnEntity('catalog', id);
}

function reactToFurniture(uid, furnitureType) {
  const entity = entities.find(e => e.uid === uid);
  if (!entity || entity.kind !== 'character') return;
  const char = getCharacterById(entity.id);
  let reaction = getRandomReaction(furnitureType);
  if (furnitureType === 'desk' && char.features?.robotics) {
    reaction = '*staví robota* 🤖';
  }
  showToast(`${char.name} ${reaction}`);
}

function getRandomReaction(type) {
  const reactions = FURNITURE_REACTIONS[type] || ['*hraje si* 🎮'];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function onWorldScroll() {
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = setTimeout(() => {
    const scroll = document.getElementById('world-scroll');
    const { w } = getWorldSize();
    const index = Math.round(scroll.scrollLeft / w);
    const rooms = getBuildingRooms();
    const roomId = rooms[index];
    if (roomId && roomId !== currentRoom) {
      currentRoom = roomId;
      state.currentRoom = roomId;
      const room = getRoomById(roomId);
      const title = room.name.includes('—') ? room.name.split('—')[1].trim() : room.name;
      document.getElementById('room-title').textContent = title;
      document.querySelectorAll('.room-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.room === roomId));
      updateArrowVisibility();
      updateWorldRect();
      persist();
    }
  }, 80);
}

function setupInteractions() {
  document.getElementById('char-list').addEventListener('click', e => {
    const item = e.target.closest('[data-spawn="character"]');
    if (item) spawnEntity('character', item.dataset.id);
  });
  document.getElementById('items-list').addEventListener('click', e => {
    const card = e.target.closest('[data-catalog-action]');
    if (!card) return;
    const action = card.dataset.catalogAction;
    const id = card.dataset.id;
    if (action === 'group') {
      catalogNav = { level: 'subgroups', groupId: id, subgroupId: null };
      renderCatalog();
    } else if (action === 'subgroup') {
      catalogNav = { ...catalogNav, level: 'items', subgroupId: id };
      renderCatalog();
    } else if (action === 'spawn') {
      spawnCatalogItem(id);
    }
  });
  document.getElementById('world-scroll').addEventListener('scroll', onWorldScroll, { passive: true });

  document.getElementById('arrow-left').addEventListener('click', () => {
    const rooms = getBuildingRooms();
    const idx = rooms.indexOf(currentRoom);
    if (idx > 0) switchRoom(rooms[idx - 1]);
  });
  document.getElementById('arrow-right').addEventListener('click', () => {
    const rooms = getBuildingRooms();
    const idx = rooms.indexOf(currentRoom);
    if (idx < rooms.length - 1) switchRoom(rooms[idx + 1]);
  });

  document.getElementById('game-world').addEventListener('click', e => {
    if (e.target.closest('.entity') || e.target.closest('.room-arrow')) return;
    selectedEntity = null;
    document.querySelectorAll('.entity').forEach(el => el.classList.remove('selected'));
    updateOutfitBar();
  });

  window.addEventListener('resize', () => {
    buildWorldStrip();
    scrollToRoom(currentRoom, false);
    renderAllEntities();
  });
}

export function toggleDrawer(id) {
  const drawer = document.getElementById(id);
  const isOpen = drawer.classList.contains('open');
  closeDrawers();
  if (!isOpen) {
    drawer.classList.add('open');
    if (id === 'items-drawer') {
      resetCatalogNav();
      renderCatalog();
    }
  }
}

export function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
}

function persist() {
  state.currentRoom = currentRoom;
  state.currentBuilding = currentBuilding;
  state.roomThemes = roomThemes;
  state.entities = entities;
  saveState(state);
}

function scheduleAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(persist, 10000);
}

export function getGameState() {
  return { ...state, currentRoom, currentBuilding, roomThemes, entities };
}

export function restoreGameState(newState) {
  state = { ...newState };
  currentRoom = state.currentRoom || 'living';
  currentBuilding = state.currentBuilding || 'home';
  roomThemes = { ...(state.roomThemes || {}) };
  entities = [...(state.entities || [])];
  buildBuildingNav();
  buildRoomNav();
  buildWorldStrip();
  switchRoom(currentRoom, false);
  showToast('Hra načtena! Vítej zpět! 🎉');
}

let toastTimer = null;
export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

export function registerCustomAsset(id, imageUrl, meta = {}) {
  const custom = JSON.parse(localStorage.getItem('toca-groca-custom-assets') || '{}');
  custom[id] = { imageUrl, ...meta, addedAt: Date.now() };
  localStorage.setItem('toca-groca-custom-assets', JSON.stringify(custom));
}