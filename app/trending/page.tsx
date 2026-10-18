"use client";

import React, { useState } from "react";
import {
  Flame,
  TrendingUp,
  Sparkles,
  Newspaper,
  Film,
  MessageCircle,
  Layers,
} from "lucide-react";
import { useGetTrendingQuery } from "@/services/apiSlice";
import { ContentCard } from "@/components/cards/ContentCard";
import { FeedSkeleton } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContentType } from "@/types/content";
import { cn } from "@/lib/utils";

export default function TrendingPage() {
  const { data, isLoading, isError, refetch } = useGetTrendingQuery();
  const [filterType, setFilterType] = useState<"all" | ContentType>("all");

  const items = data?.data || [];
  const filtered = filterType === "all" ? items : items.filter((i) => i.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Trending Hub
            <Flame className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Top viral stories, breakout movies, and fastest-growing community discussions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          {[
            { id: "all", label: "All", icon: Layers },
            { id: "news", label: "News", icon: Newspaper },
            { id: "movie", label: "Movies", icon: Film },
            { id: "social", label: "Social", icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as "all" | ContentType)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Velocity Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/60 dark:border-rose-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              #1 Breakout Topic
            </span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1 truncate">
            Quantum Processors
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            +480% view surge across global networks
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Box Office Leader
            </span>
            <Film className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1 truncate">
            Dune: Part Two
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            8.5 Rating • 4.8k verified reviews
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/60 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Viral Community Post
            </span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1 truncate">
            dnd-kit Performance
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            1.2k likes • 310 reposts today
          </div>
        </div>
      </div>

      {/* Grid of Trending Cards */}
      {isLoading ? (
        <FeedSkeleton count={6} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No trending items"
          description="Trending content is currently refreshing. Check back shortly."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
