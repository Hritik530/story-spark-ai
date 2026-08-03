import { describe, test, expect } from "vitest";
import { splitIntoChapters, renumberChapters } from "../chapterUtils";

describe("splitIntoChapters", () => {
  test("should split a story with multiple chapters", () => {
    const story = `Chapter 1
Once upon a time there was a hero.

Chapter 2
The hero went on an adventure.

Chapter 3
They returned home.`;

    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(3);
    expect(chapters[0].id).toBe(1);
    expect(chapters[0].title).toBe("Chapter 1");
    expect(chapters[0].content).toBe("Once upon a time there was a hero.");

    expect(chapters[1].id).toBe(2);
    expect(chapters[1].title).toBe("Chapter 2");
    expect(chapters[1].content).toBe("The hero went on an adventure.");

    expect(chapters[2].id).toBe(3);
    expect(chapters[2].title).toBe("Chapter 3");
    expect(chapters[2].content).toBe("They returned home.");
  });

  test("should handle chapter with numeric variations", () => {
    const story = `Chapter 1
First chapter content.

Chapter 10
Tenth chapter content.`;

    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(2);
    expect(chapters[0].title).toBe("Chapter 1");
    expect(chapters[1].title).toBe("Chapter 10");
  });

  test("should handle case-insensitive chapter markers", () => {
    const story = `CHAPTER 1
All caps marker.

chapter 2
Lower case marker.`;

    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(2);
  });

  test("should handle a single chapter without a Chapter prefix", () => {
    const story = "This is a single story with no chapters.";

    const chapters = splitIntoChapters(story);

    expect(chapters).toHaveLength(1);
    expect(chapters[0].id).toBe(1);
    expect(chapters[0].title).toBe("Chapter 1");
    expect(chapters[0].content).toBe(story);
  });

  test("should return empty array for empty string", () => {
    const chapters = splitIntoChapters("");
    expect(chapters).toHaveLength(0);
  });

  test("should return empty array for whitespace-only content", () => {
    const chapters = splitIntoChapters("   \n  \n  ");
    expect(chapters).toHaveLength(0);
  });
});

describe("renumberChapters", () => {
  test("should renumber chapters sequentially starting at 1", () => {
    const chapters = [
      { id: 5, title: "Old Title 5", content: "Content 5" },
      { id: 10, title: "Old Title 10", content: "Content 10" },
      { id: 99, title: "Old Title 99", content: "Content 99" },
    ];

    const renumbered = renumberChapters(chapters);

    expect(renumbered[0].id).toBe(1);
    expect(renumbered[0].title).toBe("Chapter 1");
    expect(renumbered[0].content).toBe("Content 5");

    expect(renumbered[1].id).toBe(2);
    expect(renumbered[1].title).toBe("Chapter 2");

    expect(renumbered[2].id).toBe(3);
    expect(renumbered[2].title).toBe("Chapter 3");
  });

  test("should preserve body content when renumbering", () => {
    const chapters = [
      { id: 1, title: "Chapter 1", content: "Important story content here." },
    ];

    const renumbered = renumberChapters(chapters);

    expect(renumbered[0].content).toBe("Important story content here.");
  });

  test("should handle empty array", () => {
    const renumbered = renumberChapters([]);
    expect(renumbered).toHaveLength(0);
  });

  test("should handle single chapter", () => {
    const chapters = [{ id: 999, title: "Whatever", content: "Content" }];

    const renumbered = renumberChapters(chapters);

    expect(renumbered).toHaveLength(1);
    expect(renumbered[0].id).toBe(1);
    expect(renumbered[0].title).toBe("Chapter 1");
  });
});
