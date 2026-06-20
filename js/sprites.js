/** SVG sprite generator — Toca-inspired cartoon style */

export function createHumanSVG(char) {
  const { colors, features, size } = char;
  const h = features.height === 'small' ? 0.85 : features.height === 'tall' ? 1.1 : 1;
  const headR = 14 * h;
  const bodyW = 22;
  const bodyH = 28 * h;
  const legH = 22 * h;

  let extras = '';
  if (features.glasses) {
    extras += `
      <circle cx="18" cy="22" r="5" fill="none" stroke="#333" stroke-width="1.5"/>
      <circle cx="32" cy="22" r="5" fill="none" stroke="#333" stroke-width="1.5"/>
      <line x1="23" y1="22" x2="27" y2="22" stroke="#333" stroke-width="1.5"/>
    `;
  }
  if (features.artist) {
    extras += `<rect x="38" y="45" width="8" height="12" rx="1" fill="#8B4513" transform="rotate(15 42 51)"/>
      <polygon points="44,45 48,38 46,45" fill="#FFD166"/>`;
  }

  return `<svg viewBox="0 0 50 ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="25" cy="${size.h - 4}" rx="16" ry="3" fill="rgba(0,0,0,0.08)"/>
    <rect x="${25 - bodyW/2}" y="${headR * 2 + 2}" width="${bodyW}" height="${bodyH}" rx="6" fill="${colors.shirt}"/>
    <rect x="${25 - bodyW/2 + 3}" y="${headR * 2 + bodyH + 2}" width="7" height="${legH}" rx="3" fill="${colors.pants}"/>
    <rect x="${25 + bodyW/2 - 10}" y="${headR * 2 + bodyH + 2}" width="7" height="${legH}" rx="3" fill="${colors.pants}"/>
    <ellipse cx="21" cy="${headR * 2 + bodyH + legH + 2}" rx="5" ry="3" fill="#333"/>
    <ellipse cx="29" cy="${headR * 2 + bodyH + legH + 2}" rx="5" ry="3" fill="#333"/>
    <circle cx="25" cy="${headR + 4}" r="${headR}" fill="${colors.skin}"/>
    <ellipse cx="25" cy="${headR - 2}" rx="${headR - 2}" ry="8" fill="${colors.hair}"/>
    <circle cx="20" cy="${headR + 4}" r="2.5" fill="#333"/>
    <circle cx="30" cy="${headR + 4}" r="2.5" fill="#333"/>
    <circle cx="21" cy="${headR + 3}" r="1" fill="white"/>
    <circle cx="31" cy="${headR + 3}" r="1" fill="white"/>
    <path d="M 22 ${headR + 10} Q 25 ${headR + 13} 28 ${headR + 10}" fill="none" stroke="#E07A7A" stroke-width="1.5" stroke-linecap="round"/>
    ${extras}
  </svg>`;
}

export function createDogSVG(char) {
  const { colors, features, size } = char;
  const isPoodle = features.breed === 'poodle';

  if (isPoodle) {
    return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${size.w/2}" cy="${size.h - 3}" rx="22" ry="4" fill="rgba(0,0,0,0.08)"/>
      <ellipse cx="${size.w/2}" cy="42" rx="20" ry="22" fill="${colors.fur}"/>
      <circle cx="${size.w/2}" cy="22" r="16" fill="${colors.fur}"/>
      <circle cx="${size.w/2 - 10}" cy="14" r="8" fill="${colors.fur}"/>
      <circle cx="${size.w/2 + 10}" cy="14" r="8" fill="${colors.fur}"/>
      <ellipse cx="${size.w/2 - 6}" cy="20" rx="3" ry="4" fill="#333"/>
      <ellipse cx="${size.w/2 + 6}" cy="20" rx="3" ry="4" fill="#333"/>
      <circle cx="${size.w/2 - 5}" cy="19" r="1.2" fill="white"/>
      <circle cx="${size.w/2 + 7}" cy="19" r="1.2" fill="white"/>
      <ellipse cx="${size.w/2}" cy="28" rx="5" ry="4" fill="${colors.accent}"/>
      <path d="M ${size.w/2 - 3} 30 Q ${size.w/2} 33 ${size.w/2 + 3} 30" fill="none" stroke="#333" stroke-width="1"/>
      <rect x="${size.w/2 - 18}" y="55" width="8" height="12" rx="3" fill="${colors.fur}"/>
      <rect x="${size.w/2 + 10}" y="55" width="8" height="12" rx="3" fill="${colors.fur}"/>
      <path d="M ${size.w/2 + 18} 40 Q ${size.w/2 + 28} 35 ${size.w/2 + 24} 48" fill="${colors.fur}" stroke="${colors.accent}" stroke-width="0.5"/>
    </svg>`;
  }

  // Shiba Inu
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 3}" rx="20" ry="4" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="${size.w/2}" cy="38" rx="18" ry="16" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2}" cy="38" rx="10" ry="8" fill="${colors.belly}"/>
    <circle cx="${size.w/2}" cy="20" r="14" fill="${colors.fur}"/>
    <polygon points="${size.w/2 - 12},8 ${size.w/2 - 8},22 ${size.w/2 - 16},18" fill="${colors.accent}"/>
    <polygon points="${size.w/2 + 12},8 ${size.w/2 + 8},22 ${size.w/2 + 16},18" fill="${colors.accent}"/>
    <ellipse cx="${size.w/2 - 5}" cy="19" rx="3" ry="3.5" fill="#333"/>
    <ellipse cx="${size.w/2 + 5}" cy="19" rx="3" ry="3.5" fill="#333"/>
    <circle cx="${size.w/2 - 4}" cy="18" r="1" fill="white"/>
    <circle cx="${size.w/2 + 6}" cy="18" r="1" fill="white"/>
    <ellipse cx="${size.w/2}" cy="26" rx="4" ry="3" fill="#333"/>
    <path d="M ${size.w/2 - 2} 28 Q ${size.w/2} 30 ${size.w/2 + 2} 28" fill="none" stroke="#333" stroke-width="0.8"/>
    <rect x="${size.w/2 - 14}" y="48" width="7" height="10" rx="2" fill="${colors.accent}"/>
    <rect x="${size.w/2 + 7}" y="48" width="7" height="10" rx="2" fill="${colors.accent}"/>
    <path d="M ${size.w/2 + 16} 35 Q ${size.w/2 + 26} 30 ${size.w/2 + 22} 40" fill="${colors.fur}" stroke="${colors.accent}" stroke-width="0.5"/>
    <path d="M ${size.w/2 - 5} 14 Q ${size.w/2} 10 ${size.w/2 + 5} 14" fill="none" stroke="#333" stroke-width="0.8"/>
  </svg>`;
}

export function createCatSVG(char) {
  const { colors, size } = char;
  const isLarge = size.w > 50;

  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 2}" rx="${size.w/2 - 4}" ry="3" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.65}" rx="${size.w/2 - 6}" ry="${size.h * 0.28}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.65}" rx="${size.w/4}" ry="${size.h * 0.15}" fill="${colors.belly}"/>
    <circle cx="${size.w/2}" cy="${size.h * 0.32}" r="${size.w * 0.22}" fill="${colors.fur}"/>
    <polygon points="${size.w/2 - 10},${size.h * 0.12} ${size.w/2 - 14},${size.h * 0.28} ${size.w/2 - 4},${size.h * 0.24}" fill="${colors.fur}"/>
    <polygon points="${size.w/2 + 10},${size.h * 0.12} ${size.w/2 + 14},${size.h * 0.28} ${size.w/2 + 4},${size.h * 0.24}" fill="${colors.fur}"/>
    <ellipse cx="${size.w/2 - 5}" cy="${size.h * 0.3}" rx="2.5" ry="${isLarge ? 3.5 : 3}" fill="#333"/>
    <ellipse cx="${size.w/2 + 5}" cy="${size.h * 0.3}" rx="2.5" ry="${isLarge ? 3.5 : 3}" fill="#333"/>
    <ellipse cx="${size.w/2 - 4}" cy="${size.h * 0.29}" rx="1" ry="1.2" fill="#8ECAE6"/>
    <ellipse cx="${size.w/2 + 6}" cy="${size.h * 0.29}" rx="1" ry="1.2" fill="#8ECAE6"/>
    <path d="M ${size.w/2 - 2} ${size.h * 0.38} Q ${size.w/2} ${size.h * 0.4} ${size.w/2 + 2} ${size.h * 0.38}" fill="none" stroke="#E07A7A" stroke-width="1"/>
    <line x1="${size.w/2 - 8}" y1="${size.h * 0.36}" x2="${size.w/2 - 16}" y2="${size.h * 0.34}" stroke="${colors.accent}" stroke-width="0.6"/>
    <line x1="${size.w/2 - 8}" y1="${size.h * 0.39}" x2="${size.w/2 - 16}" y2="${size.h * 0.4}" stroke="${colors.accent}" stroke-width="0.6"/>
    <line x1="${size.w/2 + 8}" y1="${size.h * 0.36}" x2="${size.w/2 + 16}" y2="${size.h * 0.34}" stroke="${colors.accent}" stroke-width="0.6"/>
    <line x1="${size.w/2 + 8}" y1="${size.h * 0.39}" x2="${size.w/2 + 16}" y2="${size.h * 0.4}" stroke="${colors.accent}" stroke-width="0.6"/>
    <rect x="${size.w/2 - 10}" y="${size.h * 0.78}" width="5" height="8" rx="2" fill="${colors.fur}"/>
    <rect x="${size.w/2 + 5}" y="${size.h * 0.78}" width="5" height="8" rx="2" fill="${colors.fur}"/>
    <path d="M ${size.w/2 + 12} ${size.h * 0.6} Q ${size.w/2 + 20} ${size.h * 0.55} ${size.w/2 + 18} ${size.h * 0.68}" fill="${colors.fur}" stroke="${colors.accent}" stroke-width="0.5"/>
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
    <circle cx="${size.w/2 - 5}" cy="${size.h * 0.35}" r="2" fill="#333"/>
    <circle cx="${size.w/2 + 5}" cy="${size.h * 0.35}" r="2" fill="#333"/>
    <ellipse cx="${size.w/2}" cy="${size.h * 0.42}" rx="3" ry="2" fill="${colors.accent}"/>
    <path d="M ${size.w/2 - 1} ${size.h * 0.44} L ${size.w/2} ${size.h * 0.47} L ${size.w/2 + 1} ${size.h * 0.44}" fill="none" stroke="#333" stroke-width="0.8"/>
    <rect x="${size.w/2 - 9}" y="${size.h * 0.82}" width="5" height="7" rx="2" fill="${colors.fur}"/>
    <rect x="${size.w/2 + 4}" y="${size.h * 0.82}" width="5" height="7" rx="2" fill="${colors.fur}"/>
    <circle cx="${size.w/2 + 14}" cy="${size.h * 0.65}" r="4" fill="${colors.fur}"/>
  </svg>`;
}

export function createCharacterSprite(char) {
  switch (char.type) {
    case 'human': return createHumanSVG(char);
    case 'dog': return createDogSVG(char);
    case 'cat': return createCatSVG(char);
    case 'rabbit': return createRabbitSVG(char);
    default: return createHumanSVG(char);
  }
}

/** Item sprites */
export const ITEMS = [
  { id: 'ball', name: 'Míč', emoji: '⚽', size: { w: 40, h: 40 }, color: '#FF6B35' },
  { id: 'teddy', name: 'Medvídek', emoji: '🧸', size: { w: 45, h: 50 }, color: '#C4956A' },
  { id: 'book', name: 'Kniha', emoji: '📚', size: { w: 35, h: 40 }, color: '#9B5DE5' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', size: { w: 45, h: 45 }, color: '#FFD166' },
  { id: 'cake', name: 'Dort', emoji: '🎂', size: { w: 42, h: 48 }, color: '#FF8FAB' },
  { id: 'guitar', name: 'Kytara', emoji: '🎸', size: { w: 50, h: 55 }, color: '#8B4513' },
  { id: 'paint', name: 'Barvy', emoji: '🎨', size: { w: 42, h: 42 }, color: '#52B788' },
  { id: 'phone', name: 'Telefon', emoji: '📱', size: { w: 30, h: 50 }, color: '#333' },
  { id: 'flower', name: 'Květina', emoji: '🌸', size: { w: 38, h: 50 }, color: '#FF8FAB' },
  { id: 'bone', name: 'Kost', emoji: '🦴', size: { w: 40, h: 25 }, color: '#FFF5E6' },
  { id: 'fish', name: 'Rybička', emoji: '🐟', size: { w: 40, h: 30 }, color: '#219EBC' },
  { id: 'carrot', name: 'Mrkev', emoji: '🥕', size: { w: 25, h: 45 }, color: '#FF6B35' }
];

export function createItemSVG(item) {
  const { size, color } = item;
  const emoji = item.emoji;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w/2}" cy="${size.h - 2}" rx="${size.w/2 - 2}" ry="3" fill="rgba(0,0,0,0.1)"/>
    <circle cx="${size.w/2}" cy="${size.h/2}" r="${Math.min(size.w, size.h)/2 - 2}" fill="${color}" opacity="0.3"/>
    <text x="${size.w/2}" y="${size.h/2 + 8}" text-anchor="middle" font-size="${Math.min(size.w, size.h) * 0.7}px">${emoji}</text>
  </svg>`;
}