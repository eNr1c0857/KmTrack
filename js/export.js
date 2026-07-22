function exportCsv(entries) {
  const rows = entries.map(entry => `${entry.date};${entry.distance};${entry.destination}`);
  const content = ['date;distance;destination', ...rows].join('\n');
  return content;
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export { exportCsv, downloadText };
