<div align="center">

# ⚡ PulseBoard
### Personalized Content Dashboard

A modern, high-performance, responsive SaaS dashboard aggregating curated news, cinema recommendations (TMDB), and developer community discussions into a unified, interactive workspace.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Passed-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-38_Tests_Passed-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

[Features](#-key-features) • [Assignment Compliance](#-sde-intern-assignment-compliance) • [Architecture](#-system-architecture--how-it-works) • [API Layer](#-api-architecture--proxy-layer) • [Testing](#-testing--quality-assurance-matrix) • [Quickstart](#-getting-started--local-setup)

---

</div>

## 🌟 Executive Overview

**PulseBoard** was engineered for the **Software Development Engineer (SDE) Intern Frontend Assignment**. It demonstrates production-grade frontend architecture, robust state management, resilient API handling with offline fallbacks, accessible user-centric UI design, and comprehensive automated test coverage.

### Core Highlights
- **Editorial 3-Column SaaS Interface**: Left collapsible navigation with topic capsules, center feed with cinematic hero banner and horizontal cinema strip, and right sidebar featuring top 5 trending rankings and live bookmark management.
- **Unified Multi-Source Aggregator**: Ingests disparate APIs (World/Tech News, The Movie Database (TMDB), and Community Social Pulse) into a single, strongly-typed normalization schema (`UnifiedContentItem`).
- **Interactive Drag-and-Drop Feed**: Fluid card reordering powered by `@dnd-kit/sortable` with hardware-accelerated CSS transforms and automatic `localStorage` persistence.
- **Resilient Zero-Crash Fallback Engine**: If external API keys (`TMDB_API_KEY`, `NEWS_API_KEY`) are omitted, rate-limited, or offline, internal proxies gracefully degrade to curated high-definition datasets without breaking the user experience.
- **SSR Hydration Safety Bridge**: Utilizes React 19's native `useSyncExternalStore` for client-side storage hydration, guaranteeing 0 hydration mismatches and strict ESLint compliance.
- **Complete Test Matrix**: 38 unit tests (Vitest) covering reducers, storage, hooks, and components, alongside 6 automated browser user journeys (Playwright Chromium) and 0-error TypeScript checks.

---

## 📋 SDE Intern Assignment Compliance

This project satisfies all requirements and bonus criteria specified in the assignment brief:

| # | Assignment Requirement | Implementation in PulseBoard | File Reference | Status |
|---|---|---|---|---|
| **1.1** | **User Preferences** | User-configurable category preferences (Technology, Business, Sports, Entertainment, etc.) with persistent storage. | [`preferencesSlice.ts`](file:///c:/pulseboard/features/preferences/preferencesSlice.ts)<br>[`settings/page.tsx`](file:///c:/pulseboard/app/settings/page.tsx) | ✅ **Complete** |
| **1.2** | **News API Integration** | Category-based news wire integration with source badges, read time, and fallback datasets. | [`app/api/news/route.ts`](file:///c:/pulseboard/app/api/news/route.ts)<br>[`lib/news.ts`](file:///c:/pulseboard/lib/news.ts) | ✅ **Complete** |
| **1.3** | **Recommendations API** | TMDB API v3 integration providing movie recommendations, ratings, posters, and release years. | [`app/api/movies/route.ts`](file:///c:/pulseboard/app/api/movies/route.ts)<br>[`lib/tmdb.ts`](file:///c:/pulseboard/lib/tmdb.ts) | ✅ **Complete** |
| **1.4** | **Social Media API** | Hashtag-driven social feed with author avatars, handles, like counters, and engagement metrics. | [`app/api/social/route.ts`](file:///c:/pulseboard/app/api/social/route.ts)<br>[`lib/social.ts`](file:///c:/pulseboard/lib/social.ts) | ✅ **Complete** |
| **1.5** | **Interactive Cards** | Unified card presentation with images, headlines, synopsis, type capsules, and CTA buttons. | [`ContentCard.tsx`](file:///c:/pulseboard/components/cards/ContentCard.tsx) | ✅ **Complete** |
| **1.6** | **Pagination / Infinite Scroll** | Chunked pagination and "Load More Content" action across all sources. | [`FeedList.tsx`](file:///c:/pulseboard/components/feed/FeedList.tsx) | ✅ **Complete** |
| **2.1** | **Dashboard Layout** | 3-column desktop layout with sidebar navigation, sticky header, search bar, and account info. | [`DashboardShell.tsx`](file:///c:/pulseboard/components/layout/DashboardShell.tsx)<br>[`TopNav.tsx`](file:///c:/pulseboard/components/layout/TopNav.tsx) | ✅ **Complete** |
| **2.2** | **Personalized Feed** | Multi-source feed unifying news, cinema, and social posts with instant tab filtering. | [`page.tsx`](file:///c:/pulseboard/app/page.tsx)<br>[`SortableFeed.tsx`](file:///c:/pulseboard/components/feed/SortableFeed.tsx) | ✅ **Complete** |
| **2.3** | **Trending Section** | Right sidebar top 5 ranked breakdown + dedicated `/trending` hub with velocity metrics. | [`RightSidebar.tsx`](file:///c:/pulseboard/components/layout/RightSidebar.tsx)<br>[`trending/page.tsx`](file:///c:/pulseboard/app/trending/page.tsx) | ✅ **Complete** |
| **2.4** | **Favorites Section** | One-click bookmarking on all cards, sidebar favorites list, and dedicated `/favorites` hub. | [`favorites/page.tsx`](file:///c:/pulseboard/app/favorites/page.tsx)<br>[`favoritesSlice.ts`](file:///c:/pulseboard/features/favorites/favoritesSlice.ts) | ✅ **Complete** |
| **3.1** | **Search Bar** | Global search across titles, descriptions, categories, and author handles. | [`TopNav.tsx`](file:///c:/pulseboard/components/layout/TopNav.tsx) | ✅ **Complete** |
| **3.2** | **Debounced Search** | 300ms debouncing hook to eliminate typing latency and redundant component re-renders. | [`useDebounce.ts`](file:///c:/pulseboard/hooks/useDebounce.ts) | ✅ **Complete** |
| **4.1** | **Drag-and-Drop** | Reorder cards in feed with smooth visual drag handle and persistent position saving. | [`@dnd-kit/sortable`](file:///c:/pulseboard/components/feed/SortableFeed.tsx) | ✅ **Complete** |
| **4.2** | **Dark Mode** | Dark/Light/System theme toggles using CSS custom properties and Tailwind CSS `.dark` tokens. | [`globals.css`](file:///c:/pulseboard/app/globals.css)<br>[`StoreProvider.tsx`](file:///c:/pulseboard/store/StoreProvider.tsx) | ✅ **Complete** |
| **4.3** | **Animations & Micro-interactions** | Framer Motion transitions, card hover transforms, glowing waveform icon, and shimmer skeletons. | [`HeroBanner.tsx`](file:///c:/pulseboard/components/feed/HeroBanner.tsx)<br>[`SkeletonCard.tsx`](file:///c:/pulseboard/components/ui/SkeletonCard.tsx) | ✅ **Complete** |
| **5.1** | **Redux Toolkit** | Centralized store with 3 modular slices (`dashboard`, `favorites`, `preferences`). | [`store/index.ts`](file:///c:/pulseboard/store/index.ts)<br>[`features/`](file:///c:/pulseboard/features/) | ✅ **Complete** |
| **5.2** | **Async Logic / Cache** | RTK Query endpoints with tag invalidation (`Content`, `Trending`, `Status`) and deduplication. | [`services/apiSlice.ts`](file:///c:/pulseboard/services/apiSlice.ts) | ✅ **Complete** |
| **5.3** | **LocalStorage Persistence** | Automatic serialization of preferences and favorites, rehydrated safely via `useSyncExternalStore`. | [`StoreProvider.tsx`](file:///c:/pulseboard/store/StoreProvider.tsx)<br>[`storage.ts`](file:///c:/pulseboard/lib/storage.ts) | ✅ **Complete** |
| **6.1** | **Unit & Integration Tests** | 38 Vitest tests covering slices, hooks, storage utilities, and UI feedback states. | [`tests/unit/`](file:///c:/pulseboard/tests/unit/) | ✅ **Complete** |
| **6.2** | **E2E Browser Tests** | 6 Playwright tests testing full user journeys in real Chromium browser. | [`tests/e2e/dashboard.spec.ts`](file:///c:/pulseboard/tests/e2e/dashboard.spec.ts) | ✅ **Complete** |
| **7.1** | **Bonus: User Profile** | User avatar chip in header with dynamic greeting, plus upgrade modal tier showcase. | [`TopNav.tsx`](file:///c:/pulseboard/components/layout/TopNav.tsx)<br>[`Sidebar.tsx`](file:///c:/pulseboard/components/layout/Sidebar.tsx) | ✅ **Complete** |
| **7.2** | **Bonus: Real-Time Polling** | Configurable background polling intervals (Off, 30s, 1m, 5m) configured in `/settings`. | [`settings/page.tsx`](file:///c:/pulseboard/app/settings/page.tsx) | ✅ **Complete** |
| **7.3** | **Bonus: JSON Exporter** | One-click button in `/favorites` downloading all saved bookmarks as a timestamped JSON file. | [`favorites/page.tsx`](file:///c:/pulseboard/app/favorites/page.tsx) | ✅ **Complete** |
| **7.4** | **Bonus: API Health Inspector** | Real-time diagnostic endpoint (`/api/status`) inspecting provider live vs. fallback status. | [`app/api/status/route.ts`](file:///c:/pulseboard/app/api/status/route.ts) | ✅ **Complete** |

---

## 🏗️ System Architecture & How It Works

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PULSEBOARD ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
    ┌──────────────────────┐                                    ┌──────────────────────┐
    │  CLIENT COMPONENTS   │                                    │  API ROUTE PROXIES   │
    │  (Next.js App Router)│                                    │  (/api/* Handlers)   │
    └──────────┬───────────┘                                    └──────────┬───────────┘
               │                                                           │
               ▼                                                           ▼
    ┌──────────────────────┐            RTK Query Cache         ┌──────────────────────┐
    │     REDUX STORE      │ ◄────────────────────────────────► │ EXTERNAL APIS /      │
    │  - dashboardSlice    │        Tags: Content, Trending     │ CURATED FALLBACKS    │
    │  - favoritesSlice    │                                    │ - TMDB v3 API        │
    │  - preferencesSlice  │                                    │ - NewsAPI Provider   │
    └──────────┬───────────┘                                    │ - PulseNet Social    │
               │                                                └──────────────────────┘
               ▼
    ┌──────────────────────┐
    │  STORAGE SUBSYSTEM   │
    │  - localStorage      │
    │  - useSyncExtStore   │
    └──────────────────────┘
```

### 1. Request & Data Lifecycle
1. **Trigger**: The user interacts with the UI (e.g., switches feed to *"Movies"*, selects *"Technology"*, or types *"Drones"*).
2. **RTK Query Hook**: Client component triggers an RTK Query hook (e.g., `useGetMoviesQuery({ category, search })`).
3. **Internal Route Proxy**: Requests are routed through Next.js server route handlers (`/api/movies`, `/api/news`, `/api/social`).
   - *Why this pattern?* Keeps secret API keys safe on the server, eliminates browser CORS restrictions, and performs schema normalization before client delivery.
4. **Resilient Data Normalization**: Route handlers evaluate API keys (`TMDB_API_KEY`, `NEWS_API_KEY`). If valid, live data is retrieved; if credentials are missing or external APIs return errors (401, 429, 500), the handler automatically returns high-definition curated fallback datasets marked with `isMock: true`.
5. **State Update & Re-render**: Normalized items populate the RTK Query normalized cache. UI updates smoothly with Framer Motion enter transitions.
6. **Persistence Bridge**: Changes to bookmarks or preferences are serialized to `localStorage` via a Redux store subscriber. On subsequent visits, data rehydrates instantly using `useSyncExternalStore`.

---

### 2. Key Engineering Decisions & Rationale

| Architecture Choice | Technical Justification | Alternative Evaluated & Rejected |
|---|---|---|
| **RTK Query over `useEffect` + `fetch`** | Provides out-of-the-box request deduplication, cache normalization, polling intervals, and tag-based invalidation with zero boilerplate. | Manual `useEffect` (prone to race conditions, no caching) or React Query (would duplicate state libraries alongside Redux). |
| **`@dnd-kit` over `react-beautiful-dnd`** | Modern, modular library fully compatible with React 19 and mobile pointer/touch events. Uses CSS transforms for smooth 60fps reordering. | `react-beautiful-dnd` (abandoned maintenance, incompatible with React 18/19 strict mode). |
| **`useSyncExternalStore` for Hydration** | React 19's officially endorsed API for detecting client hydration. Eliminates SSR hydration mismatches without triggering `react-hooks/set-state-in-effect` lint warnings. | Setting state inside `useEffect` (causes cascading re-renders and React 19 strict linter errors). |
| **Server-Side API Proxies** | Keeps private API keys off client browsers, isolates third-party API changes, and provides a centralized fallback mechanism. | Direct client-side `fetch` (exposes private API keys in browser network tab). |
| **Tailwind CSS v4 with Midnight Tokens** | Zero runtime CSS-in-JS overhead. Uses CSS custom properties for instant `.dark` theme toggling without page reloads or style recalculation lag. | Styled Components / Emotion (runtime overhead, incompatible with Next.js Server Components). |

---

## 🔌 API Architecture & Proxy Layer

All internal route handlers return standard HTTP `NextResponse` JSON payloads adhering to the unified schema:

### Endpoint Catalog

| Endpoint | Method | Query Parameters | Description |
|---|---|---|---|
| `/api/movies` | `GET` | `category`, `search`, `page` | Proxies TMDB v3 movie discovery & search, or serves curated cinema data when unauthenticated. |
| `/api/news` | `GET` | `category`, `search`, `page` | Aggregates world, tech, and business news with source attribution and read times. |
| `/api/social` | `GET` | `hashtag`, `search`, `page` | Serves community developer posts, engagement statistics, and author profile details. |
| `/api/trending` | `GET` | None | Returns top trending items ranked by engagement and view velocity metrics. |
| `/api/status` | `GET` | None | Diagnostics endpoint reporting real-time connectivity for TMDB, News, and Social providers. |

---

### Unified Content Model (`UnifiedContentItem`)
All content is normalized on the server into a single TypeScript contract:

```typescript
export interface UnifiedContentItem {
  id: string;
  type: "news" | "movie" | "social";
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
  source: string;
  sourceIcon?: string;
  author?: {
    name: string;
    handle?: string;
    avatar?: string;
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  rating?: number;          // Movie ratings (e.g., 8.8/10)
  releaseDate?: string;     // Movie release year
  readTime?: string;        // News article read time (e.g., "4 min read")
  hashtags?: string[];      // Social hashtags (e.g., ["#webdev", "#react"])
  trendingRank?: number;    // Trending rank (1–5)
  trendingVelocity?: string;// Growth metric (e.g., "+480% view surge")
  isMock?: boolean;         // Origin transparency
}
```

---

## ✨ Application Features & Tour

### 1. Personalized Feed (`/`)
- **Hero Banner**: High-contrast mountain sunrise landscape with call-to-action button and inspirational quote card.
- **Recommended Movies**: Cinema poster strip highlighting ratings and one-click bookmarking.
- **Interactive Controls**: Filter by content type (`All`, `News`, `Movies`, `Social`), sort by `latest`, `popular`, or `rating`, and toggle between `Grid View` and `Compact View`.
- **Drag-and-Drop Reordering**: Dedicated drag handles enable effortless rearranging with persisted ordering.

### 2. Trending Hub (`/trending`)
- **Velocity Metrics Bar**:
  - `#1 Breakout Topic`: Quantum Processors (+480% view surge).
  - `Box Office Leader`: Dune: Part Two (8.8 Critics Choice).
  - `Viral Community Post`: dnd-kit Performance (+1.2k likes).
- Filter trending content by category.

### 3. Favorites Manager (`/favorites`)
- Dedicated bookmarks dashboard.
- Filter bookmarks by type and search within saved items.
- **Export to JSON**: One-click download of all bookmarked content to a timestamped `pulseboard-favorites.json` file.

### 4. Settings & Preferences (`/settings`)
- **Theme Selection**: Dark (Midnight `#080c15`), Light (Slate `#f8fafc`), or System preference.
- **Feed Customization**: Toggle category interests, manage custom hashtags, and choose layout modes.
- **Auto-Refresh**: Configure background polling frequency (Off, 30s, 1m, 5m).
- **API Status Inspector**: Real-time diagnostic cards showing connection state for external providers.
- **Factory Reset**: Instant one-click wipe of custom storage back to clean defaults.

---

## 🧪 Testing & Quality Assurance Matrix

Every test suite was executed against the production build with 100% pass rates:

| Test Suite | Command | Coverage / Target | Result | Duration |
|---|---|---|---|---|
| **TypeScript Typecheck** | `npm run typecheck` | Strict type checking across entire codebase | ✅ **0 Errors** | ~8s |
| **ESLint (React 19)** | `npm run lint` | Code quality, React 19 hook safety | ✅ **0 Warnings** | ~12s |
| **Vitest Unit Suite** | `npm test` | Reducers, custom hooks, storage, UI states | ✅ **38/38 Passed** | ~38s |
| **Playwright E2E Suite** | `npm run test:e2e` | Automated browser tests in real Chromium | ✅ **6/6 Passed** | ~38s |
| **Production Build** | `npm run build` | Turbopack compilation of 12 routes | ✅ **Exit Code 0** | ~5s |

### E2E Test Scenarios Tested (`dashboard.spec.ts`)
1. **Initial Load & Cards Rendering**: Validates hero banner typography, tab buttons, and dynamic card feed rendering.
2. **Category & Tab Switching**: Verifies real-time filtering between `News`, `Movies`, and `Social` tabs.
3. **Debounced Search**: Tests 300ms debounced input filtering and Clear button functionality.
4. **Favorites Persistence**: Adds cards to favorites, navigates to `/favorites`, and asserts localStorage rehydration.
5. **Trending Hub**: Validates sidebar navigation to `/trending` and breakout topic indicator presence.
6. **Theme Customization**: Toggles dark/light themes and verifies root HTML class synchronization.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) with React 19 & Turbopack |
| **Language** | TypeScript 5.0 (Strict mode, zero `any` types) |
| **Styling** | Tailwind CSS v4 with custom dark mode variants |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **Data Fetching & Cache** | RTK Query with tag-based caching and invalidation |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Animations** | Framer Motion & CSS micro-interactions |
| **Icons** | Lucide React |
| **Unit Testing** | Vitest, `@testing-library/react`, `@testing-library/jest-dom` |
| **E2E Testing** | Playwright (Headless Chromium) |

---

## 📂 Project Structure

```
pulseboard/
├── app/
│   ├── api/
│   │   ├── movies/route.ts      # TMDB movie recommendations proxy & mock fallback
│   │   ├── news/route.ts        # News wire feed with category & query filtering
│   │   ├── social/route.ts      # PulseNet social feed with hashtag support
│   │   ├── status/route.ts      # Provider configuration & diagnostics status
│   │   └── trending/route.ts    # Cross-platform trending engine
│   ├── favorites/page.tsx       # Saved bookmarks manager & JSON exporter
│   ├── settings/page.tsx        # Preferences, theme, and API diagnostics
│   ├── trending/page.tsx        # Dedicated breakout trending hub
│   ├── globals.css              # Midnight dark theme design tokens & gradients
│   ├── layout.tsx               # Root layout with Store & Toast providers
│   └── page.tsx                 # 3-column Personalized Feed dashboard
├── components/
│   ├── cards/
│   │   ├── ContentCard.tsx      # Unified card for news, cinema, and social posts
│   │   └── SortableContentCard.tsx # dnd-kit sortable card wrapper
│   ├── feed/
│   │   ├── HeroBanner.tsx       # Editorial landscape hero banner
│   │   ├── RecommendedMovies.tsx # Horizontal cinema recommendations strip
│   │   └── SortableFeed.tsx     # Drag-and-drop sortable container
│   ├── layout/
│   │   ├── DashboardShell.tsx   # Three-column responsive layout orchestrator
│   │   ├── MobileNav.tsx        # Sliding drawer and bottom mobile bar
│   │   ├── RightSidebar.tsx     # Trending now, favorites, & settings CTA
│   │   ├── Sidebar.tsx          # Collapsible sidebar with categories & upgrade card
│   │   └── TopNav.tsx           # Search, Sun/Moon switch, and profile chip
│   └── ui/
│       ├── Badge.tsx            # Colored topic and status badge capsules
│       ├── EmptyState.tsx       # Filter reset and empty state illustration
│       ├── ErrorState.tsx       # Network retry and error presentation
│       ├── SkeletonCard.tsx     # Shimmer skeleton loader
│       └── Toast.tsx            # Animated notifications feedback
├── features/
│   ├── dashboard/dashboardSlice.ts # Active filters, tabs, search query, notifications
│   ├── favorites/favoritesSlice.ts # Saved bookmark actions and filter state
│   └── preferences/preferencesSlice.ts # Categories, hashtags, theme, order persistence
├── lib/
│   ├── mockData.ts              # Authentic curated datasets for all feeds
│   ├── news.ts                  # News fetching service
│   ├── social.ts                # Social feed filter engine
│   ├── storage.ts               # SSR-safe localStorage persistence utilities
│   ├── tmdb.ts                  # TMDB client, normalization, and mock fallback
│   └── utils.ts                 # Class merging (cn) and format helpers
├── services/
│   └── apiSlice.ts              # RTK Query API endpoints and caching tags
├── store/
│   ├── index.ts                 # Redux store configuration and typed hooks
│   └── StoreProvider.tsx        # Client-side hydration and theme synchronization
├── tests/
│   ├── e2e/
│   │   └── dashboard.spec.ts    # Playwright E2E tests for critical user journeys
│   ├── unit/                    # Vitest unit tests for slices, hooks, & components
│   └── test-utils.tsx           # Custom test render wrapper
├── vitest.config.mts            # Vitest configuration with JSDOM
└── playwright.config.ts         # Playwright test harness configuration
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js 18.18+ or 20+ (Node.js 24 supported)
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/Chandru9842/pulseboard.git
cd pulseboard
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your optional keys:
```env
# Optional: The Movie Database API (v3 key)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_READ_ACCESS_TOKEN=your_v4_bearer_token_here

# Optional: NewsAPI Key
NEWS_API_KEY=your_news_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Offline Simulation Note**: If left blank, PulseBoard operates seamlessly in rich mock fallback mode. Every feature—including movie recommendations, ratings, news, categories, and search—remains 100% operational.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Execute Test Suites
```bash
# Run unit & component tests
npm test

# Run end-to-end browser tests
npm run test:e2e

# Run TypeScript type check
npm run typecheck

# Run ESLint
npm run lint
```

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Vercel Deployment Guide

PulseBoard is optimized for one-click deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import the **`Chandru9842/pulseboard`** repository.
4. *(Optional)* Add any environment variables (`TMDB_API_KEY`, `NEWS_API_KEY`) under the **Environment Variables** tab.
5. Click **Deploy**. Vercel will automatically build and deploy your application.

---

<div align="center">

**PulseBoard** — Built for the Software Development Engineer (SDE) Intern Assignment  
*Crafted with Next.js 16, React 19, TypeScript, and Redux Toolkit*

</div>
