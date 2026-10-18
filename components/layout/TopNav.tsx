"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSearchQuery,
  setMobileMenuOpen,
  toggleNotifications,
  markAllNotificationsRead,
} from "@/features/dashboard/dashboardSlice";
import { setTheme } from "@/features/preferences/preferencesSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { formatTimeAgo, cn } from "@/lib/utils";

export function TopNav() {
  const dispatch = useAppDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const globalSearchQuery = useAppSelector((state) => state.dashboard.searchQuery);
  const currentTheme = useAppSelector((state) => state.preferences.theme);
  const notifications = useAppSelector((state) => state.dashboard.notifications);
  const notificationsOpen = useAppSelector((state) => state.dashboard.notificationsOpen);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [localSearch, setLocalSearch] = useState(globalSearchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync debounced search to Redux
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Dynamic greeting based on current local time
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const toggleTheme = () => {
    dispatch(setTheme(currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="sticky top-0 z-20 h-20 border-b border-slate-200/80 dark:border-[#141a29] bg-white/80 dark:bg-[#080c15]/90 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Center Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => dispatch(setMobileMenuOpen(true))}
          aria-label="Open mobile navigation"
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-[#131b2e] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar matching reference */}
        <div id="search" className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search news, movies, posts..."
            aria-label="Search dashboard content"
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs md:text-sm bg-slate-100 dark:bg-[#101728] border border-transparent focus:border-indigo-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
          />

          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                dispatch(setSearchQuery(""));
              }}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Theme Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Sun / Moon Switcher Pill */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark and light theme"
          className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-[#101728] border border-slate-200 dark:border-[#1e2942] transition-colors"
        >
          <div
            className={cn(
              "p-1.5 rounded-full transition-all",
              currentTheme === "light"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Sun className="w-3.5 h-3.5" />
          </div>
          <div
            className={cn(
              "p-1.5 rounded-full transition-all",
              currentTheme === "dark" || currentTheme === "system"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Moon className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Notification Bell with red dot */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => dispatch(toggleNotifications())}
            aria-label="Notifications"
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#101728] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#080c15]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-3xl border border-slate-200 dark:border-[#1a233a] bg-white dark:bg-[#0f1523] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162035]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:underline font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-[#162035] max-h-72 overflow-y-auto mt-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "py-3 px-2 rounded-xl transition-colors text-left",
                      !notif.read && "bg-indigo-50/50 dark:bg-indigo-950/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge matching reference: "Good evening, Chand" */}
        <div className="flex items-center gap-2.5 pl-1.5 cursor-pointer group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80"
              alt="Chand user profile"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] text-slate-400 leading-tight">
              {greeting},
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Chand
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}
