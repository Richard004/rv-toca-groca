import { FAMILY, getCharacterById } from './characters.js';
import { ROOMS, getRoomById, createRoomSVG, ROOM_VIEW_W, ROOM_VIEW_H } from './rooms.js';
import { createCharacterSprite, createItemSVG, ITEMS } from './sprites.js';
import { loadState, saveState } from './storage.js';

let state = loadState();
let currentRoom = state.currentRoom || 'living';
let entities = [...(state.entities || [])];
let selectedEntity = null;
let dragEntity = null;
let dragOffset = { x: 0, y: 0 };
let worldRect = null;
let autoSaveTimer = null;
let resizeObserver = null;

const FURNITURE_REACTIONS = {
  sofa: ['*si sedne na gauč* 😊', '*odpočívá* 💤', '*skáče na gauči* 🎉'],
  tv: ['*kouká na TV* 📺', '*směje se u televize* 😂'],
  fridge: ['*otevírá lednici* 🧊', '*bere svačinu* 🍎'],
  stove: ['*vaří něco dobrého* 👨‍🍳', '*voní to!* 😋'],
  table: ['*sedí u stolu* 🍽️', '*jí oběd* 😋'],
  bed: ['*spí* 💤💤', '*spí jako andílek* 😴'],
  desk: ['*kreslí* 🎨', '*dělá domácí úkoly* 📝'],
  toybox: ['*hraje si s hračkami* 🧸', '*staví z kostek* 🏗️'],
  swing: ['*houpe se* 🎪', '*wheee!* 🎉'],
  sandbox: ['*staví hrad z písku* 🏰', '*hraje si v písku* ⛱️'],
  doghouse: ['*lehá si do boudy* 🐕', '*hlídá zahradu* 🦴'],
  plant: ['*zalévá květinu* 💧', '*květina roste!* 🌱'],
  lamp: ['*zapíná světlo* 💡', '*svítí!* ✨'],
  poster: ['*objímá rodinu* ❤️', '*rodina je nejlepší!* 💕'],
  fruitbowl: ['*bere ovoce* 🍎', '*jablíčko!* 🍏']
};

export function initGame() {
  buildRoomNav();
  buildCharacterDrawer();
  buildItemsDrawer();
  buildSplashCharacters();
  seedFirstPlay();
  setupInteractions();
  setupResizeObserver();
  scheduleAutoSave();
  waitForLayout(() => switchRoom(currentRoom));
}

function getChromeHeight() {
  const topBar = document.querySelector('.top-bar');
  const roomNav = document.querySelector('.room-nav');
  return (topBar?.offsetHeight || 58) + (roomNav?.offsetHeight || 52);
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
    if (remaining > 0) {
      requestAnimationFrame(() => tick(remaining - 1));
    } else {
      callback();
    }
  };
  requestAnimationFrame(() => tick(attempts));
}

function getWorldSize() {
  const world = document.getElementById('game-world');
  ensureWorldHeight();
  const w = world.clientWidth || window.innerWidth;
  const h = world.clientHeight || (window.innerHeight - getChromeHeight());
  return { w: Math.max(w, 320), h: Math.max(h, 240) };
}

function setupResizeObserver() {
  const world = document.getElementById('game-world');
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = new ResizeObserver(() => {
    ensureWorldHeight();
    renderRoomScene();
    renderEntities();
    updateWorldRect();
  });
  resizeObserver.observe(world);
}

function renderRoomScene() {
  const room = getRoomById(currentRoom);
  if (!room) return;
  const scene = document.getElementById('room-scene');
  scene.innerHTML = createRoomSVG(room, ROOM_VIEW_W, ROOM_VIEW_H);

  scene.querySelectorAll('.furniture.interactive').forEach(el => {
    el.addEventListener('click', (e) => {
      const type = el.closest('[data-furniture]')?.dataset.furniture;
      if (type && selectedEntity) {
        reactToFurniture(selectedEntity, type);
      } else if (type) {
        showToast(getRandomReaction(type));
      }
      e.stopPropagation();
    });
  });
}

function seedFirstPlay() {
  if (entities.length > 0) return;
  const placements = [
    { kind: 'character', id: 'risa', room: 'living', x: 0.15, y: 0.55 },
    { kind: 'character', id: 'anetka', room: 'living', x: 0.28, y: 0.52 },
    { kind: 'character', id: 'puffy', room: 'garden', x: 0.2, y: 0.6 },
    { kind: 'character', id: 'zuzana', room: 'kitchen', x: 0.45, y: 0.5 },
    { kind: 'item', id: 'teddy', room: 'bedroom', x: 0.3, y: 0.6 },
    { kind: 'item', id: 'ball', room: 'garden', x: 0.55, y: 0.65 }
  ];
  entities = placements.map((p, i) => ({
    uid: `seed-${p.id}-${i}`,
    kind: p.kind,
    id: p.id,
    room: p.room,
    x: p.x,
    y: p.y,
    xRel: p.x,
    yRel: p.y
  }));
  persist();
}

function entityToPixels(entity, worldW, worldH) {
  const def = entity.kind === 'character'
    ? getCharacterById(entity.id)
    : ITEMS.find(i => i.id === entity.id);
  if (!def) return { x: 0, y: 0 };

  let xRel = entity.xRel;
  let yRel = entity.yRel;
  if (xRel == null) {
    xRel = entity.x / ROOM_VIEW_W;
    yRel = entity.y / ROOM_VIEW_H;
    entity.xRel = xRel;
    entity.yRel = yRel;
  }

  return {
    x: xRel * worldW,
    y: yRel * worldH
  };
}

function pixelsToRelative(x, y) {
  const { w, h } = getWorldSize();
  return { xRel: x / w, yRel: y / h };
}

function buildSplashCharacters() {
  const el = document.getElementById('splash-chars');
  if (!el) return;
  const chars = ['risa', 'anetka', 'puffy', 'tanicka', 'cookie'];
  el.innerHTML = chars.map(id => {
    const char = getCharacterById(id);
    return `<div class="splash-char">${createCharacterSprite(char)}</div>`;
  }).join('');
}

function buildRoomNav() {
  const nav = document.getElementById('room-nav');
  nav.innerHTML = ROOMS.map(room => `
    <button class="room-tab ${room.id === currentRoom ? 'active' : ''}" data-room="${room.id}">
      ${room.icon} ${room.name}
    </button>
  `).join('');

  nav.querySelectorAll('.room-tab').forEach(btn => {
    btn.addEventListener('click', () => switchRoom(btn.dataset.room));
  });
}

function buildCharacterDrawer() {
  const list = document.getElementById('char-list');
  list.innerHTML = FAMILY.map(char => `
    <div class="drawer-item" data-spawn="character" data-id="${char.id}" title="${char.name} — ${char.role}">
      ${createCharacterSprite(char)}
      <span>${char.name}</span>
    </div>
  `).join('');
}

function buildItemsDrawer() {
  const list = document.getElementById('items-list');
  list.innerHTML = ITEMS.map(item => `
    <div class="drawer-item" data-spawn="item" data-id="${item.id}" title="${item.name}">
      ${createItemSVG(item)}
      <span>${item.name}</span>
    </div>
  `).join('');
}

export function switchRoom(roomId) {
  currentRoom = roomId;
  state.currentRoom = roomId;

  const room = getRoomById(roomId);
  document.getElementById('room-title').textContent = room.name;

  document.querySelectorAll('.room-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.room === roomId);
  });

  renderRoomScene();
  renderEntities();
  persist();
}

function renderEntities() {
  const layer = document.getElementById('entities-layer');
  const roomEntities = entities.filter(e => e.room === currentRoom);
  const { w: worldW, h: worldH } = getWorldSize();

  layer.innerHTML = roomEntities.map(entity => {
    const isChar = entity.kind === 'character';
    const def = isChar ? getCharacterById(entity.id) : ITEMS.find(i => i.id === entity.id);
    if (!def) return '';

    const size = def.size;
    const svg = isChar ? createCharacterSprite(def) : createItemSVG(def);
    const pos = entityToPixels(entity, worldW, worldH);

    return `<div class="entity ${entity.uid === selectedEntity ? 'selected' : ''}"
      data-uid="${entity.uid}"
      style="left:${pos.x}px;top:${pos.y}px;width:${size.w}px;height:${size.h}px">
      ${svg}
      <span class="entity-label">${def.name}</span>
    </div>`;
  }).join('');

  updateWorldRect();
  attachEntityListeners();
}

function attachEntityListeners() {
  document.querySelectorAll('.entity').forEach(el => {
    el.addEventListener('pointerdown', onEntityPointerDown);
  });
}

function updateWorldRect() {
  const world = document.getElementById('game-world');
  worldRect = world.getBoundingClientRect();
}

let lastTapTime = 0;
let lastTapUid = null;

function onEntityPointerDown(e) {
  e.preventDefault();
  const el = e.currentTarget;
  const uid = el.dataset.uid;
  const now = Date.now();

  if (uid === lastTapUid && now - lastTapTime < 350) {
    removeEntity(uid);
    lastTapTime = 0;
    lastTapUid = null;
    return;
  }
  lastTapTime = now;
  lastTapUid = uid;

  selectedEntity = uid;
  document.querySelectorAll('.entity').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected', 'dragging');

  dragEntity = el;
  const rect = el.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', onEntityPointerMove);
  el.addEventListener('pointerup', onEntityPointerUp);
  el.addEventListener('pointercancel', onEntityPointerUp);
}

function removeEntity(uid) {
  const entity = entities.find(e => e.uid === uid);
  if (!entity) return;
  const def = entity.kind === 'character'
    ? getCharacterById(entity.id)
    : ITEMS.find(i => i.id === entity.id);
  entities = entities.filter(e => e.uid !== uid);
  selectedEntity = null;
  renderEntities();
  showToast(`${def?.name || 'Postava'} šel/a domů 👋`);
  persist();
}

function onEntityPointerMove(e) {
  if (!dragEntity || !worldRect) return;
  const x = e.clientX - worldRect.left - dragOffset.x;
  const y = e.clientY - worldRect.top - dragOffset.y;

  const maxX = worldRect.width - dragEntity.offsetWidth;
  const maxY = worldRect.height - dragEntity.offsetHeight;

  const clampedX = Math.max(0, Math.min(x, maxX));
  const clampedY = Math.max(0, Math.min(y, maxY));

  dragEntity.style.left = clampedX + 'px';
  dragEntity.style.top = clampedY + 'px';
}

function onEntityPointerUp(e) {
  if (!dragEntity) return;

  const uid = dragEntity.dataset.uid;
  const entity = entities.find(ent => ent.uid === uid);
  if (entity) {
    const x = parseFloat(dragEntity.style.left);
    const y = parseFloat(dragEntity.style.top);
    const rel = pixelsToRelative(x, y);
    entity.x = x;
    entity.y = y;
    entity.xRel = rel.xRel;
    entity.yRel = rel.yRel;
    persist();
  }

  dragEntity.classList.remove('dragging');
  dragEntity.releasePointerCapture(e.pointerId);
  dragEntity.removeEventListener('pointermove', onEntityPointerMove);
  dragEntity.removeEventListener('pointerup', onEntityPointerUp);
  dragEntity.removeEventListener('pointercancel', onEntityPointerUp);
  dragEntity = null;
}

function spawnEntity(kind, id) {
  const { w: worldW, h: worldH } = getWorldSize();
  const def = kind === 'character' ? getCharacterById(id) : ITEMS.find(i => i.id === id);
  if (!def) return;

  const xRel = 0.4 + Math.random() * 0.15;
  const yRel = 0.5 + Math.random() * 0.1;
  const x = xRel * worldW;
  const y = yRel * worldH;

  const existing = kind === 'character'
    ? entities.find(e => e.kind === 'character' && e.id === id)
    : null;

  if (existing) {
    existing.room = currentRoom;
    existing.x = x;
    existing.y = y;
    existing.xRel = xRel;
    existing.yRel = yRel;
    selectedEntity = existing.uid;
    renderEntities();
    showToast(`${def.name} jde do ${getRoomById(currentRoom).name}! 👋`);
    persist();
    closeDrawers();
    return;
  }

  const entity = {
    uid: `${kind}-${id}-${Date.now()}`,
    kind,
    id,
    room: currentRoom,
    x,
    y,
    xRel,
    yRel
  };

  entities.push(entity);
  selectedEntity = entity.uid;
  renderEntities();

  const el = document.querySelector(`[data-uid="${entity.uid}"]`);
  if (el) el.classList.add('spawn');

  showToast(`${def.name} přišel/a do ${getRoomById(currentRoom).name}! 🎉`);
  persist();
  closeDrawers();
}

function reactToFurniture(uid, furnitureType) {
  const entity = entities.find(e => e.uid === uid);
  if (!entity || entity.kind !== 'character') return;

  const char = getCharacterById(entity.id);
  const reaction = getRandomReaction(furnitureType);
  showToast(`${char.name} ${reaction}`);
}

function getRandomReaction(type) {
  const reactions = FURNITURE_REACTIONS[type] || ['*hraje si* 🎮'];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function setupInteractions() {
  document.getElementById('char-list').addEventListener('click', e => {
    const item = e.target.closest('[data-spawn="character"]');
    if (item) spawnEntity('character', item.dataset.id);
  });

  document.getElementById('items-list').addEventListener('click', e => {
    const item = e.target.closest('[data-spawn="item"]');
    if (item) spawnEntity('item', item.dataset.id);
  });

  document.getElementById('game-world').addEventListener('click', e => {
    if (e.target.closest('.entity')) return;
    selectedEntity = null;
    document.querySelectorAll('.entity').forEach(el => el.classList.remove('selected'));
  });

  window.addEventListener('resize', () => {
    renderRoomScene();
    renderEntities();
    updateWorldRect();
  });
}

export function toggleDrawer(id) {
  const drawer = document.getElementById(id);
  const isOpen = drawer.classList.contains('open');
  closeDrawers();
  if (!isOpen) drawer.classList.add('open');
}

export function closeDrawers() {
  document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
}

function persist() {
  state.currentRoom = currentRoom;
  state.entities = entities;
  saveState(state);
}

function scheduleAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(persist, 10000);
}

export function getGameState() {
  return { ...state, currentRoom, entities };
}

export function restoreGameState(newState) {
  state = { ...newState };
  currentRoom = state.currentRoom || 'living';
  entities = [...(state.entities || [])];
  switchRoom(currentRoom);
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

/** Placeholder for future custom drawing integration */
export function registerCustomAsset(id, imageUrl, meta = {}) {
  const custom = JSON.parse(localStorage.getItem('toca-groca-custom-assets') || '{}');
  custom[id] = { imageUrl, ...meta, addedAt: Date.now() };
  localStorage.setItem('toca-groca-custom-assets', JSON.stringify(custom));
}