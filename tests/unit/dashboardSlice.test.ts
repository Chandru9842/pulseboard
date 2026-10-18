import { describe, it, expect } from "vitest";
import dashboardReducer, {
  setActiveTab,
  setSelectedCategory,
  setSelectedHashtag,
  setSearchQuery,
  toggleSidebar,
  setActiveSourceFilter,
  markAllNotificationsRead,
} from "@/features/dashboard/dashboardSlice";

describe("dashboardSlice", () => {
  it("should initialize with default dashboard state", () => {
    const state = dashboardReducer(undefined, { type: "@@INIT" });
    expect(state.activeTab).toBe("all");
    expect(state.selectedCategory).toBe("All");
    expect(state.selectedHashtag).toBe("All");
    expect(state.searchQuery).toBe("");
    expect(state.isSidebarCollapsed).toBe(false);
  });

  it("should change active tab", () => {
    const state = dashboardReducer(undefined, setActiveTab("movie"));
    expect(state.activeTab).toBe("movie");
  });

  it("should change selected category", () => {
    const state = dashboardReducer(undefined, setSelectedCategory("AI & ML"));
    expect(state.selectedCategory).toBe("AI & ML");
  });

  it("should change selected hashtag", () => {
    const state = dashboardReducer(undefined, setSelectedHashtag("#frontend"));
    expect(state.selectedHashtag).toBe("#frontend");
  });

  it("should update search query", () => {
    const state = dashboardReducer(undefined, setSearchQuery("Next.js"));
    expect(state.searchQuery).toBe("Next.js");
  });

  it("should toggle sidebar collapsed state", () => {
    let state = dashboardReducer(undefined, toggleSidebar());
    expect(state.isSidebarCollapsed).toBe(true);

    state = dashboardReducer(state, toggleSidebar());
    expect(state.isSidebarCollapsed).toBe(false);
  });

  it("should update source filter", () => {
    const state = dashboardReducer(undefined, setActiveSourceFilter("live"));
    expect(state.activeSourceFilter).toBe("live");
  });

  it("should mark all notifications read", () => {
    let state = dashboardReducer(undefined, { type: "@@INIT" });
    expect(state.notifications.some((n) => !n.read)).toBe(true);

    state = dashboardReducer(state, markAllNotificationsRead());
    expect(state.notifications.every((n) => n.read)).toBe(true);
  });
});
