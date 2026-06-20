import { BUILDINGS, getBuildingById } from './rooms.js';

let travelHandler = null;

export function initWorldMap(onTravel) {
  travelHandler = onTravel;
  buildWorldMapUI();
}

function buildWorldMapUI() {
  const list = document.getElementById('world-map-list');
  if (!list) return;

  list.innerHTML = BUILDINGS.map(b => `
    <button type="button" class="world-map-card" data-building="${b.id}">
      <span class="world-map-icon">${b.icon}</span>
      <span class="world-map-name">${b.name}</span>
      <span class="world-map-meta">${b.rooms.length} místností</span>
    </button>`).join('');

  list.querySelectorAll('.world-map-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if (travelHandler) travelHandler(btn.dataset.building);
    });
  });
}

export function updateWorldMapActive(buildingId) {
  document.querySelectorAll('.world-map-card').forEach(card => {
    card.classList.toggle('active', card.dataset.building === buildingId);
  });
}

export function playTravelAnimation(fromBuildingId, toBuildingId, onComplete) {
  const from = getBuildingById(fromBuildingId);
  const to = getBuildingById(toBuildingId);
  const overlay = document.getElementById('travel-overlay');

  if (!overlay) {
    onComplete();
    return;
  }

  overlay.innerHTML = `
    <div class="travel-scene">
      <div class="travel-clouds" aria-hidden="true"></div>
      <div class="travel-route">
        <span class="travel-from">${from.icon}<small>${from.name}</small></span>
        <span class="travel-plane" role="img" aria-label="Letadlo">✈️</span>
        <span class="travel-to">${to.icon}<small>${to.name}</small></span>
      </div>
      <p class="travel-caption">Letíme do ${to.name}…</p>
    </div>`;

  overlay.hidden = false;
  overlay.classList.remove('travel-active');
  void overlay.offsetWidth;
  overlay.classList.add('travel-active');

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    overlay.classList.remove('travel-active');
    overlay.hidden = true;
    onComplete();
  };

  setTimeout(done, 2400);
}