"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Bookmark, Star } from "lucide-react";
import { useGetMoviesQuery } from "@/services/apiSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleFavorite } from "@/features/favorites/favoritesSlice";
import { useToast } from "@/components/ui/Toast";
import { UnifiedContentItem } from "@/types/content";
import { cn } from "@/lib/utils";

interface RecommendedMoviesProps {
  onViewAll?: () => void;
}

export function RecommendedMovies({ onViewAll }: RecommendedMoviesProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data } = useGetMoviesQuery({ page: 1 });
  const favorites = useAppSelector((state) => state.favorites.items);

  const movies = data?.data?.slice(0, 6) || [];
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleFavorite = (e: React.MouseEvent, movie: UnifiedContentItem) => {
    e.stopPropagation();
    e.preventDefault();
    const isFav = favorites.some((f) => f.id === movie.id);
    dispatch(toggleFavorite(movie));
    toast(
      isFav ? `Removed ${movie.title} from favorites` : `Saved ${movie.title} to favorites`,
      isFav ? "info" : "success"
    );
  };

  if (movies.length === 0) return null;

  return (
    <section className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Recommended Movies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on your interests
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Movie Posters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {movies.map((movie) => {
          const isFavorited = favorites.some((f) => f.id === movie.id);
          const hasError = imageErrors[movie.id];

          return (
            <div
              key={movie.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1a233a] bg-white dark:bg-[#0f1523] hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Poster Image */}
              <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {movie.imageUrl && !hasError ? (
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [movie.id]: true }))
                    }
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-xs text-slate-400">
                    <span className="font-bold">{movie.title}</span>
                  </div>
                )}

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                {/* Top bookmark button */}
                <button
                  onClick={(e) => handleFavorite(e, movie)}
                  aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
                  className={cn(
                    "absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all shadow-md z-10",
                    isFavorited
                      ? "bg-rose-500 text-white"
                      : "bg-black/50 hover:bg-black/80 text-white/80 hover:text-white"
                  )}
                >
                  <Bookmark
                    className={cn("w-3.5 h-3.5", isFavorited && "fill-current")}
                  />
                </button>
              </div>

              {/* Bottom Details */}
              <div className="p-2.5 flex items-center justify-between gap-1 bg-white dark:bg-[#0f1523]">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
