/// <reference types="vitest/globals" />
import { vi } from "vitest";

describe("resolveSocketUrl", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns the VITE_SOCKET_URL value when it is set", async () => {
    const url = "http://localhost:5000";
    vi.stubEnv("VITE_SOCKET_URL", url);
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe(url);
  });

  it("returns empty string when VITE_SOCKET_URL is not set in production", async () => {
    vi.stubEnv("VITE_SOCKET_URL", "");
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe("");
  });

  it("returns empty string when VITE_SOCKET_URL is undefined in production", async () => {
    vi.stubEnv("VITE_SOCKET_URL", undefined);
    vi.stubEnv("DEV", false);

    const mod = await import("../socket-url");
    expect(mod.resolveSocketUrl()).toBe("");
  });
});
