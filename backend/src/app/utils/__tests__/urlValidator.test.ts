import { isValidUrl } from "../urlValidator";

describe("isValidUrl", () => {
  describe("valid HTTP/HTTPS URLs", () => {
    it("returns true for standard https URL", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
    });

    it("returns true for standard http URL", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("returns true for localhost", () => {
      expect(isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("returns true for URL with port", () => {
      expect(isValidUrl("https://example.com:8080")).toBe(true);
    });

    it("returns true for URL with path", () => {
      expect(isValidUrl("https://example.com/path/to/page")).toBe(true);
    });

    it("returns true for URL with query string", () => {
      expect(isValidUrl("https://example.com?search=term&page=1")).toBe(true);
    });

    it("returns true for URL with fragment", () => {
      expect(isValidUrl("https://example.com#section")).toBe(true);
    });

    it("returns true for URL with query and fragment", () => {
      expect(isValidUrl("https://example.com/path?a=1#anchor")).toBe(true);
    });

    it("returns true for URL with subdomain", () => {
      expect(isValidUrl("https://api.example.com/v1/users")).toBe(true);
    });

    it("returns true for URL with IP address", () => {
      expect(isValidUrl("http://127.0.0.1:5000")).toBe(true);
    });

    it("returns true for URL with authentication", () => {
      expect(isValidUrl("https://user:pass@example.com")).toBe(true);
    });
  });

  describe("invalid URLs", () => {
    it("returns false for relative path", () => {
      expect(isValidUrl("/path/to/page")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidUrl("")).toBe(false);
    });

    it("returns false for whitespace-only string", () => {
      expect(isValidUrl("   ")).toBe(false);
    });

    it("returns false for plain domain without protocol", () => {
      expect(isValidUrl("example.com")).toBe(false);
    });

    it("returns false for ftp protocol", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
    });

    it("returns false for javascript protocol", () => {
      expect(isValidUrl("javascript:void(0)")).toBe(false);
    });

    it("returns false for data URL", () => {
      expect(isValidUrl("data:text/html,<h1>test</h1>")).toBe(false);
    });

    it("returns false for file protocol", () => {
      expect(isValidUrl("file:///etc/passwd")).toBe(false);
    });

    it("returns false for mailto protocol", () => {
      expect(isValidUrl("mailto:test@example.com")).toBe(false);
    });

    it("returns false for tel protocol", () => {
      expect(isValidUrl("tel:+1234567890")).toBe(false);
    });
  });

  describe("null and type safety", () => {
    it("returns false for null", () => {
      expect(isValidUrl(null as any)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isValidUrl(undefined as any)).toBe(false);
    });

    it("returns false for number input", () => {
      expect(isValidUrl(123 as any)).toBe(false);
    });

    it("returns false for object input", () => {
      expect(isValidUrl({ url: "https://example.com" } as any)).toBe(false);
    });
  });
});
