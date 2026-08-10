import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import PageTransition from "./PageTransition";

// Mock framer-motion to simplify testing in jsdom
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});

describe("PageTransition Component", () => {
  it("renders children successfully within the router context", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PageTransition>
          <div data-testid="test-content">Page Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("applies custom className to wrapper element", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/custom-route"]}>
        <PageTransition className="custom-class-name">
          <div>Child Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    const animatedWrapper = container.firstElementChild;
    expect(animatedWrapper).toHaveClass("custom-class-name");
  });
});
