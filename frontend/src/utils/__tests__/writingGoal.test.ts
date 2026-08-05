import { describe, it, expect } from "vitest";
import {
  calculateWordProgress,
  calculateStoryProgress,
  calculatePromptProgress,
  isGoalCompleted,
  getRemainingWords,
  getRemainingStories,
  getRemainingPrompts,
} from "../writingGoal";

describe("calculateWordProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculateWordProgress(0, 100)).toBe(0);
  });

  it("returns 50 when current is half of target", () => {
    expect(calculateWordProgress(50, 100)).toBe(50);
  });

  it("returns 100 when current equals target", () => {
    expect(calculateWordProgress(100, 100)).toBe(100);
  });

  it("caps at 100 when current exceeds target", () => {
    expect(calculateWordProgress(150, 100)).toBe(100);
  });

  it("returns NaN when current and target are both 0 (divide by zero)", () => {
    // Division by zero produces NaN; this documents the current behavior
    expect(Number.isNaN(calculateWordProgress(0, 0))).toBe(true);
  });
});

describe("calculateStoryProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculateStoryProgress(0, 5)).toBe(0);
  });

  it("returns correct percentage for partial progress", () => {
    expect(calculateStoryProgress(2, 5)).toBe(40);
  });

  it("caps at 100 when current exceeds target", () => {
    expect(calculateStoryProgress(10, 5)).toBe(100);
  });
});

describe("calculatePromptProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculatePromptProgress(0, 3)).toBe(0);
  });

  it("returns correct percentage for partial progress", () => {
    expect(calculatePromptProgress(1, 3)).toBeCloseTo(33.33, 1);
  });

  it("caps at 100 when current exceeds target", () => {
    expect(calculatePromptProgress(5, 3)).toBe(100);
  });
});

describe("isGoalCompleted", () => {
  it("returns false when current is less than target", () => {
    expect(isGoalCompleted(49, 50)).toBe(false);
  });

  it("returns true when current equals target", () => {
    expect(isGoalCompleted(50, 50)).toBe(true);
  });

  it("returns true when current exceeds target", () => {
    expect(isGoalCompleted(100, 50)).toBe(true);
  });

  it("returns false when current is 0 and target is positive", () => {
    expect(isGoalCompleted(0, 100)).toBe(false);
  });
});

describe("getRemainingWords", () => {
  it("returns target minus current when current is less than target", () => {
    expect(getRemainingWords(30, 100)).toBe(70);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingWords(100, 100)).toBe(0);
  });

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingWords(150, 100)).toBe(0);
  });

  it("returns target when current is 0", () => {
    expect(getRemainingWords(0, 50)).toBe(50);
  });
});

describe("getRemainingStories", () => {
  it("returns correct remaining stories", () => {
    expect(getRemainingStories(1, 5)).toBe(4);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingStories(5, 5)).toBe(0);
  });

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingStories(10, 5)).toBe(0);
  });
});

describe("getRemainingPrompts", () => {
  it("returns correct remaining prompts", () => {
    expect(getRemainingPrompts(2, 7)).toBe(5);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingPrompts(7, 7)).toBe(0);
  });

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingPrompts(10, 7)).toBe(0);
  });
});
