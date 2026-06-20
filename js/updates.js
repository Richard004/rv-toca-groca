/**
 * In-app changelog
 *
 * SHIPPED_UPDATES  = done, shown as "Hotovo ✅"
 * PENDING_FEEDBACK = next round only, shown as "Připravujeme 🔄"
 * Never mix the two before shipping.
 */

export const APP_VERSION = '1.6.3';
export const NEXT_VERSION = '1.7.0';
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
  },
  {
    id: 'round-2',
    version: '1.2.0',
    date: '20. 6. 2026',
    title: 'Lepší hra na mobilu! 📱',
    intro: 'Hrajete na telefonu — tak jsme udělali celou obrazovku, aby vám nepřekážela lišta prohlížeče.',
    from: 'Táta (testování na mobilu)',
    items: [
      { feedback: 'Na mobilu překáží lišta prohlížeče — chceme celou obrazovku', fix: 'Tlačítko ⛶ nahoře = celá obrazovka. Na iPhonu: Sdílet → Přidat na plochu 📲', status: 'done' }
    ]
  },
  {
    id: 'round-3',
    version: '1.3.0',
    date: '20. 6. 2026',
    title: 'Obrovský katalog nábytku! 🪑',
    intro: 'Teď můžete zařídit celý dům — židle, vany, bazén, prolézačky a všechno ostatní!',
    from: 'Rodina',
    items: [
      { feedback: 'Chceme všechny druhy nábytku ve všech místnostech', fix: 'Přes 130 věcí! 🎁 → vyber místnost → druh → konkrétní kus', status: 'done' },
      { feedback: 'Na zahradě chybí prolézačky, houpačky, bazén…', fix: 'Zahrada má bazén 🏊 prolézačku 🧗 skluzavku 🛝 trampolínu a víc', status: 'done' },
      { feedback: 'Chybí koupelna — vana, záchod, umyvadlo…', fix: 'Nová místnost 🛁 Koupelna + vše do katalogu', status: 'done' },
      { feedback: 'Ať si člověk vybere: koupelna → záchod → jaký záchod', fix: '3 kroky v katalogu — místnost, druh, barva/tvar', status: 'done' },
      { feedback: 'Různé barvy a tvary, ať to jde přesouvat', fix: 'Každá věc má varianty barev — táhni kam chceš!', status: 'done' }
    ]
  },
  {
    id: 'round-4',
    version: '1.4.0',
    date: '20. 6. 2026',
    title: 'Emoce a jídlo! 😊🍎',
    intro: 'Postavičky teď umí být šťastné, smutné i zamilované — a taky jíst a pít!',
    from: 'Rodina',
    items: [
      { feedback: 'Chceme zvolit emoce — šťastná, smutná…', fix: 'Klepni na postavu → dole 😊 Emoce — usměje se, zapláče…', status: 'done' },
      { feedback: 'Postavičky mají umět jíst a pít', fix: '🍎 Jídlo → přetáhni k puse — „Anetka snědla mrkev!“', status: 'done' },
      { feedback: 'Jídlo dát do ledničky', fix: 'Přetáhni jídlo k lednici v kuchyni 🧊 — uloží se tam', status: 'done' },
      { feedback: 'Hezká animace jedení', fix: 'Pusa se hýbe při jídle + veselá zpráva nahoře 😋', status: 'done' }
    ]
  },
  {
    id: 'round-5',
    version: '1.5.0',
    date: '20. 6. 2026',
    title: 'Prázdný dům + celá obrazovka! 🏠',
    intro: 'Jako v Toca Boca — prázdné místnosti a celá obrazovka na mobilu. Žádné lišty navrchu!',
    from: 'Rodina',
    items: [
      { feedback: 'Místnosti mají být prázdné jako v Toca Boca', fix: 'Všechny pokoje začínají prázdné — zařiď si je sám!', status: 'done' },
      { feedback: 'Nábytek a stromy musí jít přesouvat a odstraňovat', fix: 'Vše přidáš z 🎁 — táhni, 2× klepnutí = pryč. Nic není natvrdo', status: 'done' },
      { feedback: 'Na mobilu je polovina obrazovky panely — chceme scénu', fix: 'Celá obrazovka = hra! Ovládání jen jako overlay', status: 'done' },
      { feedback: 'Nový elegantní mobilní layout', fix: '＋ tlačítko dole • místnost nahoře • tečky pro přepínání', status: 'done' }
    ]
  },
  {
    id: 'round-6',
    version: '1.6.0',
    date: '20. 6. 2026',
    title: 'Pan v místnosti + mapa světa! 🌍',
    intro: 'Teď je to víc jako Toca Boca — širší místnosti na prozkoumání a letadlo na cestu do Chalupy!',
    from: 'Táta (srovnání s Toca Boca)',
    items: [
      { feedback: 'V Toca Boca se dá posouvat uvnitř místnosti doleva/doprava', fix: 'Táhni prstem po prázdné podlaze — místnost je širší, objevíš víc prostoru!', status: 'done' },
      { feedback: 'V Toca Boca je mapa světa a cestování letadlem', fix: '🌍 Mapa světa nahoře — vyber dům nebo Chalupu, přiletí letadlo ✈️', status: 'done' },
      { feedback: 'Na kraji místnosti chceme přejít do dalšího pokoje', fix: 'Na kraji panování swipe pokračuje do sousední místnosti ‹ ›', status: 'done' }
    ]
  },
  {
    id: 'round-6b',
    version: '1.6.1',
    date: '20. 6. 2026',
    title: 'Vždy nová verze po reloadu! 🔄',
    intro: 'Na mobilu už nemusíte dělat tvrdý reload — jedno obnovení stránky stáhne všechno nanovo.',
    from: 'Táta (programátor)',
    items: [
      { feedback: 'Děti na telefonu nemůžou vynutit hard reload — míchají se staré CSS/JS', fix: 'Fingerprint verze: jeden reload = vždy celá nová verze. V nástrojích i 🔄 Aktualizovat', status: 'done' }
    ]
  },
  {
    id: 'round-6c',
    version: '1.6.2',
    date: '20. 6. 2026',
    title: 'Oprava Let\'s Play! ▶️',
    intro: 'Po cache updatu nešlo spustit hru — teď už zase funguje.',
    from: 'Táta (programátor)',
    items: [
      { feedback: 'Let\'s Play nic nedělá', fix: 'Opraveno načítání aplikace po boot loaderu — tlačítko zase funguje', status: 'done' },
      { feedback: 'Špatná škála místnosti vs. věcí při zoomu', fix: 'Postavy a nábytek se počítají ze stejné velikosti místnosti jako pozadí', status: 'done' }
    ]
  },
  {
    id: 'round-6d',
    version: '1.6.3',
    date: '20. 6. 2026',
    title: 'Místnost na celou výšku! 📱',
    intro: 'Na telefonu na výšku už se místnost nezmenšuje — vyplní celou obrazovku a do stran se posouváš.',
    from: 'Táta (programátor)',
    items: [
      { feedback: 'Na výšku se široká místnost zmenšuje na šířku místo výřezu', fix: 'Výška = celý telefon, šířka = výřez — táhni doleva/doprava a objevíš zbytek', status: 'done' }
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
  intro: 'Pošlete Tátovi další hlasovou zprávu — nová přání se objeví tady, než je opravíme.',
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