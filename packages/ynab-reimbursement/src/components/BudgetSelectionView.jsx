import React from 'react';

export const BudgetSelectionView = ({
  isLoading,
  error,
  budgets,
  onLogout,
  onBudgetSelect
}) => (
  <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">Select Your Budget</h2>

    {isLoading ? (
      <p>Loading budgets...</p>
    ) : error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button
          onClick={onLogout}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    ) : budgets.length === 0 ? (
      <p>No budgets found for this account.</p>
    ) : (
      <div className="space-y-2">
        {budgets.map(budget => (
          <div
            key={budget.id}
            onClick={() => onBudgetSelect(budget.id)}
            className="cursor-pointer p-3 border border-gray-200 rounded hover:bg-blue-50
                       dark:border-gray-700 dark:hover:bg-blue-900/20"
          >
            {budget.name}
          </div>
        ))}
      </div>
    )}

    <button
      onClick={onLogout}
      className="mt-4 text-sm text-gray-500 hover:text-gray-700"
    >
      Use a different token
    </button>
  </div>
);
