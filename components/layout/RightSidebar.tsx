"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Heart, Settings, Sparkles } from "lucide-react";
import { useGetTrendingQuery } from "@/services/apiSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeFavorite } from "@/features/favorites/favoritesSlice";
import { useToast } from "@/components/ui/Toast";
import { UnifiedContentItem } from "@/types/content";
import { INITIAL_FAVORITES } from "@/lib/mockData";

export function RightSidebar() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: trendingData } = useGetTrendingQuery();
  const favorites = useAppSelector((state) => state.favorites.items);

  const trendingItems = (trendingData?.data || []).slice(0, 5);
  const favoriteItems = (favorites.length > 0 ? favorites : INITIAL_FAVORITES).slice(0, 3);

  const handleRemoveFavorite = (e: React.MouseEvent, item: UnifiedContentItem) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(removeFavorite(item.id));
    toast(`Removed "${item.title.substring(0, 20)}..." from favorites`, "info");
  };

  return (
    <aside className="w-80 2xl:w-88 shrink-0 space-y-6 hidden xl:block">
      {/* 1. Trending Now Card */}
      <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-[#1a233a] bg-white dark:bg-[#0c1220] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162035] mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Trending Now
            </h3>
            <span className="text-base">🔥</span>
          </div>
          <Link
            href="/trending"
            className="text-[11px] font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Ranked Items 1 - 5 */}
        <div className="space-y-2.5">
          {trendingItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#131b2e] transition-colors group cursor-pointer"
            >
              {/* Rank Number */}
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#1a233a] text-slate-600 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              {/* Thumbnail */}
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="44px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors leading-tight">
                  {item.title}
                </h4>
                <span className="text-[10px] font-medium text-indigo-500 dark:text-indigo-400 block mt-0.5">
                  {item.category || item.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Your Favorites Card */}
      <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-[#1a233a] bg-white dark:bg-[#0c1220] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162035] mb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Your Favorites
          </h3>
          <Link
            href="/favorites"
            className="text-[11px] font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No saved favorites yet. Click the heart on any card!
          </div>
        ) : (
          <div className="space-y-2.5">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#131b2e] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                        ★
                      </div>
                    )}
                  </div>

                  {/* Title & Type */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Remove heart button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, item)}
                  aria-label="Remove favorite"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Create Your Perfect Feed Widget */}
      <div className="relative p-5 rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-[#12182b] to-[#1c183b] shadow-lg">
        {/* Ambient background glow and gear icons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-25 pointer-events-none">
          <Settings className="w-8 h-8 text-indigo-400 animate-spin-slow" />
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>

        <div className="relative z-10 space-y-2">
          <h4 className="text-sm font-extrabold text-white">
            Create Your Perfect Feed
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Choose your interests, set preferences and discover content that matters to you.
          </p>

          <div className="pt-2">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              <span>Go to Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
