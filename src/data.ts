export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'sleepy' | 'love';
export type Pose = 'idle' | 'sit' | 'sleep' | 'eat';
export type EntityKind = 'character' | 'furniture' | 'item' | 'food' | 'sketch';

export interface VecRel { xRel: number; yRel: number }

export interface Entity {
  uid: string;
  kind: EntityKind;
  id: string;
  room: string;
  xRel: number;
  yRel: number;
  outfit?: { shirt?: string };
  emotion?: Emotion;
  pose?: Pose;
  eatingUntil?: number;
  flipped?: boolean;
}

export interface CharacterDef {
  id: string;
  name: string;
  role: string;
  kind: 'human' | 'dog' | 'cat' | 'rabbit' | 'sketch';
  heightRel: number;
  aspect?: number;
  src?: string;
  shirts?: string[];
}

export interface FurnitureDef {
  id: string;
  group: string;
  subgroup: string;
  name: string;
  type: string;
  heightRel: number;
  aspect?: number;
  wall?: boolean;
  src?: string;
}

export interface FoodDef {
  id: string;
  name: string;
  drink?: boolean;
}

export interface RoomDef {
  id: string;
  name: string;
  building: string;
  theme: string;
  plate?: string;
}

export interface BuildingDef {
  id: string;
  name: string;
  rooms: string[];
}

export const EMOTIONS: { id: Emotion; label: string; mark: string }[] = [
  { id: 'happy', label: 'Šťastná', mark: '◡' },
  { id: 'sad', label: 'Smutná', mark: '︵' },
  { id: 'angry', label: 'Naštvaná', mark: '∧' },
  { id: 'surprised', label: 'Překvapená', mark: 'o' },
  { id: 'sleepy', label: 'Unavená', mark: '–' },
  { id: 'love', label: 'Zamilovaná', mark: '♥' }
];

export const SHIRT_COLORS = ['#c45c3e', '#3d7a73', '#d4a04a', '#7a9b6a', '#5a4e42', '#d9897a'];

export const FAMILY: CharacterDef[] = [
  { id: 'richard', name: 'Richard', role: 'Táta', kind: 'human', heightRel: 0.40, aspect: 0.44, src: 'characters/richard.webp', shirts: SHIRT_COLORS },
  { id: 'zuzana', name: 'Zuzana', role: 'Maminka', kind: 'human', heightRel: 0.38, aspect: 0.46, src: 'characters/zuzana.webp', shirts: SHIRT_COLORS },
  { id: 'klarka', name: 'Klárka', role: '21 let', kind: 'human', heightRel: 0.40, aspect: 0.38, src: 'characters/klarka.webp', shirts: SHIRT_COLORS },
  { id: 'anetka', name: 'Anetka', role: '12 let', kind: 'human', heightRel: 0.33, aspect: 0.57, src: 'characters/anetka.webp', shirts: SHIRT_COLORS },
  { id: 'tanicka', name: 'Taníčka', role: '11 let', kind: 'human', heightRel: 0.32, aspect: 0.42, src: 'characters/tanicka.webp', shirts: SHIRT_COLORS },
  { id: 'risa', name: 'Ríša', role: '6 let', kind: 'human', heightRel: 0.26, aspect: 0.45, src: 'characters/risa.webp', shirts: SHIRT_COLORS },
  { id: 'puffy', name: 'Puffy', role: 'Shiba Inu', kind: 'dog', heightRel: 0.16, aspect: 0.97, src: 'characters/puffy.webp' },
  { id: 'dart', name: 'Dart', role: 'Pudl', kind: 'dog', heightRel: 0.20, aspect: 0.94, src: 'characters/dart.webp' },
  { id: 'liza', name: 'Líza', role: 'Kočka', kind: 'cat', heightRel: 0.11, aspect: 1.05, src: 'characters/liza.webp' },
  { id: 'cookie', name: 'Cookie', role: 'Kočka', kind: 'cat', heightRel: 0.13, aspect: 1.19, src: 'characters/cookie.webp' },
  { id: 'berta', name: 'Berta', role: 'Králík', kind: 'rabbit', heightRel: 0.18, aspect: 0.71, src: 'characters/berta.webp' },
  { id: 'mikie', name: 'Mikie', role: 'Králík', kind: 'rabbit', heightRel: 0.13, aspect: 1.05, src: 'characters/mikie.webp' }
];

export const SKETCHES: CharacterDef[] = [
  { id: 'sketch-catgirl', name: 'Kočičí dívka', role: 'Kresba', kind: 'sketch', heightRel: 0.34, src: 'sketches/sketch-catgirl.webp' }
];

export const ROOMS: RoomDef[] = [
  { id: 'living', name: 'Obývák', building: 'home', theme: 'paper', plate: 'rooms/living.webp' },
  { id: 'kitchen', name: 'Kuchyně', building: 'home', theme: 'pond', plate: 'rooms/kitchen.webp' },
  { id: 'bedroom', name: 'Pokoj', building: 'home', theme: 'plum', plate: 'rooms/bedroom.webp' },
  { id: 'bathroom', name: 'Koupelna', building: 'home', theme: 'paper', plate: 'rooms/bathroom.webp' },
  { id: 'garden', name: 'Zahrada', building: 'home', theme: 'pond', plate: 'rooms/garden.webp' },
  { id: 'cottage-living', name: 'Chalupa', building: 'cottage', theme: 'clay' },
  { id: 'cottage-garden', name: 'Zahrádka', building: 'cottage', theme: 'honey', plate: 'rooms/garden.webp' },
  { id: 'sketch-studio', name: 'Sešit', building: 'anetka', theme: 'paper' }
];

export const BUILDINGS: BuildingDef[] = [
  { id: 'home', name: 'Náš dům', rooms: ['living', 'kitchen', 'bedroom', 'bathroom', 'garden'] },
  { id: 'cottage', name: 'Chalupa', rooms: ['cottage-living', 'cottage-garden'] },
  { id: 'anetka', name: 'Anetčin svět', rooms: ['sketch-studio'] }
];

export const WALLPAPERS = [
  { id: 'paper', name: 'Papír', wall: '#f3ebd9', floor: '#d9c9a8' },
  { id: 'clay', name: 'Hlína', wall: '#e7c4b0', floor: '#c4a484' },
  { id: 'pond', name: 'Rybník', wall: '#c5d5ce', floor: '#8aa396' },
  { id: 'plum', name: 'Švestka', wall: '#d5c4d0', floor: '#9a8494' },
  { id: 'night', name: 'Noc', wall: '#3a4250', floor: '#2c3340' },
  { id: 'honey', name: 'Med', wall: '#f0d9a0', floor: '#c9a15b' }
];

export const CATALOG_GROUPS = [
  { id: 'living', name: 'Obývák' },
  { id: 'kitchen', name: 'Kuchyně' },
  { id: 'bedroom', name: 'Pokoj' },
  { id: 'bathroom', name: 'Koupelna' },
  { id: 'garden', name: 'Zahrada' },
  { id: 'toys', name: 'Hračky' },
  { id: 'decor', name: 'Dekorace' }
];

export const FURNITURE: FurnitureDef[] = [
  { id: 'sofa-clay', group: 'living', subgroup: 'gauč', name: 'Gauč', type: 'sofa', heightRel: 0.24, aspect: 1.96, src: 'furniture/sofa-clay.webp' },
  { id: 'armchair', group: 'living', subgroup: 'gauč', name: 'Křeslo', type: 'chair', heightRel: 0.24, aspect: 0.72, src: 'furniture/armchair.webp' },
  { id: 'table-coffee', group: 'living', subgroup: 'stůl', name: 'Stolek', type: 'table', heightRel: 0.12, aspect: 1.68, src: 'furniture/table-coffee.webp' },
  { id: 'chair-wood', group: 'living', subgroup: 'stůl', name: 'Židle', type: 'chair', heightRel: 0.22, aspect: 0.85 },
  { id: 'lamp-floor', group: 'living', subgroup: 'světlo', name: 'Lampa', type: 'lamp', heightRel: 0.36, aspect: 0.38, src: 'furniture/lamp-floor.webp' },
  { id: 'tv', group: 'living', subgroup: 'světlo', name: 'Televize', type: 'tv', heightRel: 0.16, aspect: 1.08, wall: true, src: 'furniture/tv.webp' },
  { id: 'rug-clay', group: 'living', subgroup: 'koberec', name: 'Koberec', type: 'rug', heightRel: 0.16, aspect: 2.07, src: 'furniture/rug-clay.webp' },
  { id: 'fridge', group: 'kitchen', subgroup: 'spotřebiče', name: 'Lednice', type: 'fridge', heightRel: 0.40, aspect: 0.38, src: 'furniture/fridge.webp' },
  { id: 'stove', group: 'kitchen', subgroup: 'spotřebiče', name: 'Sporák', type: 'stove', heightRel: 0.24, aspect: 0.92, src: 'furniture/stove.webp' },
  { id: 'sink', group: 'kitchen', subgroup: 'spotřebiče', name: 'Dřez', type: 'sink', heightRel: 0.20, aspect: 0.87, src: 'furniture/sink.webp' },
  { id: 'bed-plum', group: 'bedroom', subgroup: 'spaní', name: 'Postel', type: 'bed', heightRel: 0.24, aspect: 1.31, src: 'furniture/bed-plum.webp' },
  { id: 'desk', group: 'bedroom', subgroup: 'práce', name: 'Psací stůl', type: 'desk', heightRel: 0.20, aspect: 1.6 },
  { id: 'toilet', group: 'bathroom', subgroup: 'koupelna', name: 'Záchod', type: 'toilet', heightRel: 0.24, aspect: 0.7 },
  { id: 'bathtub', group: 'bathroom', subgroup: 'koupelna', name: 'Vana', type: 'bathtub', heightRel: 0.20, aspect: 1.46, src: 'furniture/bathtub.webp' },
  { id: 'mirror', group: 'bathroom', subgroup: 'koupelna', name: 'Zrcadlo', type: 'mirror', heightRel: 0.22, aspect: 0.7, wall: true },
  { id: 'swing', group: 'garden', subgroup: 'hra', name: 'Houpačka', type: 'swing', heightRel: 0.28, aspect: 0.97, src: 'furniture/swing.webp' },
  { id: 'slide', group: 'garden', subgroup: 'hra', name: 'Skluzavka', type: 'slide', heightRel: 0.32, aspect: 1.2 },
  { id: 'pool', group: 'garden', subgroup: 'hra', name: 'Bazén', type: 'pool', heightRel: 0.18, aspect: 2.1 },
  { id: 'tree', group: 'garden', subgroup: 'příroda', name: 'Strom', type: 'tree', heightRel: 0.40, aspect: 0.61, src: 'furniture/tree.webp' },
  { id: 'teddy', group: 'toys', subgroup: 'hračky', name: 'Medvídek', type: 'toy', heightRel: 0.14, aspect: 0.9 },
  { id: 'robot', group: 'toys', subgroup: 'hračky', name: 'Robot', type: 'toy', heightRel: 0.14, aspect: 0.75 },
  { id: 'plant-sage', group: 'decor', subgroup: 'květiny', name: 'Květina', type: 'plant', heightRel: 0.26, aspect: 0.72, src: 'furniture/plant-sage.webp' },
  { id: 'poster', group: 'decor', subgroup: 'obrazy', name: 'Obrázek', type: 'poster', heightRel: 0.20, aspect: 0.78, wall: true, src: 'furniture/poster.webp' }
];

export const FOODS: FoodDef[] = [
  { id: 'food-apple', name: 'Jablko' },
  { id: 'food-banana', name: 'Banán' },
  { id: 'food-carrot', name: 'Mrkev' },
  { id: 'food-pizza', name: 'Pizza' },
  { id: 'food-cake', name: 'Dort' },
  { id: 'food-cookie', name: 'Sušenka' },
  { id: 'food-sandwich', name: 'Sendvič' },
  { id: 'food-egg', name: 'Vejce' },
  { id: 'food-water', name: 'Voda', drink: true },
  { id: 'food-juice', name: 'Džus', drink: true },
  { id: 'food-milk', name: 'Mléko', drink: true },
  { id: 'food-tea', name: 'Čaj', drink: true }
];

export const REACTIONS: Record<string, string[]> = {
  sofa: ['si sedne na gauč.', 'odpočívá.', 'skáče na gauči.'],
  tv: ['kouká na televizi.', 'se směje u televize.'],
  fridge: ['otevírá lednici.', 'bere svačinu.'],
  stove: ['vaří něco dobrého.', 'čichá k hrnci.'],
  table: ['sedí u stolu.', 'jí oběd.'],
  bed: ['jde spát.', 'spí jako andílek.'],
  desk: ['kreslí.', 'dělá úkoly.', 'staví robota.'],
  swing: ['houpe se.', 'volá wheee!'],
  slide: ['sjíždí skluzavku.'],
  pool: ['cáka v bazénu.'],
  plant: ['zalévá květinu.'],
  lamp: ['rozsvítí lampu.'],
  toilet: ['zavře dveře. Soukromí!'],
  bathtub: ['se koupe. Bublinky!'],
  fridge_default: ['otevírá lednici.']
};

export function getCharacter(id: string) {
  return FAMILY.find((c) => c.id === id) || SKETCHES.find((c) => c.id === id);
}

export function getFurniture(id: string) {
  return FURNITURE.find((f) => f.id === id);
}

export function getFood(id: string) {
  return FOODS.find((f) => f.id === id);
}

export function getRoom(id: string) {
  return ROOMS.find((r) => r.id === id);
}

export function getBuilding(id: string) {
  return BUILDINGS.find((b) => b.id === id) || BUILDINGS[0];
}

export function resolveDef(entity: Entity) {
  if (entity.kind === 'character' || entity.kind === 'sketch') return getCharacter(entity.id);
  if (entity.kind === 'food') return getFood(entity.id);
  return getFurniture(entity.id);
}

let uidSeq = 0;
export function uid(tag: string) {
  uidSeq += 1;
  return `${tag}-${uidSeq}-${Date.now().toString(36)}`;
}

function e(kind: EntityKind, id: string, room: string, xRel: number, yRel: number, extra: Partial<Entity> = {}): Entity {
  return { uid: uid(kind[0]), kind, id, room, xRel, yRel, ...extra };
}

export function furnishedWorld(): Entity[] {
  uidSeq = 0;
  return [
    e('furniture', 'rug-clay', 'living', 0.46, 0.97),
    e('furniture', 'sofa-clay', 'living', 0.52, 0.84),
    e('furniture', 'table-coffee', 'living', 0.24, 0.90),
    e('furniture', 'lamp-floor', 'living', 0.11, 0.90),
    e('furniture', 'plant-sage', 'living', 0.92, 0.88),
    e('furniture', 'tv', 'living', 0.90, 0.28),
    e('food', 'food-cookie', 'living', 0.26, 0.84),
    e('character', 'zuzana', 'living', 0.40, 0.91, { emotion: 'happy' }),
    e('character', 'anetka', 'living', 0.60, 0.91, { emotion: 'happy' }),
    e('character', 'liza', 'living', 0.70, 0.86),
    e('character', 'cookie', 'living', 0.18, 0.94),

    e('furniture', 'fridge', 'kitchen', 0.14, 0.86),
    e('furniture', 'stove', 'kitchen', 0.40, 0.86),
    e('furniture', 'sink', 'kitchen', 0.62, 0.86),
    e('furniture', 'table-coffee', 'kitchen', 0.84, 0.88),
    e('furniture', 'chair-wood', 'kitchen', 0.76, 0.90),
    e('furniture', 'chair-wood', 'kitchen', 0.92, 0.90),
    e('food', 'food-apple', 'kitchen', 0.82, 0.80),
    e('character', 'richard', 'kitchen', 0.38, 0.91, { emotion: 'happy' }),

    e('furniture', 'bed-plum', 'bedroom', 0.38, 0.88),
    e('character', 'klarka', 'bedroom', 0.22, 0.91, { emotion: 'happy' }),
    e('character', 'tanicka', 'bedroom', 0.58, 0.91, { emotion: 'happy' }),

    e('furniture', 'bathtub', 'bathroom', 0.28, 0.90),

    e('furniture', 'swing', 'garden', 0.22, 0.84),
    e('character', 'risa', 'garden', 0.48, 0.90, { emotion: 'happy' }),
    e('character', 'puffy', 'garden', 0.64, 0.92),
    e('character', 'dart', 'garden', 0.34, 0.90),

    e('furniture', 'sofa-clay', 'cottage-living', 0.16, 0.78),
    e('furniture', 'table-coffee', 'cottage-living', 0.46, 0.76),
    e('character', 'mikie', 'cottage-living', 0.52, 0.80),
    e('furniture', 'tree', 'cottage-garden', 0.70, 0.60),
    e('character', 'berta', 'cottage-garden', 0.34, 0.80),

    e('sketch', 'sketch-catgirl', 'sketch-studio', 0.42, 0.78)
  ];
}

export const V2_ID_MAP: Record<string, string> = {
  'sofa-sofa-0': 'sofa-clay',
  'sofa-sofa-1': 'sofa-clay',
  'sofa-sofa-2': 'sofa-clay',
  'table-table-0': 'table-coffee',
  'table-table-1': 'table-coffee',
  'ktable-table-0': 'table-coffee',
  'chair-chair-0': 'chair-wood',
  'chair-chair-3': 'chair-wood',
  'kchair-chair-0': 'chair-wood',
  'kchair-chair-2': 'chair-wood',
  'lamp-lamp-0': 'lamp-floor',
  'lamp-lamp-1': 'lamp-floor',
  'blamp-blamp-0': 'lamp-floor',
  'plants-plant-0': 'plant-sage',
  'plants-plant-1': 'plant-sage',
  'plants-plant-2': 'plant-sage',
  'plants-plant-3': 'plant-sage',
  'tv-tv-0': 'tv',
  'rug-rug-0': 'rug-clay',
  'rug-rug-1': 'rug-clay',
  'rug-rug-2': 'rug-clay',
  'fridge-fridge-0': 'fridge',
  'stove-stove-0': 'stove',
  'ksink-sink-0': 'sink',
  'bsink-sink-0': 'sink',
  'bed-bed-0': 'bed-plum',
  'bed-bed-2': 'bed-plum',
  'desk-desk-2': 'desk',
  'toilet-toilet-0': 'toilet',
  'bathtub-bathtub-0': 'bathtub',
  'mirror-mirror-0': 'mirror',
  'swing-swing-0': 'swing',
  'slide-slide-0': 'slide',
  'pool-pool-0': 'pool',
  'gtree-tree-0': 'tree',
  'gtree-tree-1': 'tree',
  'toy-teddy': 'teddy',
  'toy-robot': 'robot',
  'posters-poster-0': 'poster'
};

export const BITMAP_V2_IDS = new Set([
  'zuzana', 'anetka', 'cookie', 'liza', 'richard',
  'sofa-sofa-0', 'rug-rug-0', 'tv-tv-0', 'lamp-lamp-0', 'table-table-0', 'plants-plant-0', 'toy-teddy'
]);

export const WALL_TYPES = new Set(['tv', 'poster', 'picture', 'clock', 'mirror', 'towelrack', 'shower']);
