import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadBookmarkNotes,
  saveBookmarkNotes,
  searchBookmarkNotes,
} from "../storyBookmarkNotes";

const STORAGE_KEY = "story-bookmark-notes";

interface MockStorage {
  store: Record<string, string>;
}

let mockStorage: MockStorage = { store: {} };

beforeEach(() => {
  mockStorage = { store: {} };
  vi.stubGlobal(
    "localStorage",
    {
      getItem: (key: string) => mockStorage.store[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage.store[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage.store[key];
      },
    }
  );
});

describe("loadBookmarkNotes", () => {
  it("returns empty array when localStorage key does not exist", () => {
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });

  it("returns parsed array when localStorage has valid data", () => {
    const notes = [
      { id: 1, storyId: "s1", title: "Note 1", note: "Content 1", createdAt: "2026-01-01" },
      { id: 2, storyId: "s1", title: "Note 2", note: "Content 2", createdAt: "2026-01-02" },
    ];
    mockStorage.store[STORAGE_KEY] = JSON.stringify(notes);
    const result = loadBookmarkNotes();
    expect(result).toEqual(notes);
  });

  it("returns empty array when localStorage data is invalid JSON", () => {
    mockStorage.store[STORAGE_KEY] = "not valid json {{{";
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });

  it("returns empty array when localStorage returns null", () => {
    mockStorage.store = {};
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });
});

describe("saveBookmarkNotes", () => {
  it("calls localStorage.setItem with stringified JSON of notes array", () => {
    const notes = [
      { id: 1, storyId: "s1", title: "Test", note: "Test note", createdAt: "2026-01-01" },
    ];
    saveBookmarkNotes(notes);
    expect(mockStorage.store[STORAGE_KEY]).toBe(JSON.stringify(notes));
  });

  it("stores empty array correctly", () => {
    saveBookmarkNotes([]);
    expect(mockStorage.store[STORAGE_KEY]).toBe("[]");
  });

  it("overwrites previous notes", () => {
    const notes1 = [{ id: 1, storyId: "s1", title: "First", note: "First note", createdAt: "2026-01-01" }];
    const notes2 = [{ id: 2, storyId: "s1", title: "Second", note: "Second note", createdAt: "2026-01-02" }];
    saveBookmarkNotes(notes1);
    saveBookmarkNotes(notes2);
    expect(mockStorage.store[STORAGE_KEY]).toBe(JSON.stringify(notes2));
  });
});

describe("searchBookmarkNotes", () => {
  const notes = [
    { id: 1, storyId: "s1", title: "Chapter 1 Note", note: "Introduction scene", createdAt: "2026-01-01" },
    { id: 2, storyId: "s1", title: "Character Note", note: "Hero's backstory", createdAt: "2026-01-02" },
    { id: 3, storyId: "s2", title: "Plot Note", note: "The climax scene", createdAt: "2026-01-03" },
  ];

  it("returns all notes matching keyword in note field (case-insensitive)", () => {
    const result = searchBookmarkNotes(notes, "SCENE");
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.id)).toContain(1);
    expect(result.map((n) => n.id)).toContain(3);
  });

  it("returns all notes matching keyword in title field (case-insensitive)", () => {
    const result = searchBookmarkNotes(notes, "CHAPTER");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("matches keyword in both title and note fields", () => {
    const result = searchBookmarkNotes(notes, "Note");
    expect(result).toHaveLength(3);
  });

  it("returns empty array when no notes match", () => {
    const result = searchBookmarkNotes(notes, "nonexistent keyword xyz");
    expect(result).toEqual([]);
  });

  it("returns empty array when notes array is empty", () => {
    const result = searchBookmarkNotes([], "anything");
    expect(result).toEqual([]);
  });

  it("matches partial words in note content", () => {
    const result = searchBookmarkNotes(notes, "Hero");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});
