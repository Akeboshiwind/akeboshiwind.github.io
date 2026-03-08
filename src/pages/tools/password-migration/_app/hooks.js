import { useState, useEffect, useCallback, useRef } from 'react';

const VAULT_KEY = 'passwordMigration_vault';
const PROGRESS_KEY = 'passwordMigration_progress';

const EMPTY_PROGRESS = {
  // Non-sensitive entry metadata for rendering without vault
  // { [bitwarden_id]: { name, type, folder_name } }
  manifest: {},
  dispositions: {},
  fieldStatuses: {},
  userNotes: {},
  pinnedId: null,
  applePasswordsReported: null,
};

// Vault: sessionStorage (sensitive, dies with tab)

export function useVault() {
  const [vault, setVaultState] = useState(() => {
    try {
      const stored = sessionStorage.getItem(VAULT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setVault = useCallback((entries) => {
    setVaultState(entries);
    if (entries) {
      try {
        sessionStorage.setItem(VAULT_KEY, JSON.stringify(entries));
      } catch {
        // Quota exceeded — vault lives in memory only, won't survive refresh
      }
    } else {
      sessionStorage.removeItem(VAULT_KEY);
    }
  }, []);

  return [vault, setVault];
}

// Progress: localStorage (non-sensitive, persists across sessions)

export function useProgress() {
  const [progress, setProgressState] = useState(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? { ...EMPTY_PROGRESS, ...JSON.parse(stored) } : EMPTY_PROGRESS;
    } catch {
      return EMPTY_PROGRESS;
    }
  });

  const saveTimer = useRef(null);

  const setProgress = useCallback((updater) => {
    setProgressState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
        } catch {
          // quota exceeded — progress not saved, but app still works
        }
      }, 300);
      return next;
    });
  }, []);

  return [progress, setProgress];
}

// Clear everything

export function clearAll() {
  sessionStorage.removeItem(VAULT_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
