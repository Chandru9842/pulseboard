import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardState, FeedTab, NotificationItem } from "@/types/dashboard";

interface ExtendedDashboardState extends DashboardState {
  notifications: NotificationItem[];
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Welcome to PulseBoard",
    message: "Your personalized news, movies, and community pulse is ready.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info",
  },
  {
    id: "notif-2",
    title: "TMDB & News Fallback Active",
    message: "Running in rich mock mode. Add TMDB_API_KEY to unlock live movies.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "success",
  },
  {
    id: "notif-3",
    title: "Interactive Drag-and-Drop",
    message: "Reorder cards using the grip handle. Layout order automatically saves.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info",
  },
];

const initialState: ExtendedDashboardState = {
  activeTab: "all",
  selectedCategory: "All",
  selectedHashtag: "All",
  searchQuery: "",
  isSidebarCollapsed: false,
  mobileMenuOpen: false,
  activeSourceFilter: "all",
  activeSort: "latest",
  notificationsOpen: false,
  notifications: INITIAL_NOTIFICATIONS,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<FeedTab>) => {
      state.activeTab = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedHashtag: (state, action: PayloadAction<string>) => {
      state.selectedHashtag = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setActiveSourceFilter: (state, action: PayloadAction<"all" | "live" | "mock">) => {
      state.activeSourceFilter = action.payload;
    },
    setActiveSort: (state, action: PayloadAction<"latest" | "popular" | "rating">) => {
      state.activeSort = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsOpen = action.payload;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
  },
});

export const {
  setActiveTab,
  setSelectedCategory,
  setSelectedHashtag,
  setSearchQuery,
  toggleSidebar,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setActiveSourceFilter,
  setActiveSort,
  toggleNotifications,
  setNotificationsOpen,
  markAllNotificationsRead,
  markNotificationRead,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
