import { NextResponse } from "next/server";
import { isTmdbConfigured } from "@/lib/tmdb";

export async function GET() {
  const hasTmdb = isTmdbConfigured();
  const hasNews = Boolean(process.env.NEWS_API_KEY);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    integrations: {
      tmdb: {
        configured: hasTmdb,
        provider: "The Movie Database (TMDB v3)",
        mode: hasTmdb ? "live" : "mock-fallback",
      },
      news: {
        configured: hasNews,
        provider: "NewsAPI / Curated Tech Sources",
        mode: hasNews ? "live" : "mock-fallback",
      },
      social: {
        configured: true,
        provider: "PulseNet Simulated Mesh",
        mode: "mock",
      },
    },
  });
}
