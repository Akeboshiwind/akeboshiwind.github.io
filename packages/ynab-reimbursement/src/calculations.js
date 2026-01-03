export function isValidType(type, forCalculation = false) {
  const validConfigTypes = ["His", "Hers", "Shared", "Unset"];
  const validCalculationTypes = ["His", "Hers", "Shared"];

  return forCalculation
    ? validCalculationTypes.includes(type)
    : validConfigTypes.includes(type);
}

export function createTypeWarning(id, name, type, forCalculation = false) {
  const expectedTypes = forCalculation
    ? "His, Hers, or Shared"
    : "His, Hers, Shared, or Unset";

  return {
    id: `invalid-type-${id}`,
    message: `"${name}" has an invalid type: "${type}".`,
    details: `Expected type to be one of: ${expectedTypes}.`,
  };
}

export function isInflowTransaction(transaction) {
  return transaction.category_name === "Inflow: Ready to Assign";
}

export function isUncategorizedTransaction(transaction) {
  return transaction.category_name === "Uncategorized";
}

export function filterTransactions(
  transactionsList,
  getAccountTypeFunc,
  getCategoryTypeFunc,
) {
  const transactionWarnings = [];
  const processedTransactions = [];

  transactionsList.forEach((transaction) => {
    if (transaction.transfer_transaction_id || transaction.transfer_account_id) {
      return;
    }

    if (transaction.subtransactions && transaction.subtransactions.length > 0) {
      transaction.subtransactions.forEach((subtransaction, index) => {
        if (!subtransaction.category_id) {
          transactionWarnings.push({
            id: `subtransaction-${transaction.id}-${index}`,
            message: `Subtransaction of "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
            details: "Subtransactions must have a category assigned in YNAB.",
          });
          return;
        }

        processedTransactions.push({
          ...transaction,
          id: `${transaction.id}:sub:${index}`,
          amount: subtransaction.amount,
          category_id: subtransaction.category_id,
          category_name: subtransaction.category_name,
          subtransactions: [],
          original_transaction_id: transaction.id,
        });
      });
    } else {
      processedTransactions.push(transaction);
    }
  });

  const validTransactions = processedTransactions.filter((transaction) => {
    if (!transaction.category_id) {
      transactionWarnings.push({
        id: `transaction-${transaction.id}`,
        message: `Transaction "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
        details: "Transaction must have a category assigned in YNAB.",
      });
      return false;
    }

    if (isInflowTransaction(transaction)) {
      return false;
    }

    if (isUncategorizedTransaction(transaction)) {
      transactionWarnings.push({
        id: `unassigned-transaction-${transaction.id}`,
        message: `Transaction "${transaction.payee_name}" (${transaction.date}) is uncategorized.`,
        details: "This transaction is in the 'Uncategorized' category. Please assign it to a proper category in YNAB.",
      });
      return false;
    }

    const accountType = getAccountTypeFunc(transaction.account_id);
    if (!isValidType(accountType, true)) {
      transactionWarnings.push(
        createTypeWarning(
          `transaction-account-${transaction.id}`,
          `Transaction "${transaction.payee_name}" (${transaction.date}) account`,
          accountType,
          true,
        ),
      );
      return false;
    }

    const categoryType = getCategoryTypeFunc(transaction.category_id);
    if (!isValidType(categoryType, true)) {
      transactionWarnings.push(
        createTypeWarning(
          `transaction-category-${transaction.id}`,
          `Transaction "${transaction.payee_name}" (${transaction.date}) category`,
          categoryType,
          true,
        ),
      );
      return false;
    }

    return true;
  });

  return { validTransactions, transactionWarnings };
}

export function calculateCategorySpending(validTransactions, getAccountTypeFunc) {
  const categorySpending = {};
  const warnings = [];

  validTransactions.forEach((transaction) => {
    const accountType = getAccountTypeFunc(transaction.account_id);
    const categoryId = transaction.category_id;
    const amount = -transaction.amount;

    if (!isValidType(accountType, true)) {
      warnings.push(
        createTypeWarning(
          `account-${transaction.id}`,
          `Transaction "${transaction.payee_name}" (${transaction.date}) account`,
          accountType,
          true,
        ),
      );
      return;
    }

    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = { hisSpending: 0, herSpending: 0 };
    }

    if (accountType === "His") {
      categorySpending[categoryId].hisSpending += amount;
    } else if (accountType === "Hers") {
      categorySpending[categoryId].herSpending += amount;
    }
    // 'Shared' account transactions are not counted in either
  });

  return { categorySpending, warnings };
}

export function calculateSpendingTotals(
  categorySpending,
  categoriesList,
  getCategoryTypeFunc,
) {
  let hisTotalShared = 0;
  let herTotalShared = 0;
  let hisTotalForHer = 0;
  let herTotalForHim = 0;
  let hisTotalForHim = 0;
  let herTotalForHer = 0;
  const warnings = [];

  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const categoryType = getCategoryTypeFunc(categoryId);

    if (!isValidType(categoryType, true)) {
      const category = categoriesList.find((c) => c.id === categoryId);
      const categoryName = category ? category.name : `Category ID: ${categoryId}`;
      warnings.push(createTypeWarning(`category-${categoryId}`, categoryName, categoryType, true));
      return;
    }

    if (categoryType === "Shared") {
      hisTotalShared += spending.hisSpending;
      herTotalShared += spending.herSpending;
    } else if (categoryType === "His") {
      hisTotalForHim += spending.hisSpending;
      herTotalForHim += spending.herSpending;
    } else if (categoryType === "Hers") {
      herTotalForHer += spending.herSpending;
      hisTotalForHer += spending.hisSpending;
    }
  });

  return {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    warnings,
  };
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

export function createCategorySummary(
  categorySpending,
  categoriesList,
  categoryGroupsList,
  getCategoryTypeFunc,
) {
  const categorySummaryMap = {};
  const warnings = [];

  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const category = categoriesList.find((c) => c.id === categoryId);
    if (!category) {
      warnings.push({
        id: `missing-category-${categoryId}`,
        message: `Category with ID "${categoryId}" was not found in the categories list.`,
        details: "This may indicate a deleted category or data synchronization issue.",
      });
      return;
    }

    const group = categoryGroupsList.find((g) => g.id === category.category_group_id);
    if (!group) {
      warnings.push({
        id: `missing-group-${category.category_group_id}`,
        message: `Category group with ID "${category.category_group_id}" was not found for category "${category.name}".`,
        details: "This may indicate a deleted category group or data synchronization issue.",
      });
      return;
    }

    const categoryType = getCategoryTypeFunc(categoryId);

    if (!isValidType(categoryType)) {
      warnings.push(createTypeWarning(`summary-category-${categoryId}`, `Category "${category.name}"`, categoryType));
    }

    categorySummaryMap[categoryId] = {
      categoryId,
      categoryName: category.name,
      groupId: group.id,
      groupName: group.name,
      type: categoryType,
      hisSpending: spending.hisSpending,
      herSpending: spending.herSpending,
    };
  });

  return { categorySummaryMap, warnings };
}

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

  const categorySummary = Object.values(categorySummaryMap).sort((a, b) => {
    if (a.groupName < b.groupName) return -1;
    if (a.groupName > b.groupName) return 1;
    return a.categoryName.localeCompare(b.categoryName);
  });

  return {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    reimbursementAmount,
    reimbursementDirection,
    categorySummary,
    warnings: allWarnings,
  };
}
