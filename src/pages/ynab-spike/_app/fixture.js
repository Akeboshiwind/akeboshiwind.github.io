const cat = (groupId, groupName, categoryId, categoryName, his, her) =>
  ({ groupId, groupName, categoryId, categoryName, hisSpending: his * (globalThis.location?.search.includes("x10") ? 10 : 1), herSpending: her * (globalThis.location?.search.includes("x10") ? 10 : 1) });

export const props = {
  reimbursementData: {
    hisTotalShared: 1843_210,
    herTotalShared: 1265_400,
    hisTotalForHer: 42_990,
    herTotalForHim: 118_500,
    hisTotalForHim: 64_000,
    herTotalForHer: 23_450,
    reimbursementAmount: 365_415,
    reimbursementDirection: 'herToHim',
    categorySummary: [
      cat('g1', 'Bills', 'c1', 'Rent', 1100_000, 0),
      cat('g1', 'Bills', 'c2', 'Council Tax', 0, 182_000),
      cat('g1', 'Bills', 'c3', 'Electricity & Gas', 96_420, 0),
      cat('g1', 'Bills', 'c4', 'Broadband', 0, 32_000),
      cat('g2', 'Everyday Expenses', 'c5', 'Groceries', 412_330, 389_150),
      cat('g2', 'Everyday Expenses', 'c6', 'Eating Out & Takeaways', 134_460, 220_250),
      cat('g2', 'Everyday Expenses', 'c7', 'Household Supplies', 0, 47_000),
      cat('g3', 'Holidays & Travel', 'c8', 'Summer Holiday 2026', 100_000, 395_000),
    ],
    warnings: [],
  },
  warnings: [],
  onOpenConfig: () => {},
  onOpenConfigTab: () => {},
  availableMonths: [{ month: '2026-10-01' }, { month: '2026-09-01' }, { month: '2026-08-01' }],
  selectedMonth: '2026-09-01',
  onMonthChange: () => {},
  onFetchTransactions: () => {},
  selectedBudgetId: 'b1',
  transactions: [{}],
  currencySymbol: '£',
};
