/** SVG sprites for draggable catalog furniture */

function shadow(w, h) {
  return `<ellipse cx="${w / 2}" cy="${h - 2}" rx="${w / 2 - 4}" ry="3" fill="rgba(0,0,0,0.12)"/>`;
}

export function createPlaceableSVG(item) {
  if (item.type === 'toy' && item.emoji) {
    const { size, color } = item;
    return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(size.w, size.h)}
      <circle cx="${size.w / 2}" cy="${size.h / 2}" r="${Math.min(size.w, size.h) / 2 - 2}" fill="${color}" opacity="0.35"/>
      <text x="${size.w / 2}" y="${size.h / 2 + 8}" text-anchor="middle" font-size="${Math.min(size.w, size.h) * 0.65}px">${item.emoji}</text>
    </svg>`;
  }

  const fn = RENDERERS[item.type];
  if (fn) return fn(item);
  return fallback(item);
}

function fallback(item) {
  const { size, color, name } = item;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(size.w, size.h)}
    <rect x="4" y="8" width="${size.w - 8}" height="${size.h - 16}" rx="8" fill="${color}" stroke="rgba(0,0,0,0.08)"/>
    <text x="${size.w / 2}" y="${size.h / 2 + 4}" text-anchor="middle" font-size="9" fill="#555" font-weight="700">${name.slice(0, 8)}</text>
  </svg>`;
}

const RENDERERS = {
  chair: renderChair,
  table: renderTable,
  sofa: renderSofa,
  bed: renderBed,
  lamp: renderLamp,
  rug: renderRug,
  tv: renderTv,
  fridge: renderFridge,
  stove: renderStove,
  cabinet: renderCabinet,
  sink: renderSink,
  toilet: renderToilet,
  bathtub: renderBathtub,
  mirror: renderMirror,
  towelrack: renderTowelrack,
  shower: renderShower,
  desk: renderDesk,
  wardrobe: renderWardrobe,
  nightstand: renderNightstand,
  toybox: renderToybox,
  swing: renderSwing,
  sandbox: renderSandbox,
  pool: renderPool,
  climbing: renderClimbing,
  slide: renderSlide,
  trampoline: renderTrampoline,
  tree: renderTree,
  flowers: renderFlowers,
  doghouse: renderDoghouse,
  bench: renderBench,
  grill: renderGrill,
  plant: renderPlant,
  poster: renderPoster,
  picture: renderPicture,
  clock: renderClock,
  vase: renderVase,
  shelf: renderShelf
};

function renderChair(item) {
  const { size, color, variant } = item;
  const isArm = variant === 'armchair' || item.emoji === 'armchair';
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="22" width="${w - 20}" height="14" rx="5" fill="${color}"/>
    <rect x="12" y="34" width="8" height="${h - 40}" rx="3" fill="${darken(color)}"/>
    <rect x="${w - 20}" y="34" width="8" height="${h - 40}" rx="3" fill="${darken(color)}"/>
    ${isArm ? `<rect x="6" y="18" width="8" height="22" rx="4" fill="${color}"/><rect x="${w - 14}" y="18" width="8" height="22" rx="4" fill="${color}"/>` : ''}
    <rect x="14" y="8" width="${w - 28}" height="18" rx="6" fill="${color}" stroke="rgba(0,0,0,0.06)"/>
  </svg>`;
}

function renderTable(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  const round = variant === 'round' || variant === 'v2';
  if (round) {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(w, h)}
      <ellipse cx="${w / 2}" cy="18" rx="${w / 2 - 6}" ry="14" fill="${color}"/>
      <rect x="${w / 2 - 5}" y="24" width="10" height="${h - 30}" rx="3" fill="${darken(color)}"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="10" width="${w - 12}" height="12" rx="6" fill="${color}"/>
    <rect x="10" y="20" width="8" height="${h - 26}" rx="2" fill="${darken(color)}"/>
    <rect x="${w - 18}" y="20" width="8" height="${h - 26}" rx="2" fill="${darken(color)}"/>
    ${variant === 'dining' || item.subgroup === 'ktable' ? `<rect x="${w * 0.35}" y="20" width="8" height="${h - 26}" rx="2" fill="${darken(color)}"/><rect x="${w * 0.6}" y="20" width="8" height="${h - 26}" rx="2" fill="${darken(color)}"/>` : ''}
  </svg>`;
}

function renderSofa(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  const cushion = lighten(color);
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="4" y="${h * 0.38}" width="${w - 8}" height="${h * 0.52}" rx="12" fill="${darken(color)}"/>
    <rect x="8" y="${h * 0.32}" width="${w - 16}" height="${h * 0.22}" rx="10" fill="${cushion}"/>
    <rect x="10" y="${h * 0.54}" width="${(w - 24) / 2}" height="${h * 0.28}" rx="8" fill="${color}"/>
    <rect x="${w / 2 + 2}" y="${h * 0.54}" width="${(w - 24) / 2}" height="${h * 0.28}" rx="8" fill="${color}"/>
    <rect x="6" y="${h * 0.34}" width="12" height="${h * 0.42}" rx="6" fill="${cushion}"/>
    <rect x="${w - 18}" y="${h * 0.34}" width="12" height="${h * 0.42}" rx="6" fill="${cushion}"/>
    <ellipse cx="${w * 0.28}" cy="${h * 0.44}" rx="8" ry="5" fill="white" opacity="0.55"/>
    <ellipse cx="${w * 0.72}" cy="${h * 0.44}" rx="8" ry="5" fill="white" opacity="0.55"/>
  </svg>`;
}

function renderBed(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  const bunk = variant === 'bunk';
  if (bunk) {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(w, h)}
      <rect x="8" y="8" width="${w - 16}" height="18" rx="6" fill="${color}"/>
      <rect x="8" y="30" width="${w - 16}" height="18" rx="6" fill="${lighten(color)}"/>
      <rect x="10" y="6" width="${w - 20}" height="6" rx="3" fill="#8B6F47"/>
      <rect x="10" y="28" width="${w - 20}" height="4" rx="2" fill="#8B6F47"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="4" y="${h * 0.28}" width="${w - 8}" height="${h * 0.66}" rx="10" fill="#8B6F47"/>
    <rect x="8" y="${h * 0.12}" width="${w - 16}" height="${h * 0.22}" rx="10" fill="${color}"/>
    <rect x="10" y="${h * 0.34}" width="${w - 20}" height="${h * 0.52}" rx="6" fill="${lighten(color)}"/>
    <ellipse cx="${w * 0.22}" cy="${h * 0.2}" rx="10" ry="7" fill="white"/>
    <ellipse cx="${w * 0.78}" cy="${h * 0.2}" rx="10" ry="7" fill="white"/>
    <rect x="${w * 0.18}" y="${h * 0.38}" width="${w * 0.64}" height="${h * 0.12}" rx="4" fill="${color}" opacity="0.45"/>
    <circle cx="${w * 0.35}" cy="${h * 0.44}" r="4" fill="#FF8FAB" opacity="0.7"/>
    <circle cx="${w * 0.65}" cy="${h * 0.44}" r="4" fill="#8ECAE6" opacity="0.7"/>
  </svg>`;
}

function renderLamp(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  if (variant === 'ceiling') {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${w / 2}" y1="4" x2="${w / 2}" y2="18" stroke="#888" stroke-width="2"/>
      <path d="M ${w * 0.15} 18 L ${w * 0.85} 18 L ${w * 0.7} 42 L ${w * 0.3} 42 Z" fill="${color}"/>
    </svg>`;
  }
  const tall = variant !== 'desk' && variant !== 'v1';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="${w / 2 - 4}" y="${tall ? 24 : 18}" width="8" height="${h - (tall ? 30 : 24)}" fill="#8B6F47"/>
    <path d="M 4 ${tall ? 24 : 18} L ${w - 4} ${tall ? 24 : 18} L ${w - 8} 8 L 8 8 Z" fill="${color}"/>
  </svg>`;
}

function renderRug(item) {
  const { size, color } = item;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="${size.w / 2}" cy="${size.h / 2}" rx="${size.w / 2 - 4}" ry="${size.h / 2 - 4}" fill="${color}" opacity="0.85"/>
    <ellipse cx="${size.w / 2}" cy="${size.h / 2}" rx="${size.w / 2 - 12}" ry="${size.h / 2 - 10}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
  </svg>`;
}

function renderTv(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="8" width="${w - 12}" height="${h - 20}" rx="5" fill="${color}"/>
    <rect x="12" y="14" width="${w - 24}" height="${h - 30}" rx="3" fill="#4FC3F7"/>
    <rect x="${w * 0.35}" y="${h - 10}" width="${w * 0.3}" height="6" rx="2" fill="#555"/>
  </svg>`;
}

function renderFridge(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="8" y="4" width="${w - 16}" height="${h - 8}" rx="6" fill="${color}" stroke="#BDBDBD"/>
    <line x1="8" y1="${h * 0.35}" x2="${w - 8}" y2="${h * 0.35}" stroke="#BDBDBD" stroke-width="2"/>
    <rect x="${w - 16}" y="12" width="3" height="10" rx="1" fill="#9E9E9E"/>
    <rect x="${w - 16}" y="${h * 0.42}" width="3" height="12" rx="1" fill="#9E9E9E"/>
  </svg>`;
}

function renderStove(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="8" width="${w - 12}" height="${h - 14}" rx="4" fill="${color}"/>
    <circle cx="${w * 0.3}" cy="20" r="7" fill="#333"/>
    <circle cx="${w * 0.7}" cy="20" r="7" fill="#333"/>
    <rect x="12" y="32" width="${w - 24}" height="${h - 40}" rx="3" fill="#333"/>
  </svg>`;
}

function renderCabinet(item) {
  const { size, color } = item;
  return `<svg viewBox="0 0 ${size.w} ${size.h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(size.w, size.h)}
    <rect x="8" y="6" width="${size.w - 16}" height="${size.h - 12}" rx="4" fill="${color}"/>
    <line x1="${size.w / 2}" y1="8" x2="${size.w / 2}" y2="${size.h - 8}" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
    <circle cx="${size.w * 0.35}" cy="${size.h / 2}" r="3" fill="#FFD166"/>
    <circle cx="${size.w * 0.65}" cy="${size.h / 2}" r="3" fill="#FFD166"/>
  </svg>`;
}

function renderSink(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  if (variant === 'round') {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(w, h)}
      <ellipse cx="${w / 2}" cy="${h / 2 + 4}" rx="${w / 2 - 8}" ry="12" fill="${color}" stroke="#B0BEC5"/>
      <ellipse cx="${w / 2}" cy="${h / 2 + 6}" rx="${w / 2 - 14}" ry="7" fill="#CFD8DC"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="8" y="${h * 0.35}" width="${w - 16}" height="${h * 0.45}" rx="5" fill="${color}"/>
    <ellipse cx="${w / 2}" cy="${h * 0.42}" rx="${w / 2 - 14}" ry="8" fill="#CFD8DC"/>
    <rect x="${w / 2 - 3}" y="6" width="6" height="14" fill="#90A4AE"/>
    <circle cx="${w / 2}" cy="6" r="4" fill="#78909C"/>
  </svg>`;
}

function renderToilet(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  const modern = variant === 'modern' || variant === 'v3';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="12" y="6" width="${w - 24}" height="14" rx="${modern ? 6 : 3}" fill="${color}" stroke="#CFD8DC"/>
    <rect x="8" y="22" width="${w - 16}" height="${h - 30}" rx="${modern ? 10 : 8}" fill="${color}" stroke="#CFD8DC"/>
    <ellipse cx="${w / 2}" cy="30" rx="${w / 2 - 14}" ry="8" fill="#ECEFF1"/>
  </svg>`;
}

function renderBathtub(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  const corner = variant === 'corner' || variant === 'v3';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="14" width="${w - 12}" height="${h - 22}" rx="${corner ? 16 : 12}" fill="${color}" stroke="#B0BEC5" stroke-width="2"/>
    <ellipse cx="${w / 2}" cy="22" rx="${w / 2 - 16}" ry="8" fill="#E1F5FE"/>
    <circle cx="${w - 14}" cy="18" r="4" fill="#78909C"/>
  </svg>`;
}

function renderMirror(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  if (variant === 'round' || variant === 'v2') {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2 - 4}" fill="${color}" stroke="#8D6E63" stroke-width="4"/>
      <ellipse cx="${w / 2 - 6}" cy="${h / 2 - 6}" rx="6" ry="10" fill="rgba(255,255,255,0.45)"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="${w - 16}" height="${h - 12}" rx="${variant === 'oval' ? 20 : 6}" fill="${color}" stroke="#8D6E63" stroke-width="4"/>
    <ellipse cx="${w / 2 - 8}" cy="${h * 0.35}" rx="8" ry="14" fill="rgba(255,255,255,0.4)"/>
  </svg>`;
}

function renderTowelrack(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="${w - 12}" height="6" rx="3" fill="${color}"/>
    <rect x="10" y="16" width="${w - 36}" height="${h - 22}" rx="4" fill="#90CAF9"/>
    <rect x="${w - 26}" y="16" width="14" height="${h - 22}" rx="4" fill="#F48FB1"/>
  </svg>`;
}

function renderShower(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="8" width="${w - 20}" height="${h - 14}" rx="4" fill="${color}" opacity="0.7" stroke="#90CAF9"/>
    <circle cx="${w / 2}" cy="12" r="6" fill="#78909C"/>
    <line x1="${w / 2}" y1="18" x2="${w / 2}" y2="${h - 10}" stroke="#B0BEC5" stroke-width="2" stroke-dasharray="4 3"/>
  </svg>`;
}

function renderDesk(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="18" width="${w - 12}" height="10" rx="4" fill="${color}"/>
    <rect x="10" y="26" width="8" height="${h - 32}" rx="2" fill="${darken(color)}"/>
    <rect x="${w - 18}" y="26" width="8" height="${h - 32}" rx="2" fill="${darken(color)}"/>
    <rect x="${w * 0.32}" y="4" width="${w * 0.36}" height="16" rx="2" fill="#333"/>
  </svg>`;
}

function renderWardrobe(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="8" y="4" width="${w - 16}" height="${h - 8}" rx="4" fill="${color}"/>
    <line x1="${w / 2}" y1="6" x2="${w / 2}" y2="${h - 6}" stroke="rgba(0,0,0,0.12)"/>
    <circle cx="${w * 0.35}" cy="${h / 2}" r="3" fill="#FFD166"/>
    <circle cx="${w * 0.65}" cy="${h / 2}" r="3" fill="#FFD166"/>
  </svg>`;
}

function renderNightstand(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="12" width="${w - 12}" height="${h - 18}" rx="4" fill="${color}"/>
    <rect x="10" y="20" width="${w - 20}" height="8" rx="2" fill="${darken(color)}"/>
    <circle cx="${w / 2}" cy="8" r="5" fill="#FFD166"/>
  </svg>`;
}

function renderToybox(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="10" width="${w - 12}" height="${h - 16}" rx="6" fill="${color}"/>
    <text x="${w / 2}" y="${h / 2 + 6}" text-anchor="middle" font-size="18">🧸</text>
  </svg>`;
}

function renderSwing(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="4" width="6" height="${h - 8}" fill="#8B4513"/>
    <rect x="${w - 16}" y="4" width="6" height="${h - 8}" fill="#8B4513"/>
    <rect x="8" y="4" width="${w - 16}" height="6" fill="#8B4513"/>
    <line x1="20" y1="10" x2="20" y2="${h * 0.55}" stroke="#8B4513" stroke-width="2"/>
    <line x1="${w - 20}" y1="10" x2="${w - 20}" y2="${h * 0.55}" stroke="#8B4513" stroke-width="2"/>
    <rect x="14" y="${h * 0.55}" width="${w - 28}" height="10" rx="4" fill="${color}"/>
  </svg>`;
}

function renderSandbox(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="4" y="12" width="${w - 8}" height="${h - 16}" rx="6" fill="#8B6F47"/>
    <rect x="8" y="16" width="${w - 16}" height="${h - 24}" rx="4" fill="${color}"/>
  </svg>`;
}

function renderPool(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  if (variant === 'round' || variant === 'v0') {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(w, h)}
      <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 8}" ry="${h / 2 - 8}" fill="${color}" stroke="#0288D1" stroke-width="3"/>
      <ellipse cx="${w / 2 - 12}" cy="${h / 2 - 6}" rx="16" ry="6" fill="rgba(255,255,255,0.35)"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="6" y="10" width="${w - 12}" height="${h - 18}" rx="8" fill="${color}" stroke="#0288D1" stroke-width="3"/>
    <ellipse cx="${w / 2}" cy="${h / 2 - 4}" rx="${w / 2 - 20}" ry="8" fill="rgba(255,255,255,0.35)"/>
  </svg>`;
}

function renderClimbing(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  if (variant === 'net' || variant === 'v1') {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${shadow(w, h)}
      <rect x="12" y="8" width="8" height="${h - 16}" fill="#8B4513"/>
      <rect x="${w - 20}" y="8" width="8" height="${h - 16}" fill="#8B4513"/>
      <line x1="20" y1="20" x2="${w - 20}" y2="40" stroke="${color}" stroke-width="2"/>
      <line x1="20" y1="40" x2="${w - 20}" y2="60" stroke="${color}" stroke-width="2"/>
      <line x1="20" y1="60" x2="${w - 20}" y2="80" stroke="${color}" stroke-width="2"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="${h - 20}" width="${w - 20}" height="12" rx="4" fill="#8B4513"/>
    <rect x="14" y="30" width="10" height="40" rx="3" fill="${color}"/>
    <rect x="${w - 24}" y="20" width="10" height="50" rx="3" fill="#42A5F5"/>
    <rect x="${w / 2 - 8}" y="10" width="16" height="50" rx="3" fill="#FFD166"/>
  </svg>`;
}

function renderSlide(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="8" width="8" height="${h - 16}" fill="#8B4513"/>
    <path d="M 18 16 L ${w - 14} ${h - 20} L ${w - 14} ${h - 12} L 18 28 Z" fill="${color}"/>
    <rect x="${w - 22}" y="${h - 24}" width="12" height="14" rx="3" fill="#8B4513"/>
  </svg>`;
}

function renderTrampoline(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 8}" ry="${h / 2 - 6}" fill="none" stroke="#555" stroke-width="3"/>
    <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 14}" ry="${h / 2 - 10}" fill="${color}" opacity="0.85"/>
  </svg>`;
}

function renderTree(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="${w / 2 - 5}" y="${h * 0.55}" width="10" height="${h * 0.38}" fill="#8B4513"/>
    <circle cx="${w / 2}" cy="${h * 0.35}" r="${w * 0.35}" fill="${color}"/>
    <circle cx="${w * 0.3}" cy="${h * 0.42}" r="${w * 0.22}" fill="${lighten(color)}"/>
  </svg>`;
}

function renderFlowers(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <line x1="${w * 0.25}" y1="${h - 6}" x2="${w * 0.25}" y2="${h * 0.35}" stroke="#52B788" stroke-width="2"/>
    <circle cx="${w * 0.25}" cy="${h * 0.3}" r="8" fill="${color}"/>
    <line x1="${w * 0.55}" y1="${h - 6}" x2="${w * 0.55}" y2="${h * 0.25}" stroke="#52B788" stroke-width="2"/>
    <circle cx="${w * 0.55}" cy="${h * 0.2}" r="9" fill="${lighten(color)}"/>
    <line x1="${w * 0.8}" y1="${h - 6}" x2="${w * 0.8}" y2="${h * 0.38}" stroke="#52B788" stroke-width="2"/>
    <circle cx="${w * 0.8}" cy="${h * 0.33}" r="7" fill="${color}"/>
  </svg>`;
}

function renderDoghouse(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="${h * 0.42}" width="${w - 20}" height="${h * 0.5}" fill="${color}"/>
    <path d="M 6 ${h * 0.42} L ${w / 2} ${h * 0.12} L ${w - 6} ${h * 0.42}" fill="${darken(color)}"/>
    <rect x="${w * 0.38}" y="${h * 0.58}" width="${w * 0.24}" height="${h * 0.28}" rx="8" fill="#5C4033"/>
  </svg>`;
}

function renderBench(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="8" y="14" width="${w - 16}" height="10" rx="4" fill="${color}"/>
    <rect x="12" y="22" width="6" height="${h - 28}" rx="2" fill="${darken(color)}"/>
    <rect x="${w - 18}" y="22" width="6" height="${h - 28}" rx="2" fill="${darken(color)}"/>
  </svg>`;
}

function renderGrill(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="10" y="16" width="${w - 20}" height="${h - 28}" rx="6" fill="${color}"/>
    <rect x="14" y="22" width="${w - 28}" height="8" rx="2" fill="#333"/>
    <rect x="14" y="8" width="${w - 28}" height="8" rx="3" fill="#555"/>
  </svg>`;
}

function renderPlant(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="${w * 0.3}" y="${h * 0.62}" width="${w * 0.4}" height="${h * 0.3}" rx="4" fill="#8B4513"/>
    <ellipse cx="${w / 2}" cy="${h * 0.42}" rx="${w * 0.38}" ry="${h * 0.28}" fill="${color}"/>
  </svg>`;
}

function renderPoster(item) {
  const { size, color, variant } = item;
  const w = size.w;
  const h = size.h;
  const label = variant === 'heart' ? '♥' : variant === 'stars' ? '★' : '♥';
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="4" fill="${color}"/>
    <text x="${w / 2}" y="${h / 2 + 6}" text-anchor="middle" font-size="20" fill="white">${label}</text>
  </svg>`;
}

function renderPicture(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="3" fill="#8D6E63"/>
    <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="2" fill="${color}"/>
    <circle cx="${w / 2}" cy="${h * 0.55}" r="8" fill="#FFD166" opacity="0.8"/>
  </svg>`;
}

function renderClock(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2 - 4}" fill="${color}" stroke="#8D6E63" stroke-width="3"/>
    <line x1="${w / 2}" y1="${h / 2}" x2="${w / 2}" y2="${h * 0.3}" stroke="#333" stroke-width="2"/>
    <line x1="${w / 2}" y1="${h / 2}" x2="${w * 0.65}" y2="${h / 2}" stroke="#333" stroke-width="2"/>
  </svg>`;
}

function renderVase(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <path d="M ${w * 0.35} ${h - 8} L ${w * 0.3} ${h * 0.45} L ${w * 0.7} ${h * 0.45} L ${w * 0.65} ${h - 8} Z" fill="${color}"/>
    <circle cx="${w / 2}" cy="${h * 0.32}" r="6" fill="#FF8FAB"/>
  </svg>`;
}

function renderShelf(item) {
  const { size, color } = item;
  const w = size.w;
  const h = size.h;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${shadow(w, h)}
    <rect x="8" y="8" width="${w - 16}" height="6" rx="2" fill="${color}"/>
    <rect x="8" y="${h / 2 - 3}" width="${w - 16}" height="6" rx="2" fill="${color}"/>
    <rect x="8" y="${h - 16}" width="${w - 16}" height="6" rx="2" fill="${color}"/>
    <rect x="10" y="8" width="4" height="${h - 16}" fill="${darken(color)}"/>
    <rect x="${w - 14}" y="8" width="4" height="${h - 16}" fill="${darken(color)}"/>
  </svg>`;
}

function darken(hex) {
  if (!hex || hex.length < 7) return '#6D4C41';
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lighten(hex) {
  if (!hex || hex.length < 7) return '#E0E0E0';
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + 35);
  const g = Math.min(255, ((n >> 8) & 0xff) + 35);
  const b = Math.min(255, (n & 0xff) + 35);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}