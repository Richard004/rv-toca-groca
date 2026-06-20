import {
  initGame,
  toggleDrawer,
  closeDrawers,
  showToast,
  getGameState,
  restoreGameState
} from './game.js';
import { downloadBackup, importBackup } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  setupSplash();
  setupGameControls();
});

function setupSplash() {
  document.getElementById('btn-play').addEventListener('click', startGame);
}

function startGame() {
  document.getElementById('splash').classList.remove('active');
  document.getElementById('game').classList.add('active');
  initGame();
  showToast('Vítej v Toca Groca! 🏠❤️');
}

function setupGameControls() {
  document.getElementById('btn-home').addEventListener('click', () => {
    document.getElementById('game').classList.remove('active');
    document.getElementById('splash').classList.add('active');
    closeDrawers();
  });

  document.getElementById('btn-wallpaper').addEventListener('click', () => {
    toggleDrawer('wallpaper-drawer');
  });

  document.getElementById('btn-characters').addEventListener('click', () => {
    toggleDrawer('char-drawer');
  });

  document.getElementById('btn-items').addEventListener('click', () => {
    toggleDrawer('items-drawer');
  });

  document.querySelectorAll('.drawer-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close).classList.remove('open');
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