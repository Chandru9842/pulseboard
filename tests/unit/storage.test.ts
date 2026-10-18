import { describe, it, expect, beforeEach } from "vitest";
import { loadFromStorage, saveToStorage, removeFromStorage } from "@/lib/storage";

describe("lib/storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return fallback when key is not present", () => {
    const val = loadFromStorage("non_existent_key", { default: true });
    expect(val).toEqual({ default: true });
  });

  it("should save and load JSON data from localStorage", () => {
    const data = { theme: "dark", count: 42 };
    saveToStorage("test_key", data);
    const loaded = loadFromStorage("test_key", { theme: "light", count: 0 });
    expect(loaded).toEqual(data);
  });

  it("should remove items from localStorage", () => {
    saveToStorage("remove_key", "hello");
    removeFromStorage("remove_key");
    const loaded = loadFromStorage("remove_key", "default");
    expect(loaded).toBe("default");
  });
});
