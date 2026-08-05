
/**
 * useDocumentStats.test.ts
 * Unit tests for the useDocumentStats React hook.
 */
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";

const makeChapter = (overrides: Partial<import("../../types/story.types").Chapter> = {}): import("../../types/story.types").Chapter => ({
  id: 1,
  title: "Chapter 1",
  content: "This is some sample content for testing.",
  ...overrides,
} as import("../../types/story.types").Chapter);

describe("useDocumentStats", () => {
  it("returns docStats with correct shape when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.docStats).toBeDefined();
    expect(typeof result.current.docStats.totalWords).toBe("number");
    expect(typeof result.current.docStats.readingTimeMin).toBe("number");
  });

  it("returns empty chapterStats array when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.chapterStats).toEqual([]);
  });

  it("returns zero chapterAvgWords when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.chapterAvgWords).toBe(0);
  });

  it("returns zero maxChapterWords when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("returns empty chapterStats when chapters is an empty array", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.chapterStats).toEqual([]);
  });

  it("computes chapterStats correctly for a single chapter", () => {
    const chapters = [makeChapter({ id: 1, title: "Intro", content: "One two three four five." })];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0].id).toBe(1);
    expect(result.current.chapterStats[0].title).toBe("Intro");
  });

  it("maps id and title correctly in chapterStats", () => {
    const chapters = [
      makeChapter({ id: 5, title: "First Chapter", content: "Word." }),
      makeChapter({ id: 10, title: "Second Chapter", content: "Word word." }),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats[0].id).toBe(5);
    expect(result.current.chapterStats[0].title).toBe("First Chapter");
    expect(result.current.chapterStats[1].id).toBe(10);
    expect(result.current.chapterStats[1].title).toBe("Second Chapter");
  });

  it("computes docStats with positive totalWords for non-empty chapters", () => {
    const chapters = [makeChapter({ content: "Hello world this is a test." })];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.docStats.totalWords).toBeGreaterThan(0);
  });

  it("chapterStats length matches the chapters array length", () => {
    const chapters = [
      makeChapter({ id: 1, content: "Content one." }),
      makeChapter({ id: 2, content: "Content two." }),
      makeChapter({ id: 3, content: "Content three." }),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats).toHaveLength(3);
  });

  it("chapterAvgWords is computed as totalWords divided by chapter count", () => {
    const chapters = [
      makeChapter({ id: 1, content: "word word word word" }),
      makeChapter({ id: 2, content: "word word word word" }),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterAvgWords).toBe(result.current.docStats.totalWords / 2);
  });

  it("maxChapterWords is the maximum word count across chapters", () => {
    const chapters = [
      makeChapter({ id: 1, content: "word" }),
      makeChapter({ id: 2, content: "word word word word word word" }),
      makeChapter({ id: 3, content: "word word word" }),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    const chapterWordCounts = result.current.chapterStats.map((c) => c.totalWords);
    expect(result.current.maxChapterWords).toBe(Math.max(...chapterWordCounts));
  });

  it("each chapterStats entry has all DocumentStats fields", () => {
    const chapters = [makeChapter({ id: 1, content: "Sample content for testing." })];
    const { result } = renderHook(() => useDocumentStats(chapters));
    const stats = result.current.chapterStats[0];
    expect(stats).toHaveProperty("totalWords");
    expect(stats).toHaveProperty("uniqueWords");
    expect(stats).toHaveProperty("readingTimeMin");
    expect(stats).toHaveProperty("estimatedPages");

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import { Chapter } from "../../types/story.types";

describe("useDocumentStats hook", () => {
  const makeChapter = (id: number, title: string, content: string): Chapter => ({
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
  });

  it("should return zero stats for undefined chapters", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));

    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.docStats.uniqueWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("should return zero stats for empty chapters array", () => {
    const { result } = renderHook(() => useDocumentStats([]));

    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("should compute per-chapter and aggregate stats for a single chapter", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Chapter 1", "Hello world hello"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // Per-chapter: 3 words total, 2 unique
    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0].id).toBe(1);
    expect(result.current.chapterStats[0].title).toBe("Chapter 1");
    expect(result.current.chapterStats[0].totalWords).toBe(3);
    expect(result.current.chapterStats[0].uniqueWords).toBe(2);

    // Aggregate: 3 words total, 2 unique, avg = 3, max = 3
    expect(result.current.docStats.totalWords).toBe(3);
    expect(result.current.docStats.uniqueWords).toBe(2);
    expect(result.current.chapterAvgWords).toBe(3);
    expect(result.current.maxChapterWords).toBe(3);
  });

  it("should compute correct aggregate stats across multiple chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Chapter 1", "one two three four five"),
      makeChapter(2, "Chapter 2", "six seven eight nine ten eleven twelve"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // Chapter 1: 5 words, Chapter 2: 7 words
    expect(result.current.chapterStats).toHaveLength(2);
    expect(result.current.chapterStats[0].totalWords).toBe(5);
    expect(result.current.chapterStats[1].totalWords).toBe(7);

    // Aggregate: 12 total words, avg = 12/2 = 6, max = 7
    expect(result.current.docStats.totalWords).toBe(12);
    expect(result.current.chapterAvgWords).toBe(6);
    expect(result.current.maxChapterWords).toBe(7);
  });

  it("should set maxChapterWords to the chapter with the most words", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Short", "a b c"),
      makeChapter(2, "Longest", "a b c d e f g h i j"),
      makeChapter(3, "Medium", "w x y z"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    expect(result.current.maxChapterWords).toBe(10);
    expect(result.current.chapterAvgWords).toBeCloseTo(6.0);
  });

  it("should recompute when chapters array changes", () => {
    const { result, rerender } = renderHook(
      ({ chapters }: { chapters: Chapter[] | undefined }) =>
        useDocumentStats(chapters),
      { initialProps: { chapters: undefined as Chapter[] | undefined } }
    );

    expect(result.current.docStats.totalWords).toBe(0);

    rerender({
      chapters: [makeChapter(1, "Chapter 1", "hello world")],
    });

    expect(result.current.docStats.totalWords).toBe(2);
  });
});
