import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVault, useProgress, clearAll } from './hooks.js';

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe('useVault', () => {
  it('returns null when nothing stored', () => {
    const { result } = renderHook(() => useVault());
    expect(result.current[0]).toBeNull();
  });

  it('stores vault in sessionStorage', () => {
    const { result } = renderHook(() => useVault());
    act(() => result.current[1]([{ id: '1' }]));
    expect(result.current[0]).toEqual([{ id: '1' }]);
    expect(JSON.parse(sessionStorage.getItem('passwordMigration_vault'))).toEqual([{ id: '1' }]);
    expect(localStorage.getItem('passwordMigration_vault')).toBeNull();
  });

  it('reads existing vault from sessionStorage', () => {
    sessionStorage.setItem('passwordMigration_vault', JSON.stringify([{ id: '2' }]));
    const { result } = renderHook(() => useVault());
    expect(result.current[0]).toEqual([{ id: '2' }]);
  });
});

describe('useProgress', () => {
  it('returns empty progress when nothing stored', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current[0].dispositions).toEqual({});
    expect(result.current[0].pinnedId).toBeNull();
  });

  it('stores progress in localStorage', () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current[1](prev => ({ ...prev, pinnedId: 'abc' })));
    expect(result.current[0].pinnedId).toBe('abc');
    const stored = JSON.parse(localStorage.getItem('passwordMigration_progress'));
    expect(stored.pinnedId).toBe('abc');
    expect(sessionStorage.getItem('passwordMigration_progress')).toBeNull();
  });
});

describe('clearAll', () => {
  it('removes both vault and progress', () => {
    sessionStorage.setItem('passwordMigration_vault', 'data');
    localStorage.setItem('passwordMigration_progress', 'data');
    clearAll();
    expect(sessionStorage.getItem('passwordMigration_vault')).toBeNull();
    expect(localStorage.getItem('passwordMigration_progress')).toBeNull();
  });
});
