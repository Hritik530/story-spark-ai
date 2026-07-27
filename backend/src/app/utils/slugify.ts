export function slugify(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // Replace one or more spaces with a hyphen
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-")        // Collapse multiple hyphens
    .replace(/^-|-$/g, "");     // Remove leading/trailing hyphens
}