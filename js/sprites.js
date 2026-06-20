/** SVG sprite generator — Toca-inspired cartoon style */

export const OUTFIT_COLORS = [
  '#FF6B9D', '#9B5DE5', '#00BBF9', '#52B788', '#FFD166',
  '#FF6B35', '#FB6F92', '#4A90D9', '#2C3E50', '#E07A9F'
];

export function createHumanSVG(char, overrides = {}) {
  const { colors, features, size } = char;
  const shirt = overrides.shirt || colors.shirt;
  const pants = overrides.pants || colors.pants;
  const h = features.height === 'small' ? 0.82 : features.height === 'tall' ? 1.12 : 1;
  const headR = 16 * h;
  const bodyW = 24;
  const bodyH = 26 * h;
  const legH = 20 * h;
  const cx = 28;

  let extras = '';
  if (features.glasses) {
    extras += `
      <rect x="16" y="20" width="10" height="8" rx="3" fill="none" stroke="#333" stroke-width="1.8"/>
      <rect x="30" y="20" width="10" height="8" rx="3" fill="none" stroke="#333" stroke-width="1.8"/>
      <line x1="26" y1="24" x2="30" y2="24" stroke="#333" stroke-width="1.8"/>
    `;
  }
  if (features.artist) {
    extras += `<rect x="40" y="48" width="9" height="14" rx="2" fill="#8B4513" transform="rotate(12 44 55)"/>
      <circle cx="47" cy="46" r="4" fill="#FF6B9D"/><circle cx="44" cy="50" r="3" fill="#FFD166"/>`;
  }
  if (features.robotics) {
    extras += `<rect x="42" y="42" width="14" height="16" rx="3" fill="#78909C" stroke="#546E7A" stroke-width="1"/>
      <circle cx="47" cy="48" r="3" fill="#4FC3F7"/><circle cx="53" cy="48" r="3" fill="#4FC3F7"/>
      <rect x="45" y="54" width="8" height="2" rx="1" fill="#333"/>`;
  }

  return `<svg viewBox="0 0 56 ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${cx}" cy="${size.h - 4}" rx="18" ry="4" fill="rgba(0,0,0,0.1)"/>
    <rect x="${cx - bodyW/2}" y="${headR * 2 + 4}" width="${bodyW}" height="${bodyH}" rx="8" fill="${shirt}" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
    <rect x="${cx - bodyW/2 + 4}" y="${headR * 2 + bodyH + 6}" width="8" height="${legH}" rx="4" fill="${pants}"/>
    <rect x="${cx + bodyW/2 - 12}" y="${headR * 2 + bodyH + 6}" width="8" height="${legH}" rx="4" fill="${pants}"/>
    <ellipse cx="${cx - 6}" cy="${headR * 2 + bodyH + legH + 8}" rx="6" ry="3.5" fill="#333"/>
    <ellipse cx="${cx + 6}" cy="${headR * 2 + bodyH + legH + 8}" rx="6" ry="3.5" fill="#333"/>
    <circle cx="${cx}" cy="${headR + 6}" r="${headR}" fill="${colors.skin}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
    <ellipse cx="${cx}" cy="${headR}" rx="${headR - 1}" ry="10" fill="${colors.hair}"/>
    <ellipse cx="22" cy="${headR + 6}" rx="4" ry="5" fill="#333"/>
    <ellipse cx="34" cy="${headR + 6}" rx="4" ry="5" fill="#333"/>
    <circle cx="23" cy="${headR + 4}" r="1.8" fill="white"/>
    <circle cx="35" cy="${headR + 4}" r="1.8" fill="white"/>
    <ellipse cx="22" cy="${headR + 8}" rx="1.2" ry="0.8" fill="rgba(255,255,255,0.4)"/>
    <ellipse cx="34" cy="${headR + 8}" rx="1.2" ry="0.8" fill="rgba(255,255,255,0.4)"/>
    <path d="M 24 ${headR + 14} Q ${cx} ${headR + 17} 32 ${headR + 14}" fill="none" stroke="#E07A7A" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="18" cy="${headR + 10}" rx="3" ry="2" fill="#FFB4C8" opacity="0.5"/>
    <ellipse cx="38" cy="${headR + 10}" rx="3" ry="2" fill="#FFB4C8" opacity="0.5"/>
    ${extras}
  </svg>`;
}

export function createDogSVG(char) {
  const { colors, features, size } = char;
  const isPoodle = features.breed === 'poodle';
  const stroke = features.white ? 'stroke="#BDBDBD" stroke-width="1.2"' : '';

  if (isPoodle) {
    return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${size.w/2}" cy="${size.h - 3}" rx="24" ry="4" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="${size.w/2}" cy="44" rx="22" ry="24" fill="${colors.fur}" ${stroke}/>
      <circle cx="${size.w/2}" cy="24" r="18" fill="${colors.fur}" ${stroke}/>
      <circle cx="${size.w/2 - 12}" cy="14" r="10" fill="${colors.fur}" ${stroke}/>
      <circle cx="${size.w/2 + 12}" cy="14" r="10" fill="${colors.fur}" ${stroke}/>
      <ellipse cx="${size.w/2 - 7}" cy="22" rx="3.5" ry="4.5" fill="#333"/>
      <ellipse cx="${size.w/2 + 7}" cy="22" rx="3.5" ry="4.5" fill="#333"/>
      <circle cx="${size.w/2 - 6}" cy="21" r="1.5" fill="white"/>
      <circle cx="${size.w/2 + 8}" cy="21" r="1.5" fill="white"/>
      <ellipse cx="${size.w/2}" cy="32" rx="6" ry="5" fill="${colors.accent}"/>
      <path d="M ${size.w/2 - 4} 34 Q ${size.w/2} 37 ${size.w/2 + 4} 34" fill="none" stroke="#333" stroke-width="1.2"/>
      <rect x="${size.w/2 - 20}" y="58" width="10" height="14" rx="4" fill="${colors.fur}" ${stroke}/>
      <rect x="${size.w/2 + 10}" y="58" width="10" height="14" rx="4" fill="${colors.fur}" ${stroke}/>
      <path d="M ${size.w/2 + 20} 42 Q ${size.w/2 + 32} 36 ${size.w/2 + 28} 50" fill="${colors.fur}" ${stroke}/>
    </svg>`;
  }

  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 3}" rx="22" ry="4" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="${size.w/2}" cy="38" rx="20" ry="18" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2}" cy="40" rx="11" ry="9" fill="${colors.belly}"/>
    <circle cx="${size.w/2}" cy="20" r="15" fill="${colors.fur}"/>
    <polygon points="${size.w/2 - 14},6 ${size.w/2 - 9},22 ${size.w/2 - 18},17" fill="${colors.accent}"/>
    <polygon points="${size.w/2 + 14},6 ${size.w/2 + 9},22 ${size.w/2 + 18},17" fill="${colors.accent}"/>
    <ellipse cx="${size.w/2 - 6}" cy="19" rx="3.5" ry="4" fill="#333"/>
    <ellipse cx="${size.w/2 + 6}" cy="19" rx="3.5" ry="4" fill="#333"/>
    <circle cx="${size.w/2 - 5}" cy="18" r="1.3" fill="white"/>
    <circle cx="${size.w/2 + 7}" cy="18" r="1.3" fill="white"/>
    <ellipse cx="${size.w/2}" cy="27" rx="5" ry="4" fill="#333"/>
    <path d="M ${size.w/2 - 3} 29 Q ${size.w/2} 31 ${size.w/2 + 3} 29" fill="none" stroke="#333" stroke-width="1"/>
    <rect x="${size.w/2 - 15}" y="48" width="8" height="11" rx="3" fill="${colors.accent}"/>
    <rect x="${size.w/2 + 7}" y="48" width="8" height="11" rx="3" fill="${colors.accent}"/>
    <path d="M ${size.w/2 + 17} 34 Q ${size.w/2 + 28} 28 ${size.w/2 + 24} 40" fill="${colors.fur}" stroke="${colors.accent}" stroke-width="0.8"/>
    <path d="M ${size.w/2 - 6} 13 Q ${size.w/2} 8 ${size.w/2 + 6} 13" fill="none" stroke="#333" stroke-width="1"/>
  </svg>`;
}

export function createCatSVG(char) {
  const { colors, features, size } = char;
  const isLarge = features.size === 'large';
  const isWhite = features.white;
  const stroke = isWhite ? 'stroke="#BDBDBD" stroke-width="1.5"' : 'stroke="rgba(0,0,0,0.05)" stroke-width="0.8"';

  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 2}" rx="${size.w/2 - 3}" ry="3" fill="rgba(0,0,0,0.1)"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.66}" rx="${size.w/2 - 5}" ry="${size.h * 0.27}" fill="${colors.fur}" ${stroke}/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.66}" rx="${size.w/4}" ry="${size.h * 0.14}" fill="${colors.belly}"/>
    <circle cx="${size.w/2}" cy="${size.h * 0.33}" r="${size.w * 0.24}" fill="${colors.fur}" ${stroke}/>
    <polygon points="${size.w/2 - 11},${size.h * 0.1} ${size.w/2 - 15},${size.h * 0.28} ${size.w/2 - 5},${size.h * 0.24}" fill="${colors.fur}" ${stroke}/>
    <polygon points="${size.w/2 + 11},${size.h * 0.1} ${size.w/2 + 15},${size.h * 0.28} ${size.w/2 + 5},${size.h * 0.24}" fill="${colors.fur}" ${stroke}/>
    <ellipse cx="${size.w/2 - 6}" cy="${size.h * 0.31}" rx="3" ry="${isLarge ? 4 : 3.5}" fill="#333"/>
    <ellipse cx="${size.w/2 + 6}" cy="${size.h * 0.31}" rx="3" ry="${isLarge ? 4 : 3.5}" fill="#333"/>
    <circle cx="${size.w/2 - 5}" cy="${size.h * 0.29}" r="1.3" fill="white"/>
    <circle cx="${size.w/2 + 7}" cy="${size.h * 0.29}" r="1.3" fill="white"/>
    <path d="M ${size.w/2 - 2} ${size.h * 0.39} Q ${size.w/2} ${size.h * 0.42} ${size.w/2 + 2} ${size.h * 0.39}" fill="none" stroke="#E07A7A" stroke-width="1.2"/>
    <line x1="${size.w/2 - 10}" y1="${size.h * 0.37}" x2="${size.w/2 - 18}" y2="${size.h * 0.35}" stroke="${colors.accent}" stroke-width="0.8"/>
    <line x1="${size.w/2 + 10}" y1="${size.h * 0.37}" x2="${size.w/2 + 18}" y2="${size.h * 0.35}" stroke="${colors.accent}" stroke-width="0.8"/>
    <rect x="${size.w/2 - 11}" y="${size.h * 0.8}" width="6" height="9" rx="2" fill="${colors.fur}"/>
    <rect x="${size.w/2 + 5}" y="${size.h * 0.8}" width="6" height="9" rx="2" fill="${colors.fur}"/>
    <path d="M ${size.w/2 + 14} ${size.h * 0.62} Q ${size.w/2 + 22} ${size.h * 0.56} ${size.w/2 + 20} ${size.h * 0.7}" fill="${colors.fur}" ${stroke}/>
  </svg>`;
}

export function createRabbitSVG(char) {
  const { colors, size } = char;
  const isLarge = size.w > 45;

  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 2}" rx="${size.w/2 - 4}" ry="3" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.68}" rx="${size.w/2 - 5}" ry="${size.h * 0.25}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.68}" rx="${size.w/4}" ry="${size.h * 0.12}" fill="${colors.belly}"/>
    <circle cx="${size.w/2}" cy="${size.h * 0.38}" r="${size.w * 0.2}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2 - 6}" cy="${size.h * 0.08}" rx="4" ry="${isLarge ? 14 : 10}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2 + 6}" cy="${size.h * 0.08}" rx="4" ry="${isLarge ? 14 : 10}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2 - 6}" cy="${size.h * 0.08}" rx="2" ry="${isLarge ? 10 : 7}" fill="${colors.belly}"/>
    <ellipse cx="${size.w/2 + 6}" cy="${size.h * 0.08}" rx="2" ry="${isLarge ? 10 : 7}" fill="${colors.belly}"/>
    <circle cx="${size.w/2 - 5}" cy="${size.h * 0.35}" r="2.2" fill="#333"/>
    <circle cx="${size.w/2 + 5}" cy="${size.h * 0.35}" r="2.2" fill="#333"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.42}" rx="3" ry="2" fill="${colors.accent}"/>
    <rect x="${size.w/2 - 9}" y="${size.h * 0.82}" width="5" height="7" rx="2" fill="${colors.fur}"/>
    <rect x="${size.w/2 + 4}" y="${size.h * 0.82}" width="5" height="7" rx="2" fill="${colors.fur}"/>
    <circle cx="${size.w/2 + 14}" cy="${size.h * 0.65}" r="4" fill="${colors.fur}"/>
  </svg>`;
}

export function createCharacterSprite(char, overrides = {}) {
  switch (char.type) {
    case 'human': return createHumanSVG(char, overrides);
    case 'dog': return createDogSVG(char);
    case 'cat': return createCatSVG(char);
    case 'rabbit': return createRabbitSVG(char);
    default: return createHumanSVG(char, overrides);
  }
}

export const ITEMS = [
  { id: 'ball', name: 'Míč', emoji: '⚽', size: { w: 40, h: 40 }, color: '#FF6B35' },
  { id: 'teddy', name: 'Medvídek', emoji: '🧸', size: { w: 45, h: 50 }, color: '#C4956A' },
  { id: 'robot', name: 'Robot', emoji: '🤖', size: { w: 48, h: 52 }, color: '#78909C' },
  { id: 'book', name: 'Kniha', emoji: '📚', size: { w: 35, h: 40 }, color: '#9B5DE5' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', size: { w: 45, h: 45 }, color: '#FFD166' },
  { id: 'cake', name: 'Dort', emoji: '🎂', size: { w: 42, h: 48 }, color: '#FF8FAB' },
  { id: 'guitar', name: 'Kytara', emoji: '🎸', size: { w: 50, h: 55 }, color: '#8B4513' },
  { id: 'paint', name: 'Barvy', emoji: '🎨', size: { w: 42, h: 42 }, color: '#52B788' },
  { id: 'phone', name: 'Telefon', emoji: '📱', size: { w: 30, h: 50 }, color: '#333' },
  { id: 'flower', name: 'Květina', emoji: '🌸', size: { w: 38, h: 50 }, color: '#FF8FAB' },
  { id: 'bone', name: 'Kost', emoji: '🦴', size: { w: 40, h: 25 }, color: '#FFF5E6' },
  { id: 'fish', name: 'Rybička', emoji: '🐟', size: { w: 40, h: 30 }, color: '#219EBC' },
  { id: 'carrot', name: 'Mrkev', emoji: '🥕', size: { w: 25, h: 45 }, color: '#FF6B35' },
  { id: 'blocks', name: 'Kostky', emoji: '🧱', size: { w: 44, h: 40 }, color: '#FF6B35' },
  { id: 'crown', name: 'Koruna', emoji: '👑', size: { w: 40, h: 35 }, color: '#FFD166' }
];

export function createItemSVG(item) {
  const { size, color } = item;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 2}" rx="${size.w/2 - 2}" ry="3" fill="rgba(0,0,0,0.1)"/>
    <circle cx="${size.w/2}" cy="${size.h/2}" r="${Math.min(size.w, size.h)/2 - 2}" fill="${color}" opacity="0.35"/>
    <text x="${size.w/2}" y="${size.h/2 + 8}" text-anchor="middle" font-size="${Math.min(size.w, size.h) * 0.65}px">${item.emoji}</text>
  </svg>`;
}