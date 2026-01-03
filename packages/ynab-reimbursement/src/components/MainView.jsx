import React from 'react';
import { milliunitsToDisplayAmount, formatMonth, getCurrentMonth } from '../utils.js';

export const MainView = ({
  reimbursementData,
  warnings,
  onOpenConfig,
  onOpenConfigTab,
  availableMonths,
  selectedMonth,
  onMonthChange,
  onFetchTransactions,
  selectedBudgetId,
  transactions
}) => {
  const {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    reimbursementAmount,
    reimbursementDirection,
    categorySummary,
    warnings: transactionWarnings
  } = reimbursementData;

  const hisTotal = hisTotalShared + hisTotalForHer;
  const herTotal = herTotalShared + herTotalForHim;
  const total = hisTotal + herTotal;

  const currentMonthIndex = availableMonths.findIndex(m => m.month === selectedMonth);
  const isFirstMonth = currentMonthIndex === 0;
  const isLastMonth = currentMonthIndex === availableMonths.length - 1;
  const currentMonth = getCurrentMonth();
  const isCurrentMonth = currentMonth === selectedMonth;

  const goToPreviousMonth = () => {
    if (availableMonths.length === 0 || isLastMonth) return;
    onMonthChange(availableMonths[currentMonthIndex + 1].month);
  };

  const goToNextMonth = () => {
    if (availableMonths.length === 0 || isFirstMonth) return;
    onMonthChange(availableMonths[currentMonthIndex - 1].month);
  };

  const goToCurrentMonth = () => {
    if (availableMonths.length === 0) return;
    const exists = availableMonths.some(m => m.month === currentMonth);
    onMonthChange(exists ? currentMonth : availableMonths[0].month);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">YNAB Reimbursement Report</h1>
        <button
          onClick={onOpenConfig}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Open Configuration"
        >
          ⚙️
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
            ⚠️ Configuration Warnings
          </h2>
          <p className="mb-2 text-sm">
            Please fix the following issues before calculations can be performed:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {warnings.map((warning, index) => (
              <li key={index}>
                {warning.message}{' '}
                <button
                  onClick={() => {
                    onOpenConfig();
                    onOpenConfigTab(warning.tabToFix);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Fix
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length === 0 && transactionWarnings.length > 0 && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
            ⚠️ Transaction Warnings
          </h2>
          <p className="mb-2 text-sm">
            Some transactions have issues that need to be fixed directly in YNAB:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {transactionWarnings.map((warning, index) => (
              <li key={index} className="mb-2">
                <div>{warning.message}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {warning.details}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousMonth}
            disabled={isLastMonth}
            className={`px-3 py-1 ${
              isLastMonth
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } rounded`}
          >
            ← Prev
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold">{formatMonth(selectedMonth)}</h2>
          </div>

          <div className="flex">
            <button
              onClick={goToCurrentMonth}
              disabled={availableMonths.length === 0 || isCurrentMonth}
              className={`px-3 py-1 ${
                availableMonths.length === 0 || isCurrentMonth
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'
              } rounded mr-2`}
            >
              Current
            </button>
            <button
              onClick={goToNextMonth}
              disabled={isFirstMonth}
              className={`px-3 py-1 ${
                isFirstMonth
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } rounded`}
            >
              Next →
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={onFetchTransactions}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded flex items-center"
            disabled={!selectedBudgetId || !selectedMonth}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Import Transactions
          </button>
        </div>
      </div>

      {warnings.length === 0 ? (
        <>
          {transactions.length === 0 ? (
            <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
              <p className="text-lg mb-4">No transactions imported yet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click the "Import Transactions" button above to load transactions for the selected month.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">His Spending</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Spent on shared categories:</span>
                      <span className="font-semibold">£{milliunitsToDisplayAmount(hisTotalShared)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spent on her categories:</span>
                      <span className="font-semibold">£{milliunitsToDisplayAmount(hisTotalForHer)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-400 mb-2">Her Spending</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Spent on shared categories:</span>
                      <span className="font-semibold">£{milliunitsToDisplayAmount(herTotalShared)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spent on his categories:</span>
                      <span className="font-semibold">£{milliunitsToDisplayAmount(herTotalForHim)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Reimbursement Due
                  </h3>
                  <span
                    className="ml-2 cursor-help text-green-600 dark:text-green-400"
                    title="Makes sure shared costs are split 50/50 and accounts for when one person paid for the other's personal expenses."
                  >
                    ℹ️
                  </span>
                </div>

                <div className="text-center py-3">
                  <div className="text-2xl font-bold mb-2">
                    <span
                      className="cursor-help"
                      title={`(£${milliunitsToDisplayAmount(hisTotalShared)} + £${milliunitsToDisplayAmount(herTotalShared)}) ÷ 2 - £${milliunitsToDisplayAmount(hisTotalShared)} + (£${milliunitsToDisplayAmount(herTotalForHim)} - £${milliunitsToDisplayAmount(hisTotalForHer)})`}
                    >
                      {reimbursementDirection === 'herToHim'
                        ? `£${milliunitsToDisplayAmount(reimbursementAmount)} - She should pay Him`
                        : `£${milliunitsToDisplayAmount(reimbursementAmount)} - He should pay Her`
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                    Budget Refill Required
                  </h3>
                  <span
                    className="ml-2 cursor-help text-yellow-600 dark:text-yellow-400"
                    title="Personal spending from shared accounts needs to be reimbursed back to the shared budget. This ensures only agreed-upon shared expenses remain in the shared budget."
                  >
                    ℹ️
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>She should refill:</span>
                    <span className="font-semibold">£{milliunitsToDisplayAmount(hisTotalForHer + herTotalForHer)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>He should refill:</span>
                    <span className="font-semibold">£{milliunitsToDisplayAmount(herTotalForHim + hisTotalForHim)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Shared Spending by Category</h3>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="text-left p-2 border border-gray-300 dark:border-gray-600">Category</th>
                        <th className="text-right p-2 border border-gray-300 dark:border-gray-600">His Spending</th>
                        <th className="text-right p-2 border border-gray-300 dark:border-gray-600">Her Spending</th>
                        <th className="text-right p-2 border border-gray-300 dark:border-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        categorySummary.reduce((acc, cat) => {
                          if (!acc[cat.groupId]) {
                            acc[cat.groupId] = { groupName: cat.groupName, categories: [] };
                          }
                          acc[cat.groupId].categories.push(cat);
                          return acc;
                        }, {})
                      ).map(([groupId, group]) => {
                        const groupHisTotal = group.categories.reduce((sum, cat) => sum + cat.hisSpending, 0);
                        const groupHerTotal = group.categories.reduce((sum, cat) => sum + cat.herSpending, 0);
                        const groupTotal = groupHisTotal + groupHerTotal;

                        return (
                          <React.Fragment key={groupId}>
                            <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                              <td className="p-2 border border-gray-300 dark:border-gray-600">{group.groupName}</td>
                              <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(groupHisTotal)}</td>
                              <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(groupHerTotal)}</td>
                              <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(groupTotal)}</td>
                            </tr>

                            {group.categories.map(category => {
                              const catTotal = category.hisSpending + category.herSpending;
                              if (catTotal > 0) {
                                return (
                                  <tr key={category.categoryId}>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 pl-6">{category.categoryName}</td>
                                    <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(category.hisSpending)}</td>
                                    <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(category.herSpending)}</td>
                                    <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(catTotal)}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                          </React.Fragment>
                        );
                      })}

                      <tr className="font-bold">
                        <td className="p-2 border border-gray-300 dark:border-gray-600">Grand Total</td>
                        <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(hisTotal)}</td>
                        <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(herTotal)}</td>
                        <td className="text-right p-2 border border-gray-300 dark:border-gray-600">£{milliunitsToDisplayAmount(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg">
            Please fix the configuration warnings to view the reimbursement report.
          </p>
        </div>
      )}
    </div>
  );
};
