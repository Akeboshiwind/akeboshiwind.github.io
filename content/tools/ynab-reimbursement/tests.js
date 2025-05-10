// >> Utils

// Test utility functions
const createTestTransaction = (
  id,
  payee,
  date,
  amount,
  categoryId,
  accountId,
  transfer = false,
  category_name = null,
) => ({
  id,
  payee_name: payee,
  date,
  amount,
  category_id: categoryId,
  account_id: accountId,
  transfer_transaction_id: transfer ? "transfer-id" : null,
  transfer_account_id: transfer ? "transfer-acc" : null,
  category_name: category_name,
});

const createTestCategory = (id, name, groupId) => ({
  id,
  name,
  category_group_id: groupId,
});

const createTestCategoryGroup = (id, name) => ({
  id,
  name,
});

// Mock functions for account and category type lookup
const mockGetAccountType = (typeMap) => (id) => typeMap[id] || "Unset";
const mockGetCategoryType = (typeMap) => (id) => typeMap[id] || "Unset";

function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

function runTest(functionName, description, testFunction, testCases) {
  const results = testCases.map((testCase) => {
    try {
      const actual = testFunction(testCase.input);
      const expected = testCase.expected;
      const passed = deepEqual(expected, actual);

      return {
        name: testCase.name,
        passed,
        expected,
        actual,
      };
    } catch (error) {
      return {
        name: testCase.name,
        passed: false,
        error: error.message,
      };
    }
  });

  return {
    functionName,
    description,
    results,
  };
}

// >> Tests

// 1. Tests for filterTransactions
function testFilterTransactions() {
  const calc = window.ynabReimbursementCalculations;

  const testCases = [
    {
      name: "Normal case: Valid transactions pass through",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Restaurant",
            "2023-01-02",
            -50000,
            "cat2",
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        validTransactions: 2,
        warningsCount: 0,
      },
    },
    {
      name: "Transfers are filtered out",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Transfer",
            "2023-01-02",
            -50000,
            "cat2",
            "acc2",
            true,
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 0,
      },
    },
    {
      name: "Inflow transactions are filtered out",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Salary",
            "2023-01-02",
            500000,
            "inflow-cat",
            "acc2",
            false,
            "Inflow: Ready to Assign",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          "inflow-cat": "Shared",
        }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 0,
      },
    },
    {
      name: "Uncategorized transactions are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Unknown Expense",
            "2023-01-02",
            -50000,
            "uncat-id",
            "acc2",
            false,
            "Uncategorized",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          "uncat-id": "Shared",
        }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1,
      },
    },
    {
      name: "Transactions without categories are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Missing Category",
            "2023-01-02",
            -50000,
            null,
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({ cat1: "Shared" }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1,
      },
    },
    {
      name: "Transactions with invalid account types are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Invalid Account",
            "2023-01-02",
            -50000,
            "cat2",
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Unset" }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1,
      },
    },
    {
      name: "Transactions with invalid category types are filtered with warnings",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Invalid Category",
            "2023-01-02",
            -50000,
            "cat2",
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
        getCategoryType: mockGetCategoryType({ cat1: "Shared", cat2: "Unset" }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 1,
      },
    },
    {
      name: "Mixed case: Some valid, some invalid transactions",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Valid",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Transfer",
            "2023-01-02",
            -50000,
            "cat2",
            "acc2",
            true,
          ),
          createTestTransaction(
            "t3",
            "No Category",
            "2023-01-03",
            -30000,
            null,
            "acc3",
          ),
          createTestTransaction(
            "t4",
            "Invalid Account",
            "2023-01-04",
            -40000,
            "cat4",
            "acc4",
          ),
          createTestTransaction(
            "t5",
            "Invalid Category",
            "2023-01-05",
            -60000,
            "cat5",
            "acc5",
          ),
        ],
        getAccountType: mockGetAccountType({
          acc1: "His",
          acc5: "His",
          acc4: "Unset",
        }),
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat4: "Shared",
          cat5: "Unset",
        }),
      },
      expected: {
        validTransactions: 1,
        warningsCount: 3, // No category, invalid account, invalid category
      },
    },
    {
      name: "Empty array case",
      input: {
        transactions: [],
        getAccountType: mockGetAccountType({}),
        getCategoryType: mockGetCategoryType({}),
      },
      expected: {
        validTransactions: 0,
        warningsCount: 0,
      },
    },
  ];

  return runTest(
    "filterTransactions",
    "Filters and validates transactions for processing",
    ({ transactions, getAccountType, getCategoryType }) => {
      const { validTransactions, transactionWarnings } =
        calc.filterTransactions(transactions, getAccountType, getCategoryType);
      return {
        validTransactions: validTransactions.length,
        warningsCount: transactionWarnings.length,
      };
    },
    testCases,
  );
}

// 2. Tests for calculateCategorySpending
function testCalculateCategorySpending() {
  const calc = window.ynabReimbursementCalculations;

  const testCases = [
    {
      name: "Normal case: Transactions across different categories",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Restaurant",
            "2023-01-02",
            -50000,
            "cat2",
            "acc1",
          ),
          createTestTransaction(
            "t3",
            "Utilities",
            "2023-01-03",
            -75000,
            "cat1",
            "acc2",
          ),
          createTestTransaction(
            "t4",
            "Entertainment",
            "2023-01-04",
            -25000,
            "cat2",
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc2: "Hers" }),
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100000, herSpending: 75000 },
          cat2: { hisSpending: 50000, herSpending: 25000 },
        },
      },
    },
    {
      name: "His spending in different categories",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Restaurant",
            "2023-01-02",
            -50000,
            "cat2",
            "acc1",
          ),
          createTestTransaction(
            "t3",
            "Gas",
            "2023-01-03",
            -30000,
            "cat3",
            "acc1",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His" }),
      },
      expected: {
        categoryCount: 3,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100000, herSpending: 0 },
          cat2: { hisSpending: 50000, herSpending: 0 },
          cat3: { hisSpending: 30000, herSpending: 0 },
        },
      },
    },
    {
      name: "Her spending in different categories",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -80000,
            "cat1",
            "acc2",
          ),
          createTestTransaction(
            "t2",
            "Restaurant",
            "2023-01-02",
            -40000,
            "cat2",
            "acc2",
          ),
        ],
        getAccountType: mockGetAccountType({ acc2: "Hers" }),
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 0, herSpending: 80000 },
          cat2: { hisSpending: 0, herSpending: 40000 },
        },
      },
    },
    {
      name: "Shared account spending should not be counted in either His or Hers",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Restaurant",
            "2023-01-02",
            -50000,
            "cat1",
            "acc3",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc3: "Shared" }),
      },
      expected: {
        categoryCount: 1,
        warningsCount: 0,
        categories: {
          cat1: { hisSpending: 100000, herSpending: 0 },
        },
      },
    },
    {
      name: "Invalid account types generate warnings",
      input: {
        transactions: [
          createTestTransaction(
            "t1",
            "Grocery",
            "2023-01-01",
            -100000,
            "cat1",
            "acc1",
          ),
          createTestTransaction(
            "t2",
            "Invalid Account",
            "2023-01-02",
            -50000,
            "cat1",
            "acc4",
          ),
        ],
        getAccountType: mockGetAccountType({ acc1: "His", acc4: "Invalid" }),
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          cat1: { hisSpending: 100000, herSpending: 0 },
        },
      },
    },
    {
      name: "Empty array case",
      input: {
        transactions: [],
        getAccountType: mockGetAccountType({}),
      },
      expected: {
        categoryCount: 0,
        warningsCount: 0,
        categories: {},
      },
    },
  ];

  return runTest(
    "calculateCategorySpending",
    "Calculates spending per category by account type",
    ({ transactions, getAccountType }) => {
      const { categorySpending, warnings } = calc.calculateCategorySpending(
        transactions,
        getAccountType,
      );
      return {
        categoryCount: Object.keys(categorySpending).length,
        warningsCount: warnings.length,
        categories: categorySpending,
      };
    },
    testCases,
  );
}

// 3. Tests for calculateSpendingTotals
function testCalculateSpendingTotals() {
  const calc = window.ynabReimbursementCalculations;

  const testCases = [
    {
      name: "Normal case: Mixed spending across different category types",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 75000 }, // Shared
          cat2: { hisSpending: 50000, herSpending: 0 }, // His
          cat3: { hisSpending: 0, herSpending: 40000 }, // Hers
          cat4: { hisSpending: 20000, herSpending: 30000 }, // Shared
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "His Stuff", "g2"),
          createTestCategory("cat3", "Her Stuff", "g3"),
          createTestCategory("cat4", "Utilities", "g1"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "His",
          cat3: "Hers",
          cat4: "Shared",
        }),
      },
      expected: {
        hisTotalShared: 120000,
        herTotalShared: 105000,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0,
      },
    },
    {
      name: "Only shared categories",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 40000 },
          cat2: { hisSpending: 60000, herSpending: 20000 },
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        hisTotalShared: 160000,
        herTotalShared: 60000,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0,
      },
    },
    {
      name: "Only his categories",
      input: {
        categorySpending: {
          cat1: { hisSpending: 80000, herSpending: 20000 },
          cat2: { hisSpending: 40000, herSpending: 10000 },
        },
        categories: [
          createTestCategory("cat1", "His Stuff 1", "g1"),
          createTestCategory("cat2", "His Stuff 2", "g1"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "His",
          cat2: "His",
        }),
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 30000,
        warningsCount: 0,
      },
    },
    {
      name: "Only her categories",
      input: {
        categorySpending: {
          cat1: { hisSpending: 30000, herSpending: 70000 },
          cat2: { hisSpending: 15000, herSpending: 35000 },
        },
        categories: [
          createTestCategory("cat1", "Her Stuff 1", "g1"),
          createTestCategory("cat2", "Her Stuff 2", "g1"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "Hers",
          cat2: "Hers",
        }),
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 45000,
        herTotalForHim: 0,
        warningsCount: 0,
      },
    },
    {
      name: "Mixed spending with direct payments in both directions",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 }, // Shared
          cat2: { hisSpending: 40000, herSpending: 20000 }, // His
          cat3: { hisSpending: 30000, herSpending: 60000 }, // Hers
        },
        categories: [
          createTestCategory("cat1", "Shared Expenses", "g1"),
          createTestCategory("cat2", "His Expenses", "g2"),
          createTestCategory("cat3", "Her Expenses", "g3"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "His",
          cat3: "Hers",
        }),
      },
      expected: {
        hisTotalShared: 100000,
        herTotalShared: 50000,
        hisTotalForHer: 30000,
        herTotalForHim: 20000,
        warningsCount: 0,
      },
    },
    {
      name: "Invalid category types generate warnings",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 },
          cat2: { hisSpending: 20000, herSpending: 10000 },
        },
        categories: [
          createTestCategory("cat1", "Valid", "g1"),
          createTestCategory("cat2", "Invalid", "g2"),
        ],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Invalid",
        }),
      },
      expected: {
        hisTotalShared: 100000,
        herTotalShared: 50000,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 1,
      },
    },
    {
      name: "Empty object case",
      input: {
        categorySpending: {},
        categories: [],
        getCategoryType: mockGetCategoryType({}),
      },
      expected: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 0,
        warningsCount: 0,
      },
    },
  ];

  return runTest(
    "calculateSpendingTotals",
    "Aggregates totals for shared and direct spending",
    ({ categorySpending, categories, getCategoryType }) => {
      const {
        hisTotalShared,
        herTotalShared,
        hisTotalForHer,
        herTotalForHim,
        warnings,
      } = calc.calculateSpendingTotals(
        categorySpending,
        categories,
        getCategoryType,
      );
      return {
        hisTotalShared,
        herTotalShared,
        hisTotalForHer,
        herTotalForHim,
        warningsCount: warnings.length,
      };
    },
    testCases,
  );
}

// 4. Tests for calculateReimbursementValues
function testCalculateReimbursementValues() {
  const calc = window.ynabReimbursementCalculations;

  const testCases = [
    {
      name: "He owes her (positive heShouldPay)",
      input: {
        hisTotalShared: 75000,
        herTotalShared: 125000,
        hisTotalForHer: 10000,
        herTotalForHim: 30000,
      },
      expected: {
        reimbursementAmount: 45000,
        reimbursementDirection: "himToHer",
      },
    },
    {
      name: "She owes him (negative heShouldPay)",
      input: {
        hisTotalShared: 125000,
        herTotalShared: 75000,
        hisTotalForHer: 20000,
        herTotalForHim: 10000,
      },
      expected: {
        reimbursementAmount: 35000,
        reimbursementDirection: "herToHim",
      },
    },
    {
      name: "No one owes anything (zero heShouldPay)",
      input: {
        hisTotalShared: 100000,
        herTotalShared: 100000,
        hisTotalForHer: 25000,
        herTotalForHim: 25000,
      },
      expected: {
        reimbursementAmount: 0,
        reimbursementDirection: "herToHim", // Direction doesn't matter when amount is 0
      },
    },
    {
      name: "Only direct payments - she paid for his stuff",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 80000,
      },
      expected: {
        reimbursementAmount: 80000,
        reimbursementDirection: "himToHer",
      },
    },
    {
      name: "Only direct payments - he paid for her stuff",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 50000,
        herTotalForHim: 0,
      },
      expected: {
        reimbursementAmount: 50000,
        reimbursementDirection: "herToHim",
      },
    },
    {
      name: "Only shared expenses - he paid more",
      input: {
        hisTotalShared: 140000,
        herTotalShared: 60000,
        hisTotalForHer: 0,
        herTotalForHim: 0,
      },
      expected: {
        reimbursementAmount: 40000,
        reimbursementDirection: "herToHim",
      },
    },
    {
      name: "Only shared expenses - she paid more",
      input: {
        hisTotalShared: 60000,
        herTotalShared: 140000,
        hisTotalForHer: 0,
        herTotalForHim: 0,
      },
      expected: {
        reimbursementAmount: 40000,
        reimbursementDirection: "himToHer",
      },
    },
    {
      name: "Fractional amounts are handled correctly",
      input: {
        hisTotalShared: 10033,
        herTotalShared: 9966,
        hisTotalForHer: 2525,
        herTotalForHim: 2475,
      },
      expected: {
        reimbursementAmount: 83.5,
        reimbursementDirection: "herToHim",
      },
    },
    {
      name: "Zero amounts all around",
      input: {
        hisTotalShared: 0,
        herTotalShared: 0,
        hisTotalForHer: 0,
        herTotalForHim: 0,
      },
      expected: {
        reimbursementAmount: 0,
        reimbursementDirection: "herToHim", // Direction doesn't matter when amount is 0
      },
    },
  ];

  return runTest(
    "calculateReimbursementValues",
    "Determines the final reimbursement amount and direction",
    calc.calculateReimbursementValues,
    testCases,
  );
}

// 5. Tests for createCategorySummary
function testCreateCategorySummary() {
  const calc = window.ynabReimbursementCalculations;

  const testCases = [
    {
      name: "Normal case: Valid categories with metadata",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 },
          cat2: { hisSpending: 75000, herSpending: 25000 },
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1"),
        ],
        categoryGroups: [createTestCategoryGroup("g1", "Essentials")],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        categoryCount: 2,
        warningsCount: 0,
        categories: {
          cat1: {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared",
          },
          cat2: {
            categoryName: "Utilities",
            groupName: "Essentials",
            type: "Shared",
          },
        },
      },
    },
    {
      name: "Categories that don't exist in the list generate warnings",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 },
          missing: { hisSpending: 75000, herSpending: 25000 },
        },
        categories: [createTestCategory("cat1", "Groceries", "g1")],
        categoryGroups: [createTestCategoryGroup("g1", "Essentials")],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          missing: "Shared",
        }),
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          cat1: {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared",
          },
        },
      },
    },
    {
      name: "Categories with missing group information generate warnings",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 },
          cat2: { hisSpending: 75000, herSpending: 25000 },
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "missing"),
        ],
        categoryGroups: [createTestCategoryGroup("g1", "Essentials")],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Shared",
        }),
      },
      expected: {
        categoryCount: 1,
        warningsCount: 1,
        categories: {
          cat1: {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared",
          },
        },
      },
    },
    {
      name: "Invalid category types are reported as warnings but included in summary",
      input: {
        categorySpending: {
          cat1: { hisSpending: 100000, herSpending: 50000 },
          cat2: { hisSpending: 75000, herSpending: 25000 },
        },
        categories: [
          createTestCategory("cat1", "Groceries", "g1"),
          createTestCategory("cat2", "Utilities", "g1"),
        ],
        categoryGroups: [createTestCategoryGroup("g1", "Essentials")],
        getCategoryType: mockGetCategoryType({
          cat1: "Shared",
          cat2: "Invalid",
        }),
      },
      expected: {
        categoryCount: 2,
        warningsCount: 1,
        categories: {
          cat1: {
            categoryName: "Groceries",
            groupName: "Essentials",
            type: "Shared",
          },
          cat2: {
            categoryName: "Utilities",
            groupName: "Essentials",
            type: "Invalid",
          },
        },
      },
    },
    {
      name: "Empty object case",
      input: {
        categorySpending: {},
        categories: [],
        categoryGroups: [],
        getCategoryType: mockGetCategoryType({}),
      },
      expected: {
        categoryCount: 0,
        warningsCount: 0,
        categories: {},
      },
    },
  ];

  return runTest(
    "createCategorySummary",
    "Prepares detailed category data with metadata for display",
    ({ categorySpending, categories, categoryGroups, getCategoryType }) => {
      const { categorySummaryMap, warnings } = calc.createCategorySummary(
        categorySpending,
        categories,
        categoryGroups,
        getCategoryType,
      );
      return {
        categoryCount: Object.keys(categorySummaryMap).length,
        warningsCount: warnings.length,
        categories: Object.fromEntries(
          Object.entries(categorySummaryMap).map(([key, value]) => [
            key,
            {
              categoryName: value.categoryName,
              groupName: value.groupName,
              type: value.type,
            },
          ]),
        ),
      };
    },
    testCases,
  );
}

// >> Test Runner

// Function to run all pure function tests
function runPureFunctionTests() {
  return [
    testFilterTransactions(),
    testCalculateCategorySpending(),
    testCalculateSpendingTotals(),
    testCalculateReimbursementValues(),
    testCreateCategorySummary(),
  ];
}

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
};
