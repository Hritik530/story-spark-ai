import { slugify } from "../slugify";

describe("slugify", () => {
  test("converts uppercase letters to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("replaces spaces with hyphens", () => {
    expect(slugify("My Story Spark")).toBe("my-story-spark");
  });

  test("collapses multiple spaces into a single hyphen", () => {
    expect(slugify("Hello     World")).toBe("hello-world");
  });

  test("trims leading and trailing whitespace", () => {
    expect(slugify("   Hello World   ")).toBe("hello-world");
  });

  test("removes special characters", () => {
    expect(slugify("Hello@World!")).toBe("helloworld");
  });

  test("collapses multiple hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  test("removes leading and trailing hyphens", () => {
    expect(slugify("---hello-world---")).toBe("hello-world");
  });

  test("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  test("handles strings containing only spaces", () => {
    expect(slugify("     ")).toBe("");
  });

  test("handles unicode characters by removing unsupported characters", () => {
    expect(slugify("Héllo Wörld")).toBe("hllo-wrld");
  });

  test("handles numbers correctly", () => {
    expect(slugify("Story 2026 Version 2")).toBe("story-2026-version-2");
  });

  test("removes mixed special characters", () => {
    expect(slugify("Story*&^%$#@! Spark")).toBe("story-spark");
  });
});