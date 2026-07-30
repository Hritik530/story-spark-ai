/**
 * storyBookmarkNotes.test.ts
 * Unit tests for the storyBookmarkNotes utility.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadBookmarkNotes, saveBookmarkNotes } from "../storyBookmarkNotes";

const STORAGE_KEY = "story-bookmark-notes";

const storageMock = {
  store: {} as Record<string, string>,
};

const mockLocalStorage = () => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => storageMock.store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storageMock.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storageMock.store[key];
    }),
  });
};

describe("loadBookmarkNotes", () => {
  beforeEach(() => {
    storageMock.store = {};
    mockLocalStorage();
  });

  it("returns an empty array when localStorage is empty", () => {
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });

  it("parses and returns stored JSON array", () => {
    const notes = [
      { id: 1, storyId: "s1", title: "Note 1", note: "Content 1", createdAt: "2024-01-01T00:00:00.000Z" },
      { id: 2, storyId: "s1", title: "Note 2", note: "Content 2", createdAt: "2024-01-02T00:00:00.000Z" },
    ];
    storageMock.store[STORAGE_KEY] = JSON.stringify(notes);
    const result = loadBookmarkNotes();
    expect(result).toEqual(notes);
    expect(result).toHaveLength(2);
  });

  it("returns an empty array when localStorage contains invalid JSON", () => {
    storageMock.store[STORAGE_KEY] = "not valid json {";
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });

  it("returns JSON.parse result when localStorage contains the string null", () => {
    storageMock.store[STORAGE_KEY] = "null";
    const result = loadBookmarkNotes();
    // JSON.parse("null") returns null; the function returns it as-is
    expect(result).toBeNull();
  });

  it("returns an empty array when localStorage key does not exist", () => {
    const result = loadBookmarkNotes();
    expect(result).toEqual([]);
  });
});

describe("saveBookmarkNotes", () => {
  beforeEach(() => {
    storageMock.store = {};
    mockLocalStorage();
  });

  it("saves notes array to localStorage as JSON", () => {
    const notes = [
      { id: 1, storyId: "s1", title: "Test Note", note: "Test content", createdAt: "2024-01-01T00:00:00.000Z" },
    ];
    saveBookmarkNotes(notes);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(notes)
    );
  });

  it("saves and loadBookmarkNotes round-trips correctly", () => {
    const notes = [
      { id: 1, storyId: "s2", title: "My Note", note: "Some content", createdAt: "2024-06-15T12:00:00.000Z" },
      { id: 2, storyId: "s2", title: "Second Note", note: "More content", createdAt: "2024-06-16T12:00:00.000Z" },
    ];
    saveBookmarkNotes(notes);
    const result = loadBookmarkNotes();
    expect(result).toEqual(notes);
  });

  it("saves an empty array correctly", () => {
    saveBookmarkNotes([]);
    const stored = storageMock.store[STORAGE_KEY];
    expect(stored).toBe("[]");
  });

  it("saves a single note correctly", () => {
    const notes = [
      { id: 99, storyId: "s99", title: "Single", note: "Only one", createdAt: "2024-12-31T23:59:59.000Z" },
    ];
    saveBookmarkNotes(notes);
    const result = loadBookmarkNotes();
    expect(result).toEqual(notes);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(99);
  });
});
