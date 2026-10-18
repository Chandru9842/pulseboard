"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Crown,
  Film,
  Flame,
  HeartPulse,
  Home,
  Plane,
  Search,
  Settings,
  Sparkles,
  Trophy,
  Utensils,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSelectedCategory,
  toggleSidebar,
} from "@/features/dashboard/dashboardSlice";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "Technology", name: "Technology", icon: Cpu, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  { id: "Business", name: "Business", icon: Briefcase, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  { id: "Sports", name: "Sports", icon: Trophy, color: "text-rose-400", bgColor: "bg-rose-500/10" },
  { id: "Entertainment", name: "Entertainment", icon: Film, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  { id: "Health", name: "Health", icon: HeartPulse, color: "text-teal-400", bgColor: "bg-teal-500/10" },
  { id: "Science", name: "Science", icon: Sparkles, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  { id: "Travel", name: "Travel", icon: Plane, color: "text-sky-400", bgColor: "bg-sky-500/10" },
  { id: "Food", name: "Food", icon: Utensils, color: "text-orange-400", bgColor: "bg-orange-500/10" },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.dashboard.isSidebarCollapsed);
  const selectedCategory = useAppSelector((state) => state.dashboard.selectedCategory);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "For You", href: "/#your-feed-section", icon: Sparkles },
    { label: "Trending", href: "/trending", icon: Flame },
    { label: "Favorites", href: "/favorites", icon: Bookmark },
    { label: "Search", href: "/#search", icon: Search },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col justify-between border-r transition-all duration-300 z-30 shrink-0",
          "bg-white dark:bg-[#0b0f19] border-slate-200/80 dark:border-[#141a29] h-screen sticky top-0 overflow-y-auto scrollbar-none",
          isCollapsed ? "w-20" : "w-60"
        )}
      >
        <div>
          {/* Top Brand Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 dark:border-[#141a29]">
            <Link href="/" className="flex items-center gap-3 overflow-hidden group">
              {/* Neon Waveform Soundwave Icon */}
              <div className="flex items-center gap-0.5 h-7">
                <span className="w-1 h-3 rounded-full bg-indigo-500 animate-pulse" />
                <span className="w-1 h-5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-7 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="w-1 h-4 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "450ms" }} />
                <span className="w-1 h-2 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: "600ms" }} />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                    PulseBoard
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 tracking-tight">
                    Your World. Your Feed.
                  </span>
                </div>
              )}
            </Link>

            {/* Toggle collapse */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Nav Menu */}
          <nav className="p-3 space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/#")
                  ? false
                  : pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all relative group",
                    isActive
                      ? "gradient-pill-active text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b2e] hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive && "text-white")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Categories Section */}
          {!isCollapsed && (
            <div className="px-4 pt-3 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </span>

              <div className="mt-2 space-y-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => dispatch(setSelectedCategory(isSelected ? "All" : cat.id))}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left group",
                        isSelected
                          ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b2e] hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <div className={cn("p-1 rounded-lg shrink-0", cat.bgColor, cat.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Card: Upgrade Your Experience */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#12182b] to-[#1c183b] space-y-2.5 text-center shadow-lg">
            <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Crown className="w-4 h-4" />
            </div>

            <div>
              <h5 className="text-xs font-extrabold text-white">
                Upgrade Your Experience
              </h5>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                More personalized content, real-time updates and more.
              </p>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 inline-flex items-center justify-center gap-1.5"
            >
              <span>Explore Premium</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </aside>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-3xl border border-indigo-500/40 bg-[#0f1523] text-white space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Crown className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold">PulseBoard Premium</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlock multi-language live news feeds, unrestricted TMDB 4K trailers, custom AI summarization, and cloud multi-device synchronization.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#141c2e] border border-slate-700/60 text-xs text-indigo-400 text-center font-bold">
              Included in Intern Demo Sandbox — All Features Fully Unlocked!
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
}
