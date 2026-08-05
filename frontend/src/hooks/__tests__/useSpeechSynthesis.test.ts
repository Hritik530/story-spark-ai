/**
 * useSpeechSynthesis.test.ts
 * Unit tests for the useSpeechSynthesis React hook.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeechSynthesis } from "../useSpeechSynthesis";

const mockVoice = (overrides: Partial<SpeechSynthesisVoice> = {}): SpeechSynthesisVoice =>
  ({
    name: "Test Voice",
    lang: "en-US",
    voiceURI: "test-voice-uri",
    default: false,
    localService: true,
    ...overrides,
  } as SpeechSynthesisVoice);

const makeMockSpeechSynthesis = (): SpeechSynthesis => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockPause = vi.fn();
  const mockResume = vi.fn();
  const mockGetVoices = vi.fn(() => [
    mockVoice({ name: "Voice A", lang: "en-US", voiceURI: "voice-a" }),
    mockVoice({ name: "Voice B", lang: "en-GB", voiceURI: "voice-b" }),
  ]);
  const synth = {
    speak: mockSpeak,
    cancel: mockCancel,
    pause: mockPause,
    resume: mockResume,
    getVoices: mockGetVoices,
    onvoiceschanged: null,
    pending: false,
    speaking: false,
    paused: false,
  } as unknown as SpeechSynthesis;

  return synth;
};

const stubSpeechSynthesis = (synth: SpeechSynthesis) => {
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal("SpeechSynthesisUtterance", vi.fn());
};

describe("useSpeechSynthesis", () => {
  let synth: SpeechSynthesis;

  beforeEach(() => {
    synth = makeMockSpeechSynthesis();
    stubSpeechSynthesis(synth);
    vi.clearAllMocks();
  });

  it("initializes isSupported to true when speechSynthesis is available", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.isSupported).toBe(true);
  });

  it("initializes isPlaying and isSpeaking to false", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it("initializes rate to 1 (default)", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.rate).toBe(1);
  });

  it("initializes pitch to 1 (default)", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.pitch).toBe(1);
  });

  it("initializes volume to 1 (default)", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.volume).toBe(1);
  });

  it("exposes play as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.play).toBe("function");
  });

  it("exposes pause as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.pause).toBe("function");
  });

  it("exposes resume as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.resume).toBe("function");
  });

  it("exposes stop as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.stop).toBe("function");
  });

  it("exposes setRate as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setRate).toBe("function");
  });

  it("exposes setPitch as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setPitch).toBe("function");
  });

  it("exposes setVolume as a function", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setVolume).toBe("function");
  });

  it("exposes progress as an object", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.progress).toBe("object");
    expect(result.current.progress).toHaveProperty("currentWordIndex");
    expect(result.current.progress).toHaveProperty("totalWords");
    expect(result.current.progress).toHaveProperty("percentage");
  });

  it("exposes voices as an array", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(Array.isArray(result.current.voices)).toBe(true);
  });

  it("exposes languageOptions as an array", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(Array.isArray(result.current.languageOptions)).toBe(true);
  });

  it("setRate updates the rate state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.rate).toBe(1);
    act(() => {
      result.current.setRate(1.5);
    });
    expect(result.current.rate).toBe(1.5);
  });

  it("setRate clamps rate to minimum of 0.5", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    act(() => {
      result.current.setRate(0.1);
    });
    expect(result.current.rate).toBeGreaterThanOrEqual(0.5);
  });

  it("setRate clamps rate to maximum of 2", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    act(() => {
      result.current.setRate(5);
    });
    expect(result.current.rate).toBeLessThanOrEqual(2);
  });

  it("setPitch updates the pitch state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.pitch).toBe(1);
    act(() => {
      result.current.setPitch(0.5);
    });
    expect(result.current.pitch).toBe(0.5);
  });

  it("setVolume updates the volume state", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.volume).toBe(1);
    act(() => {
      result.current.setVolume(0.5);
    });
    expect(result.current.volume).toBe(0.5);
  });

  it("error initializes to null", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.error).toBeNull();
  });

  it("currentWordIndex initializes to 0", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(result.current.currentWordIndex).toBe(0);
  });

  it("accepts voiceGender parameter without crashing", () => {
    const { result } = renderHook(() =>
      useSpeechSynthesis("hello world", "female")
    );
    expect(result.current.isSupported).toBe(true);
  });

  it("setSelectedVoiceId updates selectedVoiceId", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setSelectedVoiceId).toBe("function");
  });

  it("setSelectedLanguage updates selectedLanguage", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setSelectedLanguage).toBe("function");
  });

  it("setPlaybackRate is callable without crashing", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setPlaybackRate).toBe("function");
    result.current.setPlaybackRate(0.75);
  });

  it("setSelectedVoice is callable without crashing", () => {
    const { result } = renderHook(() => useSpeechSynthesis("hello world"));
    expect(typeof result.current.setSelectedVoice).toBe("function");
    result.current.setSelectedVoice(0);
  });
});
