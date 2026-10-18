import { describe, it, expect } from "vitest";
import preferencesReducer, {
  setTheme,
  toggleCategory,
  toggleHashtag,
  setViewMode,
  toggleAutoRefresh,
  resetPreferences,
  loadSavedPreferences,
} from "@/features/preferences/preferencesSlice";
import { DEFAULT_PREFERENCES } from "@/types/preferences";

describe("preferencesSlice", () => {
  it("should initialize with default preferences", () => {
    const state = preferencesReducer(undefined, { type: "@@INIT" });
    expect(state.theme).toBe("dark");
    expect(state.viewMode).toBe("grid");
    expect(state.categories.length).toBeGreaterThan(0);
  });

  it("should handle setTheme", () => {
    const state = preferencesReducer(DEFAULT_PREFERENCES, setTheme("light"));
    expect(state.theme).toBe("light");
  });

  it("should handle setViewMode", () => {
    const state = preferencesReducer(DEFAULT_PREFERENCES, setViewMode("compact"));
    expect(state.viewMode).toBe("compact");
  });

  it("should toggle categories properly", () => {
    // Add new category
    let state = preferencesReducer(DEFAULT_PREFERENCES, toggleCategory("Gaming"));
    expect(state.categories).toContain("Gaming");

    // Remove category
    state = preferencesReducer(state, toggleCategory("Gaming"));
    expect(state.categories).not.toContain("Gaming");
  });

  it("should not allow removing all categories", () => {
    let state = {
      ...DEFAULT_PREFERENCES,
      categories: ["Technology"],
    };
    state = preferencesReducer(state, toggleCategory("Technology"));
    expect(state.categories.length).toBe(1);
    expect(state.categories).toContain("Technology");
  });

  it("should toggle hashtags properly", () => {
    let state = preferencesReducer(DEFAULT_PREFERENCES, toggleHashtag("#nextjs"));
    expect(state.hashtags).toContain("#nextjs");

    state = preferencesReducer(state, toggleHashtag("#nextjs"));
    expect(state.hashtags).not.toContain("#nextjs");
  });

  it("should toggle autoRefresh", () => {
    const state = preferencesReducer(DEFAULT_PREFERENCES, toggleAutoRefresh());
    expect(state.autoRefresh).toBe(!DEFAULT_PREFERENCES.autoRefresh);
  });

  it("should reset to default preferences", () => {
    const modifiedState = {
      ...DEFAULT_PREFERENCES,
      theme: "light" as const,
      categories: ["Gaming"],
    };
    const state = preferencesReducer(modifiedState, resetPreferences());
    expect(state.theme).toBe(DEFAULT_PREFERENCES.theme);
    expect(state.categories).toEqual(DEFAULT_PREFERENCES.categories);
  });

  it("should load saved preferences", () => {
    const state = preferencesReducer(
      DEFAULT_PREFERENCES,
      loadSavedPreferences({ theme: "light", compactView: true })
    );
    expect(state.theme).toBe("light");
    expect(state.compactView).toBe(true);
  });
});
