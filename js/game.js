import { FAMILY, getCharacterById } from './characters.js';
import {
  ROOMS, BUILDINGS, WALLPAPERS,
  getRoomById, getBuildingById, getThemedRoom,
  createRoomSVG, ROOM_VIEW_W, ROOM_VIEW_H, ROOM_ASPECT
} from './rooms.js';
import { createPortraitRoomSVG } from './room-art.js';
import { initWorldMap, playTravelAnimation, updateWorldMapActive } from './world-map.js';
import { createCharacterSprite, createItemSVG, ITEMS, OUTFIT_COLORS, EMOTIONS } from './sprites.js';
import { FOOD_ITEMS, getFoodItem, createFoodSVG } from './food-catalog.js';
import { CATALOG_GROUPS, getCatalogGroup, getSubgroupsForGroup, getCatalogItem } from './catalog.js';
import { createPlaceableSVG } from './furniture-sprites.js';
import { loadState, saveState } from './storage.js';
import { buildFurnishedDefaultWorld, buildEmptyWorld } from './default-world.js';
import { scaleSize } from './entity-scale.js';

let catalogNav = { level: 'groups', groupId: null, subgroupId: null };

let state = loadState();
let currentBuilding = state.currentBuilding || 'home';
let currentRoom = state.currentRoom || 'living';
let roomThemes = { ...(state.roomThemes || {}) };
let entities = [...(state.entities || [])];
let fridgeItems = { ...(state.fridgeItems || {}) };
let selectedEntity = null;
let dragEntity = null;
let dragOffset = { x: 0, y: 0 };
let dragStartPos = { x: 0, y: 0 };
let hasDragMoved = false;
let worldRect = null;
let autoSaveTimer = null;
let resizeObserver = null;
let scrollSyncTimer = null;
let interactionsBound = false;
let layoutChangeBound = false;
let lastSpawnKey = '';
let lastSpawnAt = 0;
let roomPans = { ...(state.roomPans || {}) };
let panDrag = null;
let isTraveling = false;

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
  if (document.getElementById('game')?.dataset.inited) return;
  document.documentElement.style.setProperty('--room-aspect', String(ROOM_ASPECT));

  buildBuildingNav();
  buildRoomNav();
  buildCharacterDrawer();
  buildItemsDrawer();
  buildWallpaperDrawer();
  buildOutfitBar();
  buildEmotionBar();
  buildFoodDrawer();
  buildSplashCharacters();
  initWorldMap(travelToBuilding);
  updateWorldMapActive(currentBuilding);
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
  return 0;
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
  const world = document.getElementById('game-world');
  const vv = window.visualViewport;
  ensureWorldHeight();
  const w = scroll?.clientWidth || world?.clientWidth || vv?.width || window.innerWidth;
  const h = world?.clientHeight || vv?.height || window.innerHeight;
  return { w: Math.max(w, 320), h: Math.max(h, 240) };
}

/** Read real layout from DOM (CSS sets height-first crop). */
/** Explicit dimensions — works on Safari without container-query units (cqh). */
function applyRoomDimensions() {
  document.querySelectorAll('.room-panel').forEach((panel) => {
    const vp = panel.querySelector('.room-pan-viewport');
    const inner = panel.querySelector('.room-pan-inner');
    if (!vp || !inner) return;
    const vpH = vp.clientHeight;
    const vpW = vp.clientWidth;
    if (vpH < 50) return;
    const portraitPhone = vpW < vpH * 0.85;
    let innerW = portraitPhone ? vpW : Math.round(vpH * ROOM_ASPECT);
    if (!portraitPhone && innerW < vpW) innerW = vpW;
    inner.style.width = `${innerW}px`;
    inner.style.height = `${vpH}px`;
    inner.dataset.portraitFit = portraitPhone ? '1' : '0';
  });
}

function getRoomInnerSize(panelW, panelH, roomId = currentRoom) {
  const panel = document.querySelector(`.room-panel[data-room="${roomId}"]`)
    || document.querySelector('.room-panel');
  const inner = panel?.querySelector('.room-pan-inner');
  const viewport = panel?.querySelector('.room-pan-viewport');

  if (inner && viewport) {
    const innerW = inner.offsetWidth;
    const innerH = viewport.clientHeight;
    return { innerW, innerH, maxPan: Math.max(0, innerW - viewport.clientWidth) };
  }

  const innerH = panelH;
  const portraitPhone = panelW < panelH * 0.85;
  let innerW = portraitPhone ? panelW : Math.round(innerH * ROOM_ASPECT);
  if (!portraitPhone && innerW < panelW) innerW = panelW;
  return { innerW, innerH, maxPan: Math.max(0, innerW - panelW) };
}

function getRoomPanMetrics(roomId) {
  const { w: panelW, h: panelH } = getWorldSize();
  const { innerW, innerH, maxPan } = getRoomInnerSize(panelW, panelH);
  const panRel = roomPans[roomId] ?? 0.5;
  return { panelW, panelH, innerW, innerH, h: panelH, maxPan, panOffset: panRel * maxPan };
}

function getRoomPanOffset(roomId) {
  return getRoomPanMetrics(roomId).panOffset;
}

function applyRoomPan(roomId) {
  const panel = document.querySelector(`.room-panel[data-room="${roomId}"]`);
  const inner = panel?.querySelector('.room-pan-inner');
  if (!inner) return;
  const offset = getRoomPanOffset(roomId);
  inner.style.transform = `translate3d(${-offset}px, 0, 0)`;
}

function applyAllRoomPans() {
  getBuildingRooms().forEach(applyRoomPan);
}

function setRoomPanOffset(roomId, offsetPx, save = true) {
  const { maxPan } = getRoomPanMetrics(roomId);
  const clamped = Math.max(0, Math.min(maxPan, offsetPx));
  roomPans[roomId] = maxPan > 0 ? clamped / maxPan : 0.5;
  applyRoomPan(roomId);
  if (save) persist();
}

function getRoomInnerElement(roomId = currentRoom) {
  const panel = document.querySelector(`.room-panel[data-room="${roomId}"]`);
  return panel?.querySelector('.room-pan-inner') || panel;
}

function getRoomLayout(roomId) {
  const panel = document.querySelector(`.room-panel[data-room="${roomId}"]`);
  const inner = panel?.querySelector('.room-pan-inner');
  const viewport = panel?.querySelector('.room-pan-viewport');
  const panOffset = getRoomPanOffset(roomId);

  if (inner && viewport) {
    return {
      innerW: inner.offsetWidth,
      innerH: viewport.clientHeight,
      panOffset,
      vpRect: viewport.getBoundingClientRect()
    };
  }

  const { w: panelW, h: panelH } = getWorldSize();
  const { innerW, innerH } = getRoomInnerSize(panelW, panelH);
  return {
    innerW,
    innerH,
    panOffset,
    vpRect: panel?.getBoundingClientRect() || { left: 0, top: 0, width: panelW, height: panelH }
  };
}

function getEntityDragBounds(roomId = currentRoom) {
  const { innerW, innerH, panOffset, vpRect } = getRoomLayout(roomId);
  return { innerW, h: innerH, panOffset, vpRect };
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
  if (!layoutChangeBound) {
    layoutChangeBound = true;
    window.addEventListener('toca-layout-change', onLayoutChange);
    window.visualViewport?.addEventListener('resize', onLayoutChange);
    window.visualViewport?.addEventListener('scroll', onLayoutChange);
  }
}

/** Re-measure after game screen becomes visible (fixes portrait crop). */
export function refreshWorldLayout() {
  document.documentElement.style.setProperty('--room-aspect', String(ROOM_ASPECT));
  ensureWorldHeight();
  buildWorldStrip();
  scrollToRoom(currentRoom, false);
  renderAllEntities();
  updateWorldRect();
}

function onLayoutChange() {
  ensureWorldHeight();
  buildWorldStrip();
  scrollToRoom(currentRoom, false);
  renderAllEntities();
  updateWorldRect();
}

function roomSceneSVG(room) {
  const { w, h } = getWorldSize();
  if (w < h * 0.85) return createPortraitRoomSVG(room);
  return createRoomSVG(room, ROOM_VIEW_W, ROOM_VIEW_H);
}

function buildWorldStrip() {
  const strip = document.getElementById('rooms-strip');
  const { w, h } = getWorldSize();
  const rooms = getBuildingRooms();

  strip.innerHTML = rooms.map(roomId => {
    const room = getThemedRoom(getRoomById(roomId), 'default', roomThemes);
    const sceneSvg = roomSceneSVG(room);
    return `<div class="room-panel" data-room="${roomId}" style="width:${w}px">
      <div class="room-pan-viewport">
        <div class="room-pan-inner">
          <div class="room-scene">${sceneSvg}</div>
          <div class="entities-layer" data-room="${roomId}"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  strip.style.width = `${w * rooms.length}px`;
  applyRoomDimensions();
  applyAllRoomPans();
  setupPanListeners();

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
  if (state.worldMode === 'empty' && entities.length === 0) {
    setTimeout(() => showToast('Prázdný dům! Přidej rodinu z ＋ a nábytek z 🎁'), 900);
  } else if (state.worldMode === 'furnished') {
    setTimeout(() => showToast('Krásně zařízený dům — vše můžeš přesouvat! 🏠✨'), 900);
  }
}

export function startNewWorld(mode = 'furnished') {
  const built = mode === 'empty' ? buildEmptyWorld() : buildFurnishedDefaultWorld();

  entities = [...built.entities];
  roomThemes = { ...(built.roomThemes || {}) };
  roomPans = { ...(built.roomPans || {}) };
  fridgeItems = { ...(built.fridgeItems || {}) };
  currentBuilding = built.currentBuilding || 'home';
  currentRoom = built.currentRoom || 'living';
  state.worldMode = built.worldMode;
  state.emptyWorldSeeded = mode === 'empty';
  selectedEntity = null;

  buildBuildingNav();
  buildRoomNav();
  updateWorldMapActive(currentBuilding);
  refreshWorldLayout();
  switchRoom(currentRoom, false);
  persist();

  const msg = mode === 'empty'
    ? 'Nový prázdný dům! Zařiď si ho od nuly 📦'
    : 'Nový krásný dům je připravený! Užij si ho 🌟';
  showToast(msg);
}

function entityToPixels(entity, worldW, worldH) {
  return { x: entity.xRel * worldW, y: entity.yRel * worldH };
}

function pixelsToRelative(x, y, roomId = currentRoom) {
  const { innerW, innerH } = getRoomLayout(roomId);
  return {
    xRel: Math.max(0, Math.min(1, x / Math.max(innerW, 1))),
    yRel: Math.max(0, Math.min(1, y / Math.max(innerH, 1)))
  };
}

function getEntityOverrides(entity) {
  if (entity.kind !== 'character') return {};
  const overrides = {};
  if (entity.outfit) {
    overrides.shirt = entity.outfit.shirt;
    overrides.pants = entity.outfit.pants;
  }
  if (entity.eatingUntil && entity.eatingUntil > Date.now()) {
    overrides.emotion = 'eating';
  } else if (entity.emotion) {
    overrides.emotion = entity.emotion;
  }
  return overrides;
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
    btn.addEventListener('click', () => travelToBuilding(btn.dataset.building));
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
    btn.addEventListener('click', () => {
      switchRoom(btn.dataset.room);
      closeDrawers();
    });
  });
  buildRoomDots();
}

function buildRoomDots() {
  const dots = document.getElementById('room-dots');
  if (!dots) return;
  const rooms = getBuildingRooms();
  dots.innerHTML = rooms.map((roomId, i) => {
    const room = getRoomById(roomId);
    const active = roomId === currentRoom;
    return `<button type="button" class="overlay-dot ${active ? 'active' : ''}" data-room="${roomId}" aria-label="${room.name}" title="${room.name}"></button>`;
  }).join('');
  dots.querySelectorAll('.overlay-dot').forEach(btn => {
    btn.addEventListener('click', () => switchRoom(btn.dataset.room));
  });
}

function updateOverlayChrome() {
  const room = getRoomById(currentRoom);
  if (!room) return;
  const title = room.name.includes('—') ? room.name.split('—')[1].trim() : room.name;
  const iconEl = document.getElementById('overlay-room-icon');
  const nameEl = document.getElementById('overlay-room-name');
  if (iconEl) iconEl.textContent = room.icon;
  if (nameEl) nameEl.textContent = title;
  document.querySelectorAll('.overlay-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.room === currentRoom);
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

function buildEmotionBar() {
  const bar = document.getElementById('emotion-buttons');
  bar.innerHTML = EMOTIONS.map(em => `
    <button class="emotion-btn" data-emotion="${em.id}" title="${em.label}" type="button">
      <span>${em.icon}</span>
    </button>`).join('');
  bar.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', () => applyEmotion(btn.dataset.emotion));
  });
}

function buildFoodDrawer() {
  document.getElementById('food-list').innerHTML = FOOD_ITEMS.map(food => `
    <div class="drawer-item" data-spawn="food" data-id="${food.id}">
      ${createFoodSVG(food)}
      <span>${food.name}</span>
    </div>`).join('');
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
  if (entity.kind === 'food') return getFoodItem(entity.id);
  const catalog = getCatalogItem(entity.id);
  if (catalog) return catalog;
  return ITEMS.find(i => i.id === entity.id);
}

function entitySvg(entity, def) {
  if (entity.kind === 'character') {
    return createCharacterSprite(def, getEntityOverrides(entity));
  }
  if (entity.kind === 'food') return createFoodSVG(def);
  if (getCatalogItem(entity.id)) return createPlaceableSVG(def);
  return createItemSVG(def);
}

export function switchBuilding(buildingId, { silent = false } = {}) {
  currentBuilding = buildingId;
  const rooms = getBuildingRooms();
  if (!rooms.includes(currentRoom)) currentRoom = rooms[0];
  buildRoomNav();
  document.querySelectorAll('.building-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.building === buildingId));
  updateWorldMapActive(buildingId);
  updateOverlayChrome();
  buildWorldStrip();
  switchRoom(currentRoom, false);
  if (!silent) showToast(`${getBuildingById(buildingId).name} — pojďme exploreovat! 🏠`);
  persist();
}

export function travelToBuilding(buildingId) {
  if (isTraveling) return;
  if (buildingId === currentBuilding) {
    closeDrawers();
    showToast(`Už jsme v ${getBuildingById(buildingId).name}! 🏠`);
    return;
  }
  isTraveling = true;
  closeDrawers();
  const from = currentBuilding;
  playTravelAnimation(from, buildingId, () => {
    switchBuilding(buildingId, { silent: true });
    showToast(`Přiletěli jsme do ${getBuildingById(buildingId).name}! ✈️`);
    isTraveling = false;
  });
}

export function switchRoom(roomId, smooth = true) {
  const rooms = getBuildingRooms();
  if (!rooms.includes(roomId)) return;
  currentRoom = roomId;
  state.currentRoom = roomId;

  const room = getRoomById(roomId);
  updateOverlayChrome();

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

function applyEmotion(emotionId) {
  const entity = entities.find(e => e.uid === selectedEntity);
  if (!entity || entity.kind !== 'character') return;
  entity.emotion = emotionId;
  entity.eatingUntil = null;
  renderAllEntities();
  const char = getCharacterById(entity.id);
  const em = EMOTIONS.find(e => e.id === emotionId);
  showToast(`${char.name} je ${em?.label?.toLowerCase() || 'šťastná'}! ${em?.icon || '😊'}`);
  persist();
}

function renderAllEntities() {
  document.querySelectorAll('.room-panel').forEach(panel => {
    const roomId = panel.dataset.room;
    const layer = panel.querySelector('.entities-layer');
    const roomEntities = entities.filter(e => e.room === roomId);
    const { innerW, innerH } = getRoomLayout(roomId);

    layer.innerHTML = roomEntities.map(entity => {
      const def = resolveEntityDef(entity);
      if (!def) return '';
      const vp = panel.querySelector('.room-pan-viewport');
      const size = scaleSize(def.size, innerH, innerW, vp?.clientWidth || innerW);
      const svg = entitySvg(entity, def);
      const pos = entityToPixels(entity, innerW, innerH);
      const z = Math.round(pos.y + size.h);
      return `<div class="entity ${entity.uid === selectedEntity ? 'selected' : ''}"
        data-uid="${entity.uid}"
        style="left:${pos.x}px;top:${pos.y}px;width:${size.w}px;height:${size.h}px;z-index:${z}">
        ${svg}<span class="entity-label">${def.name}</span></div>`;
    }).join('');
  });
  updateWorldRect();
  attachEntityListeners();
  updateOutfitBar();
}

function updateOutfitBar() {
  const bars = document.getElementById('character-bars');
  const entity = entities.find(e => e.uid === selectedEntity);
  const show = entity && entity.kind === 'character';
  bars.hidden = !show;
  if (show) {
    document.querySelectorAll('.emotion-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.emotion === entity.emotion);
    });
  }
}

function isNearFridge(xRel, yRel, roomId) {
  const fridge = entities.find(e => {
    if (e.kind !== 'furniture' || e.room !== roomId) return false;
    const def = getCatalogItem(e.id);
    return def?.type === 'fridge';
  });
  if (fridge) {
    return Math.hypot(fridge.xRel - xRel, fridge.yRel - yRel) < 0.14;
  }
  return roomId === 'kitchen' && xRel < 0.25 && yRel > 0.12 && yRel < 0.75;
}

function czechEatVerb(char, drink) {
  const masc = ['richard', 'risa', 'puffy', 'dart', 'mikie'].includes(char.id);
  if (drink) return masc ? 'vypil' : 'vypila';
  return masc ? 'snědl' : 'snědla';
}

function feedCharacter(charEntity, foodEntity, foodDef) {
  const char = getCharacterById(charEntity.id);
  const verb = czechEatVerb(char, foodDef.drink);
  entities = entities.filter(e => e.uid !== foodEntity.uid);
  charEntity.emotion = 'happy';
  charEntity.eatingUntil = Date.now() + 2200;
  selectedEntity = charEntity.uid;
  renderAllEntities();
  const el = document.querySelector(`[data-uid="${charEntity.uid}"]`);
  el?.classList.add('entity-eating');
  showToast(`${char.name} ${verb} ${foodDef.name}! ${foodDef.emoji}`);
  setTimeout(() => {
    if (charEntity.eatingUntil && charEntity.eatingUntil <= Date.now()) {
      charEntity.eatingUntil = null;
      renderAllEntities();
    }
  }, 2300);
  persist();
}

function storeFoodInFridge(foodEntity, foodDef) {
  if (!fridgeItems[currentRoom]) fridgeItems[currentRoom] = [];
  fridgeItems[currentRoom].push({ id: foodEntity.id, at: Date.now() });
  entities = entities.filter(e => e.uid !== foodEntity.uid);
  const count = fridgeItems[currentRoom].length;
  showToast(`${foodDef.name} v lednici! 🧊 (${count} věcí)`);
  persist();
}

function tryFoodInteraction(entity, dragEl) {
  if (entity.kind !== 'food') return false;
  const foodDef = getFoodItem(entity.id);
  if (!foodDef) return false;

  const foodRect = dragEl.getBoundingClientRect();
  const fcx = foodRect.left + foodRect.width / 2;
  const fcy = foodRect.top + foodRect.height / 2;

  for (const charEntity of entities.filter(e => e.kind === 'character' && e.room === currentRoom)) {
    const charEl = document.querySelector(`[data-uid="${charEntity.uid}"]`);
    if (!charEl) continue;
    const cr = charEl.getBoundingClientRect();
    const mouthX = cr.left + cr.width * 0.5;
    const mouthY = cr.top + cr.height * 0.25;
    if (Math.hypot(fcx - mouthX, fcy - mouthY) < 58) {
      feedCharacter(charEntity, entity, foodDef);
      return true;
    }
  }

  const rel = pixelsToRelative(parseFloat(dragEl.style.left), parseFloat(dragEl.style.top));
  if (isNearFridge(rel.xRel, rel.yRel, currentRoom)) {
    storeFoodInFridge(entity, foodDef);
    return true;
  }
  return false;
}

function attachEntityListeners() {
  document.querySelectorAll('.entity').forEach(el => {
    el.addEventListener('pointerdown', onEntityPointerDown, { passive: false });
  });
}

function updateWorldRect() {
  const inner = getRoomInnerElement(currentRoom);
  worldRect = inner
    ? inner.getBoundingClientRect()
    : document.getElementById('game-world').getBoundingClientRect();
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
    const inner = getRoomInnerElement(currentRoom);
    worldRect = inner ? inner.getBoundingClientRect() : panel.getBoundingClientRect();
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
  if (!dragEntity) return;
  const dx = Math.abs(e.clientX - dragStartPos.x);
  const dy = Math.abs(e.clientY - dragStartPos.y);
  if (dx > 6 || dy > 6) {
    hasDragMoved = true;
    dragEntity.classList.add('dragging');
  }
  if (!hasDragMoved) return;

  e.preventDefault();
  const { innerW, h, panOffset, vpRect } = getEntityDragBounds(currentRoom);
  const x = e.clientX - vpRect.left + panOffset - dragOffset.x;
  const y = e.clientY - vpRect.top - dragOffset.y;
  const maxX = innerW - dragEntity.offsetWidth;
  const maxY = h - dragEntity.offsetHeight;
  dragEntity.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
  dragEntity.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function onEntityPointerUp(e) {
  if (!dragEntity) return;
  const uid = dragEntity.dataset.uid;
  const now = Date.now();

  const entity = entities.find(ent => ent.uid === uid);

  if (!hasDragMoved && uid === lastTapUid && now - lastTapTime < 400) {
    removeEntity(uid);
    lastTapTime = 0;
    lastTapUid = null;
  } else if (!hasDragMoved && entity) {
    if (entity.kind === 'furniture') {
      const def = getCatalogItem(entity.id);
      const charEntity = entities.find(e => e.uid === selectedEntity && e.kind === 'character');
      if (charEntity && def) {
        reactToFurniture(charEntity.uid, def.type);
      } else if (def) {
        showToast(getRandomReaction(def.type));
      }
    } else {
      lastTapTime = now;
      lastTapUid = uid;
    }
  } else {
    if (entity) {
      const consumed = tryFoodInteraction(entity, dragEntity);
      if (!consumed) {
        const rel = pixelsToRelative(parseFloat(dragEntity.style.left), parseFloat(dragEntity.style.top));
        entity.xRel = rel.xRel;
        entity.yRel = rel.yRel;
        entity.room = currentRoom;
        persist();
      }
    }
    lastTapTime = 0;
    lastTapUid = null;
  }

  const el = dragEntity;
  if (el) {
    el.classList.remove('dragging');
    try { el.releasePointerCapture(e.pointerId); } catch { /* consumed / re-rendered */ }
    el.removeEventListener('pointermove', onEntityPointerMove);
    el.removeEventListener('pointerup', onEntityPointerUp);
    el.removeEventListener('pointercancel', onEntityPointerUp);
  }
  dragEntity = null;
  hasDragMoved = false;
  updateOutfitBar();
}

function removeEntity(uid) {
  const entity = entities.find(e => e.uid === uid);
  if (!entity) return;
  const def = resolveEntityDef(entity);
  entities = entities.filter(e => e.uid !== uid);
  selectedEntity = null;
  renderAllEntities();
  if (entity.kind === 'character') {
    showToast(`${def?.name || 'Postava'} šel/a domů 👋`);
  } else if (entity.kind === 'food') {
    showToast(`${def?.name || 'Jídlo'} zmizelo 🍽️`);
  } else {
    showToast(`${def?.name || 'Věc'} odstraněna ✨`);
  }
  persist();
}

function spawnEntity(kind, id) {
  const spawnKey = `${kind}:${id}`;
  const now = Date.now();
  if (spawnKey === lastSpawnKey && now - lastSpawnAt < 450) return;
  lastSpawnKey = spawnKey;
  lastSpawnAt = now;

  const def = kind === 'character'
    ? getCharacterById(id)
    : kind === 'food'
      ? getFoodItem(id)
      : resolveEntityDef({ kind, id });
  if (!def) return;

  const xRel = 0.40 + Math.random() * 0.18;
  const yRel = 0.52 + Math.random() * 0.14;

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

  const entityKind = kind === 'catalog'
    ? (def.type === 'toy' ? 'item' : 'furniture')
    : kind;
  const entity = { uid: `${entityKind}-${id}-${Date.now()}`, kind: entityKind, id, room: currentRoom, xRel, yRel };
  entities.push(entity);
  selectedEntity = entity.uid;
  renderAllEntities();
  document.querySelector(`[data-uid="${entity.uid}"]`)?.classList.add('spawn');
  const placed = entityKind === 'furniture'
    ? 'je v místnosti'
    : entityKind === 'food'
      ? 'je tady — nakrm někoho!'
      : 'přišel/a';
  showToast(`${def.name} ${placed}! ${entityKind === 'food' ? foodDefEmoji(def) : '🎉'}`);
  persist();
  closeDrawers();
  resetCatalogNav();
}

function spawnCatalogItem(id) {
  spawnEntity('catalog', id);
}

function foodDefEmoji(def) {
  return def?.emoji || '🍎';
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

function setupPanListeners() {
  document.querySelectorAll('.room-pan-viewport').forEach(vp => {
    if (vp.dataset.panBound) return;
    vp.dataset.panBound = '1';
    vp.addEventListener('pointerdown', onPanPointerDown, { passive: false });
  });
}

function onPanPointerDown(e) {
  if (e.target.closest('.entity') || e.target.closest('.furniture.interactive')) return;
  if (e.button !== 0 && e.pointerType === 'mouse') return;

  const panel = e.currentTarget.closest('.room-panel');
  const roomId = panel?.dataset.room;
  if (!roomId) return;

  currentRoom = roomId;
  updateWorldRect();

  const { maxPan } = getRoomPanMetrics(roomId);
  if (maxPan <= 0) return;

  panDrag = {
    roomId,
    pointerId: e.pointerId,
    startX: e.clientX,
    startOffset: getRoomPanOffset(roomId),
    maxPan,
    moved: false,
    target: e.currentTarget
  };

  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.addEventListener('pointermove', onPanPointerMove, { passive: false });
  e.currentTarget.addEventListener('pointerup', onPanPointerUp);
  e.currentTarget.addEventListener('pointercancel', onPanPointerUp);
}

function onPanPointerMove(e) {
  if (!panDrag || e.pointerId !== panDrag.pointerId) return;

  const dx = e.clientX - panDrag.startX;
  if (Math.abs(dx) > 5) panDrag.moved = true;
  if (!panDrag.moved) return;

  const newOffset = panDrag.startOffset - dx;
  const scroll = document.getElementById('world-scroll');

  if (newOffset < 0 && dx > 0) {
    setRoomPanOffset(panDrag.roomId, 0, false);
    scroll.scrollLeft -= dx * 0.35;
    return;
  }
  if (newOffset > panDrag.maxPan && dx < 0) {
    setRoomPanOffset(panDrag.roomId, panDrag.maxPan, false);
    scroll.scrollLeft -= dx * 0.35;
    return;
  }

  e.preventDefault();
  setRoomPanOffset(panDrag.roomId, newOffset, false);
}

function onPanPointerUp(e) {
  if (!panDrag || e.pointerId !== panDrag.pointerId) return;

  const target = panDrag.target;
  if (panDrag.moved) persist();

  target.removeEventListener('pointermove', onPanPointerMove);
  target.removeEventListener('pointerup', onPanPointerUp);
  target.removeEventListener('pointercancel', onPanPointerUp);
  try { target.releasePointerCapture(e.pointerId); } catch { /* ok */ }

  panDrag = null;
  updateWorldRect();
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
      updateOverlayChrome();
      document.querySelectorAll('.room-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.room === roomId));
      updateArrowVisibility();
      updateWorldRect();
      persist();
    }
  }, 80);
}

function setupInteractions() {
  if (interactionsBound) return;
  interactionsBound = true;

  document.getElementById('char-list').addEventListener('click', e => {
    const item = e.target.closest('[data-spawn="character"]');
    if (item) spawnEntity('character', item.dataset.id);
  });
  document.getElementById('food-list').addEventListener('click', e => {
    const item = e.target.closest('[data-spawn="food"]');
    if (item) spawnEntity('food', item.dataset.id);
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
      e.preventDefault();
      e.stopPropagation();
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
  state.roomPans = roomPans;
  state.entities = entities;
  state.fridgeItems = fridgeItems;
  saveState(state);
}

function scheduleAutoSave() {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(persist, 10000);
}

export function getGameState() {
  return { ...state, currentRoom, currentBuilding, roomThemes, roomPans, entities, fridgeItems };
}

export function restoreGameState(newState) {
  state = { ...newState };
  currentRoom = state.currentRoom || 'living';
  currentBuilding = state.currentBuilding || 'home';
  roomThemes = { ...(state.roomThemes || {}) };
  roomPans = { ...(state.roomPans || {}) };
  entities = [...(state.entities || [])];
  if (!state.worldMode && entities.length === 0) state.worldMode = 'empty';
  fridgeItems = { ...(state.fridgeItems || {}) };
  buildBuildingNav();
  buildRoomNav();
  updateWorldMapActive(currentBuilding);
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