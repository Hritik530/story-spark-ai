import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAccessibility } from "../useAccessibility";

// Tests use SSR-safe guards present in the hook itself.
// The hook checks typeof window === 'undefined' in every localStorage access,
// so it is safe to render in a test environment without localStorage.

describe("useAccessibility", () => {
  it("initializes with both states false by default", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(false);
    expect(result.current.reducedMotion).toBe(false);
  });

  it("returns toggleContrast and toggleMotion functions", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(typeof result.current.toggleContrast).toBe("function");
    expect(typeof result.current.toggleMotion).toBe("function");
  });

  it("does not throw when rendered in an environment without localStorage", () => {
    expect(() => renderHook(() => useAccessibility())).not.toThrow();
  });

  it("returns highContrast and reducedMotion in the result object", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current).toHaveProperty("highContrast");
    expect(result.current).toHaveProperty("reducedMotion");
    expect(typeof result.current.highContrast).toBe("boolean");
    expect(typeof result.current.reducedMotion).toBe("boolean");
  });
});
