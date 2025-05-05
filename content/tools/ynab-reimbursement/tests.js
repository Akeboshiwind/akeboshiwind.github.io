// YNAB Reimbursement Calculation Tests
// =====================================================

// Test utility functions
const createTestTransaction = (id, payee, date, amount, categoryId, accountId, transfer = false) => ({
  id, 
  payee_name: payee, 
  date, 
  amount, 
  category_id: categoryId, 
  account_id: accountId,
  transfer_transaction_id: transfer ? "transfer-id" : null, 
  transfer_account_id: transfer ? "transfer-acc" : null
});

const createTestCategory = (id, name, groupId) => ({
  id, 
  name, 
  category_group_id: groupId
});

const createTestCategoryGroup = (id, name) => ({ 
  id, 
  name 
});

// Mock functions for account and category type lookup
const mockGetAccountType = (typeMap) => (id) => typeMap[id] || 'Unset';
const mockGetCategoryType = (typeMap) => (id) => typeMap[id] || 'Unset';

// Container to run and display test results
const runPureFunctionTests = () => {
  const testSuites = [
    testFilterTransactions(),
    testCalculateCategorySpending(),
    testCalculateSpendingTotals(),
    testCalculateReimbursementValues(),
    testCreateCategorySummary()
  ];
  
  return testSuites;
};

var deepEqual = function (x, y) {
  if (x === y) {
    return true;
  } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {  
        if (! deepEqual(x[prop], y[prop])) { return false; }
      } else {
        return false;
      }
    }
    
    return true;
  }
  else {
    return false;
  }
}

var runTest = function (functionName, description, testFunction, testCases) {
  const results = testCases.map(testCase => {
    try {
      const actual = testFunction(testCase.input);
      const expected = testCase.expected;
      const passed = deepEqual(expected, actual);
      
      return {
        name: testCase.name,
        passed,
        expected,
        actual
      };
    } catch (error) {
      return {
        name: testCase.name,
        passed: false,
        error: error.message
      };
    }
  });

  return {
    functionName,
    description,
    results,
  }
}

// =====================================================
// INDIVIDUAL FUNCTION TESTS
// =====================================================

// 1. Tests for filterTransactions
const testFilterTransactions = () => {
  const calc = window.ynabReimbursementCalculations;
  
  const testCases = [
    {
      name: "Normal case: Valid transactions pass through",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Hers" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared", "cat2": "Shared" })
      },
      expected: {
        validTransactions: 2,
        warningsCount: 0
      }
    },
    {
      name: "Transfers are filtered out",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Transfer", "2023-01-02", -50000, "cat2", "acc2", true)
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Hers" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared", "cat2": "Shared" })
      },
      expected: {
        validTransactions: 1,
        warningsCount: 0
      }
    },
    {
      name: "Transactions without categories are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Missing Category", "2023-01-02", -50000, null, "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Hers" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared" })
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1
      }
    },
    {
      name: "Transactions with invalid account types are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Invalid Account", "2023-01-02", -50000, "cat2", "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Unset" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared", "cat2": "Shared" })
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1
      }
    },
    {
      name: "Transactions with invalid category types are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Invalid Category", "2023-01-02", -50000, "cat2", "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Hers" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared", "cat2": "Unset" })
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1
      }
    },
    {
      name: "Mixed case: Some valid, some invalid transactions",
      input: {
        transactions: [
          createTestTransaction("t1", "Valid", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Transfer", "2023-01-02", -50000, "cat2", "acc2", true),
          createTestTransaction("t3", "No Category", "2023-01-03", -30000, null, "acc3"),
          createTestTransaction("t4", "Invalid Account", "2023-01-04", -40000, "cat4", "acc4"),
          createTestTransaction("t5", "Invalid Category", "2023-01-05", -60000, "cat5", "acc5")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc5": "His", "acc4": "Unset" }),
        getCategoryType: mockGetCategoryType({ "cat1": "Shared", "cat4": "Shared", "cat5": "Unset" })
      },
      expected: {
        validTransactions: 1,
        warningsCount: 3 // No category, invalid account, invalid category
      }
    },
    {
      name: "Empty array case",
      input: {
        transactions: [],
        getAccountType: mockGetAccountType({}),
        getCategoryType: mockGetCategoryType({})
      },
      expected: {
        validTransactions: 0,
        warningsCount: 0
      }
    }
  ];
  
  return runTest(
    "filterTransactions",
    "Filters and validates transactions for processing",
    ({transactions, getAccountType, getCategoryType}) => {
      const { validTransactions, transactionWarnings } = calc.filterTransactions(
        transactions,
        getAccountType,
        getCategoryType
      );
      return {
        validTransactions: validTransactions.length,
        warningsCount: transactionWarnings.length
      }
    },
    testCases
  );
};

// 2. Tests for calculateCategorySpending
const testCalculateCategorySpending = () => {
  const calc = window.ynabReimbursementCalculations;
  
  const testCases = [
    {
      name: "Normal case: Transactions across different categories",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc1"),
          createTestTransaction("t3", "Utilities", "2023-01-03", -75000, "cat1", "acc2"),
          createTestTransaction("t4", "Entertainment", "2023-01-04", -25000, "cat2", "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc2": "Hers" })
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100, herSpending: 75 },
          cat2: { hisSpending: 50, herSpending: 25 },
        }
      }
    },
    {
      name: "His spending in different categories",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc1"),
          createTestTransaction("t3", "Gas", "2023-01-03", -30000, "cat3", "acc1")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His" })
      },
      expected: {
        categoryCount: 3,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100, herSpending: 0 },
          cat2: { hisSpending: 50, herSpending: 0 },
          cat3: { hisSpending: 30, herSpending: 0 },
        }
      }
    },
    {
      name: "Her spending in different categories",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -80000, "cat1", "acc2"),
          createTestTransaction("t2", "Restaurant", "2023-01-02", -40000, "cat2", "acc2")
        ],
        getAccountType: mockGetAccountType({ "acc2": "Hers" })
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 0, herSpending: 80 },
          cat2: { hisSpending: 0, herSpending: 40 },
        }
      }
    },
    {
      name: "Shared account spending should not be counted in either His or Hers",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat1", "acc3")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc3": "Shared" })
      },
      expected: {
        categoryCount: 1,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100, herSpending: 0 },
        }
      }
    },
    {
      name: "Invalid account types generate warnings",
      input: {
        transactions: [
          createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
          createTestTransaction("t2", "Invalid Account", "2023-01-02", -50000, "cat1", "acc4")
        ],
        getAccountType: mockGetAccountType({ "acc1": "His", "acc4": "Invalid" })
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          cat1: { hisSpending: 100, herSpending: 0 },
        }
      }
    },
    {
      name: "Empty array case",
      input: {
        transactions: [],
        getAccountType: mockGetAccountType({})
      },
      expected: {
        categoryCount: 0,
        warningsCount: 0,
        categories: {}
      }
    }
  ];
  
  return runTest(
    "calculateCategorySpending",
    "Calculates spending per category by account type",
    ({transactions, getAccountType}) => {
      const { categorySpending, warnings } = calc.calculateCategorySpending(
        transactions,
        getAccountType,
      );
      return {
        categoryCount: Object.keys(categorySpending).length,
        warningsCount: warnings.length,
        categories: categorySpending
      }
    },
    testCases
  );
};

// 3. Tests for calculateSpendingTotals
const testCalculateSpendingTotals = () => {
  const calc = window.ynabReimbursementCalculations;
  
  const testCases = [
    {
      name: "Normal case: Mixed spending across different category types",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 75 },   // Shared
          "cat2": { hisSpending: 50, herSpending: 0 },     // His
          "cat3": { hisSpending: 0, herSpending: 40 },     // Hers
          "cat4": { hisSpending: 20, herSpending: 30 }     // Shared
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "His Stuff", "g2"),
          createTestCategory("cat3", "Her Stuff", "g3"),
          createTestCategory("cat4", "Utilities", "g1")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "His", "cat3": "Hers", "cat4": "Shared"
        })
      },
      expected: {
        hisTotalShared: 120,
        herTotalShared: 105,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0
      }
    },
    {
      name: "Only shared categories",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 40 },
          "cat2": { hisSpending: 60, herSpending: 20 }
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "Shared"
        })
      },
      expected: {
        hisTotalShared: 160,
        herTotalShared: 60,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0
      }
    },
    {
      name: "Only his categories",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 80, herSpending: 20 },
          "cat2": { hisSpending: 40, herSpending: 10 }
        },
        categories: [
          createTestCategory("cat1", "His Stuff 1", "g1"),
          createTestCategory("cat2", "His Stuff 2", "g1")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "His", "cat2": "His"
        })
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 30,
        warningsCount: 0
      }
    },
    {
      name: "Only her categories",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 30, herSpending: 70 },
          "cat2": { hisSpending: 15, herSpending: 35 }
        },
        categories: [
          createTestCategory("cat1", "Her Stuff 1", "g1"),
          createTestCategory("cat2", "Her Stuff 2", "g1")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Hers", "cat2": "Hers"
        })
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 45,
        herTotalForHim: 0,
        warningsCount: 0
      }
    },
    {
      name: "Mixed spending with direct payments in both directions",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },   // Shared
          "cat2": { hisSpending: 40, herSpending: 20 },    // His
          "cat3": { hisSpending: 30, herSpending: 60 }     // Hers
        },
        categories: [
          createTestCategory("cat1", "Shared Expenses", "g1"),
          createTestCategory("cat2", "His Expenses", "g2"),
          createTestCategory("cat3", "Her Expenses", "g3")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "His", "cat3": "Hers"
        })
      },
      expected: {
        hisTotalShared: 100,
        herTotalShared: 50,
        hisTotalForHer: 30,
        herTotalForHim: 20,
        warningsCount: 0
      }
    },
    {
      name: "Invalid category types generate warnings",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },
          "cat2": { hisSpending: 20, herSpending: 10 }
        },
        categories: [
          createTestCategory("cat1", "Valid", "g1"),
          createTestCategory("cat2", "Invalid", "g2")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "Invalid"
        })
      },
      expected: {
        hisTotalShared: 100,
        herTotalShared: 50,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 1
      }
    },
    {
      name: "Empty object case",
      input: {
        categorySpending: {},
        categories: [],
        getCategoryType: mockGetCategoryType({})
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0
      }
    }
  ];
  
  return runTest(
    "calculateSpendingTotals",
    "Aggregates totals for shared and direct spending",
    ({categorySpending, categories, getCategoryType}) => {
      const { 
        hisTotalShared, 
        herTotalShared, 
        hisTotalForHer, 
        herTotalForHim, 
        warnings 
      } = calc.calculateSpendingTotals(
        categorySpending,
        categories,
        getCategoryType
      );
      return {
        hisTotalShared,
        herTotalShared,
        hisTotalForHer,
        herTotalForHim,
        warningsCount: warnings.length
      }
    },
    testCases
  );
};

// 4. Tests for calculateReimbursementValues
const testCalculateReimbursementValues = () => {
  const calc = window.ynabReimbursementCalculations;
  
  const testCases = [
    {
      name: "He owes her (positive heShouldPay)",
      input: {
        hisTotalShared: 75,
        herTotalShared: 125,
        hisTotalForHer: 10,
        herTotalForHim: 30
      },
      expected: {
        reimbursementAmount: 45,
        reimbursementDirection: "himToHer"
      }
    },
    {
      name: "She owes him (negative heShouldPay)",
      input: {
        hisTotalShared: 125,
        herTotalShared: 75,
        hisTotalForHer: 20,
        herTotalForHim: 10
      },
      expected: {
        reimbursementAmount: 35,
        reimbursementDirection: "herToHim"
      }
    },
    {
      name: "No one owes anything (zero heShouldPay)",
      input: {
        hisTotalShared: 100,
        herTotalShared: 100,
        hisTotalForHer: 25,
        herTotalForHim: 25
      },
      expected: {
        reimbursementAmount: 0,
        reimbursementDirection: "herToHim" // Direction doesn't matter when amount is 0
      }
    },
    {
      name: "Only direct payments - she paid for his stuff",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 80
      },
      expected: {
        reimbursementAmount: 80,
        reimbursementDirection: "himToHer"
      }
    },
    {
      name: "Only direct payments - he paid for her stuff",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 50,
        herTotalForHim: 0
      },
      expected: {
        reimbursementAmount: 50,
        reimbursementDirection: "herToHim"
      }
    },
    {
      name: "Only shared expenses - he paid more",
      input: {
        hisTotalShared: 140,
        herTotalShared: 60,
        hisTotalForHer: 0,
        herTotalForHim: 0
      },
      expected: {
        reimbursementAmount: 40,
        reimbursementDirection: "herToHim"
      }
    },
    {
      name: "Only shared expenses - she paid more",
      input: {
        hisTotalShared: 60,
        herTotalShared: 140,
        hisTotalForHer: 0,
        herTotalForHim: 0
      },
      expected: {
        reimbursementAmount: 40,
        reimbursementDirection: "himToHer"
      }
    },
    {
      name: "Fractional amounts are handled correctly",
      input: {
        hisTotalShared: 100.33,
        herTotalShared: 99.67,
        hisTotalForHer: 25.25,
        herTotalForHim: 24.75
      },
      expected: {
        reimbursementAmount: 0.5,
        reimbursementDirection: "herToHim"
      }
    },
    {
      name: "Zero amounts all around",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 0
      },
      expected: {
        reimbursementAmount: 0,
        reimbursementDirection: "herToHim" // Direction doesn't matter when amount is 0
      }
    }
  ];
  
  return runTest(
    "calculateReimbursementValues",
    "Determines the final reimbursement amount and direction",
    calc.calculateReimbursementValues,
    testCases
  );
};

// 5. Tests for createCategorySummary
const testCreateCategorySummary = () => {
  const calc = window.ynabReimbursementCalculations;
  
  const testCases = [
    {
      name: "Normal case: Valid categories with metadata",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },
          "cat2": { hisSpending: 75, herSpending: 25 }
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1")
        ],
        categoryGroups: [
          createTestCategoryGroup("g1", "Essentials")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "Shared"
        })
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          "cat1": {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared"
          },
          "cat2": {
            categoryName: "Utilities",
            groupName: "Essentials",
            type: "Shared"
          }
        }
      }
    },
    {
      name: "Categories that don't exist in the list generate warnings",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },
          "missing": { hisSpending: 75, herSpending: 25 }
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1")
        ],
        categoryGroups: [
          createTestCategoryGroup("g1", "Essentials")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "missing": "Shared"
        })
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          "cat1": {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared"
          }
        }
      }
    },
    {
      name: "Categories with missing group information generate warnings",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },
          "cat2": { hisSpending: 75, herSpending: 25 }
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "missing")
        ],
        categoryGroups: [
          createTestCategoryGroup("g1", "Essentials")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "Shared"
        })
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          "cat1": {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared"
          }
        }
      }
    },
    {
      name: "Invalid category types are reported as warnings but included in summary",
      input: {
        categorySpending: {
          "cat1": { hisSpending: 100, herSpending: 50 },
          "cat2": { hisSpending: 75, herSpending: 25 }
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1")
        ],
        categoryGroups: [
          createTestCategoryGroup("g1", "Essentials")
        ],
        getCategoryType: mockGetCategoryType({
          "cat1": "Shared", "cat2": "Invalid"
        })
      },
      expected: {
        categoryCount: 2,
        warningsCount: 1,
        categories: {
          "cat1": {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared"
          },
          "cat2": {
            categoryName: "Utilities",
            groupName: "Essentials",
            type: "Invalid"
          }
        }
      }
    },
    {
      name: "Empty object case",
      input: {
        categorySpending: {},
        categories: [],
        categoryGroups: [],
        getCategoryType: mockGetCategoryType({})
      },
      expected: {
        categoryCount: 0,
        warningsCount: 0,
        categories: {}
      }
    }
  ];

  return runTest(
    "createCategorySummary",
    "Prepares detailed category data with metadata for display",
    ({categorySpending, categories, categoryGroups, getCategoryType}) => {
      const { categorySummaryMap, warnings } = calc.createCategorySummary(
        categorySpending,
        categories,
        categoryGroups,
        getCategoryType
      );
      return {
        categoryCount: Object.keys(categorySummaryMap).length,
        warningsCount: warnings.length,
        categories: Object.fromEntries(
          Object.entries(categorySummaryMap).map(([key, value]) => [key , {
            categoryName: value.categoryName,
            groupName: value.groupName,
            type: value.type
          }])
        )
      }
    },
    testCases
  );
};

// Function to run all pure function tests
const handleRunPureFunctionTests = () => {
  const testResults = runPureFunctionTests();
  return testResults;
};

// Export all test functions
window.ynabReimbursementTests = {
  // Test utilities
  createTestTransaction,
  createTestCategory,
  createTestCategoryGroup,
  mockGetAccountType,
  mockGetCategoryType,
  
  // Individual function tests
  testFilterTransactions,
  testCalculateCategorySpending,
  testCalculateSpendingTotals,
  testCalculateReimbursementValues,
  testCreateCategorySummary,
  
  // Test runner
  runPureFunctionTests,
  handleRunPureFunctionTests
};
