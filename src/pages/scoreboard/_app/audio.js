let audioCtx = null;

// iOS requires AudioContext creation/resume inside a user gesture, so we
// lazily initialise on the first interaction anywhere on the page.
export function ensureAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return;
  }
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = new Ctx();
    // Play a silent buffer to fully unlock audio on iOS
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(audioCtx.destination);
    src.start(0);
  } catch { /* unsupported */ }
}

export function tone(freq, startOffset, duration, type = 'square', volume = 0.32) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.012);
  gain.gain.setValueAtTime(volume, t + Math.max(0, duration - 0.05));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

// Three short pips followed by a long horn — classic sports buzzer feel
export function buzzer(soundEnabled) {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  tone(880, 0.00, 0.16, 'square', 0.28);
  tone(880, 0.24, 0.16, 'square', 0.28);
  tone(880, 0.48, 0.16, 'square', 0.28);
  tone(523, 0.78, 1.10, 'sawtooth', 0.34);
  tone(262, 0.78, 1.10, 'square',   0.18);
}
