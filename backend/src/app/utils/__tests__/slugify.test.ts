import { slugify } from "../slugify";

describe("slugify", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("converts multiple spaces to single hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("converts tabs and newlines to hyphens", () => {
    expect(slugify("Hello\tWorld")).toBe("hello-world");
    expect(slugify("Hello\nWorld")).toBe("hello-world");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("Hello@World!")).toBe("helloworld");
    expect(slugify("What's Up?")).toBe("whats-up");
    expect(slugify("Hello#World$Test")).toBe("helloworldtest");
  });

  it("preserves hyphens in the input", () => {
    expect(slugify("hello-world-story")).toBe("hello-world-story");
  });

  it("collapses multiple consecutive hyphens into one", () => {
    expect(slugify("hello---world")).toBe("hello-world");
    expect(slugify("a--b--c")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
    expect(slugify("--hello--")).toBe("hello");
  });

  it("preserves numbers", () => {
    expect(slugify("Story 123")).toBe("story-123");
    expect(slugify("Chapter 1: The Beginning")).toBe("chapter-1-the-beginning");
  });

  it("lower-cases the result", () => {
    expect(slugify("HELLO WORLD")).toBe("hello-world");
    expect(slugify("HeLLo WoRLd")).toBe("hello-world");
  });

  it("handles single character input", () => {
    expect(slugify("A")).toBe("a");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles whitespace-only string", () => {
    expect(slugify("   ")).toBe("");
    expect(slugify("\t\n")).toBe("");
  });

  it("handles null input", () => {
    expect(slugify(null as unknown as string)).toBe("");
  });

  it("handles undefined input", () => {
    expect(slugify(undefined as unknown as string)).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("@#$%")).toBe("");
    expect(slugify("---")).toBe("");
  });

  it("produces consistent output for mixed input", () => {
    expect(slugify("The Quick-Brown Fox!")).toBe("the-quick-brown-fox");
    expect(slugify("  Hello   World@2024! ")).toBe("hello-world2024");
  });
});
