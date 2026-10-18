import { UnifiedContentItem } from "@/types/content";
import { MOCK_MOVIES_ITEMS } from "./mockData";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780";

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
}

export function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN);
}

export function transformTmdbMovie(movie: TMDBMovie): UnifiedContentItem {
  const genres = (movie.genre_ids || [])
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : movie.backdrop_path
    ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80";

  return {
    id: `tmdb-${movie.id}`,
    type: "movie",
    title: movie.title,
    description: movie.overview || "No synopsis available for this title.",
    source: "TMDB",
    sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    imageUrl,
    publishedAt: movie.release_date ? `${movie.release_date}T00:00:00Z` : new Date().toISOString(),
    releaseDate: movie.release_date,
    rating: Number(movie.vote_average.toFixed(1)),
    voteCount: movie.vote_count,
    genre: genres.length > 0 ? genres : ["Cinema"],
    category: "Entertainment",
    tags: [...genres, "Movies", "TMDB"],
    isMock: false,
  };
}

export async function fetchTmdbMovies(params: {
  page?: number;
  category?: string;
  query?: string;
}): Promise<{ data: UnifiedContentItem[]; total: number; isMock: boolean }> {
  const apiKey = process.env.TMDB_API_KEY;
  const readToken = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!apiKey && !readToken) {
    // Graceful fallback to mock data
    return filterMockMovies(params);
  }

  const page = params.page || 1;
  let endpoint = `${TMDB_BASE_URL}/movie/popular?page=${page}`;

  if (params.query) {
    endpoint = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
      params.query
    )}&page=${page}`;
  } else if (params.category === "top_rated") {
    endpoint = `${TMDB_BASE_URL}/movie/top_rated?page=${page}`;
  } else if (params.category === "now_playing") {
    endpoint = `${TMDB_BASE_URL}/movie/now_playing?page=${page}`;
  } else if (params.category === "upcoming") {
    endpoint = `${TMDB_BASE_URL}/movie/upcoming?page=${page}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (readToken) {
    headers["Authorization"] = `Bearer ${readToken}`;
  } else if (apiKey) {
    const separator = endpoint.includes("?") ? "&" : "?";
    endpoint += `${separator}api_key=${apiKey}`;
  }

  try {
    const res = await fetch(endpoint, {
      headers,
      next: { revalidate: 300 }, // 5 min cache
    });

    if (!res.ok) {
      console.warn(`TMDB API returned HTTP ${res.status}. Falling back to mock movies.`);
      return filterMockMovies(params);
    }

    const data = await res.json();
    const results: TMDBMovie[] = data.results || [];
    const items = results.map(transformTmdbMovie);

    return {
      data: items,
      total: data.total_results || items.length,
      isMock: false,
    };
  } catch (error) {
    console.error("Error communicating with TMDB API:", error);
    return filterMockMovies(params);
  }
}

function filterMockMovies(params: {
  page?: number;
  category?: string;
  query?: string;
}): { data: UnifiedContentItem[]; total: number; isMock: true } {
  let filtered = [...MOCK_MOVIES_ITEMS];

  if (params.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.genre && m.genre.some((g) => g.toLowerCase().includes(q)))
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
