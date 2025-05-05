// YNAB Reimbursement Calculations - Pure Functions
// =====================================================

// Validation function for account and category types
const isValidType = (type, forCalculation = false) => {
  // Valid types for configuration ('Unset' is allowed during configuration)
  const validConfigTypes = ['His', 'Hers', 'Shared', 'Unset'];
  
  // Valid types for calculation (must be fully specified)
  const validCalculationTypes = ['His', 'Hers', 'Shared'];
  
  // Check against the appropriate list
  return forCalculation 
    ? validCalculationTypes.includes(type)
    : validConfigTypes.includes(type);
};

// Helper to create validation warnings
const createTypeWarning = (id, name, type, forCalculation = false) => {
  const expectedTypes = forCalculation 
    ? 'His, Hers, or Shared' 
    : 'His, Hers, Shared, or Unset';
    
  return {
    id: `invalid-type-${id}`,
    message: `"${name}" has an invalid type: "${type}".`,
    details: `Expected type to be one of: ${expectedTypes}.`
  };
};

// Function to filter transactions and return valid ones with warnings
const filterTransactions = (
  transactionsList,
  getAccountTypeFunc,
  getCategoryTypeFunc
) => {
  const transactionWarnings = [];
  
  // Filter and process each transaction
  const validTransactions = transactionsList.filter(transaction => {
    // Skip transfer transactions
    if (transaction.transfer_transaction_id || transaction.transfer_account_id) {
      return false;
    }
    
    // Check if transaction has a category
    if (!transaction.category_id) {
      transactionWarnings.push({
        id: `transaction-${transaction.id}`,
        message: `Transaction "${transaction.payee_name}" (${transaction.date}) has no category assigned.`,
        details: "Transaction must have a category assigned in YNAB."
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
          true
        )
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
          true
        )
      );
      return false;
    }
    
    return true;
  });
  
  return { validTransactions, transactionWarnings };
};

// Function to calculate spending by category
const calculateCategorySpending = (
  validTransactions,
  getAccountTypeFunc
) => {
  // Initialize map to store spending per category by account type
  const categorySpending = {};
  const warnings = [];
  
  // Process all valid transactions
  validTransactions.forEach(transaction => {
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
          true
        )
      );
      return; // Skip this transaction
    }
    
    // Initialize category if needed
    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        hisSpending: 0,
        herSpending: 0
      };
    }
    
    // Update spending based on account type
    if (accountType === 'His') {
      categorySpending[categoryId].hisSpending += amount;
    } else if (accountType === 'Hers') {
      categorySpending[categoryId].herSpending += amount;
    }
    // Note: 'Shared' account transactions would not be counted in either His or Hers
    // If needed, this could be expanded to handle Shared account types differently
  });
  
  return { categorySpending, warnings };
};

// Function to calculate spending totals
const calculateSpendingTotals = (
  categorySpending,
  categoriesList,
  getCategoryTypeFunc
) => {
  let hisTotalShared = 0;
  let herTotalShared = 0;
  let hisTotalForHer = 0;
  let herTotalForHim = 0;
  const warnings = [];
  
  // Process each category
  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const categoryType = getCategoryTypeFunc(categoryId);
    
    // Check for invalid category type
    if (!isValidType(categoryType, true)) {
      const category = categoriesList.find(c => c.id === categoryId);
      const categoryName = category ? category.name : `Category ID: ${categoryId}`;
      
      warnings.push(
        createTypeWarning(
          `category-${categoryId}`, 
          categoryName, 
          categoryType,
          true
        )
      );
      return; // Skip this category
    }
    
    if (categoryType === 'Shared') {
      hisTotalShared += spending.hisSpending;
      herTotalShared += spending.herSpending;
    } else if (categoryType === 'His') {
      // Her spending in his categories
      herTotalForHim += spending.herSpending;
    } else if (categoryType === 'Hers') {
      // His spending in her categories
      hisTotalForHer += spending.hisSpending;
    }
  });
  
  return {
    hisTotalShared,
    herTotalShared,
    hisTotalForHer,
    herTotalForHim,
    warnings
  };
};

// Function to calculate reimbursement amount and direction
const calculateReimbursementValues = (spendingTotals) => {
  const { hisTotalShared, herTotalShared, hisTotalForHer, herTotalForHim } = spendingTotals;
  
  // Calculate shared spending difference
  const totalShared = hisTotalShared + herTotalShared;
  const heShouldPay =
    ((totalShared / 2) - hisTotalShared)
    + (herTotalForHim - hisTotalForHer);
  
  // Calculate final reimbursement
  const reimbursementAmount = Math.abs(heShouldPay);
  const reimbursementDirection = (heShouldPay > 0) ? 'himToHer' : 'herToHim';
  
  return {
    reimbursementAmount,
    reimbursementDirection
  };
};

// Function to create detailed category summary with metadata
const createCategorySummary = (
  categorySpending,
  categoriesList,
  categoryGroupsList,
  getCategoryTypeFunc
) => {
  const categorySummaryMap = {};
  const warnings = [];
  
  // Add metadata to each category's spending data
  Object.entries(categorySpending).forEach(([categoryId, spending]) => {
    const category = categoriesList.find(c => c.id === categoryId);
    if (!category) {
      warnings.push({
        id: `missing-category-${categoryId}`,
        message: `Category with ID "${categoryId}" was not found in the categories list.`,
        details: "This may indicate a deleted category or data synchronization issue."
      });
      return;
    }
    
    const group = categoryGroupsList.find(g => g.id === category.category_group_id);
    if (!group) {
      warnings.push({
        id: `missing-group-${category.category_group_id}`,
        message: `Category group with ID "${category.category_group_id}" was not found for category "${category.name}".`,
        details: "This may indicate a deleted category group or data synchronization issue."
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
          categoryType
        )
      );
    }
    
    categorySummaryMap[categoryId] = {
      categoryId: categoryId,
      categoryName: category.name,
      groupId: group.id,
      groupName: group.name,
      type: categoryType,
      hisSpending: spending.hisSpending,
      herSpending: spending.herSpending
    };
  });
  
  return { categorySummaryMap, warnings };
};

// Pure function for calculating reimbursement data
const calculateReimbursementPure = (
  transactionsList, 
  categoriesList, 
  categoryGroupsList, 
  getAccountTypeFunc, 
  getCategoryTypeFunc, 
  hasWarnings = false
) => {
  if (hasWarnings) {
    return {
      hisTotalShared: 0,
      herTotalShared: 0,
      hisTotalForHer: 0,
      herTotalForHim: 0,
      reimbursementAmount: 0,
      reimbursementDirection: null,
      categorySummary: [],
      warnings: []
    };
  }
  
  // Collect all warnings from the entire calculation process
  const allWarnings = [];
  
  // Step 1: Filter transactions
  const { validTransactions, transactionWarnings } = filterTransactions(
    transactionsList,
    getAccountTypeFunc,
    getCategoryTypeFunc
  );
  allWarnings.push(...transactionWarnings);
  
  // Step 2: Calculate raw spending by category (without metadata)
  const { 
    categorySpending, 
    warnings: categorySpendingWarnings 
  } = calculateCategorySpending(
    validTransactions,
    getAccountTypeFunc
  );
  allWarnings.push(...categorySpendingWarnings);
  
  // Step 3: Calculate spending totals
  const { 
    hisTotalShared, 
    herTotalShared, 
    hisTotalForHer, 
    herTotalForHim, 
    warnings: spendingWarnings 
  } = calculateSpendingTotals(
    categorySpending,
    categoriesList,
    getCategoryTypeFunc
  );
  allWarnings.push(...spendingWarnings);
  
  // Step 4: Calculate reimbursement amount and direction
  const { reimbursementAmount, reimbursementDirection } = calculateReimbursementValues({
    hisTotalShared, 
    herTotalShared, 
    hisTotalForHer, 
    herTotalForHim
  });
  
  // Step 5: Create detailed category summary for display
  const { categorySummaryMap, warnings: summaryWarnings } = createCategorySummary(
    categorySpending,
    categoriesList,
    categoryGroupsList,
    getCategoryTypeFunc
  );
  allWarnings.push(...summaryWarnings);
  
  // Convert to sorted array for display
  const categorySummary = Object.values(categorySummaryMap)
    .map(category => ({
      ...category,
      hisSpending: category.hisSpending,
      herSpending: category.herSpending
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
    reimbursementAmount: reimbursementAmount,
    reimbursementDirection,
    categorySummary,
    warnings: allWarnings
  };
};

// Export all the functions for use in other files
window.ynabReimbursementCalculations = {
  // Core calculation functions
  isValidType,
  createTypeWarning,
  filterTransactions,
  calculateCategorySpending,
  calculateSpendingTotals,
  calculateReimbursementValues,
  createCategorySummary,
  calculateReimbursementPure
};
