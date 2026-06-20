/**
 * In-app changelog
 *
 * SHIPPED_UPDATES  = done, shown as "Hotovo ✅"
 * PENDING_FEEDBACK = next round only, shown as "Připravujeme 🔄"
 * Never mix the two before shipping.
 */

export const APP_VERSION = '1.1.0';
export const NEXT_VERSION = '1.2.0';
const SEEN_KEY = 'toca-groca-seen-update';

/** Shipped — Round 1 (v1.1.0) */
export const SHIPPED_UPDATES = [
  {
    id: 'round-1',
    version: '1.1.0',
    date: '20. 6. 2026',
    title: 'Díky za vaše hlasy! 🎤',
    intro: 'Táta poslouchal vaše WhatsApp zprávy a spolu s AI jsme hru vylepšili. Tady je, co jsme opravili:',
    from: 'Anetka, Taníčka, Ríša & spol.',
    items: [
      { feedback: 'Nemůžeme přesouvat postavy', fix: 'Teď už můžete táhnout prstem — drž a posuň!', status: 'done' },
      { feedback: 'Postavy vypadají hrozně', fix: 'Nové roztomilejší postavy s velkýma očima — víc jako Toca Boca', status: 'done' },
      { feedback: 'Chybí Líza', fix: 'Líza je v obýváku na začátku i v rodině 👨‍👩‍👧‍👦', status: 'done' },
      { feedback: 'Puffy má být zrzavý', fix: 'Puffy je teď správně zrzavý Shiba Inu 🦊', status: 'done' },
      { feedback: 'Cookie = velká bílá kočka', fix: 'Cookie je větší a bílá — ne hnědá!', status: 'done' },
      { feedback: 'Dart = bílý pudl', fix: 'Dart je velký nadýchaný bílý pudl 🐩', status: 'done' },
      { feedback: 'Líza = malá šedá kočka', fix: 'Líza je malá a šedá — jiná než Cookie', status: 'done' },
      { feedback: 'Klárka dělá roboty', fix: 'Klárka má robota 🤖 a u stolu staví roboty!', status: 'done' },
      { feedback: 'Místnosti posouvat jako Toca Boca', fix: 'Posouvej prstem doleva/doprava mezi místnostmi ‹ ›', status: 'done' },
      { feedback: 'Chceme tapety a jinou podlahu', fix: 'Tlačítko 🎨 — vyber tapetu pro každou místnost', status: 'done' },
      { feedback: 'Chceme různé domy', fix: 'Nový dům 🏡 Chalupa — přepni nahoře u 🏠', status: 'done' },
      { feedback: 'Chceme měnit oblečení', fix: 'Klepni na postavu → dole vyber barvu trička', status: 'done' },
      { feedback: 'Málo věcí a interiérů', fix: 'Víc hraček, robot, kostky, koruna a víc nábytku', status: 'done' },
      { feedback: 'Pořád to není jako Toca Boca', fix: 'Pracujeme na tom! Brzy přidáme vaše vlastní kresby 🎨', status: 'ongoing' }
    ]
  }
];

/**
 * Next round — add NEW feedback here only.
 * Clear this array when round ships (move items into SHIPPED_UPDATES).
 */
export const PENDING_FEEDBACK = [];

export const PENDING_META = {
  version: NEXT_VERSION,
  title: 'Připravujeme další update 🔄',
  intro: 'Táta čeká na vaše nové hlasy! Až něco pošlete, objeví se to tady — ještě před tím, než to opravíme.',
  emptyMessage: 'Zatím žádné nové přání. Pošlete Tátovi hlasovou zprávu! 🎤'
};

/** @deprecated use SHIPPED_UPDATES */
export const UPDATE_ROUNDS = SHIPPED_UPDATES;

function renderShippedRound(round) {
  return `
    <section class="update-round update-round--shipped">
      <div class="update-round-header">
        <span class="update-badge update-badge--shipped">Hotovo v${round.version}</span>
        <span class="update-date">${round.date}</span>
      </div>
      <h4 class="update-title">${round.title}</h4>
      <p class="update-intro">${round.intro}</p>
      ${round.from ? `<p class="update-from">💬 Od: ${round.from}</p>` : ''}
      <ul class="update-list">
        ${round.items.map(item => `
          <li class="update-item update-item--${item.status}">
            <div class="update-feedback">
              <span class="update-icon">${item.status === 'done' ? '✅' : '🔄'}</span>
              <span class="update-you">Vy jste říkali:</span>
              <strong>${item.feedback}</strong>
            </div>
            <div class="update-fix">
              <span class="update-we">My jsme udělali:</span>
              ${item.fix}
            </div>
          </li>
        `).join('')}
      </ul>
    </section>`;
}

function renderPendingSection() {
  const meta = PENDING_META;
  const items = PENDING_FEEDBACK;

  if (items.length === 0) {
    return `
      <section class="update-round update-round--pending">
        <div class="update-round-header">
          <span class="update-badge update-badge--pending">Připravujeme v${meta.version}</span>
        </div>
        <h4 class="update-title">${meta.title}</h4>
        <p class="update-intro">${meta.intro}</p>
        <p class="update-empty">${meta.emptyMessage}</p>
      </section>`;
  }

  return `
    <section class="update-round update-round--pending">
      <div class="update-round-header">
        <span class="update-badge update-badge--pending">Připravujeme v${meta.version}</span>
      </div>
      <h4 class="update-title">${meta.title}</h4>
      <p class="update-intro">${meta.intro}</p>
      <ul class="update-list">
        ${items.map(item => `
          <li class="update-item update-item--pending">
            <div class="update-feedback">
              <span class="update-icon">🎤</span>
              <span class="update-you">Nové — vy jste říkali:</span>
              <strong>${item.feedback}</strong>
            </div>
            ${item.note ? `<p class="update-pending-note">${item.note}</p>` : ''}
          </li>
        `).join('')}
      </ul>
      <p class="update-pending-hint">Ještě na tom pracujeme — brzy v aktualizaci ${meta.version}!</p>
    </section>`;
}

export function renderUpdatesHTML() {
  const shipped = SHIPPED_UPDATES.map(renderShippedRound).join('');
  const pending = renderPendingSection();
  return `
    <div class="updates-section-label">✅ Hotové aktualizace</div>
    ${shipped}
    <div class="updates-section-label updates-section-label--pending">🔄 Příští update (v${NEXT_VERSION})</div>
    ${pending}`;
}

export function hasUnseenUpdates() {
  return localStorage.getItem(SEEN_KEY) !== APP_VERSION;
}

export function markUpdatesSeen() {
  localStorage.setItem(SEEN_KEY, APP_VERSION);
}

export function buildUpdatesPanel() {
  const list = document.getElementById('updates-list');
  if (!list) return;
  list.innerHTML = renderUpdatesHTML();
}

export function openUpdatesDrawer() {
  const { toggleDrawer } = window.__tocaGroca || {};
  if (toggleDrawer) toggleDrawer('updates-drawer');
  markUpdatesSeen();
  hideUpdatesBadge();
}

export function hideUpdatesBadge() {
  document.querySelectorAll('.updates-badge-dot').forEach(el => el.hidden = true);
}

export function showUpdatesBadge() {
  if (!hasUnseenUpdates()) return;
  document.querySelectorAll('.updates-badge-dot').forEach(el => el.hidden = false);
}

export function maybeShowUpdatesOnLaunch() {
  if (!hasUnseenUpdates()) return;
  setTimeout(() => {
    openUpdatesDrawer();
    const { showToast } = window.__tocaGroca || {};
    if (showToast) showToast('Novinky! Podívejte se, co jsme opravili ✨');
  }, 600);
}