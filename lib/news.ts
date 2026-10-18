import { UnifiedContentItem } from "@/types/content";
import { MOCK_NEWS_ITEMS } from "./mockData";

export async function fetchNewsArticles(params: {
  page?: number;
  category?: string;
  query?: string;
}): Promise<{ data: UnifiedContentItem[]; total: number; isMock: boolean }> {
  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey) {
    try {
      const q = params.query || params.category || "technology";
      const page = params.page || 1;
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        q
      )}&page=${page}&pageSize=6&apiKey=${apiKey}`;

      const res = await fetch(url, {
        next: { revalidate: 300 },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.articles && json.articles.length > 0) {
          interface RawArticle {
            title: string;
            description: string;
            url: string;
            urlToImage: string | null;
            publishedAt: string;
            author: string | null;
            source: { name: string };
          }
          const articles: UnifiedContentItem[] = json.articles.map(
            (a: RawArticle, idx: number) => ({
              id: `news-live-${page}-${idx}`,
              type: "news" as const,
              title: a.title,
              description: a.description || "Click to read full article.",
              source: a.source?.name || "News Network",
              sourceUrl: a.url,
              imageUrl:
                a.urlToImage ||
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
              publishedAt: a.publishedAt,
              author: a.author || a.source?.name || "News Wire",
              category: params.category || "General",
              tags: [params.category || "News", a.source?.name || "Live"],
              isMock: false,
            })
          );

          return {
            data: articles,
            total: json.totalResults || articles.length,
            isMock: false,
          };
        }
      }
    } catch (err) {
      console.warn("Live news fetch failed, falling back to mock:", err);
    }
  }

  // Realistic mock data filtering
  let filtered = [...MOCK_NEWS_ITEMS];

  if (params.category && params.category.toLowerCase() !== "all") {
    const cat = params.category.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        (n.category && n.category.toLowerCase().includes(cat)) ||
        n.tags.some((t) => t.toLowerCase().includes(cat))
    );
    // If specific filter resulted in 0 items, keep mock items tagged relevantly
    if (filtered.length === 0) {
      filtered = MOCK_NEWS_ITEMS.slice(0, 4);
    }
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
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
