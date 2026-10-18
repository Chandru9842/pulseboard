"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Check,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setActiveTab,
  setSelectedCategory,
  setSelectedHashtag,
  setActiveSourceFilter,
  setActiveSort,
  setSearchQuery,
} from "@/features/dashboard/dashboardSlice";
import {
  setViewMode,
  setContentOrder,
} from "@/features/preferences/preferencesSlice";
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} from "@/services/apiSlice";
import { FeedTab } from "@/types/dashboard";
import { UnifiedContentItem } from "@/types/content";
import { SortableFeed } from "@/components/feed/SortableFeed";
import { FeedSkeleton } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { HeroBanner } from "@/components/feed/HeroBanner";
import { RecommendedMovies } from "@/components/feed/RecommendedMovies";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const dispatch = useAppDispatch();

  // Redux State
  const activeTab = useAppSelector((state) => state.dashboard.activeTab);
  const selectedCategory = useAppSelector((state) => state.dashboard.selectedCategory);
  const selectedHashtag = useAppSelector((state) => state.dashboard.selectedHashtag);
  const searchQuery = useAppSelector((state) => state.dashboard.searchQuery);
  const activeSourceFilter = useAppSelector((state) => state.dashboard.activeSourceFilter);
  const activeSort = useAppSelector((state) => state.dashboard.activeSort);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const contentOrder = useAppSelector((state) => state.preferences.contentOrder);

  const [page, setPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // RTK Query hooks
  const newsQuery = useGetNewsQuery(
    {
      page,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      q: searchQuery || undefined,
    },
    { skip: activeTab === "movie" || activeTab === "social" }
  );

  const moviesQuery = useGetMoviesQuery(
    {
      page,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      q: searchQuery || undefined,
    },
    { skip: activeTab === "news" || activeTab === "social" }
  );

  const socialQuery = useGetSocialQuery(
    {
      page,
      hashtag: selectedHashtag !== "All" ? selectedHashtag : undefined,
      q: searchQuery || undefined,
    },
    { skip: activeTab === "news" || activeTab === "movie" }
  );

  const isLoading =
    (activeTab === "all" && (newsQuery.isLoading || moviesQuery.isLoading || socialQuery.isLoading)) ||
    (activeTab === "news" && newsQuery.isLoading) ||
    (activeTab === "movie" && moviesQuery.isLoading) ||
    (activeTab === "social" && socialQuery.isLoading);

  const isError =
    (activeTab === "all" && newsQuery.isError && moviesQuery.isError && socialQuery.isError) ||
    (activeTab === "news" && newsQuery.isError) ||
    (activeTab === "movie" && moviesQuery.isError) ||
    (activeTab === "social" && socialQuery.isError);

  const refetchAll = () => {
    newsQuery.refetch();
    moviesQuery.refetch();
    socialQuery.refetch();
  };

  // Interleave and sort raw items based on activeTab & filters
  const rawItems = useMemo<UnifiedContentItem[]>(() => {
    let list: UnifiedContentItem[] = [];

    if (activeTab === "all") {
      const news = newsQuery.data?.data || [];
      const movies = moviesQuery.data?.data || [];
      const social = socialQuery.data?.data || [];

      const maxLen = Math.max(news.length, movies.length, social.length);
      for (let i = 0; i < maxLen; i++) {
        if (news[i]) list.push(news[i]);
        if (movies[i]) list.push(movies[i]);
        if (social[i]) list.push(social[i]);
      }
    } else if (activeTab === "news") {
      list = [...(newsQuery.data?.data || [])];
    } else if (activeTab === "movie") {
      list = [...(moviesQuery.data?.data || [])];
    } else if (activeTab === "social") {
      list = [...(socialQuery.data?.data || [])];
    }

    // Source Filter
    if (activeSourceFilter === "live") {
      list = list.filter((i) => !i.isMock);
    } else if (activeSourceFilter === "mock") {
      list = list.filter((i) => i.isMock);
    }

    // Sort order
    if (activeSort === "rating") {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (activeSort === "popular") {
      list.sort((a, b) => {
        const scoreA = (a.engagement?.likes ?? 0) + (a.voteCount ?? 0);
        const scoreB = (b.engagement?.likes ?? 0) + (b.voteCount ?? 0);
        return scoreB - scoreA;
      });
    } else {
      list.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Persisted drag order
    if (contentOrder && contentOrder.length > 0) {
      const orderMap = new Map<string, number>();
      contentOrder.forEach((id, idx) => orderMap.set(id, idx));

      list.sort((a, b) => {
        const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
        const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
        return idxA - idxB;
      });
    }

    return list;
  }, [
    activeTab,
    newsQuery.data,
    moviesQuery.data,
    socialQuery.data,
    activeSourceFilter,
    activeSort,
    contentOrder,
  ]);

  const handleReorder = (newItems: UnifiedContentItem[]) => {
    const newOrderIds = newItems.map((i) => i.id);
    dispatch(setContentOrder(newOrderIds));
  };

  const handleResetFilters = () => {
    dispatch(setSelectedCategory("All"));
    dispatch(setSelectedHashtag("All"));
    dispatch(setActiveSourceFilter("all"));
    dispatch(setActiveSort("latest"));
    dispatch(setSearchQuery(""));
  };

  const hasMore =
    activeTab === "news"
      ? Boolean(newsQuery.data?.hasMore)
      : activeTab === "movie"
      ? Boolean(moviesQuery.data?.hasMore)
      : activeTab === "social"
      ? Boolean(socialQuery.data?.hasMore)
      : Boolean(newsQuery.data?.hasMore || moviesQuery.data?.hasMore);

  return (
    <div className="flex gap-8 items-start">
      {/* Center Main Dashboard Column */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* Editorial Hero Banner */}
        <HeroBanner />

        {/* "Your Feed" Section Header matching reference */}
        <div id="your-feed-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Your Feed
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest content based on your preferences
              </p>
            </div>

            {/* Filter Pills matching reference: All, News, Movies, Social + Sort button */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#101728] border border-slate-200 dark:border-[#1a233a] shadow-inner">
                {[
                  { id: "all" as FeedTab, label: "All" },
                  { id: "news" as FeedTab, label: "News" },
                  { id: "movie" as FeedTab, label: "Movies" },
                  { id: "social" as FeedTab, label: "Social" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        dispatch(setActiveTab(tab.id));
                        setPage(1);
                      }}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                        isActive
                          ? "gradient-pill-active text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-[#101728] border border-slate-200 dark:border-[#1a233a] text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="capitalize">{activeSort}</span>
                </button>

                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-200 dark:border-[#1a233a] bg-white dark:bg-[#0f1523] shadow-xl p-1.5 z-40">
                    {[
                      { id: "latest", label: "Latest" },
                      { id: "popular", label: "Most Popular" },
                      { id: "rating", label: "Top Rated" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          dispatch(setActiveSort(opt.id as "latest" | "popular" | "rating"));
                          setSortDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors",
                          activeSort === opt.id
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162035]"
                        )}
                      >
                        <span>{opt.label}</span>
                        {activeSort === opt.id && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#101728] border border-slate-200 dark:border-[#1a233a]">
                <button
                  onClick={() => dispatch(setViewMode("grid"))}
                  aria-label="Grid view"
                  className={cn(
                    "p-1.5 rounded-xl transition-colors",
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => dispatch(setViewMode("compact"))}
                  aria-label="Compact view"
                  className={cn(
                    "p-1.5 rounded-xl transition-colors",
                    viewMode === "compact"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Category Chip / Search Chip if filter active */}
          {(selectedCategory !== "All" || searchQuery) && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">Filtering by:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => dispatch(setSelectedCategory("All"))}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={() => dispatch(setSearchQuery(""))}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-400 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Main Feed Content List */}
          {isLoading ? (
            <FeedSkeleton count={4} compact={viewMode === "compact"} />
          ) : isError ? (
            <ErrorState onRetry={refetchAll} />
          ) : rawItems.length === 0 ? (
            <EmptyState
              title="No content matches your filters"
              description={
                searchQuery
                  ? `No items matching "${searchQuery}". Try a different keyword or category.`
                  : "No items found in this section."
              }
              onReset={handleResetFilters}
              resetLabel="Clear Filters"
            />
          ) : (
            <div className="space-y-6">
              <SortableFeed
                items={rawItems}
                onReorder={handleReorder}
                compact={viewMode === "compact"}
              />

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold border border-slate-200 dark:border-[#1a233a] bg-white dark:bg-[#0f1523] text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-400 transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <span>Load More Content</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* "Recommended Movies" Section matching reference */}
        <RecommendedMovies onViewAll={() => dispatch(setActiveTab("movie"))} />
      </div>

      {/* Right Column: Trending Now, Your Favorites, and Settings CTA */}
      <RightSidebar />
    </div>
  );
}
