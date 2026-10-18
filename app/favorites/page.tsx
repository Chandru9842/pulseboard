"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Download,
  Film,
  Layers,
  MessageCircle,
  Newspaper,
  Search,
  Trash2,
  X,
  Compass,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearFavorites,
  setFavoritesFilter,
  setFavoritesSearch,
} from "@/features/favorites/favoritesSlice";
import { ContentCard } from "@/components/cards/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContentType } from "@/types/content";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const favorites = useAppSelector((state) => state.favorites.items);
  const filterType = useAppSelector((state) => state.favorites.filterType);
  const searchQuery = useAppSelector((state) => state.favorites.searchQuery);

  const [confirmClear, setConfirmClear] = useState(false);

  // Filter and search favorites
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    if (filterType !== "all") {
      result = result.filter((item) => item.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [favorites, filterType, searchQuery]);

  // Statistics
  const newsCount = favorites.filter((i) => i.type === "news").length;
  const movieCount = favorites.filter((i) => i.type === "movie").length;
  const socialCount = favorites.filter((i) => i.type === "social").length;

  const handleExport = () => {
    if (favorites.length === 0) {
      toast("No favorites to export", "info");
      return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pulseboard_favorites_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast("Favorites exported successfully!", "success");
  };

  const handleClear = () => {
    dispatch(clearFavorites());
    setConfirmClear(false);
    toast("Cleared all saved favorites", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Favorites & Bookmarks
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Quickly access your saved articles, movies to watch, and developer posts.
          </p>
        </div>

        {/* Action Buttons: Export & Clear */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          {[
            { id: "all", label: `All (${favorites.length})`, icon: Layers },
            { id: "news", label: `News (${newsCount})`, icon: Newspaper },
            { id: "movie", label: `Movies (${movieCount})`, icon: Film },
            { id: "social", label: `Social (${socialCount})`, icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  dispatch(setFavoritesFilter(tab.id as "all" | ContentType))
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Local Search within Favorites */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setFavoritesSearch(e.target.value))}
            placeholder="Search saved bookmarks..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setFavoritesSearch(""))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main List / Grid */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-500 mb-4 shadow-sm">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            No favorites saved yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            Click the bookmark icon on any news article, movie recommendation, or community post to save it here for offline reference.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Content</span>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          title="No favorites match your search"
          description={`No saved items found matching "${searchQuery}".`}
          onReset={() => dispatch(setFavoritesSearch(""))}
          resetLabel="Clear Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
