import type { Entity, FurnitureDef, FoodDef, RoomDef } from './data';
import { WALLPAPERS } from './data';

const ink = '#3a3128';

export function roomShellHTML(room: RoomDef, themeId: string) {
  const theme = WALLPAPERS.find((w) => w.id === themeId) || WALLPAPERS[0];
  const night = themeId === 'night';
  const outdoor = room.id === 'garden' || room.id === 'cottage-garden';
  const sketch = room.id === 'sketch-studio';
  const wall = outdoor ? (night ? '#2c3340' : '#b7c9c4') : theme.wall;
  const floor = outdoor ? (night ? '#243028' : theme.floor) : theme.floor;
  const sky = night ? '#2c3340' : sketch ? '#e7dcc4' : '#c5d5ce';

  const window = windowArt(room, night);
  return `<div class="room-shell ${outdoor ? 'is-out' : ''}" style="--wall:${wall};--floor:${floor}">
    <div class="room-sky" style="background:${sky}"></div>
    <div class="room-wall"></div>
    <div class="room-wainscot"></div>
    <div class="room-floor"></div>
    ${window}
    <svg class="room-lines" viewBox="0 0 1600 1000" preserveAspectRatio="none">${lineArt(room, night)}</svg>
  </div>`;
}

function windowArt(room: RoomDef, night: boolean) {
  if (room.id === 'garden' || room.id === 'cottage-garden' || room.id === 'sketch-studio') return '';
  const glass = night ? '#2a3340' : '#cfe0dc';
  const sun = night ? '' : `<circle cx="300" cy="88" r="22" fill="#d4a04a" opacity="0.85"/>`;
  const size = room.id === 'living' ? '' : ' is-small';
  return `<svg class="room-window${size}" viewBox="0 0 420 280" preserveAspectRatio="none">
    <rect x="18" y="18" width="384" height="244" rx="12" fill="${glass}" stroke="${ink}" stroke-width="8"/>
    <line x1="210" y1="18" x2="210" y2="262" stroke="${ink}" stroke-width="6"/>
    <line x1="18" y1="140" x2="402" y2="140" stroke="${ink}" stroke-width="6"/>
    ${sun}
    <path d="M8 18 q36 120 0 244" fill="#3d7a73" opacity="0.42"/>
    <path d="M412 18 q-36 120 0 244" fill="#3d7a73" opacity="0.36"/>
  </svg>`;
}

function lineArt(room: RoomDef, night: boolean) {
  const stroke = night ? '#1a1e24' : ink;
  const rail = `<line x1="0" y1="500" x2="1600" y2="500" stroke="${stroke}" stroke-width="7"/>
    <rect x="0" y="500" width="1600" height="16" fill="${stroke}" opacity="0.14"/>`;
  if (room.id === 'garden' || room.id === 'cottage-garden') {
    return `
      <path d="M0 400 C 180 330, 320 450, 520 380 C 740 300, 900 440, 1120 370 C 1300 320, 1460 400, 1600 360 L 1600 1000 L 0 1000 Z" fill="#7a9b6a" opacity="0.55"/>
      <path d="M0 520 C 220 480, 400 560, 640 510 C 880 460, 1100 560, 1600 500 L 1600 1000 L 0 1000 Z" fill="#5f7d52"/>`;
  }
  if (room.id === 'kitchen') {
    return `${rail}
      <rect x="0" y="430" width="1600" height="36" fill="#d4a04a" opacity="0.22"/>
      ${Array.from({ length: 14 }, (_, i) => `<line x1="${60 + i * 112}" y1="516" x2="${20 + i * 112}" y2="1000" stroke="${stroke}" stroke-width="2" opacity="0.07"/>`).join('')}`;
  }
  if (room.id === 'bathroom') {
    return `${rail}
      ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 160}" y1="0" x2="${i * 160}" y2="500" stroke="${stroke}" stroke-width="1" opacity="0.1"/>`).join('')}`;
  }
  if (room.id === 'cottage-living') {
    return `${rail}
      <rect x="80" y="0" width="28" height="500" fill="#8b6f47" opacity="0.35"/>
      <rect x="0" y="36" width="1600" height="20" fill="#8b6f47" opacity="0.3"/>`;
  }
  if (room.id === 'sketch-studio') {
    return `${rail}
      <rect x="80" y="90" width="280" height="200" fill="none" stroke="${stroke}" stroke-width="4" stroke-dasharray="10 8"/>
      <rect x="420" y="70" width="220" height="160" fill="none" stroke="${stroke}" stroke-width="4"/>`;
  }
  return `${rail}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${70 + i * 112}" y1="516" x2="${28 + i * 112}" y2="1000" stroke="${stroke}" stroke-width="2.2" opacity="0.08"/>`).join('')}`;
}

export function furnitureSVG(item: FurnitureDef) {
  const { type } = item;
  const g = (inner: string) =>
    `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const s = `fill="none" stroke="${ink}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;
  switch (type) {
    case 'sofa':
      return g(`<ellipse cx="60" cy="102" rx="46" ry="6" fill="rgba(43,36,28,0.12)"/>
        <rect x="10" y="58" width="100" height="34" rx="12" fill="#c45c3e"/>
        <rect x="18" y="40" width="84" height="26" rx="11" fill="#d9897a"/>
        <rect x="22" y="46" width="34" height="16" rx="6" fill="#e7c4b0" opacity="0.55"/>
        <rect x="64" y="46" width="34" height="16" rx="6" fill="#e7c4b0" opacity="0.55"/>
        <rect x="10" y="78" width="14" height="18" rx="4" fill="#9a3f2a"/>
        <rect x="96" y="78" width="14" height="18" rx="4" fill="#9a3f2a"/>
        <rect x="10" y="58" width="100" height="34" rx="12" ${s}/>`);
    case 'chair':
      return g(`<rect x="30" y="48" width="60" height="36" rx="8" fill="#c4a484"/><rect x="34" y="22" width="52" height="30" rx="6" fill="#e7c4b0"/><rect x="30" y="48" width="60" height="36" rx="8" ${s}/>`);
    case 'table':
      return g(`<ellipse cx="60" cy="58" rx="48" ry="16" fill="#c4a484"/><rect x="22" y="58" width="8" height="36" fill="#8b6f47"/><rect x="90" y="58" width="8" height="36" fill="#8b6f47"/><ellipse cx="60" cy="58" rx="48" ry="16" ${s}/>`);
    case 'lamp':
      return g(`<rect x="56" y="48" width="8" height="52" fill="#8b6f47"/><path d="M34 48 L86 48 L76 18 L44 18 Z" fill="#d4a04a"/><ellipse cx="60" cy="104" rx="16" ry="5" fill="#c4a484"/><path d="M34 48 L86 48 L76 18 L44 18 Z" ${s}/>`);
    case 'tv':
      return g(`<rect x="18" y="22" width="84" height="58" rx="6" fill="#2b241c"/><rect x="26" y="30" width="68" height="42" fill="#b7c9c4"/><rect x="50" y="80" width="20" height="16" fill="#5a4e42"/><rect x="18" y="22" width="84" height="58" rx="6" ${s}/>`);
    case 'rug':
      return g(`<ellipse cx="60" cy="64" rx="52" ry="28" fill="#c45c3e" opacity="0.85"/><ellipse cx="60" cy="64" rx="36" ry="16" fill="#d9897a"/><ellipse cx="60" cy="64" rx="52" ry="28" ${s}/>`);
    case 'fridge':
      return g(`<rect x="32" y="8" width="56" height="100" rx="6" fill="#fbf6ec"/><line x1="32" y1="42" x2="88" y2="42" stroke="${ink}" stroke-width="3"/><rect x="76" y="20" width="6" height="14" fill="${ink}"/><rect x="32" y="8" width="56" height="100" rx="6" ${s}/>`);
    case 'stove':
      return g(`<rect x="20" y="40" width="80" height="56" rx="6" fill="#5a4e42"/><circle cx="42" cy="64" r="10" fill="#2b241c"/><circle cx="78" cy="64" r="10" fill="#2b241c"/><rect x="20" y="40" width="80" height="56" rx="6" ${s}/>`);
    case 'sink':
      return g(`<rect x="22" y="52" width="76" height="32" rx="8" fill="#d7e4e0"/><path d="M60 36 v20" stroke="${ink}" stroke-width="4"/><circle cx="60" cy="64" r="8" fill="#b7c9c4"/><rect x="22" y="52" width="76" height="32" rx="8" ${s}/>`);
    case 'bed':
      return g(`<rect x="10" y="50" width="100" height="40" rx="8" fill="#d5c4d0"/><rect x="10" y="34" width="28" height="28" rx="6" fill="#fbf6ec"/><rect x="10" y="50" width="100" height="40" rx="8" ${s}/>`);
    case 'desk':
      return g(`<rect x="14" y="50" width="92" height="12" fill="#c4a484"/><rect x="20" y="62" width="10" height="34" fill="#8b6f47"/><rect x="90" y="62" width="10" height="34" fill="#8b6f47"/><rect x="14" y="50" width="92" height="12" ${s}/>`);
    case 'toilet':
      return g(`<rect x="40" y="18" width="40" height="36" rx="6" fill="#fbf6ec"/><ellipse cx="60" cy="78" rx="26" ry="22" fill="#fbf6ec"/><ellipse cx="60" cy="78" rx="26" ry="22" ${s}/><rect x="40" y="18" width="40" height="36" rx="6" ${s}/>`);
    case 'bathtub':
      return g(`<rect x="8" y="48" width="104" height="40" rx="18" fill="#d7e4e0"/><circle cx="30" cy="62" r="6" fill="#b7c9c4"/><rect x="8" y="48" width="104" height="40" rx="18" ${s}/>`);
    case 'mirror':
      return g(`<ellipse cx="60" cy="56" rx="28" ry="40" fill="#d7e4e0"/><ellipse cx="60" cy="56" rx="28" ry="40" ${s}/>`);
    case 'swing':
      return g(`<line x1="24" y1="8" x2="24" y2="70" stroke="${ink}" stroke-width="4"/><line x1="96" y1="8" x2="96" y2="70" stroke="${ink}" stroke-width="4"/><rect x="18" y="70" width="84" height="14" rx="4" fill="#c4a484"/><rect x="18" y="70" width="84" height="14" rx="4" ${s}/>`);
    case 'slide':
      return g(`<path d="M20 20 h24 v50 L100 92 h-24 L44 70 V20 Z" fill="#c45c3e"/><path d="M20 20 h24 v50 L100 92 h-24 L44 70 V20 Z" ${s}/>`);
    case 'pool':
      return g(`<ellipse cx="60" cy="64" rx="50" ry="26" fill="#7aa8b0"/><ellipse cx="60" cy="64" rx="36" ry="16" fill="#b7c9c4"/><ellipse cx="60" cy="64" rx="50" ry="26" ${s}/>`);
    case 'tree':
      return g(`<rect x="54" y="70" width="12" height="34" fill="#8b6f47"/><circle cx="60" cy="52" r="32" fill="#7a9b6a"/><circle cx="60" cy="52" r="32" ${s}/>`);
    case 'toy':
      return item.id === 'robot'
        ? g(`<rect x="38" y="28" width="44" height="36" rx="4" fill="#3d7a73"/><circle cx="50" cy="44" r="4" fill="#d4a04a"/><circle cx="70" cy="44" r="4" fill="#d4a04a"/><rect x="38" y="28" width="44" height="36" rx="4" ${s}/>`)
        : g(`<ellipse cx="60" cy="64" rx="28" ry="26" fill="#c4a484"/><circle cx="60" cy="40" r="18" fill="#c4a484"/><circle cx="60" cy="40" r="18" ${s}/>`);
    case 'plant':
      return g(`<ellipse cx="60" cy="108" rx="16" ry="4" fill="rgba(43,36,28,0.12)"/>
        <path d="M48 78 q12 28 24 0 v18 h-24 z" fill="#c45c3e"/>
        <ellipse cx="46" cy="48" rx="14" ry="20" fill="#7a9b6a"/>
        <ellipse cx="74" cy="46" rx="13" ry="18" fill="#5f7d52"/>
        <ellipse cx="60" cy="34" rx="12" ry="16" fill="#8aaf78"/>
        <path d="M48 78 q12 28 24 0 v18 h-24 z" ${s}/>`);
    case 'poster':
      return g(`<rect x="26" y="16" width="68" height="84" rx="4" fill="#fbf6ec"/><circle cx="60" cy="52" r="16" fill="#d9897a" opacity="0.7"/><rect x="26" y="16" width="68" height="84" rx="4" ${s}/>`);
    default:
      return g(`<rect x="28" y="28" width="64" height="64" rx="8" fill="#e7dcc4"/><rect x="28" y="28" width="64" height="64" rx="8" ${s}/>`);
  }
}

export function foodSVG(food: FoodDef) {
  const fill: Record<string, string> = {
    'food-apple': '#c45c3e',
    'food-banana': '#d4a04a',
    'food-carrot': '#c86b2a',
    'food-pizza': '#d4a04a',
    'food-cake': '#d9897a',
    'food-cookie': '#c4a484',
    'food-sandwich': '#e7dcc4',
    'food-egg': '#fbf6ec',
    'food-water': '#7aa8b0',
    'food-juice': '#c86b2a',
    'food-milk': '#fbf6ec',
    'food-tea': '#7a9b6a'
  };
  const c = fill[food.id] || '#d4a04a';
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="72" rx="16" ry="4" fill="rgba(43,36,28,0.12)"/>
    <circle cx="40" cy="40" r="22" fill="${c}"/>
    <circle cx="40" cy="40" r="22" fill="none" stroke="#3a3128" stroke-width="3"/>
    <circle cx="32" cy="32" r="6" fill="#fff" opacity="0.25"/>
  </svg>`;
}

export function faceOverlay(emotion?: string) {
  if (!emotion || emotion === 'happy') return '';
  const mouths: Record<string, string> = {
    sad: '<path d="M18 28 Q24 22 30 28" fill="none" stroke="#3a3128" stroke-width="2.4"/>',
    angry: '<path d="M18 28 L30 26" fill="none" stroke="#9a3f2a" stroke-width="2.4"/>',
    surprised: '<ellipse cx="24" cy="28" rx="5" ry="6" fill="#3a3128"/>',
    sleepy: '<path d="M16 20 Q20 24 24 20 M26 20 Q30 24 34 20" fill="none" stroke="#3a3128" stroke-width="2.2"/>',
    love: '<text x="12" y="24" font-size="12" fill="#c45c3e">♥ ♥</text>',
    eating: '<ellipse cx="24" cy="28" rx="7" ry="5" fill="#9a3f2a"/>'
  };
  return `<svg class="entity-face" viewBox="0 0 48 40">${mouths[emotion] || ''}</svg>`;
}

export function assetUrl(rel: string) {
  return `${import.meta.env.BASE_URL}${rel}`;
}

export function entityVisual(entity: Entity, def: { name?: string; src?: string; type?: string; id?: string }, eating: boolean) {
  if (entity.kind === 'sketch' && def.src) {
    return `<div class="sketch-card"><span class="sketch-tape a"></span><span class="sketch-tape b"></span><img src="${assetUrl(def.src)}" alt=""/></div>`;
  }
  if (def.src) {
    const hue = entity.outfit?.shirt ? ` style="filter:drop-shadow(0 8px 10px var(--shadow)) hue-rotate(${shirtHue(entity.outfit.shirt)}deg)"` : '';
    return `<img src="${assetUrl(def.src)}" alt=""${hue}/>${faceOverlay(eating ? 'eating' : entity.emotion)}`;
  }
  if (entity.kind === 'food') return foodSVG(def as FoodDef);
  return furnitureSVG(def as FurnitureDef);
}

function shirtHue(hex: string) {
  const map: Record<string, number> = {
    '#c45c3e': 0,
    '#3d7a73': 140,
    '#d4a04a': 28,
    '#7a9b6a': 80,
    '#5a4e42': 20,
    '#d9897a': -10
  };
  return map[hex] ?? 0;
}
