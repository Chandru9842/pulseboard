import { UnifiedContentItem } from "@/types/content";
import { MOCK_SOCIAL_ITEMS } from "./mockData";

export async function fetchSocialPosts(params: {
  page?: number;
  hashtag?: string;
  query?: string;
}): Promise<{ data: UnifiedContentItem[]; total: number; isMock: boolean }> {
  let filtered = [...MOCK_SOCIAL_ITEMS];

  if (params.hashtag && params.hashtag !== "All" && params.hashtag !== "") {
    const tag = params.hashtag.startsWith("#") ? params.hashtag.toLowerCase() : `#${params.hashtag.toLowerCase()}`;
    filtered = filtered.filter(
      (s) =>
        s.tags.some((t) => t.toLowerCase() === tag) ||
        s.description.toLowerCase().includes(tag)
    );
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.author && s.author.toLowerCase().includes(q)) ||
        (s.authorHandle && s.authorHandle.toLowerCase().includes(q))
    );
  }

  const page = params.page || 1;
  const limit = 6;
  const startIndex = (page - 1) * limit;
  const paged = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paged.length > 0 ? paged : filtered,
    total: filtered.length,
    isMock: true,
  };
}
