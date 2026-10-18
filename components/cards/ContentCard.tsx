"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  GripVertical,
  Heart,
  Star,
  Film,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { UnifiedContentItem } from "@/types/content";
import { formatTimeAgo, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleFavorite } from "@/features/favorites/favoritesSlice";
import { useToast } from "@/components/ui/Toast";

interface ContentCardProps {
  item: UnifiedContentItem;
  compact?: boolean;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export function ContentCard({
  item,
  compact = false,
  dragHandleProps,
  isDragging = false,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorited = favorites.some((fav) => fav.id === item.id);

  const [imageError, setImageError] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleFavorite(item));
    toast(
      isFavorited
        ? `Removed "${item.title.substring(0, 24)}..." from favorites`
        : `Added "${item.title.substring(0, 24)}..." to favorites`,
      isFavorited ? "info" : "success"
    );
  };

  const handleHeartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsHearted((prev) => !prev);
    if (!isFavorited && !isHearted) {
      dispatch(toggleFavorite(item));
      toast(`Loved & saved "${item.title.substring(0, 24)}..."`, "success");
    } else {
      toast(isHearted ? "Unliked post" : "Liked post!", "info");
    }
  };

  const typeIcon = {
    news: <Newspaper className="w-3 h-3 text-blue-400" />,
    movie: <Film className="w-3 h-3 text-amber-400" />,
    social: <MessageCircle className="w-3 h-3 text-emerald-400" />,
  }[item.type];

  const typeLabel = {
    news: "News",
    movie: "Movie",
    social: "Social",
  }[item.type];

  // Compact List Mode
  if (compact) {
    return (
      <div
        className={cn(
          "group relative flex items-center justify-between gap-4 p-3 rounded-2xl border transition-all duration-200",
          "bg-white dark:bg-[#0f1523] border-slate-200/80 dark:border-[#1a233a] hover:border-indigo-500/50 hover:shadow-md",
          isDragging && "opacity-50 ring-2 ring-indigo-500 shadow-xl"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            {...dragHandleProps}
            aria-label="Drag to reorder"
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-white focus:outline-none"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {item.imageUrl && !imageError && (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="48px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                {typeIcon}
                <span>{typeLabel}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {item.source}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-400 transition-colors">
              {item.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavoriteToggle}
            aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
            className={cn(
              "p-2 rounded-xl transition-all",
              isFavorited
                ? "text-rose-500 bg-rose-500/10"
                : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#1a233a]"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isFavorited && "fill-current")} />
          </button>
        </div>
      </div>
    );
  }

  // Reference UI Standard Card
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden",
        "bg-white dark:bg-[#0f1523] border-slate-200/80 dark:border-[#1a233a] hover:border-indigo-500/50 hover:shadow-2xl hover:-translate-y-1",
        isDragging && "opacity-50 ring-2 ring-indigo-500 shadow-2xl z-50"
      )}
    >
      <div>
        {/* Card Thumbnail */}
        <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {item.imageUrl && !imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#141c2e] text-slate-400">
              {typeIcon}
              <span className="text-xs font-semibold mt-1">{item.source}</span>
            </div>
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Badge pinned top-left: News, Movie, Social */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/10 shadow-sm">
              {typeIcon}
              <span>{typeLabel}</span>
            </span>
          </div>

          {/* Drag grip pinned top-right */}
          <div className="absolute top-2.5 right-2.5 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              {...dragHandleProps}
              aria-label="Drag to reorder card"
              className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md transition-colors shadow-sm"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Details Body */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Movie Rating if applicable */}
          {item.type === "movie" && item.rating !== undefined && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating}/10</span>
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Source • Time Ago & Action Buttons */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-[#162035] flex items-center justify-between text-xs bg-slate-50/50 dark:bg-[#0c1220]">
        {/* Left: Source Icon/Avatar & Time */}
        <div className="flex items-center gap-2 min-w-0">
          {item.authorAvatar ? (
            <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-slate-700">
              <Image
                src={item.authorAvatar}
                alt={item.author || "User"}
                fill
                sizes="16px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-md bg-indigo-600/30 flex items-center justify-center text-[9px] font-black text-indigo-400 shrink-0">
              {item.source.charAt(0)}
            </div>
          )}
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
            {item.authorHandle || item.source}
          </span>
          <span className="text-slate-400 text-[10px]">•</span>
          <span className="text-[11px] text-slate-400 shrink-0">
            {formatTimeAgo(item.publishedAt)}
          </span>
        </div>

        {/* Right: Bookmark + Heart Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavoriteToggle}
            aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isFavorited
                ? "text-rose-500"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isFavorited && "fill-current")} />
          </button>

          <button
            onClick={handleHeartToggle}
            aria-label="Like post"
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isHearted || isFavorited
                ? "text-rose-500"
                : "text-slate-400 hover:text-rose-500 hover:bg-slate-800"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                (isHearted || isFavorited) && "fill-rose-500 text-rose-500"
              )}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
