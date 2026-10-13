import React from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import warningIcon from 'pixelarticons/svg/warning-diamond.svg?raw';
import reloadIcon from 'pixelarticons/svg/reload.svg?raw';

const ACCOUNT_TYPES = ['Unset', 'His', 'Hers', 'Shared'];
const CATEGORY_TYPES = ['Unset', 'His', 'Hers', 'Shared'];

const TABS = [
  ['general', 'General'],
  ['accounts', 'Accounts'],
  ['categories', 'Categories'],
];

const TypeSelect = ({ value, types, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="pixel-field">
    {types.map(type => (
      <option key={type} value={type}>{type}</option>
    ))}
  </select>
);

const Marks = ({ item, hasWarning }) => (
  <>
    {hasWarning && (
      <span className="pixel-alert-text inline-flex align-middle ml-2" data-variant="warn" title="Needs a type">
        <Icon svg={warningIcon} className="w-4 h-4" />
      </span>
    )}
    {item.closed && <span className="label opacity-60 ml-2">Closed</span>}
    {item.deleted && <span className="label opacity-60 ml-2">Deleted</span>}
  </>
);

const Toolbar = ({ title, showHidden, onShowHiddenChange, showHiddenLabel, onSync, syncLabel }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
    <h3 className="label text-heading m-0 mr-auto">{title}</h3>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={showHidden}
        onChange={() => onShowHiddenChange(!showHidden)}
        className="pixel-check"
      />
      <span className="label">{showHiddenLabel}</span>
    </label>
    <button onClick={onSync} className="pixel-button flex items-center gap-2">
      <Icon svg={reloadIcon} className="w-4 h-4" />
      {syncLabel}
    </button>
  </div>
);

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
    <Sheet title="Configuration" onClose={onClose} className="sm:max-w-2xl">
      <div className="flex flex-wrap gap-2 shrink-0">
        {TABS.map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            aria-pressed={configTab === tab}
            className="pixel-chip"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 overflow-y-auto">
        {configTab === 'general' && (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="label">Access Token</span>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => onAccessTokenChange(e.target.value)}
                className="pixel-field w-full"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="label">Selected Budget</span>
              <select
                value={selectedBudgetId}
                onChange={(e) => onBudgetChange(e.target.value)}
                className="pixel-field w-full"
              >
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>{budget.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {configTab === 'accounts' && (
          <div>
            <Toolbar
              title="Accounts"
              showHidden={showHiddenAccounts}
              onShowHiddenChange={onShowHiddenAccountsChange}
              showHiddenLabel="Show Closed Accounts"
              onSync={onSyncAccounts}
              syncLabel="Sync Accounts"
            />

            {isLoading ? (
              <p className="label">Loading accounts...</p>
            ) : (
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(account => {
                    const hasWarning = warnings.some(w => w.id === `account-${account.id}`);

                    if (!(showHiddenAccounts || (!account.closed && !account.deleted))) {
                      return null;
                    }

                    return (
                      <tr key={account.id}>
                        <td>
                          {account.name}
                          <Marks item={account} hasWarning={hasWarning} />
                        </td>
                        <td>
                          <TypeSelect
                            value={accountTypes[account.id] || 'Unset'}
                            types={ACCOUNT_TYPES}
                            onChange={(type) => updateAccountType(account.id, type)}
                          />
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
            <Toolbar
              title="Categories"
              showHidden={showHiddenCategories}
              onShowHiddenChange={onShowHiddenCategoriesChange}
              showHiddenLabel="Show Hidden Categories"
              onSync={onSyncCategories}
              syncLabel="Sync Categories"
            />

            {isLoading ? (
              <p className="label">Loading categories...</p>
            ) : (
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Type</th>
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
                        <tr>
                          <td className="label text-heading">
                            {group.name}
                            <Marks item={group} hasWarning={hasWarning} />
                          </td>
                          <td>
                            <TypeSelect
                              value={categoryGroupTypes[group.id] || 'Unset'}
                              types={CATEGORY_TYPES}
                              onChange={(type) => updateCategoryGroupType(group.id, type)}
                            />
                          </td>
                        </tr>

                        {groupCategories.map(category => {
                          const catHasWarning = warnings.some(w => w.id === `category-${category.id}`);

                          return (
                            <tr key={category.id}>
                              <td className="pl-4 sm:pl-6">
                                {category.name}
                                <Marks item={category} hasWarning={catHasWarning} />
                              </td>
                              <td>
                                <TypeSelect
                                  value={categoryTypes[category.id] || 'Unset'}
                                  types={CATEGORY_TYPES}
                                  onChange={(type) => updateCategoryType(category.id, type)}
                                />
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
    </Sheet>
  );
};
