import { useEffect, useReducer, useRef } from 'react';
import { splitIntoChunks } from './chunking.js';
import { generateSpeech } from './speech.js';
import { runChunk, runPool, CONCURRENCY_LIMIT, RETRY_DELAYS } from './generation.js';
import { playableCount, totalPlayableDuration, globalPosition, locate } from './timeline.js';

function audioDuration(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
    audio.addEventListener('error', () => resolve(0));
    audio.src = url;
  });
}

/**
 * One generation of chunked speech and its continuous playback through a single <audio>.
 * The audio element's events need the latest state synchronously, so the session lives in a
 * mutable model and React only re-renders from it.
 */
export function useSession(settingsRef, { retryDelays = RETRY_DELAYS } = {}) {
  const audioRef = useRef(null);
  const [, rerender] = useReducer((n) => n + 1, 0);
  const model = useRef({ run: 0, chunks: [], index: 0, playing: false, waiting: false, rate: 1, position: 0 }).current;

  const audio = () => audioRef.current;

  function playCurrent() {
    const chunk = model.chunks[model.index];
    if (!chunk || chunk.status !== 'completed') {
      model.waiting = true;
      rerender();
      return;
    }
    const el = audio();
    el.src = chunk.audioUrl;
    el.playbackRate = model.rate;
    el.oncanplaythrough = () => {
      el.oncanplaythrough = null;
      el.play().catch((err) => {
        console.error('Playback failed:', err);
        model.playing = false;
        rerender();
      });
    };
    model.playing = true;
    rerender();
  }

  function resumeIfWaiting() {
    if (model.waiting && model.playing && playableCount(model.chunks) > 0) {
      model.waiting = false;
      playCurrent();
    }
  }

  function generateChunk(id) {
    const run = model.run;
    const update = (patch) => {
      if (model.run !== run) return;
      model.chunks = model.chunks.map((c) => (c.id === id ? { ...c, ...patch } : c));
      rerender();
      if (patch.status === 'completed') resumeIfWaiting();
    };
    return runChunk(async () => {
      const { apiKey, voice, instructions } = settingsRef.current;
      const text = model.chunks.find((c) => c.id === id).text;
      const audioBlob = await generateSpeech(apiKey, text, voice, instructions);
      const audioUrl = URL.createObjectURL(audioBlob);
      const duration = await audioDuration(audioUrl);
      return { audioBlob, audioUrl, duration };
    }, update, { delays: retryDelays });
  }

  function generate(text) {
    model.chunks.forEach((c) => c.audioUrl && URL.revokeObjectURL(c.audioUrl));
    model.run++;
    model.chunks = splitIntoChunks(text);
    model.index = 0;
    model.playing = false;
    model.waiting = false;
    model.position = 0;
    const el = audio();
    if (el) {
      el.pause();
      el.removeAttribute('src');
    }
    rerender();
    return runPool(model.chunks.map((c) => c.id), CONCURRENCY_LIMIT, generateChunk);
  }

  function retry(id) {
    model.chunks = model.chunks.map((c) => (c.id === id ? { ...c, status: 'pending', retryCount: 0 } : c));
    rerender();
    return generateChunk(id);
  }

  function playFrom(index) {
    if (model.chunks[index]?.status !== 'completed') return;
    model.index = index;
    playCurrent();
  }

  function togglePlay() {
    const el = audio();
    if (model.playing) {
      el.pause();
      model.playing = false;
      rerender();
    } else if (el.getAttribute('src') && el.readyState >= 2) {
      el.play().then(() => {
        model.playing = true;
        rerender();
      }).catch((err) => console.error('Playback failed:', err));
    } else {
      playCurrent();
    }
  }

  function pause() {
    audio()?.pause();
    model.playing = false;
    rerender();
  }

  function seek(globalTime) {
    const target = locate(model.chunks, globalTime);
    if (!target) return;
    const { index, offset } = target;
    const el = audio();
    if (index !== model.index) {
      model.index = index;
      el.src = model.chunks[index].audioUrl;
      el.oncanplaythrough = () => {
        el.oncanplaythrough = null;
        el.currentTime = offset;
        if (model.playing) el.play().catch((err) => console.error('Seek play failed:', err));
        rerender();
      };
    } else {
      el.currentTime = offset;
    }
  }

  const position = () => globalPosition(model.chunks, model.index, audio()?.currentTime);
  const total = () => totalPlayableDuration(model.chunks);

  function skip(seconds) {
    seek(Math.min(total(), Math.max(0, position() + seconds)));
  }

  function seekFraction(fraction) {
    seek(fraction * total());
  }

  function setRate(rate) {
    model.rate = rate;
    if (audio()) audio().playbackRate = rate;
    rerender();
  }

  useEffect(() => {
    const el = audio();
    if (!el) return undefined;
    const onEnded = () => {
      const next = model.index + 1;
      if (next < playableCount(model.chunks)) {
        model.index = next;
        playCurrent();
      } else if (next < model.chunks.length) {
        model.waiting = true;
        rerender();
      } else {
        model.playing = false;
        model.index = 0;
        rerender();
      }
    };
    const onTime = () => {
      model.position = position();
      rerender();
    };
    el.addEventListener('ended', onEnded);
    el.addEventListener('timeupdate', onTime);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('timeupdate', onTime);
    };
  }, []);

  return {
    audioRef,
    chunks: model.chunks,
    index: model.index,
    playing: model.playing,
    waiting: model.waiting,
    rate: model.rate,
    position: model.position,
    total: total(),
    hasAudio: playableCount(model.chunks) > 0,
    generate,
    retry,
    playFrom,
    togglePlay,
    pause,
    skip,
    seekFraction,
    setRate,
  };
}
