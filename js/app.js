import { readState, writeState, resetState } from './storage.js';
import { renderStats } from './statistics.js';
import { renderEntries, updateDatalist, setStatus, toggleAuthViews } from './ui.js';
import { exportCsv, downloadText } from './export.js';
import { exportBackup, importBackup } from './backup.js';
import { safeNumber, toIsoDate } from './utils.js';

const setupSection = document.getElementById('setupSection');
const appSection = document.getElementById('appSection');
const startKmInput = document.getElementById('startKm');
const saveStartBtn = document.getElementById('saveStartBtn');
const entryForm = document.getElementById('entryForm');
const distanceInput = document.getElementById('distance');
const destinationInput = document.getElementById('destination');
const listElement = document.getElementById('entriesList');
const emptyStateElement = document.getElementById('emptyState');
const statusMessage = document.getElementById('statusMessage');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importBackupBtn = document.getElementById('importBackupBtn');
const backupInput = document.getElementById('backupInput');
const clearDataBtn = document.getElementById('clearDataBtn');
const installButton = document.getElementById('installButton');
const destinationsDatalist = document.getElementById('destinations');
const initialKmLabel = document.getElementById('initialKmLabel');
const todayLabel = document.getElementById('todayLabel');
const totalLabel = document.getElementById('totalLabel');
const averageLabel = document.getElementById('averageLabel');
let deferredPrompt = null;

function loadApp() {
  const state = readState();
  toggleAuthViews(setupSection, appSection, Boolean(state.startKm));
  if (state.startKm) {
    startKmInput.value = state.startKm;
  }
  render();
}

function persistAndRender(nextState) {
  writeState(nextState);
  render(nextState);
}

function render(state = readState()) {
  renderStats({ initialKmLabel, todayLabel, totalLabel, averageLabel }, state);
  renderEntries(listElement, emptyStateElement, state.entries.slice().reverse());
  updateDatalist(destinationsDatalist, state.entries);
}

function saveStart() {
  const nextState = readState();
  nextState.startKm = safeNumber(startKmInput.value);
  persistAndRender(nextState);
  setStatus(statusMessage, 'Base salvata. Puoi iniziare a registrare i chilometri.', 'status-success');
  toggleAuthViews(setupSection, appSection, Boolean(nextState.startKm));
}

function addEntry(event) {
  event.preventDefault();
  const state = readState();
  const entry = {
    date: toIsoDate(),
    distance: safeNumber(distanceInput.value),
    destination: destinationInput.value.trim() || 'Generico'
  };

  if (!entry.distance) {
    setStatus(statusMessage, 'Inserisci un valore maggiore di zero.', 'status-error');
    return;
  }

  state.entries = [...state.entries, entry];
  persistAndRender(state);
  entryForm.reset();
  destinationInput.focus();
  setStatus(statusMessage, 'Registrazione aggiunta.', 'status-success');
}

function clearAllData() {
  resetState();
  toggleAuthViews(setupSection, appSection, false);
  render();
  setStatus(statusMessage, 'Dati cancellati.', 'status-warning');
}

function exportData() {
  const state = readState();
  const csv = exportCsv(state.entries);
  downloadText('kmtrack.csv', csv);
  setStatus(statusMessage, 'CSV esportato.', 'status-success');
}

function exportBackupData() {
  const state = readState();
  const content = exportBackup(state);
  downloadText('kmtrack-backup.json', content);
  setStatus(statusMessage, 'Backup scaricato.', 'status-success');
}

function importBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsedState = importBackup(reader.result);
      writeState(parsedState);
      render(parsedState);
      toggleAuthViews(setupSection, appSection, Boolean(parsedState.startKm));
      setStatus(statusMessage, 'Backup importato.', 'status-success');
    } catch (error) {
      setStatus(statusMessage, error.message || 'Backup non valido.', 'status-error');
    }
  };
  reader.readAsText(file);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}

function handleInstallPrompt(event) {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
}

function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    installButton.hidden = true;
  });
}

saveStartBtn.addEventListener('click', saveStart);
entryForm.addEventListener('submit', addEntry);
exportCsvBtn.addEventListener('click', exportData);
exportJsonBtn.addEventListener('click', exportBackupData);
importBackupBtn.addEventListener('click', () => backupInput.click());
backupInput.addEventListener('change', importBackupFile);
clearDataBtn.addEventListener('click', clearAllData);
installButton.addEventListener('click', installApp);
window.addEventListener('beforeinstallprompt', handleInstallPrompt);

loadApp();
registerServiceWorker();
