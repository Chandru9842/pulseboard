export type ContentType = "news" | "movie" | "social";

export interface SocialEngagement {
  likes: number;
  reposts: number;
  comments: number;
  isLiked?: boolean;
  isReposted?: boolean;
}

export interface UnifiedContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  publishedAt: string;
  author?: string;
  category?: string;
  tags: string[];
  isMock: boolean;

  // Movie-specific attributes
  rating?: number;
  voteCount?: number;
  genre?: string[];
  releaseDate?: string;

  // Social-specific attributes
  engagement?: SocialEngagement;
  authorAvatar?: string;
  authorHandle?: string;

  // Trending-specific attributes
  trendingRank?: number;
  trendingVelocity?: string;
}

export interface ContentFilter {
  type?: ContentType | "all";
  category?: string;
  query?: string;
  hashtag?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  isMock: boolean;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  isMock: boolean;
  message?: string;
}
