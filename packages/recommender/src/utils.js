export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getPhase(list) {
  const reviewed = list.recommendations.filter(r => r.status !== 'pending').length;
  if (reviewed < 10) return 'exploring';
  if (reviewed < 25) return 'refining';
  return 'honing';
}

export function getPhaseLabel(phase) {
  return {
    exploring: 'Exploring',
    refining: 'Refining',
    honing: 'Honing',
  }[phase] || phase;
}

export function getPhaseDescription(phase) {
  return {
    exploring: 'Getting a broad sense of your preferences',
    refining: 'Narrowing in on what you enjoy',
    honing: 'Fine-tuned to your exact taste',
  }[phase] || '';
}

export function getPendingCount(list) {
  return list.recommendations.filter(r => r.status === 'pending').length;
}

export function getReviewedCount(list) {
  return list.recommendations.filter(r => r.status !== 'pending').length;
}
