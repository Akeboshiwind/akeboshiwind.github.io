import React from 'react';

const ACCOUNT_TYPES = ['Unset', 'His', 'Hers', 'Shared'];
const CATEGORY_TYPES = ['Unset', 'His', 'Hers', 'Shared'];

export const ConfigMenu = ({
  onClose,
  configTab,
  onTabChange,
  accessToken,
  onAccessTokenChange,
  selectedBudgetId,
  onBudgetChange,
  budgets,
  showHiddenAccounts,
  onShowHiddenAccountsChange,
  onSyncAccounts,
  isLoading,
  accounts,
  warnings,
  accountTypes,
  onAccountTypesChange,
  showHiddenCategories,
  onShowHiddenCategoriesChange,
  onSyncCategories,
  categoryGroups,
  categories,
  categoryGroupTypes,
  onCategoryGroupTypesChange,
  categoryTypes,
  onCategoryTypesChange
}) => {
  const updateAccountType = (accountId, type) => {
    onAccountTypesChange({ ...accountTypes, [accountId]: type });
  };

  const updateCategoryType = (categoryId, type) => {
    onCategoryTypesChange({ ...categoryTypes, [categoryId]: type });
  };

  const updateCategoryGroupType = (groupId, type) => {
    onCategoryGroupTypesChange({ ...categoryGroupTypes, [groupId]: type });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-screen overflow-auto rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onTabChange('general')}
            className={`px-4 py-2 ${configTab === 'general'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'}`}
          >
            General
          </button>
          <button
            onClick={() => onTabChange('accounts')}
            className={`px-4 py-2 ${configTab === 'accounts'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'}`}
          >
            Accounts
          </button>
          <button
            onClick={() => onTabChange('categories')}
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
                  onChange={(e) => onAccessTokenChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Selected Budget</label>
                <select
                  value={selectedBudgetId}
                  onChange={(e) => onBudgetChange(e.target.value)}
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
                    onChange={() => onShowHiddenAccountsChange(!showHiddenAccounts)}
                    className="mr-2" />
                  <label className="text-sm">Show Closed Accounts</label>
                </div>
                <button
                  onClick={onSyncAccounts}
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
                    onChange={() => onShowHiddenCategoriesChange(!showHiddenCategories)}
                    className="mr-2" />
                  <label className="text-sm">Show Hidden Categories</label>
                </div>
                <button
                  onClick={onSyncCategories}
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
};
