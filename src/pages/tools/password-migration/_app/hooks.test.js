import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './hooks.js';

beforeEach(() => localStorage.clear());

describe('useLocalStorage', () => {
  it('returns initial value when nothing stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    act(() => result.current[1]('updated'));
    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('passwordMigration_key'))).toBe('updated');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('passwordMigration_key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });
});
