function exportBackup(state) {
  return JSON.stringify(state, null, 2);
}

function importBackup(content) {
  const parsed = JSON.parse(content);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Backup non valido');
  }

  return {
    startKm: Number(parsed.startKm || 0),
    entries: Array.isArray(parsed.entries) ? parsed.entries : []
  };
}

export { exportBackup, importBackup };
