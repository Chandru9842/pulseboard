import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PaginatedResponse, UnifiedContentItem } from "@/types/content";

export interface StatusResponse {
  status: string;
  timestamp: string;
  integrations: {
    tmdb: { configured: boolean; provider: string; mode: string };
    news: { configured: boolean; provider: string; mode: string };
    social: { configured: boolean; provider: string; mode: string };
  };
}

export const pulseApi = createApi({
  reducerPath: "pulseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["News", "Movies", "Social", "Trending", "Status"],
  endpoints: (builder) => ({
    getNews: builder.query<
      PaginatedResponse<UnifiedContentItem>,
      { page?: number; category?: string; q?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.category && params.category !== "All")
          searchParams.set("category", params.category);
        if (params.q) searchParams.set("q", params.q);
        return `news?${searchParams.toString()}`;
      },
      providesTags: ["News"],
    }),

    getMovies: builder.query<
      PaginatedResponse<UnifiedContentItem>,
      { page?: number; category?: string; q?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.category && params.category !== "All")
          searchParams.set("category", params.category);
        if (params.q) searchParams.set("q", params.q);
        return `movies?${searchParams.toString()}`;
      },
      providesTags: ["Movies"],
    }),

    getSocial: builder.query<
      PaginatedResponse<UnifiedContentItem>,
      { page?: number; hashtag?: string; q?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.hashtag && params.hashtag !== "All")
          searchParams.set("hashtag", params.hashtag);
        if (params.q) searchParams.set("q", params.q);
        return `social?${searchParams.toString()}`;
      },
      providesTags: ["Social"],
    }),

    getTrending: builder.query<
      { data: UnifiedContentItem[]; total: number; isMock: boolean },
      void
    >({
      query: () => "trending",
      providesTags: ["Trending"],
    }),

    getStatus: builder.query<StatusResponse, void>({
      query: () => "status",
      providesTags: ["Status"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
  useGetTrendingQuery,
  useGetStatusQuery,
} = pulseApi;
