import { NextResponse } from "next/server";
import { ALL_MOCK_ITEMS } from "@/lib/mockData";
import { UnifiedContentItem } from "@/types/content";

export async function GET() {
  try {
    // Collect items with trendingRank or calculate engagement/popularity velocity
    const trendingItems = ALL_MOCK_ITEMS.filter((item) => item.trendingRank !== undefined)
      .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99));

    // Supplement with highest engagement social items and highest rated movies
    const topMovies = ALL_MOCK_ITEMS.filter((i) => i.type === "movie" && !i.trendingRank)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 2);

    const topSocial = ALL_MOCK_ITEMS.filter((i) => i.type === "social" && !i.trendingRank)
      .sort((a, b) => ((b.engagement?.likes ?? 0) - (a.engagement?.likes ?? 0)))
      .slice(0, 2);

    const merged: UnifiedContentItem[] = [
      ...trendingItems,
      ...topMovies.map((m, idx) => ({
        ...m,
        trendingRank: trendingItems.length + idx + 1,
        trendingVelocity: `${m.rating}/10 Critics Choice`,
      })),
      ...topSocial.map((s, idx) => ({
        ...s,
        trendingRank: trendingItems.length + topMovies.length + idx + 1,
        trendingVelocity: `+${s.engagement?.likes} likes`,
      })),
    ];

    return NextResponse.json({
      data: merged,
      total: merged.length,
      isMock: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API /api/trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending items" },
      { status: 500 }
    );
  }
}
