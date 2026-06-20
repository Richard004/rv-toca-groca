import {
  initGame,
  toggleDrawer,
  closeDrawers,
  showToast,
  getGameState,
  restoreGameState
} from './game.js';
import { downloadBackup, importBackup } from './storage.js';
import {
  buildUpdatesPanel,
  openUpdatesDrawer,
  showUpdatesBadge,
  maybeShowUpdatesOnLaunch,
  markUpdatesSeen
} from './updates.js';
import { initFullscreen, onGameStarted } from './fullscreen.js';

window.__tocaGroca = { toggleDrawer, showToast };

document.addEventListener('DOMContentLoaded', () => {
  initFullscreen();
  buildUpdatesPanel();
  showUpdatesBadge();
  setupSplash();
  setupGameControls();
});

function setupSplash() {
  document.getElementById('btn-play').addEventListener('click', startGame);
  document.getElementById('btn-updates-splash').addEventListener('click', () => {
    document.getElementById('splash').classList.remove('active');
    document.getElementById('game').classList.add('active');
    if (!document.getElementById('game').dataset.inited) {
      initGame();
      document.getElementById('game').dataset.inited = '1';
    }
    onGameStarted();
    openUpdatesDrawer();
  });
}

function startGame() {
  document.getElementById('splash').classList.remove('active');
  document.getElementById('game').classList.add('active');
  const game = document.getElementById('game');
  if (!game.dataset.inited) {
    initGame();
    game.dataset.inited = '1';
  }
  showToast('Vítej v Toca Groca! 🏠❤️');
  onGameStarted();
  maybeShowUpdatesOnLaunch();
}

function openFromTools(drawerId) {
  closeDrawers();
  if (drawerId === 'updates-drawer') openUpdatesDrawer();
  else toggleDrawer(drawerId);
}

function setupGameControls() {
  document.getElementById('btn-home').addEventListener('click', () => {
    document.getElementById('game').classList.remove('active');
    document.getElementById('splash').classList.add('active');
    closeDrawers();
  });

  document.getElementById('btn-tools').addEventListener('click', () => {
    toggleDrawer('tools-drawer');
  });

  document.getElementById('btn-room-picker').addEventListener('click', () => {
    toggleDrawer('room-picker-drawer');
  });

  document.getElementById('btn-updates').addEventListener('click', () => {
    openFromTools('updates-drawer');
  });

  document.getElementById('btn-wallpaper').addEventListener('click', () => {
    openFromTools('wallpaper-drawer');
  });

  document.getElementById('btn-characters').addEventListener('click', () => {
    openFromTools('char-drawer');
  });

  document.getElementById('btn-items').addEventListener('click', () => {
    openFromTools('items-drawer');
  });

  document.getElementById('btn-food').addEventListener('click', () => {
    openFromTools('food-drawer');
  });

  document.querySelectorAll('.drawer-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close).classList.remove('open');
      if (btn.dataset.close === 'updates-drawer') markUpdatesSeen();
    });
  });

  document.getElementById('btn-save').addEventListener('click', async () => {
    try {
      await downloadBackup(getGameState());
      showToast('Záloha stažena! 💾');
    } catch (err) {
      showToast('Chyba při ukládání 😢');
      console.error(err);
    }
  });

  const fileInput = document.getElementById('file-input');
  document.getElementById('btn-load').addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const state = await importBackup(file);
      restoreGameState(state);
    } catch (err) {
      showToast('Neplatný soubor zálohy 😢');
      console.error(err);
    }
    fileInput.value = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawers();
  });
}