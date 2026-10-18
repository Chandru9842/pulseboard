"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export function HeroBanner({ onExploreClick }: HeroBannerProps) {
  const scrollToFeed = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const feedElem = document.getElementById("your-feed-section");
      feedElem?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl overflow-hidden border border-slate-200/60 dark:border-[#1e2942] shadow-xl group min-h-[300px] md:min-h-[340px] flex items-center"
    >
      {/* Cinematic Mountain Sunset Backdrop */}
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85"
        alt="Mountain sunset panorama with wanderer"
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
      />

      {/* Dark Vignette & Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c15]/95 via-[#080c15]/80 to-[#080c15]/40 dark:from-[#080c15]/95 dark:via-[#080c15]/75 dark:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c15]/90 via-transparent to-transparent md:hidden" />

      {/* Hero Content Grid */}
      <div className="relative z-10 w-full p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400 dark:text-indigo-300">
            DISCOVER • EXPLORE • PERSONALIZE
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Your Personalized <br className="hidden sm:inline" />
            Content Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            News, Movies, Social Posts and more — all in one place, curated just for you.
          </p>

          <div className="pt-2">
            <button
              onClick={scrollToFeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              <span>Explore Your Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Floating Quote Card */}
        <div className="hidden lg:flex flex-col p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-[220px] shrink-0 self-end md:self-center shadow-lg">
          <Quote className="w-5 h-5 text-rose-500 mb-1.5 fill-rose-500/20" />
          <p className="text-xs font-medium text-slate-200 leading-snug">
            &ldquo;A more informed, inspired and connected you.&rdquo;
          </p>
          <div className="w-6 h-0.5 bg-rose-500 rounded-full mt-2.5" />
        </div>
      </div>
    </motion.div>
  );
}
