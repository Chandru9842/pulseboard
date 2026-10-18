"use client";

import React from "react";
import {
  Check,
  Clock,
  Database,
  Film,
  Key,
  Laptop,
  Moon,
  Newspaper,
  RotateCcw,
  Sliders,
  Sun,
  Tags,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setTheme,
  setViewMode,
  toggleAutoRefresh,
  setRefreshInterval,
  toggleCategory,
  toggleHashtag,
  resetPreferences,
} from "@/features/preferences/preferencesSlice";
import { useGetStatusQuery } from "@/services/apiSlice";
import {
  ALL_AVAILABLE_CATEGORIES,
  ALL_AVAILABLE_HASHTAGS,
  ThemeMode,
} from "@/types/preferences";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const preferences = useAppSelector((state) => state.preferences);
  const { data: statusData } = useGetStatusQuery();

  const handleReset = () => {
    dispatch(resetPreferences());
    toast("Preferences reset to default values", "info");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Settings & Preferences
            <Sliders className="w-5 h-5 text-indigo-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your feed topics, color theme, auto-refresh rate, and API integrations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Theme Selection */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Interface Theme
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color theme or synchronize with your operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "dark" as ThemeMode,
              label: "Dark Mode",
              icon: Moon,
              desc: "Sleek obsidian theme for low-light environments",
            },
            {
              id: "light" as ThemeMode,
              label: "Light Mode",
              icon: Sun,
              desc: "Clean, high-contrast crisp day interface",
            },
            {
              id: "system" as ThemeMode,
              label: "System Sync",
              icon: Laptop,
              desc: "Automatically adapts to your OS preference",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = preferences.theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch(setTheme(item.id));
                  toast(`Theme set to ${item.label}`, "success");
                }}
                className={cn(
                  "flex flex-col p-4 rounded-2xl border text-left transition-all",
                  isSelected
                    ? "bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Preferred Content Categories */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Preferred Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select the categories that will appear on your top navigation filters and feed.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_AVAILABLE_CATEGORIES.map((cat) => {
            const isSelected = preferences.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => dispatch(toggleCategory(cat))}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Preferred Social Hashtags */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Tags className="w-4 h-4 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            PulseNet Hashtags
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Filter simulated community discussions and developer posts by active tags.
        </p>

        <div className="flex flex-wrap gap-2">
          {ALL_AVAILABLE_HASHTAGS.map((tag) => {
            const isSelected = preferences.hashtags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => dispatch(toggleHashtag(tag))}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Layout & Auto-Refresh */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Layout & Synchronization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control default card layouts and background poll frequency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Default View Mode */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Default Card Layout
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => dispatch(setViewMode("grid"))}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  preferences.viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                Grid Cards
              </button>
              <button
                onClick={() => dispatch(setViewMode("compact"))}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  preferences.viewMode === "compact"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                Compact List
              </button>
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Auto-Refresh Polling
              </span>
              <button
                onClick={() => dispatch(toggleAutoRefresh())}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  preferences.autoRefresh ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle auto refresh"
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    preferences.autoRefresh ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <select
                value={preferences.refreshIntervalSeconds}
                onChange={(e) => dispatch(setRefreshInterval(Number(e.target.value)))}
                disabled={!preferences.autoRefresh}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <option value={30}>Every 30 seconds</option>
                <option value={60}>Every 60 seconds (Recommended)</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 5. API Status & External Credentials Diagnostics */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500" />
            API Integrations & Fallbacks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current connection state to external data sources. PulseBoard includes zero-setup mock fallbacks so all features work out-of-the-box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TMDB Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Film className="w-4 h-4 text-amber-500" />
                TMDB Movies
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  statusData?.integrations.tmdb.configured
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {statusData?.integrations.tmdb.configured ? "Live API" : "Simulated"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {statusData?.integrations.tmdb.configured
                ? "Connected with active TMDB credentials."
                : "Using high-res curated cinema fallback. Set TMDB_API_KEY in .env.local to enable live movie search."}
            </p>
          </div>

          {/* News Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Newspaper className="w-4 h-4 text-blue-500" />
                News Wire
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  statusData?.integrations.news.configured
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {statusData?.integrations.news.configured ? "Live API" : "Curated Mock"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {statusData?.integrations.news.configured
                ? "Connected to live NewsAPI."
                : "Serving realistic engineering, AI, and startup headlines. Set NEWS_API_KEY for live feed."}
            </p>
          </div>

          {/* Social Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Database className="w-4 h-4 text-emerald-500" />
                PulseNet Mesh
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive social engine with persistent likes, reposts, author avatars, and hashtag clustering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
