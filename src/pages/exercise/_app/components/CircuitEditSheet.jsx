import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet.jsx';

export function CircuitEditSheet({ open, onClose, circuit, onSave, onRemove }) {
  const [name, setName] = useState('');
  const [rounds, setRounds] = useState('3');
  const [betweenChild, setBetweenChild] = useState('15');
  const [betweenRound, setBetweenRound] = useState('60');

  useEffect(() => {
    if (!circuit) return;
    setName(circuit.name ?? '');
    setRounds(String(circuit.rounds ?? 3));
    setBetweenChild(String(circuit.betweenChildSec ?? 0));
    setBetweenRound(String(circuit.betweenRoundSec ?? 0));
  }, [circuit, open]);

  const submit = e => {
    e.preventDefault();
    if (!circuit) return;
    onSave({
      name: name.trim() || 'Circuit',
      rounds: clamp(rounds, 1, 99),
      betweenChildSec: clamp(betweenChild, 0, 600),
      betweenRoundSec: clamp(betweenRound, 0, 600),
    });
  };

  return (
    <BottomSheet open={open && !!circuit} onClose={onClose} title="Edit circuit">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Field label="Name">
          <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rounds">
            <input type="number" inputMode="numeric" value={rounds} onChange={e => setRounds(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Rest between (s)">
            <input type="number" inputMode="numeric" value={betweenChild} onChange={e => setBetweenChild(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Rest between rounds (s)">
            <input type="number" inputMode="numeric" value={betweenRound} onChange={e => setBetweenRound(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="flex gap-2 pt-2">
          {onRemove && (
            <button
              type="button"
              onClick={() => { if (confirm('Remove this circuit?')) onRemove(); }}
              className="px-3 py-2 rounded-md text-sm border border-red-500/40 text-red-700 dark:text-red-400"
            >
              Remove
            </button>
          )}
          <button type="submit" className="ml-auto px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium">
            Save
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
      {label}
      {children}
    </label>
  );
}

function clamp(v, lo, hi) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
