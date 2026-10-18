import { NextRequest, NextResponse } from "next/server";
import { fetchSocialPosts } from "@/lib/social";
import { PaginatedResponse, UnifiedContentItem } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const hashtag = searchParams.get("hashtag") || undefined;
    const query = searchParams.get("q") || undefined;

    const { data, total, isMock } = await fetchSocialPosts({
      page,
      hashtag,
      query,
    });

    const limit = 6;
    const totalPages = Math.ceil(total / limit) || 1;

    const response: PaginatedResponse<UnifiedContentItem> = {
      data,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      isMock,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API /api/social error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}
