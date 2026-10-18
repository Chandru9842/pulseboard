import React from "react";
import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { ContentCard } from "@/components/cards/ContentCard";
import { UnifiedContentItem } from "@/types/content";

const mockNewsItem: UnifiedContentItem = {
  id: "test-news-1",
  type: "news",
  title: "Quantum Breakthrough Announced",
  description: "Detailed overview of the quantum computing leap.",
  source: "Quantum Review",
  publishedAt: "2026-10-18T10:00:00Z",
  category: "Science",
  tags: ["#quantum", "#science"],
  isMock: true,
};

const mockMovieItem: UnifiedContentItem = {
  id: "test-movie-1",
  type: "movie",
  title: "Dune: Part Two",
  description: "Paul Atreides unites with the Fremen.",
  source: "TMDB",
  publishedAt: "2024-03-01T00:00:00Z",
  rating: 8.5,
  voteCount: 4800,
  genre: ["Sci-Fi", "Adventure"],
  tags: ["Sci-Fi", "Epic"],
  isMock: true,
};

const mockSocialItem: UnifiedContentItem = {
  id: "test-social-1",
  type: "social",
  title: "Building high-performance sortable lists",
  description: "Just deployed our fluid card sorting feed with dnd-kit!",
  source: "PulseNet",
  author: "Alex Rivera",
  authorHandle: "@alex_codes",
  publishedAt: "2026-10-18T10:15:00Z",
  tags: ["#frontend", "#webdev"],
  isMock: true,
  engagement: {
    likes: 10,
    reposts: 2,
    comments: 1,
    isLiked: false,
    isReposted: false,
  },
};

describe("ContentCard", () => {
  it("renders news card details properly", () => {
    renderWithProviders(<ContentCard item={mockNewsItem} />);
    expect(screen.getByText("Quantum Breakthrough Announced")).toBeInTheDocument();
    expect(screen.getAllByText(/Quantum Review/).length).toBeGreaterThan(0);
    expect(screen.getByText("News")).toBeInTheDocument();
  });

  it("renders movie card with rating", () => {
    renderWithProviders(<ContentCard item={mockMovieItem} />);
    expect(screen.getByText("Dune: Part Two")).toBeInTheDocument();
    expect(screen.getByText(/8.5/)).toBeInTheDocument();
  });

  it("renders social post with author handle and interactive heart button", () => {
    renderWithProviders(<ContentCard item={mockSocialItem} />);
    expect(screen.getByText("@alex_codes")).toBeInTheDocument();

    const heartButton = screen.getByRole("button", { name: /like post/i });
    expect(heartButton).toBeInTheDocument();

    // Click like/heart
    fireEvent.click(heartButton);
    expect(heartButton).toBeInTheDocument();
  });

  it("toggles favorite state and adds to Redux store", () => {
    const { store } = renderWithProviders(<ContentCard item={mockNewsItem} />);
    expect(store.getState().favorites.items).toHaveLength(0);

    const favButton = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(favButton);

    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0].id).toBe("test-news-1");
  });
});
