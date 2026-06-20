/** In-app changelog — mirrors feedback/FEEDBACK.md for the kids */

export const APP_VERSION = '1.1.0';
const SEEN_KEY = 'toca-groca-seen-update';

export const UPDATE_ROUNDS = [
  {
    id: 'round-1',
    date: '20. 6. 2026',
    title: 'Díky za vaše hlasy! 🎤',
    intro: 'Táta poslouchal vaše WhatsApp zprávy a spolu s AI jsme hru vylepšili. Tady je, co jsme opravili:',
    from: 'Anetka, Taníčka, Ríša & spol.',
    items: [
      {
        feedback: 'Nemůžeme přesouvat postavy',
        fix: 'Teď už můžete táhnout prstem — drž a posuň!',
        status: 'done'
      },
      {
        feedback: 'Postavy vypadají hrozně',
        fix: 'Nové roztomilejší postavy s velkýma očima — víc jako Toca Boca',
        status: 'done'
      },
      {
        feedback: 'Chybí Líza',
        fix: 'Líza je v obýváku na začátku i v rodině 👨‍👩‍👧‍👦',
        status: 'done'
      },
      {
        feedback: 'Puffy má být zrzavý',
        fix: 'Puffy je teď správně zrzavý Shiba Inu 🦊',
        status: 'done'
      },
      {
        feedback: 'Cookie = velká bílá kočka',
        fix: 'Cookie je větší a bílá — ne hnědá!',
        status: 'done'
      },
      {
        feedback: 'Dart = bílý pudl',
        fix: 'Dart je velký nadýchaný bílý pudl 🐩',
        status: 'done'
      },
      {
        feedback: 'Líza = malá šedá kočka',
        fix: 'Líza je malá a šedá — jiná než Cookie',
        status: 'done'
      },
      {
        feedback: 'Klárka dělá roboty',
        fix: 'Klárka má robota 🤖 a u stolu staví roboty!',
        status: 'done'
      },
      {
        feedback: 'Místnosti posouvat jako Toca Boca',
        fix: 'Posouvej prstem doleva/doprava mezi místnostmi ‹ ›',
        status: 'done'
      },
      {
        feedback: 'Chceme tapety a jinou podlahu',
        fix: 'Tlačítko 🎨 — vyber tapetu pro každou místnost',
        status: 'done'
      },
      {
        feedback: 'Chceme různé domy',
        fix: 'Nový dům 🏡 Chalupa — přepni nahoře u 🏠',
        status: 'done'
      },
      {
        feedback: 'Chceme měnit oblečení',
        fix: 'Klepni na postavu → dole vyber barvu trička',
        status: 'done'
      },
      {
        feedback: 'Málo věcí a interiérů',
        fix: 'Víc hraček, robot, kostky, koruna a víc nábytku',
        status: 'done'
      },
      {
        feedback: 'Pořád to není jako Toca Boca',
        fix: 'Pracujeme na tom! Brzy přidáme vaše vlastní kresby 🎨',
        status: 'ongoing'
      }
    ]
  }
];

export function hasUnseenUpdates() {
  return localStorage.getItem(SEEN_KEY) !== APP_VERSION;
}

export function markUpdatesSeen() {
  localStorage.setItem(SEEN_KEY, APP_VERSION);
}

export function renderUpdatesHTML() {
  return UPDATE_ROUNDS.map(round => `
    <section class="update-round">
      <div class="update-round-header">
        <span class="update-badge">Aktualizace ${APP_VERSION}</span>
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
    </section>
  `).join('');
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