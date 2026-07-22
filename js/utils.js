function formatKm(value) {
  return `${Number(value || 0).toFixed(1)} km`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export { formatKm, formatDate, toIsoDate, safeNumber };
