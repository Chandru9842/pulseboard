import { describe, it, expect } from "vitest";
import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  setFavoritesFilter,
  setFavoritesSearch,
} from "@/features/favorites/favoritesSlice";
import { UnifiedContentItem } from "@/types/content";

const mockItem: UnifiedContentItem = {
  id: "test-item-1",
  type: "news",
  title: "Test Title",
  description: "Test Description",
  source: "Test Source",
  publishedAt: "2026-10-18T10:00:00Z",
  tags: ["#test"],
  isMock: true,
};

describe("favoritesSlice", () => {
  it("should initialize with empty favorites", () => {
    const state = favoritesReducer(undefined, { type: "@@INIT" });
    expect(state.items).toEqual([]);
    expect(state.filterType).toBe("all");
    expect(state.searchQuery).toBe("");
  });

  it("should add a favorite item", () => {
    const state = favoritesReducer(undefined, addFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("test-item-1");
  });

  it("should not duplicate favorite if added twice", () => {
    let state = favoritesReducer(undefined, addFavorite(mockItem));
    state = favoritesReducer(state, addFavorite(mockItem));
    expect(state.items).toHaveLength(1);
  });

  it("should remove a favorite item", () => {
    let state = favoritesReducer(undefined, addFavorite(mockItem));
    state = favoritesReducer(state, removeFavorite("test-item-1"));
    expect(state.items).toHaveLength(0);
  });

  it("should toggle favorite item on and off", () => {
    let state = favoritesReducer(undefined, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(1);

    state = favoritesReducer(state, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(0);
  });

  it("should clear all favorites", () => {
    let state = favoritesReducer(undefined, addFavorite(mockItem));
    state = favoritesReducer(state, clearFavorites());
    expect(state.items).toHaveLength(0);
  });

  it("should set filter type", () => {
    const state = favoritesReducer(undefined, setFavoritesFilter("movie"));
    expect(state.filterType).toBe("movie");
  });

  it("should set search query", () => {
    const state = favoritesReducer(undefined, setFavoritesSearch("quantum"));
    expect(state.searchQuery).toBe("quantum");
  });
});
