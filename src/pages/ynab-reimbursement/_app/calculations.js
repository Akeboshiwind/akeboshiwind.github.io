export function isValidType(type, allowUnset = true) {
  const validTypes = allowUnset
    ? ["His", "Hers", "Shared", "Unset"]
    : ["His", "Hers", "Shared"];

  return validTypes.includes(type);
}

export function createTypeWarning(id, name, type, allowUnset = true) {
  const expectedTypes = allowUnset
    ? "His, Hers, Shared, or Unset"
    : "His, Hers, or Shared";

  return {
    id: `invalid-type-${id}`,
    message: `"${name}" has an invalid type: "${type}".`,
    details: `Expected type to be one of: ${expectedTypes}.`,
  };
}

export const isInflowTransaction = (tx) => tx.category_name === "Inflow: Ready to Assign";
export const isUncategorizedTransaction = (tx) => tx.category_name === "Uncategorized";
export const isTransferTransaction = (tx) => tx.transfer_transaction_id || tx.transfer_account_id;

function expandSplitTransaction(transaction) {
  const warnings = [];

  const expanded = transaction.subtransactions
    .map((sub, index) => {
      if (!sub.category_id) {
        warnings.push({
          id: `subtransaction-${transaction.id}-${index}`,
          message: `Subtransaction of "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
          details: "Subtransactions must have a category assigned in YNAB.",
        });
        return null;
      }

      return {
        ...transaction,
        id: `${transaction.id}:sub:${index}`,
        amount: sub.amount,
        category_id: sub.category_id,
        category_name: sub.category_name,
        subtransactions: [],
        original_transaction_id: transaction.id,
      };
    })
    .filter(Boolean);

  return { expanded, warnings };
}

function expandTransactions(transactions) {
  return transactions.reduce(
    (acc, tx) => {
      if (tx.subtransactions?.length > 0) {
        const { expanded, warnings } = expandSplitTransaction(tx);
        return {
          processed: [...acc.processed, ...expanded],
          warnings: [...acc.warnings, ...warnings],
        };
      }
      return { ...acc, processed: [...acc.processed, tx] };
    },
    { processed: [], warnings: [] }
  );
}

function validateTransaction(tx, getAccountType, getCategoryType) {
  if (!tx.category_id) {
    return {
      valid: false,
      warning: {
        id: `transaction-${tx.id}`,
        message: `Transaction "${tx.payee_name}" (${tx.date}) has no category assigned.`,
        details: "Transaction must have a category assigned in YNAB.",
      },
    };
  }

  if (isInflowTransaction(tx)) {
    return { valid: false, warning: null };
  }

  if (isUncategorizedTransaction(tx)) {
    return {
      valid: false,
      warning: {
        id: `unassigned-transaction-${tx.id}`,
        message: `Transaction "${tx.payee_name}" (${tx.date}) is uncategorized.`,
        details: "This transaction is in the 'Uncategorized' category. Please assign it to a proper category in YNAB.",
      },
    };
  }

  const accountType = getAccountType(tx.account_id);
  if (!isValidType(accountType, false)) {
    return {
      valid: false,
      warning: createTypeWarning(
        `transaction-account-${tx.id}`,
        `Transaction "${tx.payee_name}" (${tx.date}) account`,
        accountType,
        false,
      ),
    };
  }

  const categoryType = getCategoryType(tx.category_id);
  if (!isValidType(categoryType, false)) {
    return {
      valid: false,
      warning: createTypeWarning(
        `transaction-category-${tx.id}`,
        `Transaction "${tx.payee_name}" (${tx.date}) category`,
        categoryType,
        false,
      ),
    };
  }

  return { valid: true, warning: null };
}

export function filterTransactions(transactionsList, getAccountTypeFunc, getCategoryTypeFunc) {
  const nonTransfers = transactionsList.filter((tx) => !isTransferTransaction(tx));
  const { processed, warnings: expandWarnings } = expandTransactions(nonTransfers);

  const { valid, warnings: validationWarnings } = processed.reduce(
    (acc, tx) => {
      const result = validateTransaction(tx, getAccountTypeFunc, getCategoryTypeFunc);
      if (result.valid) {
        return { valid: [...acc.valid, tx], warnings: acc.warnings };
      }
      if (result.warning) {
        return { valid: acc.valid, warnings: [...acc.warnings, result.warning] };
      }
      return acc;
    },
    { valid: [], warnings: [] }
  );

  return {
    validTransactions: valid,
    transactionWarnings: [...expandWarnings, ...validationWarnings],
  };
}

export function calculateCategorySpending(validTransactions, getAccountTypeFunc) {
  const warnings = [];

  const categorySpending = validTransactions.reduce((acc, tx) => {
    const accountType = getAccountTypeFunc(tx.account_id);
    const amount = -tx.amount;

    if (!isValidType(accountType, false)) {
      warnings.push(
        createTypeWarning(
          `account-${tx.id}`,
          `Transaction "${tx.payee_name}" (${tx.date}) account`,
          accountType,
          false,
        ),
      );
      return acc;
    }

    const current = acc[tx.category_id] || { hisSpending: 0, herSpending: 0 };

    if (accountType === "His") {
      return { ...acc, [tx.category_id]: { ...current, hisSpending: current.hisSpending + amount } };
    }
    if (accountType === "Hers") {
      return { ...acc, [tx.category_id]: { ...current, herSpending: current.herSpending + amount } };
    }
    return acc;
  }, {});

  return { categorySpending, warnings };
}

export function calculateSpendingTotals(categorySpending, categoriesList, getCategoryTypeFunc) {
  const initial = {
    hisTotalShared: 0,
    herTotalShared: 0,
    hisTotalForHer: 0,
    herTotalForHim: 0,
    hisTotalForHim: 0,
    herTotalForHer: 0,
    warnings: [],
  };

  return Object.entries(categorySpending).reduce((acc, [categoryId, spending]) => {
    const categoryType = getCategoryTypeFunc(categoryId);

    if (!isValidType(categoryType, false)) {
      const category = categoriesList.find((c) => c.id === categoryId);
      const categoryName = category ? category.name : `Category ID: ${categoryId}`;
      return {
        ...acc,
        warnings: [...acc.warnings, createTypeWarning(`category-${categoryId}`, categoryName, categoryType, false)],
      };
    }

    if (categoryType === "Shared") {
      return {
        ...acc,
        hisTotalShared: acc.hisTotalShared + spending.hisSpending,
        herTotalShared: acc.herTotalShared + spending.herSpending,
      };
    }
    if (categoryType === "His") {
      return {
        ...acc,
        hisTotalForHim: acc.hisTotalForHim + spending.hisSpending,
        herTotalForHim: acc.herTotalForHim + spending.herSpending,
      };
    }
    if (categoryType === "Hers") {
      return {
        ...acc,
        herTotalForHer: acc.herTotalForHer + spending.herSpending,
        hisTotalForHer: acc.hisTotalForHer + spending.hisSpending,
      };
    }
    return acc;
  }, initial);
}

export function calculateReimbursementValues(spendingTotals) {
  const { hisTotalShared, herTotalShared, hisTotalForHer, herTotalForHim } = spendingTotals;

  const totalShared = hisTotalShared + herTotalShared;
  const heShouldPay = totalShared / 2 - hisTotalShared + (herTotalForHim - hisTotalForHer);

  return {
    reimbursementAmount: Math.abs(heShouldPay),
    reimbursementDirection: heShouldPay > 0 ? "himToHer" : "herToHim",
  };
}

function lookupCategoryMetadata(categoryId, categoriesList, categoryGroupsList) {
  const category = categoriesList.find((c) => c.id === categoryId);
  if (!category) {
    return {
      error: {
        id: `missing-category-${categoryId}`,
        message: `Category with ID "${categoryId}" was not found in the categories list.`,
        details: "This may indicate a deleted category or data synchronization issue.",
      },
    };
  }

  const group = categoryGroupsList.find((g) => g.id === category.category_group_id);
  if (!group) {
    return {
      error: {
        id: `missing-group-${category.category_group_id}`,
        message: `Category group with ID "${category.category_group_id}" was not found for category "${category.name}".`,
        details: "This may indicate a deleted category group or data synchronization issue.",
      },
    };
  }

  return { category, group };
}

export function createCategorySummary(categorySpending, categoriesList, categoryGroupsList, getCategoryTypeFunc) {
  const initial = { categorySummaryMap: {}, warnings: [] };

  return Object.entries(categorySpending).reduce((acc, [categoryId, spending]) => {
    const lookup = lookupCategoryMetadata(categoryId, categoriesList, categoryGroupsList);

    if (lookup.error) {
      return { ...acc, warnings: [...acc.warnings, lookup.error] };
    }

    const { category, group } = lookup;
    const categoryType = getCategoryTypeFunc(categoryId);
    const warnings = !isValidType(categoryType)
      ? [...acc.warnings, createTypeWarning(`summary-category-${categoryId}`, `Category "${category.name}"`, categoryType)]
      : acc.warnings;

    return {
      warnings,
      categorySummaryMap: {
        ...acc.categorySummaryMap,
        [categoryId]: {
          categoryId,
          categoryName: category.name,
          groupId: group.id,
          groupName: group.name,
          type: categoryType,
          hisSpending: spending.hisSpending,
          herSpending: spending.herSpending,
        },
      },
    };
  }, initial);
}

const sortCategorySummary = (summary) =>
  Object.values(summary).sort((a, b) => {
    if (a.groupName < b.groupName) return -1;
    if (a.groupName > b.groupName) return 1;
    return a.categoryName.localeCompare(b.categoryName);
  });

export function calculateReimbursementPure(
  transactionsList,
  categoriesList,
  categoryGroupsList,
  getAccountTypeFunc,
  getCategoryTypeFunc,
  hasWarnings = false,
) {
  if (hasWarnings) {
    return {
      hisTotalShared: 0,
      herTotalShared: 0,
      hisTotalForHer: 0,
      herTotalForHim: 0,
      reimbursementAmount: 0,
      reimbursementDirection: null,
      categorySummary: [],
      warnings: [],
    };
  }

  const allWarnings = [];

  const { validTransactions, transactionWarnings } = filterTransactions(
    transactionsList,
    getAccountTypeFunc,
    getCategoryTypeFunc,
  );
  allWarnings.push(...transactionWarnings);

  const { categorySpending, warnings: categorySpendingWarnings } =
    calculateCategorySpending(validTransactions, getAccountTypeFunc);
  allWarnings.push(...categorySpendingWarnings);

  const {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    warnings: spendingWarnings,
  } = calculateSpendingTotals(categorySpending, categoriesList, getCategoryTypeFunc);
  allWarnings.push(...spendingWarnings);

  const { reimbursementAmount, reimbursementDirection } = calculateReimbursementValues({
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
  });

  const { categorySummaryMap, warnings: summaryWarnings } = createCategorySummary(
    categorySpending,
    categoriesList,
    categoryGroupsList,
    getCategoryTypeFunc,
  );
  allWarnings.push(...summaryWarnings);

  return {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    reimbursementAmount,
    reimbursementDirection,
    categorySummary: sortCategorySummary(categorySummaryMap),
    warnings: allWarnings,
  };
}
