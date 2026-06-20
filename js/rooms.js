/** Room definitions with furniture and backgrounds */

export const ROOMS = [
  {
    id: 'living',
    name: 'Obývák',
    icon: '🛋️',
    bg: '#FFE8D6',
    floor: '#DEB887',
    wall: '#FFF0E6',
    furniture: []
  },
  {
    id: 'kitchen',
    name: 'Kuchyně',
    icon: '🍳',
    bg: '#E8F5E9',
    floor: '#C8E6C9',
    wall: '#F1F8E9',
    furniture: []
  },
  {
    id: 'bedroom',
    name: 'Pokoj',
    icon: '🛏️',
    bg: '#E8EAF6',
    floor: '#C5CAE9',
    wall: '#EDE7F6',
    furniture: []
  },
  {
    id: 'bathroom',
    name: 'Koupelna',
    icon: '🛁',
    bg: '#E3F2FD',
    floor: '#BBDEFB',
    wall: '#E1F5FE',
    furniture: []
  },
  {
    id: 'garden',
    name: 'Zahrada',
    icon: '🌳',
    bg: '#A8E6CF',
    floor: '#52B788',
    wall: '#87CEEB',
    furniture: []
  },
  {
    id: 'cottage-living',
    name: 'Chalupa — Obývák',
    icon: '🏡',
    building: 'cottage',
    bg: '#FFF3E0',
    floor: '#D7CCC8',
    wall: '#FFE0B2',
    furniture: []
  },
  {
    id: 'cottage-garden',
    name: 'Chalupa — Zahrádka',
    icon: '🌻',
    building: 'cottage',
    bg: '#C8E6C9',
    floor: '#81C784',
    wall: '#B3E5FC',
    furniture: []
  }
];

export const BUILDINGS = [
  { id: 'home', name: 'Náš dům', icon: '🏠', rooms: ['living', 'kitchen', 'bedroom', 'bathroom', 'garden'] },
  { id: 'cottage', name: 'Chalupa', icon: '🏡', rooms: ['cottage-living', 'cottage-garden'] }
];

export const WALLPAPERS = [
  { id: 'default', name: 'Původní', bg: null, wall: null, floor: null },
  { id: 'pink', name: 'Růžová', bg: '#FFE4EC', wall: '#FFB4C8', floor: '#FF8FAB' },
  { id: 'mint', name: 'Mátová', bg: '#E0F7FA', wall: '#B2EBF2', floor: '#80DEEA' },
  { id: 'lavender', name: 'Fialová', bg: '#EDE7F6', wall: '#D1C4E9', floor: '#B39DDB' },
  { id: 'sunset', name: 'Západ slunce', bg: '#FFF3E0', wall: '#FFE0B2', floor: '#FFCC80' },
  { id: 'night', name: 'Noční', bg: '#37474F', wall: '#546E7A', floor: '#455A64' }
];

export function getBuildingById(id) {
  return BUILDINGS.find(b => b.id === id) || BUILDINGS[0];
}

export function getRoomById(id) {
  return ROOMS.find(r => r.id === id);
}

export function getThemedRoom(room, themeId, roomThemes = {}) {
  const custom = roomThemes[room.id];
  if (custom) return { ...room, bg: custom.bg, wall: custom.wall, floor: custom.floor };
  const preset = WALLPAPERS.find(w => w.id === themeId);
  if (!preset || preset.id === 'default') return room;
  return {
    ...room,
    bg: preset.bg || room.bg,
    wall: preset.wall || room.wall,
    floor: preset.floor || room.floor
  };
}

export const ROOM_VIEW_W = 1800;
export const ROOM_VIEW_H = 625;
export const ROOM_PAN_RATIO = 1.8;
export const ROOM_PAN_RATIO_LANDSCAPE = 2.0;

/** Generate room background SVG — uses fixed viewBox so it always renders */
export function createRoomSVG(room, w = ROOM_VIEW_W, h = ROOM_VIEW_H) {
  const furnitureSVG = room.furniture.map(f => createFurnitureSVG(f, w, h)).join('');
  const windowSVG = room.id !== 'garden' ? `
    <rect x="${w * 0.35}" y="${h * 0.08}" width="${w * 0.3}" height="${h * 0.15}" rx="8" fill="#A2D2FF" stroke="#8ECAE6" stroke-width="3"/>
    <line x1="${w * 0.5}" y1="${h * 0.08}" x2="${w * 0.5}" y2="${h * 0.23}" stroke="#8ECAE6" stroke-width="2"/>
    <line x1="${w * 0.35}" y1="${h * 0.155}" x2="${w * 0.65}" y2="${h * 0.155}" stroke="#8ECAE6" stroke-width="2"/>
  ` : `
    <circle cx="${w * 0.85}" cy="${h * 0.1}" r="35" fill="#FFD166" opacity="0.9"/>
    <ellipse cx="${w * 0.15}" cy="${h * 0.12}" rx="60" ry="25" fill="white" opacity="0.7"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.08}" rx="80" ry="30" fill="white" opacity="0.5"/>
  `;

  return `<svg class="room-bg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${room.bg}"/>
    <rect x="0" y="0" width="${w}" height="${h * 0.3}" fill="${room.wall}"/>
    <rect x="0" y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="${room.floor}"/>
    <line x1="0" y1="${h * 0.7}" x2="${w}" y2="${h * 0.7}" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
    ${windowSVG}
    ${furnitureSVG}
  </svg>`;
}

function createFurnitureSVG(f, w, h) {
  const x = f.x * w;
  const y = f.y * h;
  const fw = f.w * w;
  const fh = f.h * h;
  const cls = f.interactive ? 'furniture interactive' : 'furniture';

  const templates = {
    sofa: `<g class="${cls}" data-furniture="sofa">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh * 0.6}" rx="12" fill="#FF8FAB"/>
      <rect x="${x + 5}" y="${y - fh * 0.3}" width="${fw - 10}" height="${fh * 0.35}" rx="10" fill="#FB6F92"/>
      <rect x="${x}" y="${y + fh * 0.3}" width="15" height="${fh * 0.35}" rx="5" fill="#FB6F92"/>
      <rect x="${x + fw - 15}" y="${y + fh * 0.3}" width="15" height="${fh * 0.35}" rx="5" fill="#FB6F92"/>
    </g>`,
    tv: `<g class="${cls}" data-furniture="tv">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh * 0.85}" rx="6" fill="#333"/>
      <rect x="${x + 8}" y="${y + 8}" width="${fw - 16}" height="${fh * 0.7}" rx="4" fill="#4FC3F7"/>
      <rect x="${x + fw * 0.3}" y="${y + fh * 0.85}" width="${fw * 0.4}" height="${fh * 0.15}" fill="#555"/>
    </g>`,
    rug: `<ellipse cx="${x + fw/2}" cy="${y + fh/2}" rx="${fw/2}" ry="${fh/2}" fill="#CDB4DB" opacity="0.7"/>`,
    plant: `<g class="${cls}" data-furniture="plant">
      <rect x="${x + fw * 0.3}" y="${y + fh * 0.6}" width="${fw * 0.4}" height="${fh * 0.4}" rx="4" fill="#8B4513"/>
      <ellipse cx="${x + fw/2}" cy="${y + fh * 0.4}" rx="${fw * 0.5}" ry="${fh * 0.35}" fill="#52B788"/>
      <ellipse cx="${x + fw * 0.3}" cy="${y + fh * 0.3}" rx="${fw * 0.3}" ry="${fh * 0.25}" fill="#40916C"/>
    </g>`,
    lamp: `<g class="${cls}" data-furniture="lamp">
      <rect x="${x + fw * 0.4}" y="${y + fh * 0.3}" width="${fw * 0.2}" height="${fh * 0.7}" fill="#8B6F47"/>
      <path d="M ${x} ${y + fh * 0.3} L ${x + fw} ${y + fh * 0.3} L ${x + fw * 0.8} ${y} L ${x + fw * 0.2} ${y} Z" fill="#FFD166"/>
    </g>`,
    fridge: `<g class="${cls}" data-furniture="fridge">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="6" fill="#E8EAF6" stroke="#C5CAE9" stroke-width="2"/>
      <line x1="${x}" y1="${y + fh * 0.35}" x2="${x + fw}" y2="${y + fh * 0.35}" stroke="#C5CAE9" stroke-width="2"/>
      <rect x="${x + fw * 0.7}" y="${y + fh * 0.1}" width="4" height="${fh * 0.15}" rx="2" fill="#9E9E9E"/>
      <rect x="${x + fw * 0.7}" y="${y + fh * 0.45}" width="4" height="${fh * 0.2}" rx="2" fill="#9E9E9E"/>
    </g>`,
    stove: `<g class="${cls}" data-furniture="stove">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="4" fill="#78909C"/>
      <circle cx="${x + fw * 0.25}" cy="${y + fh * 0.3}" r="12" fill="#333" stroke="#555" stroke-width="2"/>
      <circle cx="${x + fw * 0.75}" cy="${y + fh * 0.3}" r="12" fill="#333" stroke="#555" stroke-width="2"/>
      <rect x="${x + fw * 0.1}" y="${y + fh * 0.55}" width="${fw * 0.8}" height="${fh * 0.35}" rx="4" fill="#333"/>
    </g>`,
    table: `<g class="${cls}" data-furniture="table">
      <rect x="${x}" y="${y + fh * 0.3}" width="${fw}" height="${fh * 0.15}" rx="8" fill="#8B6F47"/>
      <rect x="${x + 10}" y="${y + fh * 0.45}" width="12" height="${fh * 0.55}" fill="#6D4C41"/>
      <rect x="${x + fw - 22}" y="${y + fh * 0.45}" width="12" height="${fh * 0.55}" fill="#6D4C41"/>
      <rect x="${x + fw * 0.35}" y="${y + fh * 0.45}" width="12" height="${fh * 0.55}" fill="#6D4C41"/>
      <rect x="${x + fw * 0.6}" y="${y + fh * 0.45}" width="12" height="${fh * 0.55}" fill="#6D4C41"/>
    </g>`,
    cabinet: `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="4" fill="#A1887F"/>`,
    fruitbowl: `<g class="${cls}" data-furniture="fruitbowl">
      <ellipse cx="${x + fw/2}" cy="${y + fh * 0.7}" rx="${fw * 0.5}" ry="${fh * 0.3}" fill="#8B6F47"/>
      <circle cx="${x + fw * 0.3}" cy="${y + fh * 0.4}" r="6" fill="#FF6B35"/>
      <circle cx="${x + fw * 0.6}" cy="${y + fh * 0.35}" r="5" fill="#FFD166"/>
      <circle cx="${x + fw * 0.5}" cy="${y + fh * 0.5}" r="5" fill="#FF6B35"/>
    </g>`,
    bed: `<g class="${cls}" data-furniture="bed">
      <rect x="${x}" y="${y + fh * 0.2}" width="${fw}" height="${fh * 0.8}" rx="8" fill="#8B6F47"/>
      <rect x="${x + 5}" y="${y}" width="${fw - 10}" height="${fh * 0.35}" rx="10" fill="#CDB4DB"/>
      <rect x="${x + 10}" y="${y + fh * 0.35}" width="${fw - 20}" height="${fh * 0.55}" rx="6" fill="#E8EAF6"/>
      <ellipse cx="${x + fw * 0.2}" cy="${y + fh * 0.15}" rx="15" ry="10" fill="white"/>
      <ellipse cx="${x + fw * 0.8}" cy="${y + fh * 0.15}" rx="15" ry="10" fill="white"/>
    </g>`,
    desk: `<g class="${cls}" data-furniture="desk">
      <rect x="${x}" y="${y + fh * 0.4}" width="${fw}" height="${fh * 0.15}" rx="4" fill="#8B6F47"/>
      <rect x="${x + 5}" y="${y + fh * 0.55}" width="10" height="${fh * 0.45}" fill="#6D4C41"/>
      <rect x="${x + fw - 15}" y="${y + fh * 0.55}" width="10" height="${fh * 0.45}" fill="#6D4C41"/>
      <rect x="${x + fw * 0.3}" y="${y}" width="${fw * 0.4}" height="${fh * 0.35}" rx="3" fill="#333" stroke="#555" stroke-width="2"/>
    </g>`,
    toybox: `<g class="${cls}" data-furniture="toybox">
      <rect x="${x}" y="${y + fh * 0.2}" width="${fw}" height="${fh * 0.8}" rx="6" fill="#FFD166"/>
      <text x="${x + fw/2}" y="${y + fh * 0.65}" text-anchor="middle" font-size="20">🧸</text>
    </g>`,
    poster: `<g class="${cls}" data-furniture="poster">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="4" fill="#FF8FAB"/>
      <text x="${x + fw/2}" y="${y + fh * 0.6}" text-anchor="middle" font-size="14" fill="white" font-weight="bold">♥ RODINA ♥</text>
    </g>`,
    tree: `<g class="${cls}">
      <rect x="${x + fw * 0.4}" y="${y + fh * 0.6}" width="${fw * 0.2}" height="${fh * 0.4}" fill="#8B4513"/>
      <circle cx="${x + fw/2}" cy="${y + fh * 0.35}" r="${fw * 0.45}" fill="#40916C"/>
      <circle cx="${x + fw * 0.3}" cy="${y + fh * 0.45}" r="${fw * 0.3}" fill="#52B788"/>
      <circle cx="${x + fw * 0.7}" cy="${y + fh * 0.4}" r="${fw * 0.28}" fill="#52B788"/>
    </g>`,
    swing: `<g class="${cls}" data-furniture="swing">
      <rect x="${x + fw * 0.1}" y="${y}" width="8" height="${fh}" fill="#8B4513"/>
      <rect x="${x + fw * 0.9}" y="${y}" width="8" height="${fh}" fill="#8B4513"/>
      <rect x="${x}" y="${y}" width="${fw}" height="8" fill="#8B4513"/>
      <line x1="${x + fw * 0.3}" y1="${y + 8}" x2="${x + fw * 0.3}" y2="${y + fh * 0.5}" stroke="#8B4513" stroke-width="2"/>
      <line x1="${x + fw * 0.7}" y1="${y + 8}" x2="${x + fw * 0.7}" y2="${y + fh * 0.5}" stroke="#8B4513" stroke-width="2"/>
      <rect x="${x + fw * 0.15}" y="${y + fh * 0.5}" width="${fw * 0.7}" height="12" rx="4" fill="#C4956A"/>
    </g>`,
    sandbox: `<g class="${cls}" data-furniture="sandbox">
      <rect x="${x}" y="${y + fh * 0.3}" width="${fw}" height="${fh * 0.7}" rx="6" fill="#8B6F47"/>
      <rect x="${x + 5}" y="${y + fh * 0.35}" width="${fw - 10}" height="${fh * 0.55}" rx="4" fill="#FFD166"/>
    </g>`,
    doghouse: `<g class="${cls}" data-furniture="doghouse">
      <rect x="${x + fw * 0.1}" y="${y + fh * 0.4}" width="${fw * 0.8}" height="${fh * 0.6}" fill="#E8A87C"/>
      <path d="M ${x} ${y + fh * 0.4} L ${x + fw/2} ${y} L ${x + fw} ${y + fh * 0.4}" fill="#C97B3D"/>
      <rect x="${x + fw * 0.35}" y="${y + fh * 0.6}" width="${fw * 0.3}" height="${fh * 0.35}" rx="10" fill="#5C4033"/>
    </g>`,
    fireplace: `<g class="${cls}" data-furniture="fireplace">
      <rect x="${x}" y="${y + fh * 0.2}" width="${fw}" height="${fh * 0.8}" rx="4" fill="#8B6F47"/>
      <rect x="${x + fw * 0.15}" y="${y + fh * 0.35}" width="${fw * 0.7}" height="${fh * 0.45}" rx="6" fill="#333"/>
      <ellipse cx="${x + fw * 0.35}" cy="${y + fh * 0.6}" rx="8" ry="12" fill="#FF6B35" opacity="0.8"/>
      <ellipse cx="${x + fw * 0.55}" cy="${y + fh * 0.55}" rx="10" ry="14" fill="#FFD166" opacity="0.7"/>
      <ellipse cx="${x + fw * 0.7}" cy="${y + fh * 0.62}" rx="7" ry="10" fill="#FF6B35" opacity="0.6"/>
    </g>`,
    flowers: `<g class="${cls}" data-furniture="flowers">
      <line x1="${x + fw * 0.2}" y1="${y + fh}" x2="${x + fw * 0.2}" y2="${y + fh * 0.3}" stroke="#52B788" stroke-width="2"/>
      <circle cx="${x + fw * 0.2}" cy="${y + fh * 0.25}" r="8" fill="#FF8FAB"/>
      <line x1="${x + fw * 0.5}" y1="${y + fh}" x2="${x + fw * 0.5}" y2="${y + fh * 0.2}" stroke="#52B788" stroke-width="2"/>
      <circle cx="${x + fw * 0.5}" cy="${y + fh * 0.15}" r="10" fill="#FFD166"/>
      <line x1="${x + fw * 0.8}" y1="${y + fh}" x2="${x + fw * 0.8}" y2="${y + fh * 0.35}" stroke="#52B788" stroke-width="2"/>
      <circle cx="${x + fw * 0.8}" cy="${y + fh * 0.3}" r="7" fill="#9B5DE5"/>
    </g>`,
    bathtub: `<g class="${cls}" data-furniture="bathtub">
      <rect x="${x}" y="${y + fh * 0.15}" width="${fw}" height="${fh * 0.85}" rx="14" fill="#FFFFFF" stroke="#B0BEC5" stroke-width="2"/>
      <ellipse cx="${x + fw/2}" cy="${y + fh * 0.28}" rx="${fw * 0.35}" ry="${fh * 0.12}" fill="#E1F5FE"/>
    </g>`,
    sink: `<g class="${cls}" data-furniture="sink">
      <rect x="${x}" y="${y + fh * 0.35}" width="${fw}" height="${fh * 0.65}" rx="5" fill="#FAFAFA" stroke="#CFD8DC"/>
      <ellipse cx="${x + fw/2}" cy="${y + fh * 0.45}" rx="${fw * 0.3}" ry="${fh * 0.15}" fill="#CFD8DC"/>
      <circle cx="${x + fw/2}" cy="${y + fh * 0.1}" r="${fw * 0.08}" fill="#78909C"/>
    </g>`,
    toilet: `<g class="${cls}" data-furniture="toilet">
      <rect x="${x + fw * 0.15}" y="${y}" width="${fw * 0.7}" height="${fh * 0.22}" rx="4" fill="#FAFAFA" stroke="#CFD8DC"/>
      <rect x="${x + fw * 0.08}" y="${y + fh * 0.25}" width="${fw * 0.84}" height="${fh * 0.75}" rx="10" fill="#FAFAFA" stroke="#CFD8DC"/>
    </g>`,
    mirror: `<g class="${cls}" data-furniture="mirror">
      <rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="8" fill="#ECEFF1" stroke="#8D6E63" stroke-width="4"/>
      <ellipse cx="${x + fw * 0.35}" cy="${y + fh * 0.4}" rx="${fw * 0.15}" ry="${fh * 0.2}" fill="rgba(255,255,255,0.45)"/>
    </g>`,
    towelrack: `<g class="${cls}" data-furniture="towelrack">
      <rect x="${x}" y="${y + fh * 0.15}" width="${fw}" height="${fh * 0.12}" rx="4" fill="#CFD8DC"/>
      <rect x="${x + fw * 0.1}" y="${y + fh * 0.3}" width="${fw * 0.35}" height="${fh * 0.65}" rx="4" fill="#90CAF9"/>
      <rect x="${x + fw * 0.55}" y="${y + fh * 0.3}" width="${fw * 0.35}" height="${fh * 0.65}" rx="4" fill="#F48FB1"/>
    </g>`,
    shower: `<g class="${cls}" data-furniture="shower">
      <rect x="${x + fw * 0.1}" y="${y + fh * 0.08}" width="${fw * 0.8}" height="${fh * 0.9}" rx="4" fill="#E1F5FE" opacity="0.75" stroke="#90CAF9"/>
      <circle cx="${x + fw/2}" cy="${y + fh * 0.12}" r="${fw * 0.1}" fill="#78909C"/>
    </g>`,
    pool: `<g class="${cls}" data-furniture="pool">
      <ellipse cx="${x + fw/2}" cy="${y + fh/2}" rx="${fw/2}" ry="${fh/2}" fill="#4FC3F7" stroke="#0288D1" stroke-width="3"/>
      <ellipse cx="${x + fw * 0.35}" cy="${y + fh * 0.4}" rx="${fw * 0.2}" ry="${fh * 0.1}" fill="rgba(255,255,255,0.35)"/>
    </g>`,
    climbing: `<g class="${cls}" data-furniture="climbing">
      <rect x="${x + fw * 0.05}" y="${y + fh * 0.75}" width="${fw * 0.9}" height="${fh * 0.2}" rx="4" fill="#8B4513"/>
      <rect x="${x + fw * 0.15}" y="${y + fh * 0.2}" width="${fw * 0.15}" height="${fh * 0.6}" rx="4" fill="#FF8FAB"/>
      <rect x="${x + fw * 0.7}" y="${y + fh * 0.1}" width="${fw * 0.15}" height="${fh * 0.7}" rx="4" fill="#42A5F5"/>
      <rect x="${x + fw * 0.42}" y="${y + fh * 0.05}" width="${fw * 0.15}" height="${fh * 0.65}" rx="4" fill="#FFD166"/>
    </g>`
  };

  return templates[f.type] || '';
}