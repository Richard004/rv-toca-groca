const STORAGE_KEY = 'toca-groca-save';
const VERSION = 2;

export function getDefaultState() {
  return {
    version: VERSION,
    currentBuilding: 'home',
    currentRoom: 'living',
    roomThemes: {},
    entities: [],
    savedAt: Date.now()
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const state = JSON.parse(raw);
    if (!state.version) return getDefaultState();
    return state;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  state.savedAt = Date.now();
  state.version = VERSION;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Export save as JSON blob for ZIP */
export function exportSaveData(state) {
  return {
    game: 'toca-groca',
    version: VERSION,
    exportedAt: new Date().toISOString(),
    state
  };
}

/** Download backup as ZIP */
export async function downloadBackup(state) {
  const data = exportSaveData(state);
  const json = JSON.stringify(data, null, 2);

  if (typeof JSZip !== 'undefined') {
    const zip = new JSZip();
    zip.file('toca-groca-save.json', json);
    zip.file('readme.txt', [
      'Toca Groca — Family World Save',
      'Made with love by Tata Richard',
      '',
      'To restore: open the game and tap the 📂 button, then select this ZIP or the JSON file.',
      `Saved: ${data.exportedAt}`
    ].join('\n'));

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, `toca-groca-backup-${formatDate()}.zip`);
  } else {
    const blob = new Blob([json], { type: 'application/json' });
    triggerDownload(blob, `toca-groca-backup-${formatDate()}.json`);
  }
}

/** Import backup from file */
export async function importBackup(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    const jsonFile = zip.file('toca-groca-save.json');
    if (!jsonFile) throw new Error('ZIP does not contain toca-groca-save.json');
    const text = await jsonFile.async('text');
    return parseSaveData(text);
  }

  if (name.endsWith('.json')) {
    const text = await file.text();
    return parseSaveData(text);
  }

  throw new Error('Please select a .zip or .json backup file');
}

function parseSaveData(text) {
  const data = JSON.parse(text);
  if (data.game && data.state) return data.state;
  if (data.version && data.entities) return data;
  throw new Error('Invalid save file format');
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}