import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import type { Chapter } from "../../types/story.types";

vi.mock("../../utils/story-utils", () => ({
  computeDocumentStats: vi.fn((content: string | undefined) => {
    const words = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    return {
      totalWords: words,
      uniqueWords: words,
      vocabularyRichness: 1,
      readingTimeMin: Math.ceil(words / 200),
      estimatedPages: words / 250,
    };
  }),
}));

const makeChapter = (id: number, title: string, content: string): Chapter =>
  ({ id, title, content } as Chapter);

describe("useDocumentStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero stats when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("returns zero stats for an empty chapters array", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("computes docStats from concatenated chapter content", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Chapter 1", "hello world"),
      makeChapter(2, "Chapter 2", "foo bar baz"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // combined: "hello world foo bar baz" = 5 words
    expect(result.current.docStats.totalWords).toBe(5);
  });

  it("maps chapterStats with id, title, and stats for each chapter", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Intro", "hello world"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0]).toMatchObject({
      id: 1,
      title: "Intro",
    });
    expect(result.current.chapterStats[0].totalWords).toBe(2);
  });

  it("computes chapterAvgWords as totalWords divided by chapter count", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "one two three four five"),
      makeChapter(2, "Ch2", "six seven eight nine ten"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // Ch1: 5 words, Ch2: 5 words, total: 10 words
    expect(result.current.docStats.totalWords).toBe(10);
    expect(result.current.chapterAvgWords).toBeCloseTo(5, 1);
  });

  it("computes maxChapterWords from the chapter with the most words", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Short", "hi"),
      makeChapter(2, "Long", "this is a longer chapter with more words here"),
      makeChapter(3, "Medium", "the quick brown fox"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // "Long" chapter has the most words
    expect(result.current.maxChapterWords).toBeGreaterThan(2);
    expect(result.current.maxChapterWords).toBeGreaterThanOrEqual(
      result.current.chapterStats[1].totalWords
    );
  });
});
