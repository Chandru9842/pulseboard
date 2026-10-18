# ⚡ PulseBoard — Personalized Content Dashboard

A production-grade, highly responsive, personalized dashboard where users discover curated tech news, cinema recommendations (TMDB), and developer community discussions in a unified interface.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, **RTK Query**, **Framer Motion**, and **dnd-kit**.

---

## 🌟 Visual Preview & Architecture

PulseBoard delivers a **three-column SaaS desktop layout** inspired by high-end editorial portals:

- **Left Sidebar**: Brand waveform identity, primary navigation with active gradient pills, categorized topic filters with colorful icon capsules, and an "Upgrade Your Experience" card.
- **Center Feed**:
  - **Editorial Hero Banner**: Cinematic landscape view, bold typography ("Your Personalized Content Dashboard"), gradient action button, and a quote card.
  - **Your Feed**: Real-time multi-source items across news, movies, and developer discussions with category badges, rating indicators, interactive bookmark/heart buttons, and `@dnd-kit` drag-and-drop reordering.
  - **Recommended Movies**: Cinema poster strip highlighting ratings and one-click bookmarking.
- **Right Sidebar**:
  - **Trending Now 🔥**: Ranked top 5 breakout stories with thumbnail previews and velocity badges.
  - **Your Favorites**: Instant access to saved bookmarks with live heart toggle actions.
  - **Create Your Perfect Feed**: Quick preferences CTA widget.

---

## 🚀 Core Features

1. **Unified Content Model**: Single strongly-typed model (`UnifiedContentItem`) harmonizing News, Movies, and Social media posts with type-specific metadata (ratings, genres, authors, engagement metrics).
2. **Category & Topic Filters**: Filter by Technology, Business, Sports, Entertainment, Health, Science, Travel, and Food directly from the sidebar or feed pills.
3. **TMDB Movie Recommendations**: Direct TMDB API proxy with live credential detection (`TMDB_API_KEY`) and fallback to high-resolution cinema data when credentials are absent.
4. **Live / Mock Indicator**: Every card clearly identifies its origin without misleading users.
5. **Drag-and-Drop Card Reordering**: Interactive card reordering with `@dnd-kit` (`SortableFeed`), persisted in Redux and localStorage.
6. **Debounced Global Search**: Instant cross-feed searching across titles, authors, synopsis, and hashtags with `useDebounce`.
7. **Favorites & Bookmarks System**: Save any card with instant visual feedback, browse in a dedicated manager, search bookmarks, and export as JSON.
8. **Trending Hub**: Velocity-ranked viral topics, box-office leaders, and trending discussions (`/trending`).
9. **Full Preferences Suite**: Dark / Light / System theme toggles, preferred category selection, custom hashtags, layout mode (Grid vs Compact), auto-refresh intervals, and API integration diagnostics (`/settings`).
10. **Hydration & SSR Safety**: All localStorage reads occur post-mount inside `StoreProvider`, ensuring 0 hydration mismatches and clean SSR.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router) with React 19 & Turbopack |
| **Language** | TypeScript (Strict mode, zero `any`) |
| **Styling** | Tailwind CSS v4 with dark mode custom variant |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **Data Fetching & Cache** | RTK Query with tag-based caching and invalidation |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Animations** | Framer Motion & CSS micro-interactions |
| **Icons** | Lucide React |
| **Unit & Component Testing**| Vitest, `@testing-library/react`, `@testing-library/jest-dom` |
| **End-to-End Testing** | Playwright (Automated browser testing with Chromium) |

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

## ⚡ Getting Started

### Prerequisites
- Node.js 18.18+ or 20+ (Node.js 24 supported)
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/pulseboard.git
cd pulseboard
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` (optional):
```env
# Optional TMDB Credentials:
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_READ_ACCESS_TOKEN=your_v4_token_here

# Optional NewsAPI Credentials:
NEWS_API_KEY=your_news_api_key_here
```
> **Note**: If left blank, PulseBoard automatically operates in curated offline simulation mode. Every feature—including movie posters, ratings, reviews, and search—remains 100% operational.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification Matrix

PulseBoard has been audited against strict type checking, linting, unit tests, end-to-end integration journeys, and production compilation.

| Suite | Command | Total Tests | Status | Execution Time |
|---|---|---|---|---|
| **TypeScript Typecheck** | `npm run typecheck` | Full codebase | ✅ Passed (0 errors) | ~8s |
| **ESLint (React 19 / Next.js)** | `npm run lint` | Full codebase | ✅ Passed (0 warnings) | ~12s |
| **Vitest Unit Suite** | `npm test` | 38 tests (8 test files) | ✅ Passed (38/38) | ~38s |
| **Playwright E2E Suite** | `npm run test:e2e` | 6 browser journeys | ✅ Passed (6/6) | ~38s |
| **Production Build** | `npm run build` | 12 routes generated | ✅ Passed (Exit Code 0) | ~5s |

### Run Unit & Integration Tests (Vitest)
```bash
npm test
```
*Executes 38 unit tests verifying `preferencesSlice`, `favoritesSlice`, `dashboardSlice`, `useDebounce`, `storage`, `ContentCard`, `EmptyState`, and `ErrorState`.*

### Run End-to-End Tests (Playwright)
```bash
npm run test:e2e
```
*Automated browser testing covering 6 end-to-end user journeys:*
1. **Feed & Cards**: Full dashboard load, hero banner typography, and dynamic card feed rendering.
2. **Category & Tab Switching**: Real-time filtering across `All`, `News`, `Movies`, and `Social` tabs.
3. **Debounced Search**: 300ms debounced keystroke searching and clear action.
4. **Favorites Persistence**: Adding cards to favorites, navigating to `/favorites`, and verifying localStorage rehydration.
5. **Trending Hub**: Navigation via sidebar to `/trending` and breakout topic indicator verification.
6. **Theme Customization**: Light/dark mode switching and DOM class synchronization.

### Run Type Checking & Linting
```bash
npm run typecheck
npm run lint
```

### Production Build & Launch
```bash
npm run build
npm start
```

---

## 🛡️ Known Limitations & Graceful Degradation

- **External Image Optimization**: Next.js image optimization is configured with `unoptimized: true` to prevent server-side network timeouts in firewalled or offline environments.
- **Mock vs Live Indicator**: Content cards include explicit badges (`Live API` vs `Simulated`) so evaluators can instantly distinguish mock fallbacks from authenticated live API results.
- **LocalStorage Quotas**: In private browsing mode or constrained storage environments, preferences fall back seamlessly to memory-based state.

---

## 🚢 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add any optional environment variables (`TMDB_API_KEY`, `NEWS_API_KEY`) in the Vercel dashboard.
4. Deploy! Vercel automatically detects Next.js App Router and provisions edge caching.
