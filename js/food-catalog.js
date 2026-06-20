/** Food & drinks — spawn, feed characters, store in fridge */

export const FOOD_ITEMS = [
  { id: 'food-apple', name: 'Jablko', emoji: '🍎', size: { w: 36, h: 36 }, color: '#FF6B6B', drink: false },
  { id: 'food-banana', name: 'Banan', emoji: '🍌', size: { w: 40, h: 36 }, color: '#FFD166', drink: false },
  { id: 'food-carrot', name: 'Mrkev', emoji: '🥕', size: { w: 28, h: 44 }, color: '#FF6B35', drink: false },
  { id: 'food-pizza', name: 'Pizza', emoji: '🍕', size: { w: 44, h: 44 }, color: '#FFD166', drink: false },
  { id: 'food-cake', name: 'Dort', emoji: '🎂', size: { w: 42, h: 48 }, color: '#FF8FAB', drink: false },
  { id: 'food-cookie', name: 'Sušenka', emoji: '🍪', size: { w: 36, h: 36 }, color: '#C4956A', drink: false },
  { id: 'food-sandwich', name: 'Sendvič', emoji: '🥪', size: { w: 44, h: 36 }, color: '#DEB887', drink: false },
  { id: 'food-egg', name: 'Vejce', emoji: '🥚', size: { w: 32, h: 40 }, color: '#FFF8F0', drink: false },
  { id: 'food-water', name: 'Voda', emoji: '💧', size: { w: 32, h: 44 }, color: '#4FC3F7', drink: true },
  { id: 'food-juice', name: 'Džus', emoji: '🧃', size: { w: 30, h: 48 }, color: '#FF6B35', drink: true },
  { id: 'food-milk', name: 'Mléko', emoji: '🥛', size: { w: 32, h: 44 }, color: '#F5F5F5', drink: true },
  { id: 'food-tea', name: 'Čaj', emoji: '🍵', size: { w: 36, h: 40 }, color: '#95D5B2', drink: true }
];

const FOOD_MAP = new Map(FOOD_ITEMS.map(f => [f.id, f]));

export function getFoodItem(id) {
  return FOOD_MAP.get(id) || null;
}

export function createFoodSVG(item) {
  const { size, color, emoji } = item;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w / 2}" cy="${size.h - 2}" rx="${size.w / 2 - 2}" ry="3" fill="rgba(0,0,0,0.1)"/>
    <circle cx="${size.w / 2}" cy="${size.h / 2}" r="${Math.min(size.w, size.h) / 2 - 2}" fill="${color}" opacity="0.4"/>
    <text x="${size.w / 2}" y="${size.h / 2 + 8}" text-anchor="middle" font-size="${Math.min(size.w, size.h) * 0.62}px">${emoji}</text>
  </svg>`;
}