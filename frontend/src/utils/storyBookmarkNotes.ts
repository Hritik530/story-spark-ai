export interface BookmarkNote {
  id: number;
  storyId: string;
  title: string;
  note: string;
  createdAt: string;
}

const STORAGE_KEY = "story-bookmark-notes";

export function getBookmarkNotes(): BookmarkNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBookmarkNotes(notes: BookmarkNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function addBookmarkNote(
  note: BookmarkNote
): BookmarkNote[] {
  const notes = getBookmarkNotes();
  const updated = [...notes, note];
  saveBookmarkNotes(updated);
  return updated;
}

export function updateBookmarkNote(
  id: number,
  content: string
): BookmarkNote[] {
  const updated = getBookmarkNotes().map((item) =>
    item.id === id
      ? { ...item, note: content }
      : item
  );

  saveBookmarkNotes(updated);
  return updated;
}

export function searchBookmarkNotes(
  notes: BookmarkNote[],
  keyword: string
) {
  return notes.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.note.toLowerCase().includes(keyword.toLowerCase())
  );
}