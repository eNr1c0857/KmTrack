import { readState } from './storage.js';
import { formatKm, safeNumber } from './utils.js';

function calculateStats(state = readState()) {
  const startKm = safeNumber(state.startKm);
  const entries = Array.isArray(state.entries) ? state.entries : [];
  const totalDistance = entries.reduce((sum, entry) => sum + safeNumber(entry.distance), 0);
  const todayDistance = entries.filter(entry => entry.date === new Date().toISOString().slice(0, 10)).reduce((sum, entry) => sum + safeNumber(entry.distance), 0);
  const average = entries.length ? totalDistance / entries.length : 0;

  return {
    startKm,
    totalDistance,
    todayDistance,
    average,
    entries
  };
}

function renderStats(elements, state = readState()) {
  const stats = calculateStats(state);
  elements.initialKmLabel.textContent = formatKm(stats.startKm);
  elements.todayLabel.textContent = formatKm(stats.todayDistance);
  elements.totalLabel.textContent = formatKm(stats.totalDistance + stats.startKm);
  elements.averageLabel.textContent = formatKm(stats.average);
}

export { calculateStats, renderStats };
