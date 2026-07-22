const STORAGE_KEY = 'kmtrack-state';

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { startKm: 0, entries: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      startKm: Number(parsed.startKm || 0),
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    };
  } catch (error) {
    console.warn('Unable to read storage state', error);
    return { startKm: 0, entries: [] };
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  writeState({ startKm: 0, entries: [] });
}

export { STORAGE_KEY, readState, writeState, resetState };
