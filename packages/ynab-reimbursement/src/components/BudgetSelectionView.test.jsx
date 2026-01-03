import { describe, test, expect, mock, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BudgetSelectionView } from "./BudgetSelectionView.jsx";

afterEach(cleanup);

describe("BudgetSelectionView", () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    budgets: [],
    onLogout: () => {},
    onBudgetSelect: () => {},
  };

  test("renders title", () => {
    render(<BudgetSelectionView {...defaultProps} />);
    expect(screen.getByText("Select Your Budget")).toBeTruthy();
  });

  test("shows loading state", () => {
    render(<BudgetSelectionView {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Loading budgets...")).toBeTruthy();
  });

  test("shows error with logout button", () => {
    const onLogout = mock(() => {});
    render(
      <BudgetSelectionView
        {...defaultProps}
        error="Invalid token"
        onLogout={onLogout}
      />
    );

    expect(screen.getByText("Invalid token")).toBeTruthy();

    const logoutButton = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutButton);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test("shows message when no budgets found", () => {
    render(<BudgetSelectionView {...defaultProps} budgets={[]} />);
    expect(screen.getByText("No budgets found for this account.")).toBeTruthy();
  });

  test("renders list of budgets", () => {
    const budgets = [
      { id: "budget-1", name: "Personal Budget" },
      { id: "budget-2", name: "Family Budget" },
    ];

    render(<BudgetSelectionView {...defaultProps} budgets={budgets} />);

    expect(screen.getByText("Personal Budget")).toBeTruthy();
    expect(screen.getByText("Family Budget")).toBeTruthy();
  });

  test("calls onBudgetSelect when budget is clicked", () => {
    const onBudgetSelect = mock(() => {});
    const budgets = [
      { id: "budget-1", name: "Personal Budget" },
      { id: "budget-2", name: "Family Budget" },
    ];

    render(
      <BudgetSelectionView
        {...defaultProps}
        budgets={budgets}
        onBudgetSelect={onBudgetSelect}
      />
    );

    fireEvent.click(screen.getByText("Family Budget"));

    expect(onBudgetSelect).toHaveBeenCalledTimes(1);
    expect(onBudgetSelect).toHaveBeenCalledWith("budget-2");
  });

  test("shows 'Use a different token' link that calls onLogout", () => {
    const onLogout = mock(() => {});
    render(<BudgetSelectionView {...defaultProps} onLogout={onLogout} />);

    const link = screen.getByRole("button", { name: "Use a different token" });
    fireEvent.click(link);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
