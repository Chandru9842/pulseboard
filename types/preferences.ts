export type ThemeMode = "light" | "dark" | "system";
export type ViewMode = "grid" | "compact";

export interface UserPreferences {
  categories: string[];
  hashtags: string[];
  theme: ThemeMode;
  viewMode: ViewMode;
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
  compactView: boolean;
  contentOrder: string[]; // persisted custom IDs order
}

export const DEFAULT_CATEGORIES: string[] = [
  "Technology",
  "AI & ML",
  "Startups",
  "Design",
  "Entertainment",
  "Science",
];

export const ALL_AVAILABLE_CATEGORIES: string[] = [
  "Technology",
  "AI & ML",
  "Startups",
  "Design",
  "Entertainment",
  "Science",
  "Business",
  "Gaming",
  "Cybersecurity",
  "Web Development",
];

export const DEFAULT_HASHTAGS: string[] = [
  "#tech",
  "#ai",
  "#frontend",
  "#webdev",
  "#design",
  "#typescript",
];

export const ALL_AVAILABLE_HASHTAGS: string[] = [
  "#tech",
  "#ai",
  "#frontend",
  "#webdev",
  "#design",
  "#typescript",
  "#nextjs",
  "#react",
  "#opensource",
  "#coding",
  "#startups",
  "#uiux",
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  categories: DEFAULT_CATEGORIES,
  hashtags: DEFAULT_HASHTAGS,
  theme: "dark",
  viewMode: "grid",
  autoRefresh: false,
  refreshIntervalSeconds: 60,
  compactView: false,
  contentOrder: [],
};
