import { describe, test, expect, mock, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TokenInputView } from "./TokenInputView.jsx";

afterEach(cleanup);

describe("TokenInputView", () => {
  test("renders token input form", () => {
    render(<TokenInputView onTokenSubmit={() => {}} />);

    expect(screen.getByText("YNAB Access Token")).toBeTruthy();
    expect(screen.getByPlaceholderText("Paste your YNAB access token here")).toBeTruthy();
    expect(screen.getByText("Connect to YNAB")).toBeTruthy();
  });

  test("renders link to YNAB developer settings", () => {
    render(<TokenInputView onTokenSubmit={() => {}} />);

    const link = screen.getByRole("link", { name: "YNAB Developer Settings" });
    expect(link.getAttribute("href")).toBe("https://app.youneedabudget.com/settings/developer");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  test("calls onTokenSubmit with trimmed token value on form submit", () => {
    const onTokenSubmit = mock(() => {});
    render(<TokenInputView onTokenSubmit={onTokenSubmit} />);

    const input = screen.getByPlaceholderText("Paste your YNAB access token here");
    fireEvent.change(input, { target: { value: "  my-test-token  " } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(onTokenSubmit).toHaveBeenCalledTimes(1);
    expect(onTokenSubmit).toHaveBeenCalledWith("my-test-token");
  });

  test("input is required", () => {
    render(<TokenInputView onTokenSubmit={() => {}} />);

    const input = screen.getByPlaceholderText("Paste your YNAB access token here");
    expect(input.hasAttribute("required")).toBe(true);
  });

  test("input is password type for security", () => {
    render(<TokenInputView onTokenSubmit={() => {}} />);

    const input = screen.getByPlaceholderText("Paste your YNAB access token here");
    expect(input.getAttribute("type")).toBe("password");
  });
});
