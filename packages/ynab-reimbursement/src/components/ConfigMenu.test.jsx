import { describe, test, expect, mock, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ConfigMenu } from "./ConfigMenu.jsx";

afterEach(cleanup);

describe("ConfigMenu", () => {
  const defaultProps = {
    onClose: () => {},
    configTab: "general",
    onTabChange: () => {},
    accessToken: "test-token",
    onAccessTokenChange: () => {},
    selectedBudgetId: "budget-1",
    onBudgetChange: () => {},
    budgets: [{ id: "budget-1", name: "Test Budget" }],
    showHiddenAccounts: false,
    onShowHiddenAccountsChange: () => {},
    onSyncAccounts: () => {},
    isLoading: false,
    accounts: [],
    warnings: [],
    accountTypes: {},
    onAccountTypesChange: () => {},
    showHiddenCategories: false,
    onShowHiddenCategoriesChange: () => {},
    onSyncCategories: () => {},
    categoryGroups: [],
    categories: [],
    categoryGroupTypes: {},
    onCategoryGroupTypesChange: () => {},
    categoryTypes: {},
    onCategoryTypesChange: () => {},
  };

  test("renders configuration title", () => {
    render(<ConfigMenu {...defaultProps} />);
    expect(screen.getByText("Configuration")).toBeTruthy();
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = mock(() => {});
    render(<ConfigMenu {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("renders tab buttons", () => {
    render(<ConfigMenu {...defaultProps} />);

    expect(screen.getByRole("button", { name: "General" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Accounts" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Categories" })).toBeTruthy();
  });

  test("calls onTabChange when tab is clicked", () => {
    const onTabChange = mock(() => {});
    render(<ConfigMenu {...defaultProps} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Accounts" }));
    expect(onTabChange).toHaveBeenCalledWith("accounts");

    fireEvent.click(screen.getByRole("button", { name: "Categories" }));
    expect(onTabChange).toHaveBeenCalledWith("categories");
  });

  describe("General tab", () => {
    test("shows access token input", () => {
      render(<ConfigMenu {...defaultProps} configTab="general" />);

      expect(screen.getByText("Access Token")).toBeTruthy();
      const input = screen.getByDisplayValue("test-token");
      expect(input.getAttribute("type")).toBe("password");
    });

    test("calls onAccessTokenChange when token is changed", () => {
      const onAccessTokenChange = mock(() => {});
      render(
        <ConfigMenu
          {...defaultProps}
          configTab="general"
          onAccessTokenChange={onAccessTokenChange}
        />
      );

      const input = screen.getByDisplayValue("test-token");
      fireEvent.change(input, { target: { value: "new-token" } });

      expect(onAccessTokenChange).toHaveBeenCalledWith("new-token");
    });

    test("shows budget selector with budget name", () => {
      render(<ConfigMenu {...defaultProps} configTab="general" />);

      expect(screen.getByText("Selected Budget")).toBeTruthy();
      expect(screen.getByRole("option", { name: "Test Budget" })).toBeTruthy();
    });
  });

  describe("Accounts tab", () => {
    const accountsProps = {
      ...defaultProps,
      configTab: "accounts",
      accounts: [
        { id: "acc-1", name: "Checking", closed: false, deleted: false },
        { id: "acc-2", name: "Savings", closed: false, deleted: false },
      ],
      accountTypes: { "acc-1": "His", "acc-2": "Unset" },
    };

    test("shows accounts table with account names", () => {
      render(<ConfigMenu {...accountsProps} />);

      expect(screen.getByText("Checking")).toBeTruthy();
      expect(screen.getByText("Savings")).toBeTruthy();
    });

    test("shows Sync Accounts button that calls onSyncAccounts", () => {
      const onSyncAccounts = mock(() => {});
      render(<ConfigMenu {...accountsProps} onSyncAccounts={onSyncAccounts} />);

      const button = screen.getByRole("button", { name: "Sync Accounts" });
      fireEvent.click(button);

      expect(onSyncAccounts).toHaveBeenCalledTimes(1);
    });

    test("shows loading state when isLoading is true", () => {
      render(<ConfigMenu {...accountsProps} isLoading={true} />);
      expect(screen.getByText("Loading accounts...")).toBeTruthy();
    });

    test("hides closed accounts by default", () => {
      const propsWithClosed = {
        ...accountsProps,
        accounts: [
          ...accountsProps.accounts,
          { id: "acc-3", name: "Old Account", closed: true, deleted: false },
        ],
      };

      render(<ConfigMenu {...propsWithClosed} />);

      expect(screen.queryByText("Old Account")).toBeNull();
    });

    test("shows closed accounts when showHiddenAccounts is true", () => {
      const propsWithClosed = {
        ...accountsProps,
        showHiddenAccounts: true,
        accounts: [
          ...accountsProps.accounts,
          { id: "acc-3", name: "Old Account", closed: true, deleted: false },
        ],
        accountTypes: { ...accountsProps.accountTypes, "acc-3": "Unset" },
      };

      render(<ConfigMenu {...propsWithClosed} />);

      expect(screen.getByText("Old Account")).toBeTruthy();
    });

    test("shows Show Closed Accounts checkbox", () => {
      const onShowHiddenAccountsChange = mock(() => {});
      render(
        <ConfigMenu
          {...accountsProps}
          onShowHiddenAccountsChange={onShowHiddenAccountsChange}
        />
      );

      expect(screen.getByText("Show Closed Accounts")).toBeTruthy();
    });
  });

  describe("Categories tab", () => {
    const categoriesProps = {
      ...defaultProps,
      configTab: "categories",
      categoryGroups: [
        { id: "group-1", name: "Bills", deleted: false, hidden: false },
      ],
      categories: [
        { id: "cat-1", name: "Rent", category_group_id: "group-1", deleted: false, hidden: false },
        { id: "cat-2", name: "Utilities", category_group_id: "group-1", deleted: false, hidden: false },
      ],
      categoryGroupTypes: { "group-1": "Shared" },
      categoryTypes: { "cat-1": "Unset", "cat-2": "His" },
    };

    test("shows category groups and categories", () => {
      render(<ConfigMenu {...categoriesProps} />);

      expect(screen.getByText("Bills")).toBeTruthy();
      expect(screen.getByText("Rent")).toBeTruthy();
      expect(screen.getByText("Utilities")).toBeTruthy();
    });

    test("shows Sync Categories button that calls onSyncCategories", () => {
      const onSyncCategories = mock(() => {});
      render(<ConfigMenu {...categoriesProps} onSyncCategories={onSyncCategories} />);

      const button = screen.getByRole("button", { name: "Sync Categories" });
      fireEvent.click(button);

      expect(onSyncCategories).toHaveBeenCalledTimes(1);
    });

    test("shows loading state when isLoading is true", () => {
      render(<ConfigMenu {...categoriesProps} isLoading={true} />);
      expect(screen.getByText("Loading categories...")).toBeTruthy();
    });

    test("shows Show Hidden Categories checkbox", () => {
      render(<ConfigMenu {...categoriesProps} />);
      expect(screen.getByText("Show Hidden Categories")).toBeTruthy();
    });
  });
});
