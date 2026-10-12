import React from 'react';
import { milliunitsToDisplayAmount, formatMonth, getCurrentMonth } from '../utils.js';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import slidersIcon from 'pixelarticons/svg/sliders.svg?raw';
import reloadIcon from 'pixelarticons/svg/reload.svg?raw';

const amount = 'font-pixel text-pixel-md tabular-nums whitespace-nowrap';
const cellAmount = 'font-pixel text-pixel sm:text-pixel-md tabular-nums whitespace-nowrap';

const Row = ({ label, children, className = '' }) => (
  <div className={`flex justify-between items-baseline gap-4 py-1.5 pixel-line ${className}`}>
    <span>{label}</span>
    <span className={amount}>{children}</span>
  </div>
);

const Warnings = ({ title, children }) => (
  <section className="pixel-panel border-danger p-3">
    <h2 className="label text-danger mb-2">{title}</h2>
    {children}
  </section>
);

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
  transactions,
  currencySymbol = '£'
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

  const money = (milliunits) => `${currencySymbol}${milliunitsToDisplayAmount(milliunits)}`;

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

  const groups = Object.entries(
    categorySummary.reduce((acc, cat) => {
      if (!acc[cat.groupId]) {
        acc[cat.groupId] = { groupName: cat.groupName, categories: [] };
      }
      acc[cat.groupId].categories.push(cat);
      return acc;
    }, {})
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="page-title mt-4 mb-2">YNAB Reimbursement Report</h1>
          <p className="page-sub m-0">Who owes whom for a month of shared spending.</p>
        </div>
        <button onClick={onOpenConfig} className="pixel-button mt-4" aria-label="Open Configuration">
          <Icon svg={slidersIcon} className="w-4 h-4" />
        </button>
      </div>

      {warnings.length > 0 && (
        <Warnings title="Configuration Warnings">
          <p className="mb-2">Please fix the following issues before calculations can be performed:</p>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex justify-between items-baseline gap-4">
                <span>{warning.message}</span>
                <button
                  onClick={() => {
                    onOpenConfig();
                    onOpenConfigTab(warning.tabToFix);
                  }}
                  className="pixel-button"
                >
                  Fix
                </button>
              </li>
            ))}
          </ul>
        </Warnings>
      )}

      {warnings.length === 0 && transactionWarnings.length > 0 && (
        <Warnings title="Transaction Warnings">
          <p className="mb-2">Some transactions have issues that need to be fixed directly in YNAB:</p>
          <ul className="space-y-2">
            {transactionWarnings.map((warning, index) => (
              <li key={index}>
                <div>{warning.message}</div>
                <div className="label opacity-60 normal-case tracking-normal mt-0.5">{warning.details}</div>
              </li>
            ))}
          </ul>
        </Warnings>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousMonth} disabled={isLastMonth} className="pixel-button">← Prev</button>
          <h2 className="flex-1 text-center font-pixel text-pixel-md text-heading m-0">{formatMonth(selectedMonth)}</h2>
          <button onClick={goToNextMonth} disabled={isFirstMonth} className="pixel-button">Next →</button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={goToCurrentMonth}
            disabled={availableMonths.length === 0 || isCurrentMonth}
            className="pixel-button"
          >
            Current
          </button>
          <button
            onClick={onFetchTransactions}
            className="pixel-button flex items-center gap-2"
            data-variant="primary"
            disabled={!selectedBudgetId || !selectedMonth}
          >
            <Icon svg={reloadIcon} className="w-4 h-4" />
            Import Transactions
          </button>
        </div>
      </section>

      {warnings.length === 0 ? (
        transactions.length === 0 ? (
          <div className="pixel-panel p-6 text-center">
            <p className="label text-heading mb-2">No transactions imported yet</p>
            <p className="m-0">Click the "Import Transactions" button above to load transactions for the selected month.</p>
          </div>
        ) : (
          <>
            <section>
              <SectionLabel className="mb-3">Reimbursement Due</SectionLabel>
              <p
                className="font-pixel text-pixel-lg text-accent m-0 cursor-help"
                title={`(${money(hisTotalShared)} + ${money(herTotalShared)}) ÷ 2 - ${money(hisTotalShared)} + (${money(herTotalForHim)} - ${money(hisTotalForHer)})`}
              >
                {reimbursementDirection === 'herToHim'
                  ? `${money(reimbursementAmount)} - She should pay Him`
                  : `${money(reimbursementAmount)} - He should pay Her`
                }
              </p>
              <p className="label opacity-60 normal-case tracking-normal mt-1 mb-0">
                Makes sure shared costs are split 50/50 and accounts for when one person paid for the other's personal expenses.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <SectionLabel className="mb-1">His Spending</SectionLabel>
                <Row label="Spent on shared categories:">{money(hisTotalShared)}</Row>
                <Row label="Spent on her categories:">{money(hisTotalForHer)}</Row>
              </section>
              <section>
                <SectionLabel className="mb-1">Her Spending</SectionLabel>
                <Row label="Spent on shared categories:">{money(herTotalShared)}</Row>
                <Row label="Spent on his categories:">{money(herTotalForHim)}</Row>
              </section>
            </div>

            <section>
              <SectionLabel className="mb-1">Budget Refill Required</SectionLabel>
              <Row label="She should refill:">{money(hisTotalForHer + herTotalForHer)}</Row>
              <Row label="He should refill:">{money(herTotalForHim + hisTotalForHim)}</Row>
              <p className="label opacity-60 normal-case tracking-normal mt-1 mb-0">
                Personal spending from shared accounts needs to be reimbursed back to the shared budget.
              </p>
            </section>

            <section>
              <SectionLabel className="mb-3">Shared Spending by Category</SectionLabel>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="label text-heading pixel-line">
                      <th className="p-1 sm:p-2 font-normal text-left">Category</th>
                      <th className="p-1 sm:p-2 font-normal text-right">His</th>
                      <th className="p-1 sm:p-2 font-normal text-right">Her</th>
                      <th className="p-1 sm:p-2 font-normal text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map(([groupId, group]) => {
                      const groupHisTotal = group.categories.reduce((sum, cat) => sum + cat.hisSpending, 0);
                      const groupHerTotal = group.categories.reduce((sum, cat) => sum + cat.herSpending, 0);

                      return (
                        <React.Fragment key={groupId}>
                          <tr className="pixel-line text-heading">
                            <td className="p-1 sm:p-2 label">{group.groupName}</td>
                            <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(groupHisTotal)}</td>
                            <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(groupHerTotal)}</td>
                            <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(groupHisTotal + groupHerTotal)}</td>
                          </tr>

                          {group.categories.map(category => {
                            const catTotal = category.hisSpending + category.herSpending;
                            if (catTotal <= 0) return null;
                            return (
                              <tr key={category.categoryId} className="pixel-line">
                                <td className="p-1 sm:p-2 pl-3 sm:pl-4">{category.categoryName}</td>
                                <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(category.hisSpending)}</td>
                                <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(category.herSpending)}</td>
                                <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(catTotal)}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}

                    <tr className="text-heading">
                      <td className="p-1 sm:p-2 label">Grand Total</td>
                      <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(hisTotal)}</td>
                      <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(herTotal)}</td>
                      <td className={`p-1 sm:p-2 text-right ${cellAmount}`}>{money(total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )
      ) : (
        <p className="text-center">Please fix the configuration warnings to view the reimbursement report.</p>
      )}
    </div>
  );
};
