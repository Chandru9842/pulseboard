"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        <TopNav />
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-[1720px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
