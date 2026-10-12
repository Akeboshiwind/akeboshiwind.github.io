import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { settleDissolves } from './dither-dom.js';

const fire = (el, type, animationName) =>
  el.dispatchEvent(new AnimationEvent(type, { animationName, bubbles: true }));

describe('settleDissolves', () => {
  let root;
  let el;

  beforeEach(() => {
    vi.useFakeTimers();
    root = document.createElement('div');
    el = document.createElement('div');
    el.style.animationDuration = '0.1s';
    root.append(el);
    document.body.append(root);
    settleDissolves(root);
  });

  afterEach(() => {
    root.remove();
    vi.useRealTimers();
  });

  it('records which way a dissolve ended', () => {
    fire(el, 'animationend', 'undither');
    expect(el.dataset.dissolved).toBe('in');
    fire(el, 'animationend', 'redither');
    expect(el.dataset.dissolved).toBe('out');
  });

  it('forgets the resting state when the next dissolve starts', () => {
    fire(el, 'animationend', 'undither');
    fire(el, 'animationstart', 'redither');
    expect(el.dataset.dissolved).toBeUndefined();
  });

  it('recognises a dissolve by name whatever its step count', () => {
    fire(el, 'animationend', 'undither-16');
    expect(el.dataset.dissolved).toBe('in');
  });

  it('ignores animations that are not dissolves', () => {
    fire(el, 'animationend', 'spin');
    expect(el.dataset.dissolved).toBeUndefined();
  });

  it('settles a dissolve whose end never arrives, once its duration has passed', () => {
    fire(el, 'animationstart', 'undither');
    vi.advanceTimersByTime(99);
    expect(el.dataset.dissolved).toBeUndefined();
    vi.advanceTimersByTime(200);
    expect(el.dataset.dissolved).toBe('in');
  });

  it('does not settle a dissolve that was reversed part-way', () => {
    fire(el, 'animationstart', 'undither');
    vi.advanceTimersByTime(50);
    fire(el, 'animationstart', 'redither');
    vi.advanceTimersByTime(60);
    expect(el.dataset.dissolved).toBeUndefined();
    vi.advanceTimersByTime(200);
    expect(el.dataset.dissolved).toBe('out');
  });
});
