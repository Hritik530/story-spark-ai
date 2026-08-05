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
