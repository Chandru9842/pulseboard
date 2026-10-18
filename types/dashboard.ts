import { ContentType } from "./content";

export type FeedTab = "all" | ContentType;

export interface DashboardState {
  activeTab: FeedTab;
  selectedCategory: string; // "All" or a specific category
  selectedHashtag: string; // "All" or a specific hashtag
  searchQuery: string;
  isSidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeSourceFilter: "all" | "live" | "mock";
  activeSort: "latest" | "popular" | "rating";
  notificationsOpen: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning";
}
