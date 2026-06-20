/** Family & pet definitions — ready for custom drawing assets later */
export const FAMILY = [
  {
    id: 'richard',
    name: 'Richard',
    role: 'Tata',
    type: 'human',
    size: { w: 86, h: 136 },
    colors: { skin: '#F5C9A8', hair: '#5C4033', shirt: '#4A90D9', pants: '#3D5A80' },
    features: { glasses: true, beard: false, height: 'tall' }
  },
  {
    id: 'zuzana',
    name: 'Zuzana',
    role: 'Maminka',
    type: 'human',
    size: { w: 80, h: 130 },
    colors: { skin: '#F5C9A8', hair: '#8B4513', shirt: '#E07A9F', pants: '#9B59B6' },
    features: { glasses: false, beard: false, height: 'medium' }
  },
  {
    id: 'klarka',
    name: 'Klárka',
    role: '21 let',
    type: 'human',
    size: { w: 76, h: 132 },
    colors: { skin: '#F5C9A8', hair: '#D4A574', shirt: '#FF6B9D', pants: '#2C3E50' },
    features: { glasses: false, beard: false, height: 'tall', robotics: true }
  },
  {
    id: 'anetka',
    name: 'Anetka',
    role: '12 let',
    type: 'human',
    size: { w: 68, h: 112 },
    colors: { skin: '#F5C9A8', hair: '#C4956A', shirt: '#52B788', pants: '#F4A261' },
    features: { glasses: false, beard: false, height: 'medium', artist: true }
  },
  {
    id: 'tanicka',
    name: 'Taníčka',
    role: '11 let',
    type: 'human',
    size: { w: 66, h: 110 },
    colors: { skin: '#F5C9A8', hair: '#B8860B', shirt: '#9B5DE5', pants: '#00BBF9' },
    features: { glasses: false, beard: false, height: 'medium' }
  },
  {
    id: 'risa',
    name: 'Ríša',
    role: '6 let',
    type: 'human',
    size: { w: 58, h: 88 },
    colors: { skin: '#F5C9A8', hair: '#8B6914', shirt: '#FFD166', pants: '#06D6A0' },
    features: { glasses: false, beard: false, height: 'small' }
  },
  {
    id: 'puffy',
    name: 'Puffy',
    role: 'Shiba Inu',
    type: 'dog',
    size: { w: 74, h: 68 },
    colors: { fur: '#E8652A', belly: '#FFF0E0', accent: '#B84A1A' },
    features: { breed: 'shiba', ginger: true }
  },
  {
    id: 'dart',
    name: 'Dart',
    role: 'Royal Poodle',
    type: 'dog',
    size: { w: 88, h: 96 },
    colors: { fur: '#FFFFFF', belly: '#FAFAFA', accent: '#E8E8E8' },
    features: { breed: 'poodle', fluffy: true, white: true }
  },
  {
    id: 'liza',
    name: 'Líza',
    role: 'Kočka',
    type: 'cat',
    size: { w: 52, h: 56 },
    colors: { fur: '#9E9E9E', belly: '#EEEEEE', accent: '#616161' },
    features: { size: 'small', gray: true }
  },
  {
    id: 'cookie',
    name: 'Cookie',
    role: 'Kočka',
    type: 'cat',
    size: { w: 84, h: 76 },
    colors: { fur: '#FFFFFF', belly: '#FAFAFA', accent: '#BDBDBD' },
    features: { size: 'large', white: true }
  },
  {
    id: 'berta',
    name: 'Berta',
    role: 'Králík',
    type: 'rabbit',
    size: { w: 68, h: 74 },
    colors: { fur: '#D4A574', belly: '#FFF8F0', accent: '#C4956A' },
    features: { size: 'large' }
  },
  {
    id: 'mikie',
    name: 'Mikie',
    role: 'Králík',
    type: 'rabbit',
    size: { w: 50, h: 56 },
    colors: { fur: '#F5DEB3', belly: '#FFF8F0', accent: '#DEB887' },
    features: { size: 'small' }
  }
];

export function getCharacterById(id) {
  return FAMILY.find(c => c.id === id);
}