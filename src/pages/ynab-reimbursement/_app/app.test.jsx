import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, act, within } from '@testing-library/react';
import { getCurrentMonth } from './utils.js';

const api = vi.hoisted(() => ({
  getBudgets: vi.fn(),
  getAccounts: vi.fn(),
  getCategories: vi.fn(),
  getBudgetMonths: vi.fn(),
  getTransactionsByMonth: vi.fn(),
}));

vi.mock('./ynab.js', () => ({
  ynab: {
    API: token => ({ token }),
    budgets: { getBudgets: api.getBudgets },
    accounts: { getAccounts: api.getAccounts },
    categories: { getCategories: api.getCategories },
    months: { getBudgetMonths: api.getBudgetMonths },
    transactions: { getTransactionsByMonth: api.getTransactionsByMonth },
  },
}));

const PREFIX = 'ynabReimbursement_';

const aborted = () => Promise.reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));

const previousMonth = () => {
  const [y, m] = getCurrentMonth().split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

const monthName = month =>
  new Date(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const budgets = [
  { id: 'budget-1', name: 'Personal Budget', currency_format: { currency_symbol: '£' } },
  { id: 'budget-2', name: 'Household Budget', currency_format: { currency_symbol: '€' } },
];
const accounts = [
  { id: 'acc-his', name: 'His Current', closed: false, deleted: false },
  { id: 'acc-hers', name: 'Her Current', closed: false, deleted: false },
];
const rent = { id: 'cat-rent', name: 'Rent', category_group_id: 'grp-bills', hidden: false, deleted: false };
const gym = { id: 'cat-gym', name: 'Gym', category_group_id: 'grp-bills', hidden: false, deleted: false };
const categoryGroups = [
  { id: 'grp-bills', name: 'Bills', hidden: false, deleted: false, categories: [rent, gym] },
];
const transactions = [
  { id: 't1', date: '2024-01-03', payee_name: 'Landlord', amount: -1000000, account_id: 'acc-his', category_id: 'cat-rent', category_name: 'Rent', subtransactions: [] },
  { id: 't2', date: '2024-01-04', payee_name: 'Landlord', amount: -600000, account_id: 'acc-hers', category_id: 'cat-rent', category_name: 'Rent', subtransactions: [] },
  { id: 't3', date: '2024-01-05', payee_name: 'Gym Co', amount: -40000, account_id: 'acc-hers', category_id: 'cat-gym', category_name: 'Gym', subtransactions: [] },
];

const seedStorage = () => {
  const stored = {
    accessToken: 'seeded-token',
    selectedBudgetId: 'budget-2',
    budgets,
    accounts,
    categories: [rent, gym],
    categoryGroups,
    availableMonths: [{ month: getCurrentMonth() }, { month: previousMonth() }],
    accountTypes: { 'acc-his': 'His', 'acc-hers': 'Hers' },
    categoryTypes: { 'cat-rent': 'Unset', 'cat-gym': 'His' },
    categoryGroupTypes: { 'grp-bills': 'Shared' },
  };
  for (const [key, value] of Object.entries(stored)) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }
};

const mountApp = async () => {
  document.body.innerHTML = '<div id="app"></div>';
  vi.resetModules();
  await act(async () => { await import('./app.jsx'); });
};

beforeEach(() => {
  localStorage.clear();
  for (const fn of Object.values(api)) fn.mockReset();
  api.getBudgets.mockImplementation(aborted);
  api.getAccounts.mockImplementation(aborted);
  api.getCategories.mockImplementation(aborted);
  api.getBudgetMonths.mockImplementation(aborted);
  api.getTransactionsByMonth.mockImplementation(aborted);
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('storage contract', () => {
  test('a session saved under the ynabReimbursement_ keys opens on its report', async () => {
    seedStorage();
    api.getTransactionsByMonth.mockResolvedValue(transactions);
    await mountApp();

    expect(await screen.findByText('YNAB Reimbursement Report')).toBeTruthy();
    expect(screen.queryByText(/Configuration Warnings/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Import Transactions/ }));
    expect(await screen.findByText('€160.00 - She should pay Him')).toBeTruthy();
    expect(api.getTransactionsByMonth).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'seeded-token' }),
      { budgetId: 'budget-2', month: getCurrentMonth() },
    );
    expect(screen.getByText('Rent')).toBeTruthy();
    expect(screen.getByText('Bills')).toBeTruthy();
  });

  test('the saved months drive month navigation', async () => {
    seedStorage();
    await mountApp();

    expect(await screen.findByText(monthName(getCurrentMonth()))).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '← Prev' }));
    expect(await screen.findByText(monthName(previousMonth()))).toBeTruthy();
    expect(screen.getByRole('button', { name: '← Prev' }).hasAttribute('disabled')).toBe(true);
  });

  test('the configuration shows the saved token, budget and types', async () => {
    seedStorage();
    await mountApp();

    fireEvent.click(await screen.findByLabelText('Open Configuration'));
    expect(screen.getByDisplayValue('seeded-token')).toBeTruthy();
    expect(screen.getByDisplayValue('Household Budget')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Accounts' }));
    const hisRow = screen.getByText('His Current').closest('tr');
    expect(within(hisRow).getByRole('combobox').value).toBe('His');
    const herRow = screen.getByText('Her Current').closest('tr');
    expect(within(herRow).getByRole('combobox').value).toBe('Hers');

    fireEvent.click(screen.getByRole('button', { name: 'Categories' }));
    expect(within(screen.getByText('Bills').closest('tr')).getByRole('combobox').value).toBe('Shared');
    expect(within(screen.getByText('Rent').closest('tr')).getByRole('combobox').value).toBe('Unset');
    expect(within(screen.getByText('Gym').closest('tr')).getByRole('combobox').value).toBe('His');
  });

  test('a changed type is written back as JSON under its prefixed key', async () => {
    seedStorage();
    await mountApp();

    fireEvent.click(await screen.findByLabelText('Open Configuration'));
    fireEvent.click(screen.getByRole('button', { name: 'Accounts' }));
    const hisRow = screen.getByText('His Current').closest('tr');
    fireEvent.change(within(hisRow).getByRole('combobox'), { target: { value: 'Shared' } });

    expect(JSON.parse(localStorage.getItem(PREFIX + 'accountTypes'))).toEqual({
      'acc-his': 'Shared',
      'acc-hers': 'Hers',
    });
  });
});

describe('first run', () => {
  test('a token, then a budget, leads to the report, which asks for account and category types', async () => {
    api.getBudgets.mockResolvedValue(budgets);
    api.getAccounts.mockResolvedValue(accounts);
    api.getCategories.mockResolvedValue(categoryGroups);
    api.getBudgetMonths.mockResolvedValue([{ month: getCurrentMonth() }]);
    await mountApp();

    const input = await screen.findByPlaceholderText('Paste your YNAB access token here');
    fireEvent.change(input, { target: { value: 'new-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Connect to YNAB' }));

    expect(await screen.findByText('Select Your Budget')).toBeTruthy();
    fireEvent.click(await screen.findByText('Household Budget'));

    expect(await screen.findByText(/Configuration Warnings/)).toBeTruthy();
    expect(await screen.findByText(/Account "His Current" has no type set\./)).toBeTruthy();
    expect(screen.getByText(/Category "Rent" has no type set\./)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(PREFIX + 'accessToken'))).toBe('new-token');
    expect(JSON.parse(localStorage.getItem(PREFIX + 'selectedBudgetId'))).toBe('budget-2');

    const accountWarning = screen.getByText(/Account "His Current" has no type set\./).closest('li');
    fireEvent.click(within(accountWarning).getByRole('button', { name: 'Fix' }));
    expect(screen.getByText('Configuration')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sync Accounts' })).toBeTruthy();
  });

  test('a different token returns from budget selection to the token form', async () => {
    localStorage.setItem(PREFIX + 'accessToken', JSON.stringify('bad-token'));
    await mountApp();

    fireEvent.click(await screen.findByRole('button', { name: 'Use a different token' }));
    expect(await screen.findByPlaceholderText('Paste your YNAB access token here')).toBeTruthy();
  });
});
