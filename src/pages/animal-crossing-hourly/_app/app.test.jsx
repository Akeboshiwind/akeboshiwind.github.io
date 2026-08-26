import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';

const { players, FakePlayer } = vi.hoisted(() => {
  const players = [];

  // Stands in for YT.Player: records the calls the app makes and drives the
  // same onStateChange callbacks the real player would.
  class FakePlayer {
    constructor(host, opts) {
      this.opts = opts;
      this.state = -1;
      this.time = 0;
      this.calls = [];
      players.push(this);
      setTimeout(() => opts.events.onReady({ target: this }), 0);
    }
    getPlayerState() { return this.state; }
    getCurrentTime() { return this.time; }
    seekTo(seconds) { this.calls.push(['seekTo', seconds]); this.time = seconds; }
    playVideo() { this.calls.push(['playVideo']); this.#transition(1); }
    pauseVideo() { this.calls.push(['pauseVideo']); this.#transition(2); }
    loadVideoById(args) {
      this.calls.push(['loadVideoById', args]);
      this.time = args.startSeconds;
      this.#transition(1);
    }
    destroy() {}
    #transition(state) {
      this.state = state;
      this.opts.events.onStateChange({ data: state, target: this });
    }
  }

  return { players, FakePlayer };
});

vi.mock('./player.js', async (importOriginal) => ({
  ...(await importOriginal()),
  loadYouTubeApi: () => Promise.resolve({ Player: FakePlayer }),
}));

const { App } = await import('./app.jsx');

const settle = () => act(async () => { await vi.advanceTimersByTimeAsync(10); });

// The theme toggle is a button too, so always ask for this one by name.
const transport = () => screen.getByRole('button', { name: /^(Pause|Play )/ });
const transportLabel = () => transport().getAttribute('aria-label');

const renderApp = async () => {
  render(<App />);
  await settle();
  return players[players.length - 1];
};

beforeEach(() => {
  players.length = 0;
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 20));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Animal Crossing Hourly', () => {
  test('renders without crashing', async () => {
    await renderApp();
    expect(screen.getByText('Animal Crossing Hourly')).toBeTruthy();
  });

  test('has a home link', async () => {
    await renderApp();
    expect(screen.getByText('← Home').closest('a').getAttribute('href')).toBe('../');
  });

  test('creates the player with the current hour and an http origin', async () => {
    const player = await renderApp();
    expect(player.opts.videoId).toBe('PjGfsuEgF6g');
    expect(player.opts.playerVars.origin).toMatch(/^https?:\/\//);
  });

  test('shows the current hour on the play button and the clock position', async () => {
    await renderApp();
    expect(transportLabel()).toBe('Play 2 PM in sync');
    expect(screen.getByText('30:20 / 60:00')).toBeTruthy();
  });

  test('play loads the current hour at the clock offset', async () => {
    const player = await renderApp();
    await act(async () => {
      fireEvent.click(transport());
    });
    expect(player.calls).toEqual([
      ['loadVideoById', { videoId: 'PjGfsuEgF6g', startSeconds: 1820 }],
    ]);
    expect(transportLabel()).toBe('Pause');
  });

  test('the button pauses while the video is playing', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });
    await act(async () => { fireEvent.click(transport()); });

    expect(player.calls.at(-1)).toEqual(['pauseVideo']);
    expect(transportLabel()).toBe('Play 2 PM in sync');
  });

  test('pausing from the player itself flips the button back to play', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });
    await act(async () => { player.opts.events.onStateChange({ data: 2, target: player }); });

    expect(transportLabel()).toBe('Play 2 PM in sync');
  });

  test('play after a pause re-syncs to where the clock has got to', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });
    await act(async () => { fireEvent.click(transport()); });

    vi.setSystemTime(new Date(2026, 0, 1, 14, 45, 0));
    player.calls.length = 0;
    await act(async () => { fireEvent.click(transport()); });

    expect(player.calls).toEqual([['seekTo', 45 * 60], ['playVideo']]);
  });

  test('leaves a paused player alone instead of reseeking every tick', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });
    await act(async () => { fireEvent.click(transport()); });

    player.calls.length = 0;
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(player.calls).toEqual([]);
  });

  test('nudges a playing video back when it drifts from the clock', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });

    player.calls.length = 0;
    player.time = 0; // as if the viewer scrubbed to the start
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });

    expect(player.calls).toEqual([['seekTo', 1821]]);
  });

  test('tolerates sub-second drift without seeking', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });

    player.calls.length = 0;
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    player.time = 1822; // one second of clock, one second of playback
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });

    expect(player.calls).toEqual([]);
  });

  test('rolls over to the next hour mid-playback', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });

    vi.setSystemTime(new Date(2026, 0, 1, 15, 0, 1));
    player.calls.length = 0;
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });

    expect(player.calls).toEqual([
      ['loadVideoById', { videoId: 'AA_pu-2Omtg', startSeconds: 1 }],
    ]);
  });

  test('restarts on the next hour when a video runs out', async () => {
    const player = await renderApp();
    await act(async () => { fireEvent.click(transport()); });

    vi.setSystemTime(new Date(2026, 0, 1, 15, 0, 0));
    player.calls.length = 0;
    await act(async () => { player.opts.events.onStateChange({ data: 0, target: player }); });

    expect(player.calls).toEqual([
      ['loadVideoById', { videoId: 'AA_pu-2Omtg', startSeconds: 0 }],
    ]);
  });

  test('surfaces embed errors from the player', async () => {
    const player = await renderApp();
    await act(async () => { player.opts.events.onError({ data: 153, target: player }); });

    expect(screen.getByText(/rejected this page as an embed origin/)).toBeTruthy();
  });
});
