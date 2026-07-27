import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeechSynthesis } from "../useSpeechSynthesis";

// Mock functions
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockPause = vi.fn();
const mockResume = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([]);

const makeMockSpeechSynthesis = () => ({
  speak: mockSpeak,
  cancel: mockCancel,
  pause: mockPause,
  resume: mockResume,
  getVoices: mockGetVoices,
  onvoiceschanged: null as (() => void) | null,
  pending: false,
  speaking: false,
  paused: false,
});

let mockInstance = makeMockSpeechSynthesis();
let speechSynthesisAvailable = true;

Object.defineProperty(window, "speechSynthesis", {
  configurable: true,
  get: () => (speechSynthesisAvailable ? mockInstance : undefined),
});

const mockUtteranceInstance = {
  text: "",
  lang: "en-US",
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: null as SpeechSynthesisVoice | null,
  onstart: null,
  onresume: null,
  onpause: null,
  onboundary: null,
  onend: null,
  onerror: null,
};

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  configurable: true,
  value: vi.fn().mockImplementation(() => ({ ...mockUtteranceInstance })),
});

describe("useSpeechSynthesis hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    speechSynthesisAvailable = true;
    mockInstance = makeMockSpeechSynthesis();
    mockGetVoices.mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    speechSynthesisAvailable = true;
  });

  it("returns isSupported true when speech synthesis is available", () => {
    const { result } = renderHook(() => useSpeechSynthesis(""));
    expect(result.current.isSupported).toBe(true);
  });

  it("returns correct default values", () => {
    const { result } = renderHook(() => useSpeechSynthesis(""));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("computes progress with correct word count", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello world test"));
    expect(result.current.progress.totalWords).toBe(3);
  });

  it("isPlaying is false by default", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello world"));
    expect(result.current.isPlaying).toBe(false);
  });

  it("isPaused is false by default", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello world"));
    expect(result.current.isPaused).toBe(false);
  });

  it("error is null by default", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello world"));
    expect(result.current.error).toBeNull();
  });

  it("setRate clamps rate to SPEED_MAX (2) for values above max", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello"));
    act(() => {
      result.current.setRate(5.0);
    });
    // After state update + re-render, rate should be clamped to 2
    expect(result.current.rate).toBe(2);
  });

  it("setRate clamps rate to SPEED_MIN (0.5) for values below min", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello"));
    act(() => {
      result.current.setRate(-1.0);
    });
    expect(result.current.rate).toBe(0.5);
  });

  it("setPlaybackRate updates rate state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello"));
    act(() => {
      result.current.setPlaybackRate(1.5);
    });
    expect(result.current.rate).toBe(1.5);
  });

  it("setVolume updates volume state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello"));
    act(() => {
      result.current.setVolume(0.5);
    });
    expect(result.current.volume).toBe(0.5);
  });

  it("setPitch updates pitch state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("Hello"));
    act(() => {
      result.current.setPitch(0.8);
    });
    expect(result.current.pitch).toBe(0.8);
  });
});
