import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  compact?: boolean;
}

export function SkeletonCard({ compact = false }: SkeletonCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 animate-pulse">
        <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm animate-pulse">
      {/* Media placeholder */}
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative">
        <div className="absolute top-3 left-3 w-16 h-6 rounded-md bg-slate-300 dark:bg-slate-700" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700" />
      </div>

      {/* Content placeholder */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
          </div>
          <div className="h-5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-5 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Footer placeholder */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({
  count = 6,
  compact = false,
}: {
  count?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        compact
          ? "space-y-3"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4"
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} compact={compact} />
      ))}
    </div>
  );
}
