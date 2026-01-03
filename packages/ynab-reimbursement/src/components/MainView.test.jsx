import { describe, test, expect, mock, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MainView } from "./MainView.jsx";

afterEach(cleanup);

describe("MainView", () => {
  const emptyReimbursementData = {
    hisTotalShared: 0,
    herTotalShared: 0,
    hisTotalForHer: 0,
    herTotalForHim: 0,
    hisTotalForHim: 0,
    herTotalForHer: 0,
    reimbursementAmount: 0,
    reimbursementDirection: "herToHim",
    categorySummary: [],
    warnings: [],
  };

  const defaultProps = {
    reimbursementData: emptyReimbursementData,
    warnings: [],
    onOpenConfig: () => {},
    onOpenConfigTab: () => {},
    availableMonths: [
      { month: "2024-01-01" },
      { month: "2023-12-01" },
      { month: "2023-11-01" },
    ],
    selectedMonth: "2023-12-01",
    onMonthChange: () => {},
    onFetchTransactions: () => {},
    selectedBudgetId: "budget-1",
    transactions: [],
  };

  test("renders title", () => {
    render(<MainView {...defaultProps} />);
    expect(screen.getByText("YNAB Reimbursement Report")).toBeTruthy();
  });

  test("renders config button that calls onOpenConfig", () => {
    const onOpenConfig = mock(() => {});
    render(<MainView {...defaultProps} onOpenConfig={onOpenConfig} />);

    fireEvent.click(screen.getByLabelText("Open Configuration"));
    expect(onOpenConfig).toHaveBeenCalledTimes(1);
  });

  test("displays formatted month", () => {
    render(<MainView {...defaultProps} selectedMonth="2023-12-01" />);
    expect(screen.getByText("December 2023")).toBeTruthy();
  });

  describe("month navigation", () => {
    test("calls onMonthChange with previous month when Prev is clicked", () => {
      const onMonthChange = mock(() => {});
      render(<MainView {...defaultProps} onMonthChange={onMonthChange} />);

      fireEvent.click(screen.getByText("← Prev"));
      expect(onMonthChange).toHaveBeenCalledWith("2023-11-01");
    });

    test("calls onMonthChange with next month when Next is clicked", () => {
      const onMonthChange = mock(() => {});
      render(<MainView {...defaultProps} onMonthChange={onMonthChange} />);

      fireEvent.click(screen.getByText("Next →"));
      expect(onMonthChange).toHaveBeenCalledWith("2024-01-01");
    });

    test("disables Prev button when at oldest month", () => {
      render(<MainView {...defaultProps} selectedMonth="2023-11-01" />);

      const prevButton = screen.getByText("← Prev");
      expect(prevButton.hasAttribute("disabled")).toBe(true);
    });

    test("disables Next button when at newest month", () => {
      render(<MainView {...defaultProps} selectedMonth="2024-01-01" />);

      const nextButton = screen.getByText("Next →");
      expect(nextButton.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Import Transactions button", () => {
    test("renders Import Transactions button", () => {
      render(<MainView {...defaultProps} />);
      expect(screen.getByText("Import Transactions")).toBeTruthy();
    });

    test("calls onFetchTransactions when clicked", () => {
      const onFetchTransactions = mock(() => {});
      render(<MainView {...defaultProps} onFetchTransactions={onFetchTransactions} />);

      fireEvent.click(screen.getByText("Import Transactions"));
      expect(onFetchTransactions).toHaveBeenCalledTimes(1);
    });
  });

  describe("configuration warnings", () => {
    test("displays configuration warnings when present", () => {
      const warnings = [
        { message: "Account has no type set", tabToFix: "accounts" },
        { message: "Category has no type set", tabToFix: "categories" },
      ];

      render(<MainView {...defaultProps} warnings={warnings} />);

      expect(screen.getByRole("heading", { name: /Configuration Warnings/ })).toBeTruthy();
      expect(screen.getByText("Account has no type set")).toBeTruthy();
      expect(screen.getByText("Category has no type set")).toBeTruthy();
    });

    test("Fix button opens config to correct tab", () => {
      const onOpenConfig = mock(() => {});
      const onOpenConfigTab = mock(() => {});
      const warnings = [{ message: "Account issue", tabToFix: "accounts" }];

      render(
        <MainView
          {...defaultProps}
          warnings={warnings}
          onOpenConfig={onOpenConfig}
          onOpenConfigTab={onOpenConfigTab}
        />
      );

      fireEvent.click(screen.getByText("Fix"));
      expect(onOpenConfig).toHaveBeenCalledTimes(1);
      expect(onOpenConfigTab).toHaveBeenCalledWith("accounts");
    });

    test("shows message to fix warnings when warnings present", () => {
      const warnings = [{ message: "Some issue", tabToFix: "accounts" }];
      render(<MainView {...defaultProps} warnings={warnings} />);

      expect(
        screen.getByText("Please fix the configuration warnings to view the reimbursement report.")
      ).toBeTruthy();
    });
  });

  describe("no transactions state", () => {
    test("shows message when no transactions imported", () => {
      render(<MainView {...defaultProps} transactions={[]} />);

      expect(screen.getByText("No transactions imported yet")).toBeTruthy();
    });
  });

  describe("with transactions", () => {
    const reimbursementData = {
      hisTotalShared: 50000, // £50
      herTotalShared: 30000, // £30
      hisTotalForHer: 10000, // £10
      herTotalForHim: 5000,  // £5
      hisTotalForHim: 2000,  // £2
      herTotalForHer: 3000,  // £3
      reimbursementAmount: 15000, // £15
      reimbursementDirection: "herToHim",
      categorySummary: [
        {
          groupId: "group-1",
          groupName: "Bills",
          categoryId: "cat-1",
          categoryName: "Rent",
          hisSpending: 40000,
          herSpending: 20000,
        },
      ],
      warnings: [],
    };

    const propsWithTransactions = {
      ...defaultProps,
      reimbursementData,
      transactions: [{ id: "tx-1" }], // non-empty
    };

    test("displays His Spending section", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByRole("heading", { name: "His Spending" })).toBeTruthy();
    });

    test("displays Her Spending section", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByRole("heading", { name: "Her Spending" })).toBeTruthy();
    });

    test("displays Reimbursement Due section", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByText("Reimbursement Due")).toBeTruthy();
      expect(screen.getByText("£15.00 - She should pay Him")).toBeTruthy();
    });

    test("displays opposite direction when himToHer", () => {
      const data = { ...reimbursementData, reimbursementDirection: "himToHer" };
      render(<MainView {...propsWithTransactions} reimbursementData={data} />);

      expect(screen.getByText("£15.00 - He should pay Her")).toBeTruthy();
    });

    test("displays Budget Refill Required section", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByText("Budget Refill Required")).toBeTruthy();
      expect(screen.getByText("She should refill:")).toBeTruthy();
      expect(screen.getByText("He should refill:")).toBeTruthy();
    });

    test("displays category summary table", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByText("Shared Spending by Category")).toBeTruthy();
      expect(screen.getByText("Bills")).toBeTruthy();
      expect(screen.getByText("Rent")).toBeTruthy();
    });

    test("displays Grand Total row", () => {
      render(<MainView {...propsWithTransactions} />);

      expect(screen.getByText("Grand Total")).toBeTruthy();
    });

    test("uses custom currency symbol when provided", () => {
      render(<MainView {...propsWithTransactions} currencySymbol="$" />);

      expect(screen.getByText("$15.00 - She should pay Him")).toBeTruthy();
    });
  });

  describe("transaction warnings", () => {
    test("displays transaction warnings when no config warnings", () => {
      const reimbursementData = {
        ...emptyReimbursementData,
        warnings: [
          { message: "Split transaction issue", details: "Transaction X has problems" },
        ],
      };

      render(
        <MainView
          {...defaultProps}
          warnings={[]}
          reimbursementData={reimbursementData}
          transactions={[{ id: "tx-1" }]}
        />
      );

      expect(screen.getByRole("heading", { name: /Transaction Warnings/ })).toBeTruthy();
      expect(screen.getByText("Split transaction issue")).toBeTruthy();
      expect(screen.getByText("Transaction X has problems")).toBeTruthy();
    });
  });
});
