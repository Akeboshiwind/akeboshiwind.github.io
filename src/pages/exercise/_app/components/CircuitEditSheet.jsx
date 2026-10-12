import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet.jsx';
import { Field, inputClass } from './Field.jsx';

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
              data-variant="danger"
              className="pixel-button py-2"
            >
              Remove
            </button>
          )}
          <button type="submit" data-variant="primary" className="pixel-button ml-auto py-2">
            Save
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}

function clamp(v, lo, hi) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
