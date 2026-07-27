import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import { computeDocumentStats } from "../../utils/story-utils";
import type { Chapter } from "../../types/story.types";

vi.mock("../../utils/story-utils", () => ({
  computeDocumentStats: vi.fn(),
}));

const mockStats = {
  totalWords: 100,
  uniqueWords: 80,
  vocabularyRichness: 0.8,
  readingTimeMin: 1.0,
  estimatedPages: 0.5,
};

const zeroStats = {
  totalWords: 0,
  uniqueWords: 0,
  vocabularyRichness: 0,
  readingTimeMin: 0,
  estimatedPages: 0,
};

const makeChapter = (id: number, title: string, content: string): Chapter =>
  ({ id, title, content } as Chapter);

describe("useDocumentStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeDocumentStats as ReturnType<typeof vi.fn>).mockReturnValue(mockStats);
  });

  it("handles undefined chapters gracefully", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>).mockReturnValueOnce(zeroStats);
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.chapterStats).toEqual([]);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("computes per-chapter stats and aggregate stats for a single chapter", () => {
    const chapters: Chapter[] = [makeChapter(1, "Chapter 1", "Hello world test content")];
    const { result } = renderHook(() => useDocumentStats(chapters));

    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0]).toMatchObject({
      id: 1,
      title: "Chapter 1",
    });
    expect(result.current.docStats).toEqual(mockStats);
  });

  it("computes per-chapter stats for multiple chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "content one"),
      makeChapter(2, "Ch2", "content two"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));

    // called once per chapter + once for combined
    expect(computeDocumentStats).toHaveBeenCalledTimes(3);
    expect(result.current.chapterStats).toHaveLength(2);
    expect(result.current.chapterStats[0]).toMatchObject({ id: 1, title: "Ch1" });
    expect(result.current.chapterStats[1]).toMatchObject({ id: 2, title: "Ch2" });
  });

  it("computes chapterAvgWords as docStats.totalWords / chapterCount", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 200 });

    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "chapter one"),
      makeChapter(2, "Ch2", "chapter two"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterAvgWords).toBe(200 / 2);
  });

  it("computes maxChapterWords as the maximum word count across chapters", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ ...mockStats, totalWords: 50 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 200 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 });

    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "short chapter"),
      makeChapter(2, "Ch2", "long chapter"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.maxChapterWords).toBe(200);
  });

  it("memoizes results — does not recompute for same chapters reference", () => {
    const chapters: Chapter[] = [makeChapter(1, "Ch1", "content")];
    const { result, rerender } = renderHook(() => useDocumentStats(chapters));
    const firstStats = result.current;
    rerender();
    expect(result.current).toBe(firstStats);
  });
});
