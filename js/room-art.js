/**
 * Portrait-native illustrated room backgrounds (Toca-style).
 * Designed for viewBox 400×700 — one screen = whole scene.
 */

function plankFloor(y0, y1, color, dark) {
  let lines = '';
  for (let y = y0; y < y1; y += 18) {
    lines += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${dark}" stroke-width="1" opacity="0.25"/>`;
  }
  return `<rect x="0" y="${y0}" width="400" height="${y1 - y0}" fill="${color}"/>${lines}`;
}

function dotWall(y0, y1, base, dot) {
  let dots = '';
  for (let x = 12; x < 400; x += 28) {
    for (let y = y0 + 10; y < y1 - 8; y += 24) {
      dots += `<circle cx="${x}" cy="${y}" r="2.5" fill="${dot}" opacity="0.35"/>`;
    }
  }
  return `<rect x="0" y="${y0}" width="400" height="${y1 - y0}" fill="${base}"/>${dots}`;
}

function baseboard(y, color) {
  return `<rect x="0" y="${y}" width="400" height="10" fill="${color}" rx="2"/>
    <rect x="0" y="${y}" width="400" height="3" fill="rgba(255,255,255,0.35)"/>`;
}

export function createPortraitRoomSVG(room) {
  const id = room.id;
  if (id === 'living') return livingRoom(room);
  if (id === 'kitchen') return kitchenRoom(room);
  if (id === 'bedroom') return bedroomRoom(room);
  if (id === 'bathroom') return bathroomRoom(room);
  if (id === 'garden') return gardenRoom(room);
  if (id === 'cottage-living') return cottageLiving(room);
  if (id === 'cottage-garden') return cottageGarden(room);
  return genericRoom(room);
}

function livingRoom(room) {
  const wall = room.wall || '#FFB4C8';
  const floor = room.floor || '#FF8FAB';
  const bg = room.bg || '#FFE4EC';
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="700" fill="${bg}"/>
    ${dotWall(0, 430, wall, '#FFFFFF')}
    ${baseboard(430, '#E8919F')}
    ${plankFloor(440, 700, floor, '#D66B8A')}
    <!-- okno se závěsy -->
    <rect x="118" y="52" width="164" height="118" rx="12" fill="#8ECAE6" stroke="#5BA8C9" stroke-width="4"/>
    <rect x="128" y="62" width="144" height="98" rx="8" fill="#C8E7FF"/>
    <line x1="200" y1="52" x2="200" y2="170" stroke="#5BA8C9" stroke-width="3"/>
    <line x1="118" y1="108" x2="282" y2="108" stroke="#5BA8C9" stroke-width="3"/>
    <circle cx="248" cy="82" r="22" fill="#FFD166"/>
    <path d="M 108 52 Q 118 30 128 52" fill="#FF8FAB" stroke="none"/>
    <path d="M 282 52 Q 292 30 302 52" fill="#FF8FAB"/>
    <rect x="100" y="48" width="18" height="130" rx="6" fill="#FF6B9D"/>
    <rect x="282" y="48" width="18" height="130" rx="6" fill="#FF6B9D"/>
    <!-- police s knihami -->
    <rect x="18" y="200" width="88" height="10" rx="3" fill="#8B6F47"/>
    <rect x="14" y="188" width="6" height="22" fill="#6D4C41"/>
    <rect x="104" y="188" width="6" height="22" fill="#6D4C41"/>
    <rect x="22" y="178" width="14" height="20" rx="2" fill="#9B5DE5"/>
    <rect x="40" y="180" width="12" height="18" rx="2" fill="#52B788"/>
    <rect x="56" y="176" width="16" height="22" rx="2" fill="#FFD166"/>
    <rect x="76" y="179" width="13" height="19" rx="2" fill="#FF6B9D"/>
    <!-- rodinný plakát -->
    <rect x="300" y="175" width="72" height="88" rx="6" fill="#FFF" stroke="#8B6F47" stroke-width="4"/>
    <rect x="308" y="183" width="56" height="56" rx="4" fill="#FFCCBC"/>
    <text x="336" y="222" text-anchor="middle" font-size="11" fill="#E07A9F" font-weight="700">♥ RODINA</text>
    <!-- parapet květiny -->
    <rect x="130" y="168" width="140" height="8" rx="2" fill="#8B6F47"/>
    <ellipse cx="155" cy="158" rx="16" ry="12" fill="#52B788"/>
    <ellipse cx="185" cy="155" rx="14" ry="10" fill="#FF8FAB"/>
    <ellipse cx="215" cy="158" rx="15" ry="11" fill="#95D5B2"/>
    <!-- lišta + wainscoting -->
    <rect x="0" y="350" width="400" height="80" fill="rgba(255,255,255,0.12)"/>
    <line x1="0" y1="350" x2="400" y2="350" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
    <rect x="0" y="430" width="400" height="14" fill="rgba(0,0,0,0.05)"/>
  </svg>`;
}

function kitchenRoom(room) {
  const wall = room.wall || '#B2EBF2';
  const floor = room.floor || '#80DEEA';
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="700" fill="${room.bg || '#E0F7FA'}"/>
    ${dotWall(0, 420, wall, '#fff')}
    ${baseboard(420, '#4DB6AC')}
    ${plankFloor(430, 700, floor, '#26A69A')}
    <rect x="0" y="280" width="400" height="140" fill="#ECEFF1" opacity="0.5"/>
    <rect x="20" y="300" width="360" height="8" fill="#B0BEC5"/>
    <rect x="30" y="240" width="50" height="70" rx="4" fill="#CFD8DC" stroke="#90A4AE" stroke-width="2"/>
    <rect x="90" y="250" width="80" height="60" rx="4" fill="#ECEFF1"/>
    <circle cx="280" cy="120" r="28" fill="#FFD166" opacity="0.9"/>
  </svg>`;
}

function bedroomRoom(room) {
  const wall = room.wall || '#D1C4E9';
  const floor = room.floor || '#B39DDB';
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="700" fill="${room.bg || '#EDE7F6'}"/>
    ${dotWall(0, 420, wall, '#fff')}
    ${baseboard(420, '#9575CD')}
    ${plankFloor(430, 700, floor, '#7E57C2')}
    <circle cx="60" cy="90" r="8" fill="#FFD166"/><circle cx="90" cy="70" r="5" fill="#FFD166" opacity="0.7"/>
    <circle cx="340" cy="80" r="6" fill="#FF8FAB"/><circle cx="310" cy="100" r="4" fill="#FF8FAB" opacity="0.6"/>
    <rect x="160" y="60" width="80" height="60" rx="6" fill="#FFF" stroke="#8B6F47" stroke-width="3"/>
    <polygon points="200,75 185,95 215,95" fill="#FFD166"/>
  </svg>`;
}

function bathroomRoom(room) {
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="700" fill="${room.bg || '#E3F2FD'}"/>
    <rect x="0" y="0" width="400" height="430" fill="${room.wall || '#B2EBF2'}"/>
    ${baseboard(430, '#4FC3F7')}
    <rect x="0" y="440" width="400" height="260" fill="${room.floor || '#81D4FA'}"/>
    <rect x="0" y="200" width="400" height="120" fill="#E1F5FE" opacity="0.55"/>
    <ellipse cx="200" cy="160" rx="70" ry="50" fill="#FFF" opacity="0.35"/>
  </svg>`;
}

function gardenRoom(room) {
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#B3E5FC"/>
    </linearGradient></defs>
    <rect width="400" height="280" fill="url(#sky)"/>
    <circle cx="320" cy="70" r="42" fill="#FFD166"/>
    <ellipse cx="80" cy="90" rx="55" ry="22" fill="#FFF" opacity="0.85"/>
    <ellipse cx="260" cy="60" rx="70" ry="26" fill="#FFF" opacity="0.6"/>
    <rect x="0" y="280" width="400" height="420" fill="${room.floor || '#52B788'}"/>
    <ellipse cx="200" cy="620" rx="180" ry="40" fill="#40916C" opacity="0.35"/>
  </svg>`;
}

function cottageLiving(room) {
  return livingRoom({ ...room, wall: room.wall || '#FFE0B2', floor: room.floor || '#FFCC80', bg: room.bg || '#FFF3E0' });
}

function cottageGarden(room) {
  return gardenRoom(room);
}

function genericRoom(room) {
  return `<svg class="room-bg room-bg--portrait" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="700" fill="${room.bg}"/>
    <rect x="0" y="0" width="400" height="280" fill="${room.wall}"/>
    <rect x="0" y="440" width="400" height="260" fill="${room.floor}"/>
  </svg>`;
}

/** True when room should use portrait-native art (phone). */
export function usePortraitRoomArt(innerW, vpW, vpH) {
  return vpW > 0 && vpH > vpW && innerW <= vpW * 1.08;
}