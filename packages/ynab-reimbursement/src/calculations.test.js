import { test, expect, describe } from "bun:test";
import {
  filterTransactions,
  calculateCategorySpending,
  calculateSpendingTotals,
  calculateReimbursementValues,
  createCategorySummary,
  calculateReimbursementPure,
} from "./calculations.js";

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

// Helper to create a test split transaction
const createTestSplitTransaction = (
  id,
  payee,
  date,
  amount,
  account_id,
  subtransactions
) => ({
  id,
  payee_name: payee,
  date,
  amount,
  account_id,
  subtransactions,
  transfer_transaction_id: null,
  transfer_account_id: null,
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

// >> Tests

describe("filterTransactions", () => {
  test("Normal case: Valid transactions pass through", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc2"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(2);
    expect(transactionWarnings.length).toBe(0);
  });

  test("Split transactions are expanded into individual transactions", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestSplitTransaction("t2", "Split Purchase", "2023-01-02", -150000, "acc1", [
        { id: "sub1", amount: -80000, category_id: "cat2" },
        { id: "sub2", amount: -70000, category_id: "cat3" }
      ]),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared", cat3: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(3);
    expect(transactionWarnings.length).toBe(0);
  });

  test("Split transactions with invalid subtransactions", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestSplitTransaction("t2", "Split Purchase", "2023-01-02", -150000, "acc1", [
        { id: "sub1", amount: -80000, category_id: "cat2" },
        { id: "sub2", amount: -70000, category_id: null }
      ]),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(2);
    expect(transactionWarnings.length).toBe(1);
  });

  test("Transfers are filtered out", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Transfer", "2023-01-02", -50000, "cat2", "acc2", true),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(0);
  });

  test("Inflow transactions are filtered out", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Salary", "2023-01-02", 500000, "inflow-cat", "acc2", false, "Inflow: Ready to Assign"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", "inflow-cat": "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(0);
  });

  test("Uncategorized transactions are filtered with warnings", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Unknown Expense", "2023-01-02", -50000, "uncat-id", "acc2", false, "Uncategorized"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", "uncat-id": "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(1);
  });

  test("Transactions without categories are filtered with warnings", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Missing Category", "2023-01-02", -50000, null, "acc2"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(1);
  });

  test("Transactions with invalid account types are filtered with warnings", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Invalid Account", "2023-01-02", -50000, "cat2", "acc2"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Unset" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(1);
  });

  test("Transactions with invalid category types are filtered with warnings", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Invalid Category", "2023-01-02", -50000, "cat2", "acc2"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Unset" });

    const { validTransactions, transactionWarnings } = filterTransactions(
      transactions,
      getAccountType,
      getCategoryType
    );

    expect(validTransactions.length).toBe(1);
    expect(transactionWarnings.length).toBe(1);
  });

  test("Empty array case", () => {
    const { validTransactions, transactionWarnings } = filterTransactions(
      [],
      mockGetAccountType({}),
      mockGetCategoryType({})
    );

    expect(validTransactions.length).toBe(0);
    expect(transactionWarnings.length).toBe(0);
  });
});

describe("calculateCategorySpending", () => {
  test("Normal case: Transactions across different categories", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc1"),
      createTestTransaction("t3", "Utilities", "2023-01-03", -75000, "cat1", "acc2"),
      createTestTransaction("t4", "Entertainment", "2023-01-04", -25000, "cat2", "acc2"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc2: "Hers" });

    const { categorySpending, warnings } = calculateCategorySpending(transactions, getAccountType);

    expect(Object.keys(categorySpending).length).toBe(2);
    expect(warnings.length).toBe(0);
    expect(categorySpending.cat1).toEqual({ hisSpending: 100000, herSpending: 75000 });
    expect(categorySpending.cat2).toEqual({ hisSpending: 50000, herSpending: 25000 });
  });

  test("His spending in different categories", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat2", "acc1"),
      createTestTransaction("t3", "Gas", "2023-01-03", -30000, "cat3", "acc1"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His" });

    const { categorySpending, warnings } = calculateCategorySpending(transactions, getAccountType);

    expect(Object.keys(categorySpending).length).toBe(3);
    expect(warnings.length).toBe(0);
    expect(categorySpending.cat1).toEqual({ hisSpending: 100000, herSpending: 0 });
    expect(categorySpending.cat2).toEqual({ hisSpending: 50000, herSpending: 0 });
    expect(categorySpending.cat3).toEqual({ hisSpending: 30000, herSpending: 0 });
  });

  test("Shared account spending should not be counted in either His or Hers", () => {
    const transactions = [
      createTestTransaction("t1", "Grocery", "2023-01-01", -100000, "cat1", "acc1"),
      createTestTransaction("t2", "Restaurant", "2023-01-02", -50000, "cat1", "acc3"),
    ];
    const getAccountType = mockGetAccountType({ acc1: "His", acc3: "Shared" });

    const { categorySpending, warnings } = calculateCategorySpending(transactions, getAccountType);

    expect(Object.keys(categorySpending).length).toBe(1);
    expect(warnings.length).toBe(0);
    expect(categorySpending.cat1).toEqual({ hisSpending: 100000, herSpending: 0 });
  });

  test("Empty array case", () => {
    const { categorySpending, warnings } = calculateCategorySpending([], mockGetAccountType({}));

    expect(Object.keys(categorySpending).length).toBe(0);
    expect(warnings.length).toBe(0);
  });
});

describe("calculateSpendingTotals", () => {
  test("Normal case: Mixed spending across different category types", () => {
    const categorySpending = {
      cat1: { hisSpending: 100000, herSpending: 75000 },
      cat2: { hisSpending: 50000, herSpending: 0 },
      cat3: { hisSpending: 0, herSpending: 40000 },
      cat4: { hisSpending: 20000, herSpending: 30000 },
    };
    const categories = [
      createTestCategory("cat1", "Groceries", "g1"),
      createTestCategory("cat2", "His Stuff", "g2"),
      createTestCategory("cat3", "Her Stuff", "g3"),
      createTestCategory("cat4", "Utilities", "g1"),
    ];
    const getCategoryType = mockGetCategoryType({
      cat1: "Shared",
      cat2: "His",
      cat3: "Hers",
      cat4: "Shared",
    });

    const result = calculateSpendingTotals(categorySpending, categories, getCategoryType);

    expect(result.hisTotalShared).toBe(120000);
    expect(result.herTotalShared).toBe(105000);
    expect(result.hisTotalForHer).toBe(0);
    expect(result.herTotalForHim).toBe(0);
    expect(result.warnings.length).toBe(0);
  });

  test("Only shared categories", () => {
    const categorySpending = {
      cat1: { hisSpending: 100000, herSpending: 40000 },
      cat2: { hisSpending: 60000, herSpending: 20000 },
    };
    const categories = [
      createTestCategory("cat1", "Groceries", "g1"),
      createTestCategory("cat2", "Utilities", "g1"),
    ];
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const result = calculateSpendingTotals(categorySpending, categories, getCategoryType);

    expect(result.hisTotalShared).toBe(160000);
    expect(result.herTotalShared).toBe(60000);
    expect(result.hisTotalForHer).toBe(0);
    expect(result.herTotalForHim).toBe(0);
  });

  test("Only his categories", () => {
    const categorySpending = {
      cat1: { hisSpending: 80000, herSpending: 20000 },
      cat2: { hisSpending: 40000, herSpending: 10000 },
    };
    const categories = [
      createTestCategory("cat1", "His Stuff 1", "g1"),
      createTestCategory("cat2", "His Stuff 2", "g1"),
    ];
    const getCategoryType = mockGetCategoryType({ cat1: "His", cat2: "His" });

    const result = calculateSpendingTotals(categorySpending, categories, getCategoryType);

    expect(result.hisTotalShared).toBe(0);
    expect(result.herTotalShared).toBe(0);
    expect(result.hisTotalForHer).toBe(0);
    expect(result.herTotalForHim).toBe(30000);
  });

  test("Only her categories", () => {
    const categorySpending = {
      cat1: { hisSpending: 30000, herSpending: 70000 },
      cat2: { hisSpending: 15000, herSpending: 35000 },
    };
    const categories = [
      createTestCategory("cat1", "Her Stuff 1", "g1"),
      createTestCategory("cat2", "Her Stuff 2", "g1"),
    ];
    const getCategoryType = mockGetCategoryType({ cat1: "Hers", cat2: "Hers" });

    const result = calculateSpendingTotals(categorySpending, categories, getCategoryType);

    expect(result.hisTotalShared).toBe(0);
    expect(result.herTotalShared).toBe(0);
    expect(result.hisTotalForHer).toBe(45000);
    expect(result.herTotalForHim).toBe(0);
  });

  test("Empty object case", () => {
    const result = calculateSpendingTotals({}, [], mockGetCategoryType({}));

    expect(result.hisTotalShared).toBe(0);
    expect(result.herTotalShared).toBe(0);
    expect(result.hisTotalForHer).toBe(0);
    expect(result.herTotalForHim).toBe(0);
    expect(result.warnings.length).toBe(0);
  });
});

describe("calculateReimbursementValues", () => {
  test("He owes her (positive heShouldPay)", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 75000,
      herTotalShared: 125000,
      hisTotalForHer: 10000,
      herTotalForHim: 30000,
    });

    expect(result.reimbursementAmount).toBe(45000);
    expect(result.reimbursementDirection).toBe("himToHer");
  });

  test("She owes him (negative heShouldPay)", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 125000,
      herTotalShared: 75000,
      hisTotalForHer: 20000,
      herTotalForHim: 10000,
    });

    expect(result.reimbursementAmount).toBe(35000);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("No one owes anything (zero heShouldPay)", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 100000,
      herTotalShared: 100000,
      hisTotalForHer: 25000,
      herTotalForHim: 25000,
    });

    expect(result.reimbursementAmount).toBe(0);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("Only direct payments - she paid for his stuff", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 0,
      herTotalShared: 0,
      hisTotalForHer: 0,
      herTotalForHim: 80000,
    });

    expect(result.reimbursementAmount).toBe(80000);
    expect(result.reimbursementDirection).toBe("himToHer");
  });

  test("Only direct payments - he paid for her stuff", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 0,
      herTotalShared: 0,
      hisTotalForHer: 50000,
      herTotalForHim: 0,
    });

    expect(result.reimbursementAmount).toBe(50000);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("Only shared expenses - he paid more", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 140000,
      herTotalShared: 60000,
      hisTotalForHer: 0,
      herTotalForHim: 0,
    });

    expect(result.reimbursementAmount).toBe(40000);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("Only shared expenses - she paid more", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 60000,
      herTotalShared: 140000,
      hisTotalForHer: 0,
      herTotalForHim: 0,
    });

    expect(result.reimbursementAmount).toBe(40000);
    expect(result.reimbursementDirection).toBe("himToHer");
  });

  test("Fractional amounts are handled correctly", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 10033,
      herTotalShared: 9966,
      hisTotalForHer: 2525,
      herTotalForHim: 2475,
    });

    expect(result.reimbursementAmount).toBe(83.5);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("Zero amounts all around", () => {
    const result = calculateReimbursementValues({
      hisTotalShared: 0,
      herTotalShared: 0,
      hisTotalForHer: 0,
      herTotalForHim: 0,
    });

    expect(result.reimbursementAmount).toBe(0);
    expect(result.reimbursementDirection).toBe("herToHim");
  });
});

describe("createCategorySummary", () => {
  test("Normal case: Valid categories with metadata", () => {
    const categorySpending = {
      cat1: { hisSpending: 100000, herSpending: 50000 },
      cat2: { hisSpending: 75000, herSpending: 25000 },
    };
    const categories = [
      createTestCategory("cat1", "Groceries", "g1"),
      createTestCategory("cat2", "Utilities", "g1"),
    ];
    const categoryGroups = [createTestCategoryGroup("g1", "Essentials")];
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", cat2: "Shared" });

    const { categorySummaryMap, warnings } = createCategorySummary(
      categorySpending,
      categories,
      categoryGroups,
      getCategoryType
    );

    expect(Object.keys(categorySummaryMap).length).toBe(2);
    expect(warnings.length).toBe(0);
    expect(categorySummaryMap.cat1.categoryName).toBe("Groceries");
    expect(categorySummaryMap.cat1.groupName).toBe("Essentials");
    expect(categorySummaryMap.cat1.type).toBe("Shared");
  });

  test("Categories that don't exist in the list generate warnings", () => {
    const categorySpending = {
      cat1: { hisSpending: 100000, herSpending: 50000 },
      missing: { hisSpending: 75000, herSpending: 25000 },
    };
    const categories = [createTestCategory("cat1", "Groceries", "g1")];
    const categoryGroups = [createTestCategoryGroup("g1", "Essentials")];
    const getCategoryType = mockGetCategoryType({ cat1: "Shared", missing: "Shared" });

    const { categorySummaryMap, warnings } = createCategorySummary(
      categorySpending,
      categories,
      categoryGroups,
      getCategoryType
    );

    expect(Object.keys(categorySummaryMap).length).toBe(1);
    expect(warnings.length).toBe(1);
  });

  test("Empty object case", () => {
    const { categorySummaryMap, warnings } = createCategorySummary(
      {},
      [],
      [],
      mockGetCategoryType({})
    );

    expect(Object.keys(categorySummaryMap).length).toBe(0);
    expect(warnings.length).toBe(0);
  });
});

describe("calculateReimbursementPure", () => {
  test("returns zeros when hasWarnings is true", () => {
    const result = calculateReimbursementPure([], [], [], () => "His", () => "Shared", true);

    expect(result.hisTotalShared).toBe(0);
    expect(result.herTotalShared).toBe(0);
    expect(result.reimbursementAmount).toBe(0);
    expect(result.reimbursementDirection).toBeNull();
    expect(result.categorySummary).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  test("simple case: he paid more for shared expenses, she owes him", () => {
    const categories = [
      createTestCategory("groceries", "Groceries", "essentials"),
      createTestCategory("utilities", "Utilities", "essentials"),
    ];
    const categoryGroups = [createTestCategoryGroup("essentials", "Essentials")];
    const transactions = [
      createTestTransaction("t1", "Supermarket", "2024-01-15", -100000, "groceries", "his-account"),
      createTestTransaction("t2", "Electric Co", "2024-01-20", -50000, "utilities", "her-account"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His", "her-account": "Hers" });
    const getCategoryType = mockGetCategoryType({ groceries: "Shared", utilities: "Shared" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.hisTotalShared).toBe(100000);
    expect(result.herTotalShared).toBe(50000);
    expect(result.reimbursementAmount).toBe(25000);
    expect(result.reimbursementDirection).toBe("herToHim");
    expect(result.warnings).toEqual([]);
  });

  test("simple case: she paid more for shared expenses, he owes her", () => {
    const categories = [createTestCategory("groceries", "Groceries", "essentials")];
    const categoryGroups = [createTestCategoryGroup("essentials", "Essentials")];
    const transactions = [
      createTestTransaction("t1", "Supermarket", "2024-01-15", -50000, "groceries", "his-account"),
      createTestTransaction("t2", "Supermarket", "2024-01-20", -150000, "groceries", "her-account"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His", "her-account": "Hers" });
    const getCategoryType = mockGetCategoryType({ groceries: "Shared" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.hisTotalShared).toBe(50000);
    expect(result.herTotalShared).toBe(150000);
    expect(result.reimbursementAmount).toBe(50000);
    expect(result.reimbursementDirection).toBe("himToHer");
  });

  test("cross-spending: he paid for her category", () => {
    const categories = [
      createTestCategory("shared-cat", "Groceries", "essentials"),
      createTestCategory("her-cat", "Her Hobby", "personal"),
    ];
    const categoryGroups = [
      createTestCategoryGroup("essentials", "Essentials"),
      createTestCategoryGroup("personal", "Personal"),
    ];
    const transactions = [
      createTestTransaction("t1", "Supermarket", "2024-01-15", -100000, "shared-cat", "his-account"),
      createTestTransaction("t2", "Hobby Shop", "2024-01-20", -40000, "her-cat", "his-account"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His" });
    const getCategoryType = mockGetCategoryType({ "shared-cat": "Shared", "her-cat": "Hers" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.hisTotalShared).toBe(100000);
    expect(result.hisTotalForHer).toBe(40000);
    expect(result.reimbursementAmount).toBe(90000);
    expect(result.reimbursementDirection).toBe("herToHim");
  });

  test("complex scenario with split transactions", () => {
    const categories = [
      createTestCategory("groceries", "Groceries", "essentials"),
      createTestCategory("his-cat", "His Stuff", "personal"),
    ];
    const categoryGroups = [
      createTestCategoryGroup("essentials", "Essentials"),
      createTestCategoryGroup("personal", "Personal"),
    ];
    const transactions = [
      createTestSplitTransaction("t1", "Big Store", "2024-01-15", -100000, "her-account", [
        { id: "sub1", amount: -60000, category_id: "groceries", category_name: "Groceries" },
        { id: "sub2", amount: -40000, category_id: "his-cat", category_name: "His Stuff" },
      ]),
    ];
    const getAccountType = mockGetAccountType({ "her-account": "Hers" });
    const getCategoryType = mockGetCategoryType({ groceries: "Shared", "his-cat": "His" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.herTotalShared).toBe(60000);
    expect(result.herTotalForHim).toBe(40000);
    expect(result.reimbursementAmount).toBe(70000);
    expect(result.reimbursementDirection).toBe("himToHer");
  });

  test("filters out transfers and inflows", () => {
    const categories = [createTestCategory("groceries", "Groceries", "essentials")];
    const categoryGroups = [createTestCategoryGroup("essentials", "Essentials")];
    const transactions = [
      createTestTransaction("t1", "Supermarket", "2024-01-15", -100000, "groceries", "his-account"),
      createTestTransaction("t2", "Transfer", "2024-01-16", -50000, "groceries", "his-account", true),
      createTestTransaction("t3", "Salary", "2024-01-01", 500000, "inflow", "his-account", false, "Inflow: Ready to Assign"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His" });
    const getCategoryType = mockGetCategoryType({ groceries: "Shared", inflow: "Shared" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.hisTotalShared).toBe(100000);
    expect(result.herTotalShared).toBe(0);
  });

  test("generates warnings for uncategorized transactions", () => {
    const categories = [createTestCategory("groceries", "Groceries", "essentials")];
    const categoryGroups = [createTestCategoryGroup("essentials", "Essentials")];
    const transactions = [
      createTestTransaction("t1", "Supermarket", "2024-01-15", -100000, "groceries", "his-account"),
      createTestTransaction("t2", "Unknown", "2024-01-16", -50000, "uncat", "his-account", false, "Uncategorized"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His" });
    const getCategoryType = mockGetCategoryType({ groceries: "Shared", uncat: "Shared" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.hisTotalShared).toBe(100000);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0].message).toContain("Unknown");
    expect(result.warnings[0].message).toContain("uncategorized");
  });

  test("category summary is sorted by group then category name", () => {
    const categories = [
      createTestCategory("zebra", "Zebra Care", "animals"),
      createTestCategory("apple", "Apple Store", "tech"),
      createTestCategory("banana", "Banana Stand", "food"),
    ];
    const categoryGroups = [
      createTestCategoryGroup("animals", "Animals"),
      createTestCategoryGroup("tech", "Tech"),
      createTestCategoryGroup("food", "Food"),
    ];
    const transactions = [
      createTestTransaction("t1", "Store", "2024-01-15", -10000, "zebra", "his-account"),
      createTestTransaction("t2", "Store", "2024-01-16", -20000, "apple", "his-account"),
      createTestTransaction("t3", "Store", "2024-01-17", -30000, "banana", "his-account"),
    ];
    const getAccountType = mockGetAccountType({ "his-account": "His" });
    const getCategoryType = mockGetCategoryType({ zebra: "Shared", apple: "Shared", banana: "Shared" });

    const result = calculateReimbursementPure(
      transactions, categories, categoryGroups, getAccountType, getCategoryType
    );

    expect(result.categorySummary.length).toBe(3);
    expect(result.categorySummary[0].groupName).toBe("Animals");
    expect(result.categorySummary[1].groupName).toBe("Food");
    expect(result.categorySummary[2].groupName).toBe("Tech");
  });
});
