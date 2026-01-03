import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ynab } from './ynab.js';
import { calculateReimbursementPure } from './calculations.js';
import { useLocalStorage } from './hooks.js';
import { milliunitsToDisplayAmount, formatMonth, getCurrentMonth } from './utils.js';
import './app.css';

const CONFIG_PREFIX = 'ynabReimbursement_';
const ACCOUNT_TYPES = ['Unset', 'His', 'Hers', 'Shared'];
const CATEGORY_TYPES = ['Unset', 'His', 'Hers', 'Shared'];

const App = () => {
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '', CONFIG_PREFIX);
  const [selectedBudgetId, setSelectedBudgetId] = useLocalStorage('selectedBudgetId', '', CONFIG_PREFIX);
  const [budgets, setBudgets] = useLocalStorage('budgets', [], CONFIG_PREFIX);
  const [accounts, setAccounts] = useLocalStorage('accounts', [], CONFIG_PREFIX);
  const [categories, setCategories] = useLocalStorage('categories', [], CONFIG_PREFIX);
  const [categoryGroups, setCategoryGroups] = useLocalStorage('categoryGroups', [], CONFIG_PREFIX);
  const [transactions, setTransactions] = useState([]);
  const [availableMonths, setAvailableMonths] = useLocalStorage('availableMonths', [], CONFIG_PREFIX);
  const [accountTypes, setAccountTypes] = useLocalStorage('accountTypes', {}, CONFIG_PREFIX);
  const [categoryTypes, setCategoryTypes] = useLocalStorage('categoryTypes', {}, CONFIG_PREFIX);
  const [categoryGroupTypes, setCategoryGroupTypes] = useLocalStorage('categoryGroupTypes', {}, CONFIG_PREFIX);
  const [currentView, setCurrentView] = useState('main');
  const [configTab, setConfigTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(false);
  const [showHiddenCategories, setShowHiddenCategories] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setCurrentView('tokenInput');
    } else if (!selectedBudgetId) {
      setCurrentView('budgetSelection');
    } else {
      setCurrentView('main');
    }
  }, [accessToken, selectedBudgetId]);

  useEffect(() => {
    if (accessToken) {
      fetchBudgets();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedBudgetId) {
      fetchAccounts();
      fetchCategories();
      fetchBudgetMonths();
    }
  }, [selectedBudgetId]);

  useEffect(() => {
    if (currentView === 'main') {
      validateConfiguration();
    }
  }, [accounts, categories, categoryGroups, accountTypes, categoryTypes, categoryGroupTypes, currentView]);

  const fetchYnabData = async (fn, ...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const client = ynab.API(accessToken);
      return await fn.apply(null, [client, ...args]);
    } catch (err) {
      console.error('YNAB API Error:', err);
      setError(err.message || 'An error occurred while fetching data from YNAB');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudgets = async () => {
    const result = await fetchYnabData(ynab.budgets.getBudgets);
    if (result) {
      setBudgets(result);
    }
  };

  const fetchAccounts = async () => {
    const result = await fetchYnabData(ynab.accounts.getAccounts, selectedBudgetId);
    if (result) {
      setAccounts(result);
      const newAccountTypes = {...accountTypes};
      result.forEach(account => {
        if (!newAccountTypes[account.id]) {
          newAccountTypes[account.id] = 'Unset';
        }
      });
      setAccountTypes(newAccountTypes);
    }
  };

  const fetchCategories = async () => {
    const result = await fetchYnabData(ynab.categories.getCategories, selectedBudgetId);
    if (result) {
      const filteredGroups = result.filter(group =>
        !group.deleted && group.name !== "Internal Master Category"
      );
      setCategoryGroups(filteredGroups);

      const filteredCategories = filteredGroups.flatMap(group =>
        group.categories.filter(category =>
          !category.deleted &&
          category.name !== "Inflow: Ready to Assign" &&
          category.name !== "Uncategorized"
        )
      );
      setCategories(filteredCategories);

      const newCategoryTypes = {...categoryTypes};
      const newGroupTypes = {...categoryGroupTypes};

      filteredGroups.forEach(group => {
        if (!newGroupTypes[group.id]) {
          newGroupTypes[group.id] = 'Unset';
        }
        group.categories.forEach(category => {
          if (!category.deleted && !newCategoryTypes[category.id]) {
            newCategoryTypes[category.id] = 'Unset';
          }
        });
      });

      setCategoryTypes(newCategoryTypes);
      setCategoryGroupTypes(newGroupTypes);
    }
  };

  const fetchBudgetMonths = async () => {
    const result = await fetchYnabData(ynab.months.getBudgetMonths, selectedBudgetId);
    if (result) {
      const sortedMonths = [...result].sort((a, b) => new Date(b.month) - new Date(a.month));
      setAvailableMonths(sortedMonths);

      if (sortedMonths.length > 0) {
        if (!selectedMonth || !sortedMonths.some(m => m.month === selectedMonth)) {
          const now = new Date();
          const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
          const currentMonthIndex = sortedMonths.findIndex(m => m.month === currentYearMonth);

          if (currentMonthIndex >= 0) {
            setSelectedMonth(currentYearMonth);
          } else {
            const pastMonths = sortedMonths.filter(m => new Date(m.month) <= now);
            if (pastMonths.length > 0) {
              setSelectedMonth(pastMonths[0].month);
            } else {
              setSelectedMonth(sortedMonths[sortedMonths.length - 1].month);
            }
          }
        }
      }
    }
  };

  const fetchTransactions = async () => {
    if (!selectedMonth) return;

    const result = await fetchYnabData(
      ynab.transactions.getTransactionsByMonth,
      selectedBudgetId,
      selectedMonth
    );

    if (result) {
      setTransactions(result);
      setSuccessMessage(`Successfully imported ${result.length} transactions for ${formatMonth(selectedMonth)}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const validateConfiguration = () => {
    const newWarnings = [];

    accounts.forEach(account => {
      if (accountTypes[account.id] === 'Unset') {
        newWarnings.push({
          id: `account-${account.id}`,
          message: `Account "${account.name}" has no type set.`,
          tabToFix: 'accounts'
        });
      }
    });

    categories.forEach(category => {
      const groupType = categoryGroupTypes[category.category_group_id];
      if (categoryTypes[category.id] === 'Unset' && groupType === 'Unset') {
        newWarnings.push({
          id: `category-${category.id}`,
          message: `Category "${category.name}" has no type set.`,
          tabToFix: 'categories'
        });
      }
    });

    setWarnings(newWarnings);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    setAccessToken(e.target.token.value.trim());
  };

  const handleBudgetSelect = (budgetId) => {
    setSelectedBudgetId(budgetId);
  };

  const updateAccountType = (accountId, type) => {
    setAccountTypes(prev => ({ ...prev, [accountId]: type }));
  };

  const updateCategoryType = (categoryId, type) => {
    setCategoryTypes(prev => ({ ...prev, [categoryId]: type }));
  };

  const updateCategoryGroupType = (groupId, type) => {
    setCategoryGroupTypes(prev => ({ ...prev, [groupId]: type }));
  };

  const goToPreviousMonth = () => {
    if (availableMonths.length === 0) return;
    const currentIndex = availableMonths.findIndex(m => m.month === selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1].month);
    }
  };

  const goToNextMonth = () => {
    if (availableMonths.length === 0) return;
    const currentIndex = availableMonths.findIndex(m => m.month === selectedMonth);
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1].month);
    }
  };

  const goToCurrentMonth = () => {
    if (availableMonths.length === 0) return;
    const currentMonth = getCurrentMonth();
    const exists = availableMonths.some(m => m.month === currentMonth);
    if (exists) {
      setSelectedMonth(currentMonth);
    } else {
      setSelectedMonth(availableMonths[0].month);
    }
  };

  const getCategoryType = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 'Unset';
    if (categoryTypes[categoryId] !== 'Unset') {
      return categoryTypes[categoryId];
    }
    return categoryGroupTypes[category.category_group_id] || 'Unset';
  };

  const getAccountType = (accountId) => {
    return accountTypes[accountId] || 'Unset';
  };

  const calculateReimbursement = () => {
    return calculateReimbursementPure(
      transactions,
      categories,
      categoryGroups,
      getAccountType,
      getCategoryType,
      warnings.length > 0
    );
  };

  const handleLogout = () => {
    setAccessToken('');
    setSelectedBudgetId('');
    setCurrentView('tokenInput');
  };

  const TokenInputView = () => (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">YNAB Access Token</h2>
      <p className="mb-4 text-sm">
        To use this tool, you need to provide your YNAB personal access token.
        You can generate one at <a href="https://app.youneedabudget.com/settings/developer"
        target="_blank" rel="noopener noreferrer"
        className="text-blue-500 hover:underline">YNAB Developer Settings</a>.
      </p>

      <form onSubmit={handleTokenSubmit}>
        <input
          type="password"
          name="token"
          placeholder="Paste your YNAB access token here"
          className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Connect to YNAB
        </button>
      </form>
    </div>
  );

  const BudgetSelectionView = () => (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Select Your Budget</h2>

      {isLoading ? (
        <p>Loading budgets...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={handleLogout}
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
              onClick={() => handleBudgetSelect(budget.id)}
              className="cursor-pointer p-3 border border-gray-200 rounded hover:bg-blue-50
                         dark:border-gray-700 dark:hover:bg-blue-900/20"
            >
              {budget.name}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
      >
        Use a different token
      </button>
    </div>
  );

  const ConfigMenu = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-screen overflow-auto rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Configuration</h2>
          <button
            onClick={() => setShowConfigMenu(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setConfigTab('general')}
            className={`px-4 py-2 ${configTab === 'general'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'}`}
          >
            General
          </button>
          <button
            onClick={() => setConfigTab('accounts')}
            className={`px-4 py-2 ${configTab === 'accounts'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'}`}
          >
            Accounts
          </button>
          <button
            onClick={() => setConfigTab('categories')}
            className={`px-4 py-2 ${configTab === 'categories'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'}`}
          >
            Categories
          </button>
        </div>

        <div className="p-4">
          {configTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Access Token</label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Selected Budget</label>
                <select
                  value={selectedBudgetId}
                  onChange={(e) => setSelectedBudgetId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>{budget.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {configTab === 'accounts' && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-4">
                <h3 className="font-medium">Accounts</h3>
                <div className="flex-grow"></div>
                <div>
                  <input type="checkbox"
                    checked={showHiddenAccounts}
                    onChange={() => setShowHiddenAccounts(!showHiddenAccounts)}
                    className="mr-2" />
                  <label className="text-sm">Show Closed Accounts</label>
                </div>
                <button
                  onClick={fetchAccounts}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Sync Accounts
                </button>
              </div>

              {isLoading ? (
                <p>Loading accounts...</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="text-left p-2 border border-gray-300 dark:border-gray-600">Account Name</th>
                      <th className="text-left p-2 border border-gray-300 dark:border-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(account => {
                      const hasWarning = warnings.some(w => w.id === `account-${account.id}`);

                      if (!(showHiddenAccounts || (!account.closed && !account.deleted))) {
                        return null;
                      }

                      return (
                        <tr key={account.id} className={hasWarning ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                          <td className="p-2 border border-gray-300 dark:border-gray-600">
                            {account.name}
                            {hasWarning && <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚠️</span>}
                            {account.closed && <span className="ml-2">🚫 Closed</span>}
                            {account.deleted && <span className="ml-2">🗑️ Deleted</span>}
                          </td>
                          <td className="p-2 border border-gray-300 dark:border-gray-600">
                            <select
                              value={accountTypes[account.id] || 'Unset'}
                              onChange={(e) => updateAccountType(account.id, e.target.value)}
                              className="p-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                              {ACCOUNT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {configTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-4">
                <h3 className="font-medium">Categories</h3>
                <div className="flex-grow"></div>
                <div>
                  <input type="checkbox"
                    checked={showHiddenCategories}
                    onChange={() => setShowHiddenCategories(!showHiddenCategories)}
                    className="mr-2" />
                  <label className="text-sm">Show Hidden Categories</label>
                </div>
                <button
                  onClick={fetchCategories}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Sync Categories
                </button>
              </div>

              {isLoading ? (
                <p>Loading categories...</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="text-left p-2 border border-gray-300 dark:border-gray-600">Category Name</th>
                      <th className="text-left p-2 border border-gray-300 dark:border-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryGroups.map(group => {
                      if (!(showHiddenCategories || (!group.deleted && !group.hidden))) {
                        return null;
                      }

                      const hasWarning = warnings.some(w => w.id === `group-${group.id}`);
                      const groupCategories = categories
                        .filter(c => c.category_group_id === group.id)
                        .filter(c => showHiddenCategories || (!c.deleted && !c.hidden));

                      if (groupCategories.length === 0) {
                        return null;
                      }

                      return (
                        <React.Fragment key={group.id}>
                          <tr className={`bg-gray-100 dark:bg-gray-700 font-bold ${hasWarning ? 'bg-yellow-100 dark:bg-yellow-900/40' : ''}`}>
                            <td className="p-2 border border-gray-300 dark:border-gray-600">
                              {group.name}
                              {hasWarning && <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚠️</span>}
                              {group.closed && <span className="ml-2">🚫 Closed</span>}
                              {group.deleted && <span className="ml-2">🗑️ Deleted</span>}
                            </td>
                            <td className="p-2 border border-gray-300 dark:border-gray-600">
                              <select
                                value={categoryGroupTypes[group.id] || 'Unset'}
                                onChange={(e) => updateCategoryGroupType(group.id, e.target.value)}
                                className="p-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                {CATEGORY_TYPES.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </td>
                          </tr>

                          {groupCategories.map(category => {
                            const catHasWarning = warnings.some(w => w.id === `category-${category.id}`);

                            return (
                              <tr key={category.id} className={catHasWarning ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                                <td className="p-2 border border-gray-300 dark:border-gray-600 pl-5">
                                  {category.name}
                                  {catHasWarning && <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚠️</span>}
                                  {category.closed && <span className="ml-2">🚫 Closed</span>}
                                  {category.deleted && <span className="ml-2">🗑️ Deleted</span>}
                                </td>
                                <td className="p-2 border border-gray-300 dark:border-gray-600">
                                  <select
                                    value={categoryTypes[category.id] || 'Unset'}
                                    onChange={(e) => updateCategoryType(category.id, e.target.value)}
                                    className="p-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                  >
                                    {CATEGORY_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MainView = () => {
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
    } = calculateReimbursement();

    const hisTotal = hisTotalShared + hisTotalForHer;
    const herTotal = herTotalShared + herTotalForHim;
    const total = hisTotal + herTotal;

    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">YNAB Reimbursement Report</h1>
          <button
            onClick={() => setShowConfigMenu(true)}
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
                      setShowConfigMenu(true);
                      setConfigTab(warning.tabToFix);
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
              disabled={availableMonths.findIndex(m => m.month === selectedMonth) === availableMonths.length - 1}
              className={`px-3 py-1 ${
                availableMonths.findIndex(m => m.month === selectedMonth) === availableMonths.length - 1
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
                disabled={availableMonths.length === 0 || getCurrentMonth() === selectedMonth}
                className={`px-3 py-1 ${
                  availableMonths.length === 0 || getCurrentMonth() === selectedMonth
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'
                } rounded mr-2`}
              >
                Current
              </button>
              <button
                onClick={goToNextMonth}
                disabled={availableMonths.findIndex(m => m.month === selectedMonth) === 0}
                className={`px-3 py-1 ${
                  availableMonths.findIndex(m => m.month === selectedMonth) === 0
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
              onClick={fetchTransactions}
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

  return (
    <div className="p-2 sm:p-4 text-gray-900 dark:text-gray-100">
      {isLoading && (
        <div className="fixed top-0 inset-x-0 bg-blue-500 text-white text-center py-1 text-sm">
          Loading data from YNAB...
        </div>
      )}

      {successMessage && (
        <div className="fixed top-0 inset-x-0 bg-green-500 text-white text-center py-2 text-sm">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {currentView === 'tokenInput' && <TokenInputView />}
      {currentView === 'budgetSelection' && <BudgetSelectionView />}
      {currentView === 'main' && <MainView />}

      {showConfigMenu && <ConfigMenu />}
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
