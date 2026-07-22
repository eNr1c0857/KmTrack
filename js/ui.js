import { formatDate, formatKm, safeNumber } from './utils.js';
import { buildDestinationSuggestions } from './autocomplete.js';

function renderEntries(listElement, emptyStateElement, entries) {
  listElement.innerHTML = '';

  if (!entries.length) {
    emptyStateElement.hidden = false;
    return;
  }

  emptyStateElement.hidden = true;
  entries.forEach(entry => {
    const item = document.createElement('article');
    item.className = 'entry-item';
    item.innerHTML = `
      <div>
        <strong>${entry.destination}</strong>
        <div class="entry-meta">${formatDate(entry.date)} • ${formatKm(entry.distance)}</div>
      </div>
      <span>${formatKm(entry.distance)}</span>
    `;
    listElement.appendChild(item);
  });
}

function updateDatalist(datalistElement, entries) {
  const suggestions = buildDestinationSuggestions(entries);
  datalistElement.innerHTML = suggestions.map(value => `<option value="${value}"></option>`).join('');
}

function setStatus(messageElement, text, type = '') {
  messageElement.textContent = text;
  messageElement.className = `status-message ${type}`.trim();
}

function toggleAuthViews(setupSection, appSection, hasStartKm) {
  if (!hasStartKm) {
    setupSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    return;
  }

  setupSection.classList.add('hidden');
  appSection.classList.remove('hidden');
}

export { renderEntries, updateDatalist, setStatus, toggleAuthViews };
