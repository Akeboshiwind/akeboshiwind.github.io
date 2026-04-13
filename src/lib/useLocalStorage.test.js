import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage.js';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('returns stored value when localStorage has data', () => {
    localStorage.setItem('key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  test('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    act(() => { result.current[1]('updated'); });
    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('key'))).toBe('updated');
  });

  test('uses prefix when provided', () => {
    const { result } = renderHook(() =>
      useLocalStorage('key', 'initial', { prefix: 'app_' })
    );
    act(() => { result.current[1]('value'); });
    expect(JSON.parse(localStorage.getItem('app_key'))).toBe('value');
    expect(localStorage.getItem('key')).toBeNull();
  });

  test('falls back to initial value if JSON parse fails', () => {
    localStorage.setItem('key', 'not-json{');
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });
});
