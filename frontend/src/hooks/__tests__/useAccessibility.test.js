import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = value; }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};

vi.stubGlobal("localStorage", localStorageMock);

const { useAccessibility } = await import("../useAccessibility");

describe("useAccessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(store).forEach(k => delete store[k]);
  });

  it("initializes with both states false by default", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(false);
    expect(result.current.reducedMotion).toBe(false);
  });

  it("reads saved highContrast preference from localStorage on mount", () => {
    store["accessibility-contrast"] = "true";
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(true);
  });

  it("toggles highContrast and persists to localStorage", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(false);
    act(() => result.current.toggleContrast());
    expect(result.current.highContrast).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("accessibility-contrast", "true");
    act(() => result.current.toggleContrast());
    expect(result.current.highContrast).toBe(false);
  });

  it("toggles reducedMotion and persists to localStorage", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.reducedMotion).toBe(false);
    act(() => result.current.toggleMotion());
    expect(result.current.reducedMotion).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("accessibility-motion", "true");
  });

  it("handles malformed localStorage JSON gracefully", () => {
    store["accessibility-contrast"] = "not-valid-json";
    expect(() => renderHook(() => useAccessibility())).not.toThrow();
  });
});
