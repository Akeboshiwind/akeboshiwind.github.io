import React from 'react';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';

export const BudgetSelectionView = ({
  isLoading,
  error,
  budgets,
  onLogout,
  onBudgetSelect
}) => (
  <section>
    <SectionLabel className="mb-3">Select Your Budget</SectionLabel>

    {isLoading ? (
      <p className="label">Loading budgets...</p>
    ) : error ? (
      <div className="pixel-alert flex flex-col items-start gap-2">
        <p className="m-0">{error}</p>
        <button onClick={onLogout} className="pixel-button" data-variant="danger">
          Logout
        </button>
      </div>
    ) : budgets.length === 0 ? (
      <p>No budgets found for this account.</p>
    ) : (
      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
        {budgets.map(budget => (
          <li key={budget.id}>
            <button onClick={() => onBudgetSelect(budget.id)} className="pixel-button w-full text-left py-2">
              {budget.name}
            </button>
          </li>
        ))}
      </ul>
    )}

    <button onClick={onLogout} className="pixel-button mt-4">
      Use a different token
    </button>
  </section>
);
