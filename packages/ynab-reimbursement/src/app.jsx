import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ynab } from './ynab.js';
import { calculateReimbursementPure } from './calculations.js';
import { useLocalStorage } from './hooks.js';
import { formatMonth } from './utils.js';
import { TokenInputView } from './components/TokenInputView.jsx';
import { BudgetSelectionView } from './components/BudgetSelectionView.jsx';
import { ConfigMenu } from './components/ConfigMenu.jsx';
import { MainView } from './components/MainView.jsx';
import './app.css';

const CONFIG_PREFIX = 'ynabReimbursement_';

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
    const result = await fetchYnabData(ynab.accounts.getAccounts, { budgetId: selectedBudgetId });
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
    const result = await fetchYnabData(ynab.categories.getCategories, { budgetId: selectedBudgetId });
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
    const result = await fetchYnabData(ynab.months.getBudgetMonths, { budgetId: selectedBudgetId });
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
      { budgetId: selectedBudgetId, month: selectedMonth }
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

  const selectedBudget = budgets.find(b => b.id === selectedBudgetId);
  const currencySymbol = selectedBudget?.currency_format?.currency_symbol || '£';

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

      {currentView === 'tokenInput' && (
        <TokenInputView onTokenSubmit={setAccessToken} />
      )}

      {currentView === 'budgetSelection' && (
        <BudgetSelectionView
          isLoading={isLoading}
          error={error}
          budgets={budgets}
          onLogout={handleLogout}
          onBudgetSelect={setSelectedBudgetId}
        />
      )}

      {currentView === 'main' && (
        <MainView
          reimbursementData={calculateReimbursement()}
          warnings={warnings}
          onOpenConfig={() => setShowConfigMenu(true)}
          onOpenConfigTab={setConfigTab}
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onFetchTransactions={fetchTransactions}
          selectedBudgetId={selectedBudgetId}
          transactions={transactions}
          currencySymbol={currencySymbol}
        />
      )}

      {showConfigMenu && (
        <ConfigMenu
          onClose={() => setShowConfigMenu(false)}
          configTab={configTab}
          onTabChange={setConfigTab}
          accessToken={accessToken}
          onAccessTokenChange={setAccessToken}
          selectedBudgetId={selectedBudgetId}
          onBudgetChange={setSelectedBudgetId}
          budgets={budgets}
          showHiddenAccounts={showHiddenAccounts}
          onShowHiddenAccountsChange={setShowHiddenAccounts}
          onSyncAccounts={fetchAccounts}
          isLoading={isLoading}
          accounts={accounts}
          warnings={warnings}
          accountTypes={accountTypes}
          onAccountTypesChange={setAccountTypes}
          showHiddenCategories={showHiddenCategories}
          onShowHiddenCategoriesChange={setShowHiddenCategories}
          onSyncCategories={fetchCategories}
          categoryGroups={categoryGroups}
          categories={categories}
          categoryGroupTypes={categoryGroupTypes}
          onCategoryGroupTypesChange={setCategoryGroupTypes}
          categoryTypes={categoryTypes}
          onCategoryTypesChange={setCategoryTypes}
        />
      )}
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
