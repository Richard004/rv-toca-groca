/**
 * Hierarchical placeable catalog — room → type → variant
 * @see feedback/inbox/feed.txt (Round 3)
 */

const SIZES = {
  chair: { w: 44, h: 52 },
  table: { w: 72, h: 48 },
  sofa: { w: 90, h: 50 },
  bed: { w: 88, h: 56 },
  lamp: { w: 36, h: 64 },
  rug: { w: 80, h: 40 },
  shelf: { w: 56, h: 72 },
  tv: { w: 64, h: 44 },
  fridge: { w: 48, h: 80 },
  stove: { w: 52, h: 56 },
  cabinet: { w: 60, h: 72 },
  sink: { w: 48, h: 44 },
  toilet: { w: 44, h: 58 },
  bathtub: { w: 90, h: 48 },
  mirror: { w: 44, h: 56 },
  towelrack: { w: 48, h: 36 },
  shower: { w: 56, h: 72 },
  desk: { w: 68, h: 48 },
  wardrobe: { w: 64, h: 88 },
  nightstand: { w: 40, h: 44 },
  toybox: { w: 52, h: 44 },
  swing: { w: 72, h: 80 },
  sandbox: { w: 80, h: 44 },
  pool: { w: 100, h: 56 },
  climbing: { w: 88, h: 88 },
  slide: { w: 72, h: 80 },
  trampoline: { w: 88, h: 32 },
  tree: { w: 56, h: 80 },
  flowers: { w: 52, h: 48 },
  doghouse: { w: 64, h: 56 },
  bench: { w: 72, h: 40 },
  grill: { w: 56, h: 52 },
  plant: { w: 40, h: 56 },
  poster: { w: 48, h: 56 },
  picture: { w: 44, h: 52 },
  clock: { w: 40, h: 48 },
  vase: { w: 32, h: 48 },
  toy: { w: 44, h: 44 }
};

function item(id, group, subgroup, name, type, variant, color, emoji = null) {
  return {
    id,
    group,
    subgroup,
    name,
    type,
    variant,
    color,
    emoji,
    size: SIZES[type] || SIZES.toy
  };
}

function subgroup(groupId, id, name, icon, entries) {
  return { id, groupId, name, icon, items: entries };
}

function makeVariants(group, subgroupId, type, baseName, variantNames, colors, emojis = []) {
  return variantNames.map((vName, i) => item(
    `${subgroupId}-${type}-${i}`,
    group,
    subgroupId,
    `${baseName} — ${vName}`,
    type,
    `v${i}`,
    colors[i % colors.length],
    emojis[i] || null
  ));
}

const WOODS = ['#8B6F47', '#A1887F', '#6D4C41', '#D7CCC8'];
const PASTELS = ['#FF8FAB', '#8ECAE6', '#CDB4DB', '#FFD166', '#95D5B2', '#FFFFFF', '#E8EAF6'];

export const CATALOG_GROUPS = [
  { id: 'living', name: 'Obývák', icon: '🛋️' },
  { id: 'kitchen', name: 'Kuchyně', icon: '🍳' },
  { id: 'bedroom', name: 'Pokoj', icon: '🛏️' },
  { id: 'bathroom', name: 'Koupelna', icon: '🛁' },
  { id: 'garden', name: 'Zahrada', icon: '🌳' },
  { id: 'toys', name: 'Hračky', icon: '🧸' },
  { id: 'decor', name: 'Dekorace', icon: '🖼️' }
];

export const CATALOG_SUBGROUPS = [
  // Obývák
  subgroup('living', 'sofa', 'Gauč', '🛋️', makeVariants('living', 'sofa', 'sofa', 'Gauč', ['Růžový', 'Modrý', 'Šedý', 'Zelený'], ['#FF8FAB', '#8ECAE6', '#B0BEC5', '#95D5B2'])),
  subgroup('living', 'chair', 'Židle', '🪑', makeVariants('living', 'chair', 'chair', 'Židle', ['Dřevěná', 'Bílá', 'Růžová', 'Křeslo'], [...WOODS, '#FF8FAB'], ['', '', '', 'armchair'])),
  subgroup('living', 'table', 'Stůl', '🪵', makeVariants('living', 'table', 'table', 'Stůl', ['Konferenční', 'Jídelní', 'Kulatý'], WOODS, ['coffee', 'dining', 'round'])),
  subgroup('living', 'lamp', 'Lampa', '💡', makeVariants('living', 'lamp', 'lamp', 'Lampa', ['Stojací', 'Stolní', 'Lustr'], ['#FFD166', '#8ECAE6', '#FF8FAB'], ['floor', 'desk', 'ceiling'])),
  subgroup('living', 'tv', 'Televize', '📺', makeVariants('living', 'tv', 'tv', 'TV', ['Velká', 'Malá'], ['#333', '#555'])),
  subgroup('living', 'rug', 'Koberec', '🟣', makeVariants('living', 'rug', 'rug', 'Koberec', ['Fialový', 'Růžový', 'Modrý', 'Žlutý'], ['#CDB4DB', '#FFB4C8', '#A2D2FF', '#FFD166'])),

  // Kuchyně
  subgroup('kitchen', 'fridge', 'Lednice', '🧊', makeVariants('kitchen', 'fridge', 'fridge', 'Lednice', ['Bílá', 'Stříbrná', 'Pastelová'], ['#F5F5F5', '#B0BEC5', '#E1F5FE'])),
  subgroup('kitchen', 'stove', 'Sporák', '🔥', makeVariants('kitchen', 'stove', 'stove', 'Sporák', ['Šedý', 'Černý', 'Bílý'], ['#78909C', '#424242', '#EEEEEE'])),
  subgroup('kitchen', 'ktable', 'Stůl', '🍽️', makeVariants('kitchen', 'ktable', 'table', 'Stůl', ['Dřevěný', 'Bílý', 'Kulatý'], [...WOODS.slice(0, 2), '#FAFAFA'], ['dining', 'dining', 'round'])),
  subgroup('kitchen', 'kchair', 'Židle', '🪑', makeVariants('kitchen', 'kchair', 'chair', 'Židle', ['Dřevěná', 'Bílá', 'Červená', 'Modrá'], [...WOODS.slice(0, 2), '#EF5350', '#42A5F5'])),
  subgroup('kitchen', 'cabinet', 'Skříňka', '🗄️', makeVariants('kitchen', 'cabinet', 'cabinet', 'Skříňka', ['Hnědá', 'Bílá', 'Šedá'], [...WOODS.slice(0, 2), '#ECEFF1'])),
  subgroup('kitchen', 'ksink', 'Dřez', '🚰', makeVariants('kitchen', 'ksink', 'sink', 'Dřez', ['Nerez', 'Bílý', 'Modrý'], ['#B0BEC5', '#FFFFFF', '#B3E5FC'], ['kitchen', 'kitchen', 'kitchen'])),

  // Pokoj
  subgroup('bedroom', 'bed', 'Postel', '🛏️', makeVariants('bedroom', 'bed', 'bed', 'Postel', ['Růžová', 'Modrá', 'Bílá', 'Patrová'], ['#CDB4DB', '#A2D2FF', '#FAFAFA', '#FFCCBC'], ['', '', '', 'bunk'])),
  subgroup('bedroom', 'desk', 'Psací stůl', '📝', makeVariants('bedroom', 'desk', 'desk', 'Stůl', ['Dřevěný', 'Bílý', 'Růžový'], [...WOODS.slice(0, 2), '#FF8FAB'])),
  subgroup('bedroom', 'wardrobe', 'Skříň', '👔', makeVariants('bedroom', 'wardrobe', 'wardrobe', 'Skříň', ['Hnědá', 'Bílá', 'Růžová'], [...WOODS.slice(0, 2), '#F8BBD0'])),
  subgroup('bedroom', 'nightstand', 'Noční stolek', '🌙', makeVariants('bedroom', 'nightstand', 'nightstand', 'Stolek', ['Dřevěný', 'Bílý', 'Modrý'], [...WOODS.slice(0, 2), '#90CAF9'])),
  subgroup('bedroom', 'blamp', 'Lampa', '💡', makeVariants('bedroom', 'blamp', 'lamp', 'Lampa', ['Žlutá', 'Růžová', 'Modrá'], ['#FFD166', '#FF8FAB', '#8ECAE6'], ['desk', 'desk', 'desk'])),
  subgroup('bedroom', 'toybox', 'Bedna na hračky', '📦', makeVariants('bedroom', 'toybox', 'toybox', 'Bedna', ['Žlutá', 'Růžová', 'Modrá'], ['#FFD166', '#FF8FAB', '#8ECAE6'])),

  // Koupelna
  subgroup('bathroom', 'toilet', 'Záchod', '🚽', makeVariants('bathroom', 'toilet', 'toilet', 'Záchod', ['Bílý', 'Modrý', 'Růžový', 'Moderní'], ['#FAFAFA', '#B3E5FC', '#F8BBD0', '#ECEFF1'], ['classic', 'classic', 'classic', 'modern'])),
  subgroup('bathroom', 'bathtub', 'Vana', '🛁', makeVariants('bathroom', 'bathtub', 'bathtub', 'Vana', ['Bílá', 'Modrá', 'Růžová', 'Rohová'], ['#FFFFFF', '#B3E5FC', '#F8BBD0', '#E1F5FE'], ['oval', 'oval', 'oval', 'corner'])),
  subgroup('bathroom', 'bsink', 'Umyvadlo', '🚿', makeVariants('bathroom', 'bsink', 'sink', 'Umyvadlo', ['Bílé', 'Kulaté', 'Na skříňce'], ['#FAFAFA', '#E3F2FD', '#CFD8DC'], ['pedestal', 'round', 'cabinet'])),
  subgroup('bathroom', 'mirror', 'Zrcadlo', '🪞', makeVariants('bathroom', 'mirror', 'mirror', 'Zrcadlo', ['Oválné', 'Obdélníkové', 'Kulaté'], ['#ECEFF1', '#CFD8DC', '#B0BEC5'], ['oval', 'rect', 'round'])),
  subgroup('bathroom', 'towelrack', 'Ručníky', '🧺', makeVariants('bathroom', 'towelrack', 'towelrack', 'Držák', ['Bílý', 'Modrý', 'Dřevěný'], ['#FAFAFA', '#90CAF9', '#8D6E63'])),
  subgroup('bathroom', 'shower', 'Sprcha', '🚿', makeVariants('bathroom', 'shower', 'shower', 'Sprcha', ['Skleněná', 'Záclonka', 'Moderní'], ['#E1F5FE', '#B3E5FC', '#CFD8DC'])),

  // Zahrada
  subgroup('garden', 'swing', 'Houpačka', '🎪', makeVariants('garden', 'swing', 'swing', 'Houpačka', ['Dřevěná', 'Barevná'], [...WOODS.slice(0, 2)])),
  subgroup('garden', 'sandbox', 'Pískoviště', '🏖️', makeVariants('garden', 'sandbox', 'sandbox', 'Pískoviště', ['Klasické', 'Velké'], ['#FFD166', '#FFCC80'])),
  subgroup('garden', 'pool', 'Bazén', '🏊', makeVariants('garden', 'pool', 'pool', 'Bazén', ['Kulatý', 'Obdélníkový', 'Nafukovací'], ['#4FC3F7', '#29B6F6', '#81D4FA'], ['round', 'rect', 'inflatable'])),
  subgroup('garden', 'climbing', 'Prolézačka', '🧗', makeVariants('garden', 'climbing', 'climbing', 'Prolézačka', ['Barevná', 'Velká sítě'], ['#FF8FAB', '#95D5B2'], ['frame', 'net'])),
  subgroup('garden', 'slide', 'Skluzavka', '🛝', makeVariants('garden', 'slide', 'slide', 'Skluzavka', ['Červená', 'Modrá', 'Žlutá'], ['#EF5350', '#42A5F5', '#FFD166'])),
  subgroup('garden', 'trampoline', 'Trampolína', '🤸', makeVariants('garden', 'trampoline', 'trampoline', 'Trampolína', ['Modrá', 'Zelená'], ['#42A5F5', '#66BB6A'])),
  subgroup('garden', 'bench', 'Lavička', '🪵', makeVariants('garden', 'bench', 'bench', 'Lavička', ['Dřevěná', 'Zelená', 'Bílá'], [...WOODS.slice(0, 2), '#FAFAFA'])),
  subgroup('garden', 'doghouse', 'Bouda', '🐕', makeVariants('garden', 'doghouse', 'doghouse', 'Bouda', ['Hnědá', 'Červená', 'Modrá'], ['#E8A87C', '#EF5350', '#90CAF9'])),
  subgroup('garden', 'gtree', 'Strom', '🌳', makeVariants('garden', 'gtree', 'tree', 'Strom', ['Jabloň', 'Borovice', 'Třešeň'], ['#52B788', '#2E7D32', '#E91E63'])),
  subgroup('garden', 'gflowers', 'Květiny', '🌸', makeVariants('garden', 'gflowers', 'flowers', 'Květiny', ['Růžové', 'Žluté', 'Fialové'], ['#FF8FAB', '#FFD166', '#CDB4DB'])),
  subgroup('garden', 'grill', 'Gril', '🍖', makeVariants('garden', 'grill', 'grill', 'Gril', ['Černý', 'Červený'], ['#424242', '#E53935'])),

  // Hračky (emoji toys)
  subgroup('toys', 'balls', 'Míče & sport', '⚽', [
    item('toy-ball', 'toys', 'balls', 'Míč', 'toy', 'ball', '#FF6B35', '⚽'),
    item('toy-teddy', 'toys', 'balls', 'Medvídek', 'toy', 'teddy', '#C4956A', '🧸'),
    item('toy-robot', 'toys', 'balls', 'Robot', 'toy', 'robot', '#78909C', '🤖'),
    item('toy-blocks', 'toys', 'balls', 'Kostky', 'toy', 'blocks', '#FF6B35', '🧱'),
    item('toy-crown', 'toys', 'balls', 'Koruna', 'toy', 'crown', '#FFD166', '👑')
  ]),
  subgroup('toys', 'food', 'Jídlo', '🍕', [
    item('toy-pizza', 'toys', 'food', 'Pizza', 'toy', 'pizza', '#FFD166', '🍕'),
    item('toy-cake', 'toys', 'food', 'Dort', 'toy', 'cake', '#FF8FAB', '🎂'),
    item('toy-carrot', 'toys', 'food', 'Mrkev', 'toy', 'carrot', '#FF6B35', '🥕'),
    item('toy-fish', 'toys', 'food', 'Rybička', 'toy', 'fish', '#219EBC', '🐟'),
    item('toy-bone', 'toys', 'food', 'Kost', 'toy', 'bone', '#FFF5E6', '🦴')
  ]),
  subgroup('toys', 'fun', 'Zábava', '🎸', [
    item('toy-guitar', 'toys', 'fun', 'Kytara', 'toy', 'guitar', '#8B4513', '🎸'),
    item('toy-book', 'toys', 'fun', 'Kniha', 'toy', 'book', '#9B5DE5', '📚'),
    item('toy-paint', 'toys', 'fun', 'Barvy', 'toy', 'paint', '#52B788', '🎨'),
    item('toy-phone', 'toys', 'fun', 'Telefon', 'toy', 'phone', '#333', '📱')
  ]),

  // Dekorace
  subgroup('decor', 'plants', 'Květiny & rostliny', '🪴', makeVariants('decor', 'plants', 'plant', 'Květina', ['Zelená', 'Kaktus', 'Růžová', 'Fialová'], ['#52B788', '#8BC34A', '#FF8FAB', '#CE93D8'])),
  subgroup('decor', 'posters', 'Obrázky', '🖼️', makeVariants('decor', 'posters', 'poster', 'Plakát', ['Rodina', 'Srdce', 'Hvězdy'], ['#FF8FAB', '#EF5350', '#FFD166'], ['family', 'heart', 'stars'])),
  subgroup('decor', 'pictures', 'Rámečky', '🎨', makeVariants('decor', 'pictures', 'picture', 'Obraz', ['Krajina', 'Kočička', 'Abstraktní'], ['#8ECAE6', '#FFCCBC', '#CDB4DB'])),
  subgroup('decor', 'clocks', 'Hodiny', '🕐', makeVariants('decor', 'clocks', 'clock', 'Hodiny', ['Klasické', 'Moderní'], ['#8D6E63', '#ECEFF1'])),
  subgroup('decor', 'vases', 'Vázy', '🏺', makeVariants('decor', 'vases', 'vase', 'Váza', ['Bílá', 'Modrá', 'Růžová'], ['#FAFAFA', '#90CAF9', '#F48FB1']))
];

const ITEM_MAP = new Map();
CATALOG_SUBGROUPS.forEach(sg => sg.items.forEach(i => ITEM_MAP.set(i.id, i)));

export function getCatalogGroup(id) {
  return CATALOG_GROUPS.find(g => g.id === id);
}

export function getSubgroupsForGroup(groupId) {
  return CATALOG_SUBGROUPS.filter(sg => sg.groupId === groupId);
}

export function getCatalogItem(id) {
  return ITEM_MAP.get(id) || null;
}

export function getAllCatalogItems() {
  return [...ITEM_MAP.values()];
}

export function getCatalogItemCount() {
  return ITEM_MAP.size;
}