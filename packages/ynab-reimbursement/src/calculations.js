// >> Util

// Validation function for account and category types
export function isValidType(type, forCalculation = false) {
  // Valid types for configuration ('Unset' is allowed during configuration)
  const validConfigTypes = ["His", "Hers", "Shared", "Unset"];

  // Valid types for calculation (must be fully specified)
  const validCalculationTypes = ["His", "Hers", "Shared"];

  // Check against the appropriate list
  return forCalculation
    ? validCalculationTypes.includes(type)
    : validConfigTypes.includes(type);
}

// Helper to create validation warnings
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

// Function to check if a transaction is in the inflow category
export function isInflowTransaction(transaction) {
  return transaction.category_name === "Inflow: Ready to Assign";
}

// Function to check if a transaction is uncategorized
export function isUncategorizedTransaction(transaction) {
  return transaction.category_name === "Uncategorized";
}

// >> Core

// Function to filter transactions and return valid ones with warnings
export function filterTransactions(
  transactionsList,
  getAccountTypeFunc,
  getCategoryTypeFunc,
) {
  const transactionWarnings = [];
  const processedTransactions = [];

  // Process each transaction
  transactionsList.forEach((transaction) => {
    // Skip transfer transactions
    if (
      transaction.transfer_transaction_id ||
      transaction.transfer_account_id
    ) {
      return;
    }

    // Handle split transactions
    if (transaction.subtransactions && transaction.subtransactions.length > 0) {
      // For each subtransaction, create a copy of the parent with the subtransaction details
      transaction.subtransactions.forEach((subtransaction, index) => {
        // Skip subtransactions without categories
        if (!subtransaction.category_id) {
          transactionWarnings.push({
            id: `subtransaction-${transaction.id}-${index}`,
            message: `Subtransaction of "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
            details: "Subtransactions must have a category assigned in YNAB.",
          });
          return;
        }

        // Create a new transaction based on the parent but with subtransaction details
        const newTransaction = {
          ...transaction,
          id: `${transaction.id}:sub:${index}`,
          amount: subtransaction.amount,
          category_id: subtransaction.category_id,
          category_name: subtransaction.category_name,
          // We're not copying the subtransactions array to avoid recursion
          subtransactions: [],
          original_transaction_id: transaction.id,
        };

        processedTransactions.push(newTransaction);
      });
    } else {
      // Regular non-split transaction
      processedTransactions.push(transaction);
    }
  });

  // Now filter the expanded list of transactions
  const validTransactions = processedTransactions.filter((transaction) => {
    // Check if transaction has a category
    if (!transaction.category_id) {
      transactionWarnings.push({
        id: `transaction-${transaction.id}`,
        message: `Transaction "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
        details: "Transaction must have a category assigned in YNAB.",
      });
      return false;
    }

    // Skip inflow transactions
    if (isInflowTransaction(transaction)) {
      return false;
    }

    // Flag uncategorized transactions as warnings
    if (isUncategorizedTransaction(transaction)) {
      transactionWarnings.push({
        id: `unassigned-transaction-${transaction.id}`,
        message: `Transaction "${transaction.payee_name}" (${transaction.date}) is uncategorized.`,
        details: "This transaction is in the 'Uncategorized' category. Please assign it to a proper category in YNAB.",
      });
      return false;
    }

    // Check for valid account type
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

    // Check for valid category type
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

// Function to calculate spending by category
export function calculateCategorySpending(validTransactions, getAccountTypeFunc) {
  // Initialize map to store spending per category by account type
  const categorySpending = {};
  const warnings = [];

  // Process all valid transactions
  validTransactions.forEach((transaction) => {
    const accountType = getAccountTypeFunc(transaction.account_id);
    const categoryId = transaction.category_id;
    const amount = -transaction.amount; // Keep YNAB amounts in milliunits

    // Validate account type is one of the expected values
    if (!isValidType(accountType, true)) {
      warnings.push(
        createTypeWarning(
          `account-${transaction.id}`,
          `Transaction "${transaction.payee_name}" (${transaction.date}) account`,
          accountType,
          true,
        ),
      );
      return; // Skip this transaction
    }

    // Initialize category if needed
    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        hisSpending: 0,
        herSpending: 0,
      };
    }

    // Update spending based on account type
    if (accountType === "His") {
      categorySpending[categoryId].hisSpending += amount;
    } else if (accountType === "Hers") {
      categorySpending[categoryId].herSpending += amount;
    }
    // Note: 'Shared' account transactions would not be counted in either His or Hers
  });

  return { categorySpending, warnings };
}

// Function to calculate spending totals
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

  // Process each category
  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const categoryType = getCategoryTypeFunc(categoryId);

    // Check for invalid category type
    if (!isValidType(categoryType, true)) {
      const category = categoriesList.find((c) => c.id === categoryId);
      const categoryName = category
        ? category.name
        : `Category ID: ${categoryId}`;

      warnings.push(
        createTypeWarning(
          `category-${categoryId}`,
          categoryName,
          categoryType,
          true,
        ),
      );
      return; // Skip this category
    }

    if (categoryType === "Shared") {
      hisTotalShared += spending.hisSpending;
      herTotalShared += spending.herSpending;
    } else if (categoryType === "His") {
      // His spending in his own categories
      hisTotalForHim += spending.hisSpending;
      // Her spending in his categories
      herTotalForHim += spending.herSpending;
    } else if (categoryType === "Hers") {
      // Her spending in her own categories
      herTotalForHer += spending.herSpending;
      // His spending in her categories
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

// Function to calculate reimbursement amount and direction
export function calculateReimbursementValues(spendingTotals) {
  const { hisTotalShared, herTotalShared, hisTotalForHer, herTotalForHim } =
    spendingTotals;

  // Calculate shared spending difference
  const totalShared = hisTotalShared + herTotalShared;
  const heShouldPay =
    totalShared / 2 - hisTotalShared + (herTotalForHim - hisTotalForHer);

  // Calculate final reimbursement
  const reimbursementAmount = Math.abs(heShouldPay);
  const reimbursementDirection = heShouldPay > 0 ? "himToHer" : "herToHim";

  return {
    reimbursementAmount,
    reimbursementDirection,
  };
}

// Function to create detailed category summary with metadata
export function createCategorySummary(
  categorySpending,
  categoriesList,
  categoryGroupsList,
  getCategoryTypeFunc,
) {
  const categorySummaryMap = {};
  const warnings = [];

  // Add metadata to each category's spending data
  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const category = categoriesList.find((c) => c.id === categoryId);
    if (!category) {
      warnings.push({
        id: `missing-category-${categoryId}`,
        message: `Category with ID "${categoryId}" was not found in the categories list.`,
        details:
          "This may indicate a deleted category or data synchronization issue.",
      });
      return;
    }

    const group = categoryGroupsList.find(
      (g) => g.id === category.category_group_id,
    );
    if (!group) {
      warnings.push({
        id: `missing-group-${category.category_group_id}`,
        message: `Category group with ID "${category.category_group_id}" was not found for category "${category.name}".`,
        details:
          "This may indicate a deleted category group or data synchronization issue.",
      });
      return;
    }

    const categoryType = getCategoryTypeFunc(categoryId);

    // Validate category type (only log warning, still include in summary)
    if (!isValidType(categoryType)) {
      warnings.push(
        createTypeWarning(
          `summary-category-${categoryId}`,
          `Category "${category.name}"`,
          categoryType,
        ),
      );
    }

    categorySummaryMap[categoryId] = {
      categoryId: categoryId,
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

// Pure function for calculating reimbursement data
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

  // Collect all warnings from the entire calculation process
  const allWarnings = [];

  // Step 1: Filter transactions
  const { validTransactions, transactionWarnings } = filterTransactions(
    transactionsList,
    getAccountTypeFunc,
    getCategoryTypeFunc,
  );
  allWarnings.push(...transactionWarnings);

  // Step 2: Calculate raw spending by category (without metadata)
  const { categorySpending, warnings: categorySpendingWarnings } =
    calculateCategorySpending(validTransactions, getAccountTypeFunc);
  allWarnings.push(...categorySpendingWarnings);

  // Step 3: Calculate spending totals
  const {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    hisTotalForHim,
    herTotalForHer,
    warnings: spendingWarnings,
  } = calculateSpendingTotals(
    categorySpending,
    categoriesList,
    getCategoryTypeFunc,
  );
  allWarnings.push(...spendingWarnings);

  // Step 4: Calculate reimbursement amount and direction
  const { reimbursementAmount, reimbursementDirection } =
    calculateReimbursementValues({
      hisTotalShared,
      herTotalShared,
      hisTotalForHer,
      herTotalForHim,
    });

  // Step 5: Create detailed category summary for display
  const { categorySummaryMap, warnings: summaryWarnings } =
    createCategorySummary(
      categorySpending,
      categoriesList,
      categoryGroupsList,
      getCategoryTypeFunc,
    );
  allWarnings.push(...summaryWarnings);

  // Convert to sorted array for display
  const categorySummary = Object.values(categorySummaryMap)
    .map((category) => ({
      ...category,
      hisSpending: category.hisSpending,
      herSpending: category.herSpending,
    }))
    .sort((a, b) => {
      // First sort by group name
      if (a.groupName < b.groupName) return -1;
      if (a.groupName > b.groupName) return 1;

      // Then by category name
      return a.categoryName.localeCompare(b.categoryName);
    });

  return {
    hisTotalShared: hisTotalShared,
    herTotalShared: herTotalShared,
    hisTotalForHer: hisTotalForHer,
    herTotalForHim: herTotalForHim,
    hisTotalForHim: hisTotalForHim,
    herTotalForHer: herTotalForHer,
    reimbursementAmount: reimbursementAmount,
    reimbursementDirection,
    categorySummary,
    warnings: allWarnings,
  };
}
