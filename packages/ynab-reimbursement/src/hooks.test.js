import { describe, test, expect, beforeEach } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./hooks.js";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    expect(result.current[0]).toBe("default");
  });

  test("returns stored value when localStorage has data", () => {
    localStorage.setItem("ynabReimbursement_testKey", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    expect(result.current[0]).toBe("stored");
  });

  test("updates localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("ynabReimbursement_testKey"))).toBe("updated");
  });

  test("uses custom prefix", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "value", "custom_")
    );

    act(() => {
      result.current[1]("customValue");
    });

    expect(JSON.parse(localStorage.getItem("custom_testKey"))).toBe("customValue");
    expect(localStorage.getItem("ynabReimbursement_testKey")).toBeNull();
  });
});
