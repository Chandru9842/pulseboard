# ⚡ PulseBoard — Personalized Content Dashboard

A modern, high-performance, responsive SaaS dashboard where users discover personalized news, movie recommendations, and developer community posts in a unified interface.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Redux Toolkit**, **RTK Query**, **Framer Motion**, and **dnd-kit**.

---

## 📑 Table of Contents

1. [🌟 Architectural Overview & How Things Work](#-architectural-overview--how-things-work)
   - [Next.js App Router & Hybrid Rendering](#nextjs-app-router--hybrid-rendering)
   - [State Management Pipeline (Redux Toolkit)](#state-management-pipeline-redux-toolkit)
   - [RTK Query Caching & Revalidation](#rtk-query-caching--revalidation)
   - [Hydration & Persistence Lifecycle](#hydration--persistence-lifecycle)
   - [Drag-and-Drop Reordering Engine](#drag-and-drop-reordering-engine)
   - [Theme Engine & Dynamic Styling](#theme-engine--dynamic-styling)
2. [🔌 API Architecture & Endpoints](#-api-architecture--endpoints)
   - [API Endpoint Reference](#api-endpoint-reference)
   - [Live API Proxy vs. Graceful Mock Fallbacks](#live-api-proxy-vs-graceful-mock-fallbacks)
   - [Content Normalization Schema](#content-normalization-schema)
3. [✨ Comprehensive Feature Guide](#-comprehensive-feature-guide)
   - [Three-Column SaaS Layout](#three-column-saas-layout)
   - [Editorial Hero Banner & Cinema Strip](#editorial-hero-banner--cinema-strip)
   - [Unified Content Cards (News, Movies, Social)](#unified-content-cards-news-movies-social)
   - [Debounced Real-Time Search](#debounced-real-time-search)
   - [Favorites & Bookmarks Suite (`/favorites`)](#favorites--bookmarks-suite-favorites)
   - [Trending Hub (`/trending`)](#trending-hub-trending)
   - [User Preferences & Diagnostics (`/settings`)](#user-preferences--diagnostics-settings)
   - [Notification Center & Toast System](#notification-center--toast-system)
   - [Responsive Mobile Drawer](#responsive-mobile-drawer)
4. [🧪 Testing & Verification Matrix](#-testing--verification-matrix)
5. [🛠️ Technology Stack](#️-technology-stack)
6. [🚀 Setup & Installation Guide](#-setup--installation-guide)
7. [🚢 Vercel Deployment Guide](#-vercel-deployment-guide)

---

## 🌟 Architectural Overview & How Things Work

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PulseBoard Architecture                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────┐                               ┌───────────────────┐
│ Client Components │                               │ Route Handlers    │
│  (UI / Dashboard) │                               │  (/api/* Proxies) │
└─────────┬─────────┘                               └─────────┬─────────┘
          │                                                   │
          ▼                                                   ▼
┌───────────────────┐       RTK Query Cache         ┌───────────────────┐
│ Redux Store       │ ◄───────────────────────────► │ External APIs /   │
│ - dashboard       │    Tags: Content, Trending    │ Curated Fallbacks │
│ - favorites       │                               │ - TMDB Movies     │
│ - preferences     │                               │ - News Wire       │
└─────────┬─────────┘                               │ - PulseNet Social │
          │                                         └───────────────────┘
          ▼
┌───────────────────┐
│ Storage Subsystem │
│ - localStorage    │
│ - useSyncExtStore │
└───────────────────┘
```

### Next.js App Router & Hybrid Rendering
PulseBoard leverages Next.js 16's App Router with React 19. Pages under `app/` are organized into clean route segments:
- **`app/page.tsx`**: Main 3-column personalized dashboard feed.
- **`app/trending/page.tsx`**: Trending velocity hub with category filters.
- **`app/favorites/page.tsx`**: Saved bookmarks manager with search and JSON export.
- **`app/settings/page.tsx`**: Customization controls, theme selector, and API status inspector.
- **`app/api/*/route.ts`**: Edge-ready server route handlers serving normalized JSON payloads.

Client components are isolated with `"use client"` directives at the component boundary, allowing SSR HTML generation for faster First Contentful Paint (FCP) while running interactive state on the client.

### State Management Pipeline (Redux Toolkit)
Application state is centralized in Redux Toolkit across three modular slices:
1. **`dashboardSlice`** ([features/dashboard/dashboardSlice.ts](file:///c:/pulseboard/features/dashboard/dashboardSlice.ts)):
   - Tracks active feed tabs (`all`, `news`, `movies`, `social`), category selection (`Technology`, `Business`, `Entertainment`, etc.), search queries, active sorting modes (`latest`, `popular`, `rating`), sidebar collapsed state, and notification popovers.
2. **`favoritesSlice`** ([features/favorites/favoritesSlice.ts](file:///c:/pulseboard/features/favorites/favoritesSlice.ts)):
   - Stores saved items array, active favorite filters, and local search queries within bookmarks.
3. **`preferencesSlice`** ([features/preferences/preferencesSlice.ts](file:///c:/pulseboard/features/preferences/preferencesSlice.ts)):
   - Manages user theme (`dark`, `light`, `system`), preferred topic categories, feed layout view (`grid` vs. `compact`), custom hashtags, and card reorder ID arrays.

### RTK Query Caching & Revalidation
Data fetching is managed by **RTK Query** in [services/apiSlice.ts](file:///c:/pulseboard/services/apiSlice.ts):
- **Base Query**: Queries internal API route handlers (`/api/news`, `/api/movies`, `/api/social`, `/api/trending`, `/api/status`).
- **Tag Invalidation**: Uses `Content`, `Trending`, and `Status` tags to guarantee that feed switches and manual re-fetches pull fresh data without redundant HTTP requests.
- **Deduplication & Polling**: Configured with request deduplication and configurable polling intervals set in `/settings`.

### Hydration & Persistence Lifecycle
To prevent React 19 SSR hydration mismatches, PulseBoard uses a hydration bridge in [store/StoreProvider.tsx](file:///c:/pulseboard/store/StoreProvider.tsx):
1. **`useSyncExternalStore`**: Detects client-side hydration status without triggering cascading render warnings or `react-hooks/set-state-in-effect` errors.
2. **Persistence Subscriber**: Subscribes to the Redux store; whenever `state.preferences` or `state.favorites` changes, the updated state is automatically serialized to `localStorage` under keys `pulseboard_preferences_v1` and `pulseboard_favorites_v1`.
3. **Rehydration**: On initial mount, saved favorites and preferences are loaded into Redux before components render their stored states.

### Drag-and-Drop Reordering Engine
Card reordering is powered by `@dnd-kit/core` and `@dnd-kit/sortable`:
- **Collision Detection**: Uses `closestCenter` collision detection algorithm for intuitive card movement.
- **Sensors**: Activates via `PointerSensor` (requiring a 5px drag distance to avoid accidental drags when clicking bookmark buttons) and `KeyboardSensor`.
- **Persistence**: When `onDragEnd` fires, the new order of card IDs is dispatched to `preferencesSlice.setFeedOrder()` and automatically stored in `localStorage`, maintaining custom arrangements across browser sessions.

### Theme Engine & Dynamic Styling
- Dark mode is implemented via Tailwind CSS class strategy (`.dark`).
- The theme engine supports **Dark** (Midnight Blue `#080c15`), **Light** (Clean Slate `#f8fafc`), and **System** (listening to `prefers-color-scheme`).
- Theme changes apply immediately to `document.documentElement` without page reload or layout shift.

---

## 🔌 API Architecture & Endpoints

PulseBoard features an internal API proxy layer that harmonizes distinct external APIs into a unified JSON format while providing resilient offline fallbacks.

### API Endpoint Reference

| Endpoint | Method | Parameters | Description |
|---|---|---|---|
| `/api/movies` | `GET` | `category`, `search`, `page` | Proxies The Movie Database (TMDB v3) discover & search endpoints, or returns curated cinema data if credentials are absent. |
| `/api/news` | `GET` | `category`, `search`, `page` | Returns world, technology, business, and science news with full metadata and source branding. |
| `/api/social` | `GET` | `hashtag`, `search`, `page` | Serves community developer discussions, engineering tips, and tech commentary. |
| `/api/trending` | `GET` | None | Returns velocity-ranked viral stories, box office leaders, and breakout topics. |
| `/api/status` | `GET` | None | Reports real-time connectivity status and live vs. mock provider status for all integrations. |

---

### Live API Proxy vs. Graceful Mock Fallbacks

```
Incoming Request -> /api/movies
         │
         ├──► TMDB_API_KEY Present?
         │         ├── YES: Query https://api.themoviedb.org/3/discover/movie
         │         │         │
         │         │         ├── Success: Normalize & Return (isMock: false)
         │         │         └── Failure (401/429/Network): Degrade to Curated Cinema Data (isMock: true)
         │         │
         │         └── NO: Return Curated Cinema Data immediately (isMock: true)
         ▼
Clean 200 OK Response (UI never crashes)
```

- **TMDB Integration** ([lib/tmdb.ts](file:///c:/pulseboard/lib/tmdb.ts)):
  - Validates `TMDB_API_KEY` on the server.
  - Normalizes TMDB movie objects (posters, vote averages, release dates, synopsis) into the unified content format.
  - In offline mode or when credentials are missing, falls back to cinema data (*Dune: Part Two*, *Oppenheimer*, *The Batman*, *Spider-Man*, *Inside Out 2*).
- **News API Integration** ([lib/news.ts](file:///c:/pulseboard/lib/news.ts)):
  - Validates `NEWS_API_KEY`.
  - Normalizes news wire stories (BBC, Reuters, TechCrunch, National Geographic) with source badges and publication timestamps.
- **Provider Status Inspector** ([app/api/status/route.ts](file:///c:/pulseboard/app/api/status/route.ts)):
  - Supplies the Settings page with real-time feedback on which APIs are active vs. operating in mock fallback mode.

---

### Content Normalization Schema

All data sources are harmonized into the `UnifiedContentItem` TypeScript interface:

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
  rating?: number;          // Movie ratings (e.g. 8.8)
  releaseDate?: string;     // Cinema release date
  readTime?: string;        // News article read time (e.g. "4 min read")
  hashtags?: string[];      // Social hashtags (e.g. ["#webdev", "#react"])
  trendingRank?: number;    // Trending rank (1–5)
  trendingVelocity?: string;// Growth metric (e.g. "+480% view surge")
  isMock?: boolean;         // Origin transparency
}
```

---

## ✨ Comprehensive Feature Guide

### Three-Column SaaS Layout
1. **Left Sidebar** ([components/layout/Sidebar.tsx](file:///c:/pulseboard/components/layout/Sidebar.tsx)):
   - Neon waveform brand logo with pulse animation.
   - Primary navigation (`Home`, `For You`, `Trending`, `Favorites`, `Search`, `Settings`).
   - Categorized topic filters with icons (Technology, Business, Sports, Entertainment, Health, Science, Travel, Food).
   - Sidebar collapse button (toggles width between 240px and 80px).
   - "Upgrade Your Experience" premium card with interactive modal.
2. **Center Feed**:
   - Hero banner, interactive feed controls, sortable cards grid, and recommended cinema strip.
3. **Right Sidebar** ([components/layout/RightSidebar.tsx](file:///c:/pulseboard/components/layout/RightSidebar.tsx)):
   - **Trending Now 🔥**: Top 5 breakout items with ranked numerical badges and category tags.
   - **Your Favorites**: Compact view of bookmarked items with one-click removal.
   - **Create Your Perfect Feed**: Direct shortcut widget to the preferences manager.

### Editorial Hero Banner & Cinema Strip
- **Hero Banner** ([components/feed/HeroBanner.tsx](file:///c:/pulseboard/components/feed/HeroBanner.tsx)):
  - Cinematic mountain panorama backdrop with high-contrast gradient overlays.
  - Headline: *"Your Personalized Content Dashboard"*.
  - *"Explore Your Feed"* action button with smooth scroll targeting.
  - Inspirational quote callout card.
- **Recommended Movies** ([components/feed/RecommendedMovies.tsx](file:///c:/pulseboard/components/feed/RecommendedMovies.tsx)):
  - Cinema poster strip displaying ratings (e.g. `8.8`), release years, and instant bookmarking hearts.

### Unified Content Cards (News, Movies, Social)
The `ContentCard` component ([components/cards/ContentCard.tsx](file:///c:/pulseboard/components/cards/ContentCard.tsx)) dynamically formats cards based on content type:
- **News Cards**: High-definition thumbnail, source badge (e.g., BBC News, Reuters), read time estimation, publication timestamp, and external article link.
- **Movie Cards**: Poster art, TMDB rating badge with star icon, synopsis, release year, and bookmark action.
- **Social Cards**: Author avatar, name and handle (`@alex_codes`), interactive like counter with red heart toggle, and clickable hashtag pills.
- **Drag Grip**: Dedicated handle for `@dnd-kit` reordering in `SortableContentCard.tsx`.

### Debounced Real-Time Search
- Located in the sticky `TopNav` ([components/layout/TopNav.tsx](file:///c:/pulseboard/components/layout/TopNav.tsx)).
- Powered by `useDebounce` with a **300ms delay** to prevent excessive re-renders while typing.
- Searches simultaneously across card titles, descriptions, categories, and author names.
- Displays an interactive **Clear (X)** button when text is present.

### Favorites & Bookmarks Suite (`/favorites`)
- Dedicated manager at [app/favorites/page.tsx](file:///c:/pulseboard/app/favorites/page.tsx).
- Filter saved items by `All`, `News`, `Movies`, or `Social`.
- Instant search filter within saved bookmarks.
- **Export to JSON**: One-click export button generating a timestamped `pulseboard-favorites.json` download.
- Full localStorage synchronization: cards added anywhere on the dashboard appear instantly in the Favorites hub.

### Trending Hub (`/trending`)
- Dedicated velocity analytics page at [app/trending/page.tsx](file:///c:/pulseboard/app/trending/page.tsx).
- **Velocity Metrics Bar**:
  - `#1 Breakout Topic`: Quantum Processors (+480% view surge).
  - `Box Office Leader`: Dune: Part Two (8.8 Rating).
  - `Viral Community Post`: dnd-kit Performance (+1.2k likes).
- Filter trending items by content type.

### User Preferences & Diagnostics (`/settings`)
Located at [app/settings/page.tsx](file:///c:/pulseboard/app/settings/page.tsx):
- **Theme Selection**: Toggle between Dark, Light, and System modes.
- **Feed Layout**: Switch between `Grid View` (multi-column visual cards) and `Compact View` (information-dense rows).
- **Auto-Refresh Interval**: Configure automatic background polling (Off, 30s, 1m, 5m).
- **Topic Interests**: Checkbox controls enabling or disabling specific categories.
- **Custom Hashtags**: Add or remove preferred community topics (e.g., `#webdev`, `#react`, `#ai`).
- **API Diagnostics**: Live status indicators showing connection status for TMDB and NewsAPI.
- **Factory Reset**: One-click reset clearing all custom preferences and local storage back to defaults.

### Notification Center & Toast System
- Bell icon in `TopNav` displays real-time unread badge counter.
- Interactive popover listing notifications with timestamp, read status, and "Mark all as read" control.
- Global toast provider ([components/ui/Toast.tsx](file:///c:/pulseboard/components/ui/Toast.tsx)) delivering micro-feedback when items are bookmarked or settings are updated.

### Responsive Mobile Drawer
- On viewports < 768px, the desktop sidebar automatically hides.
- TopNav reveals a hamburger button that opens the slide-out `MobileNav` drawer ([components/layout/MobileNav.tsx](file:///c:/pulseboard/components/layout/MobileNav.tsx)) with a smooth backdrop blur and full category access.

---

## 🧪 Testing & Verification Matrix

PulseBoard has been audited against strict type checking, linting, unit tests, end-to-end integration journeys, and production compilation.

| Suite | Command | Total Tests | Status | Execution Time |
|---|---|---|---|---|
| **TypeScript Typecheck** | `npm run typecheck` | Entire codebase | ✅ Passed (0 errors) | ~8s |
| **ESLint (React 19 / Next.js)** | `npm run lint` | Entire codebase | ✅ Passed (0 warnings) | ~12s |
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

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router) with React 19 & Turbopack |
| **Language** | TypeScript (Strict mode, zero `any` types) |
| **Styling** | Tailwind CSS v4 with custom dark mode variants |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **Data Fetching & Cache** | RTK Query with tag-based caching and invalidation |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Animations** | Framer Motion & CSS micro-interactions |
| **Icons** | Lucide React |
| **Unit & Component Testing**| Vitest, `@testing-library/react`, `@testing-library/jest-dom` |
| **End-to-End Testing** | Playwright (Headless Chromium) |

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Node.js 18.18+ or 20+ (Node.js 24 supported)
- npm 9+

### 1. Clone & Install Dependencies
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

Edit `.env.local` to add your optional API keys:
```env
# Optional: The Movie Database API
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_READ_ACCESS_TOKEN=your_v4_token_here

# Optional: NewsAPI
NEWS_API_KEY=your_news_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Note**: If left blank, PulseBoard operates seamlessly in rich mock mode. All features—including movie recommendations, ratings, news, categories, and search—remain 100% operational.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Vercel Deployment Guide

PulseBoard is designed for zero-configuration deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub (`git push origin main`).
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import your **`Chandru9842/pulseboard`** repository.
4. *(Optional)* Add your environment variables (`TMDB_API_KEY`, `NEWS_API_KEY`) under the **Environment Variables** section.
5. Click **Deploy**. Vercel will automatically detect Next.js and build the application.
