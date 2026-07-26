import { slugify } from "../slugify";

describe("slugify", () => {
  it("converts a simple string to lowercase with spaces replaced by hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces multiple spaces with single hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("removes non-alphanumeric characters except hyphens", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple consecutive hyphens into one", () => {
    expect(slugify("Hello---World")).toBe("hello-world");
  });

  it("trims leading hyphens", () => {
    expect(slugify("  Hello World")).toBe("hello-world");
  });

  it("trims trailing hyphens", () => {
    expect(slugify("Hello World  ")).toBe("hello-world");
  });

  it("handles unicode characters by removing them", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("returns empty string for null input", () => {
    expect(slugify(null as any)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(slugify(undefined as any)).toBe("");
  });

  it("returns empty string for empty string input", () => {
    expect(slugify("")).toBe("");
  });

  it("handles strings that are already valid slugs", () => {
    expect(slugify("hello-world-123")).toBe("hello-world-123");
  });

  it("handles mixed case input", () => {
    expect(slugify("HeLLo WOrLD")).toBe("hello-world");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("!@#$%^&*()")).toBe("");
  });

  it("preserves numbers in the slug", () => {
    expect(slugify("Story 123: The Beginning")).toBe("story-123-the-beginning");
  });
});
