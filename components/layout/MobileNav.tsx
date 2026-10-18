"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bookmark,
  Flame,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileMenuOpen } from "@/features/dashboard/dashboardSlice";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.dashboard.mobileMenuOpen);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const navItems = [
    {
      label: "Feed",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: "Trending",
      href: "/trending",
      icon: Flame,
      active: pathname === "/trending",
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: Bookmark,
      active: pathname === "/favorites",
      count: favoritesCount,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(setMobileMenuOpen(false))}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 md:hidden shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                PulseBoard
              </span>
            </div>
            <button
              onClick={() => dispatch(setMobileMenuOpen(false))}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors",
                    item.active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        item.active
                          ? "bg-white/20 text-white"
                          : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600"
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
          PulseBoard v1.0 • Personalized Content Aggregator
        </div>
      </div>

      {/* Floating Bottom Nav for Mobile */}
      <nav
        aria-label="Mobile Bottom Bar"
        className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors relative",
                item.active
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
