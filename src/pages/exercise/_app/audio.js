// Web Audio beep helpers. Synthesised tones — no asset download, works offline.
// First call lazily creates the AudioContext (must be in a user gesture for
// browsers' autoplay policies to allow it).

let ctx = null;

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const tone = ({ frequency, duration, volume = 0.2, delay = 0 }) => {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
};

export const phaseEndBeep = () => {
  tone({ frequency: 880, duration: 0.2 });
};

export const finalBeep = () => {
  tone({ frequency: 880, duration: 0.18 });
  tone({ frequency: 1175, duration: 0.28, delay: 0.2 });
};

// Prime the audio context on first user gesture so later beeps are reliable.
export const primeAudio = () => {
  getCtx();
};
