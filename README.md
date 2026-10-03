# Personalized Content Dashboard

A personalized dashboard that brings news, movie recommendations, and social content into one interactive interface. The app is built with Next.js and React on the frontend, with Redux Toolkit for global state and server-side route handlers for external API access.

## Overview

This project solves the problem of fragmented content discovery by combining multiple content sources into a single dashboard. Users can browse a personalized feed, adjust category preferences, search across content types, save items to favorites, and reorder cards to match their workflow.

The dashboard is driven by user preferences, persistent local settings, and a mixed content model. News items are sourced from NewsAPI through a Next.js API route, movie content comes from TMDB through a separate route handler, and social posts are served from a local mock dataset. The feed is aggregated in Redux state, rendered through reusable card components, and enhanced with debounced search, infinite scroll, and dark mode.

## Features

### Personalized Feed

The main dashboard is a personalized feed that prioritizes the first selected category from the saved preferences. Users can choose from:

- technology
- sports
- business
- health
- science
- entertainment

The selected category list drives the initial news requests, while the UI keeps a combined feed of news, movies, and social posts. The feed can be reordered by dragging cards to match the user's preferred layout.

### Content Sources

The application uses a combination of real external APIs and local/mock data:

- Real external APIs
  - NewsAPI via `app/api/news/route.ts`
  - TMDB via `app/api/movies/route.ts`
- Internal Next.js API routes
  - `app/api/news/route.ts` proxies the NewsAPI request server-side
  - `app/api/movies/route.ts` proxies the TMDB request server-side
- Mock/fallback data
  - `store/api/socialApi.ts` and `mocks/socialPosts.ts` provide a mock social content source
  - API routes return empty fallback payloads when upstream requests fail
- direct requests without required keys return a 503 JSON error from the route handler

### Search

The global search input is available in the header. It searches across the available content sources and shows a debounced dropdown-style result list. The search is implemented with a custom `useDebounce` hook that delays updates by 450 ms before filtering display results.

The search result preview uses current NewsAPI/TMDB data plus the mock social dataset. Matching items are displayed as a compact set of result rows and the list clears when a result is selected.

### Infinite Scrolling / Pagination

The dashboard uses an `IntersectionObserver` sentinel to progressively load more content as the user approaches the end of the feed. The implementation in `components/content/Feed.tsx`:

- tracks requested pages to avoid duplicate requests
- stores paginated results in local page maps
- preserves already-rendered items while loading additional pages
- shows a loading spinner during additional fetches
- stops loading when the available pages are exhausted

This behavior is verified in the Playwright scrolling test and the Feed unit test.

### Favorites

Users can save content to favorites from the card actions. Favorites are stored in Redux state and can be viewed on the `/favorites` page. The heart button toggles the saved state for each content item, and the favorites count appears in the header.

### Trending

A dedicated trending panel appears on the dashboard sidebar. It currently focuses on TMDB movie results and renders a quick set of popular movie cards using `useGetMoviesQuery({ q: "", page: 1 })`.

### Preferences

Users can select favorite categories from the Settings page. Preferences are stored in Redux and also persisted to `localStorage` using utilities in `lib/storage.ts`. On hydration, the app reloads the saved preferences and applies them to the dashboard.

### Dark Mode

Dark mode is controlled through a Redux theme slice and toggled from the header or the Settings page. Theme state is persisted in `localStorage`, and the root document element toggles the `dark` class and `data-theme` attribute on change.

### Responsive Design

The layout is built to work across desktop and smaller screens:

- desktop: sidebar + main dashboard + trending rail
- tablet/mobile: collapsed menu and responsive stacked layout
- cards use a grid that adjusts for screen width
- header search and controls wrap for smaller screens

### Loading / Empty / Error States

The app includes visible UX states for several conditions:

- initial loading state: skeleton cards appear while content is fetching
- subsequent loading: spinner and sentinel while more pages load
- empty results: `EmptyState` when no content or no favorites exist
- API failures: fallback payloads and UI-level error messaging
- broken images: placeholder gradient tiles replace failed media

### Animations / Interactions

The app includes lightweight motion and interaction effects:

- card hover lift with `framer-motion`
- drag-and-drop reordering via `@dnd-kit`
- smooth card layout transitions
- dark mode toggling and button feedback

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js | Application framework and routing |
| React | UI rendering |
| TypeScript | Type safety |
| Redux Toolkit | Global state management |
| RTK Query | Data fetching and caching for API-backed state |
| Tailwind CSS | Styling and layout |
| Framer Motion | Card animation and motion effects |
| @dnd-kit/core + @dnd-kit/sortable | Drag-and-drop card ordering |
| Playwright | End-to-end testing |
| Jest | Unit and integration test runner |
| Testing Library | Component-level assertions |
| localStorage | Persists preferences and theme |
| NewsAPI | News data source |
| TMDB API | Movie data source |

## Architecture

The project is a typical Next.js app-router frontend with Redux-driven UI state and server-side API proxy layers.

### Major directories

- `app/` — route pages and server route handlers
- `components/` — reusable UI blocks, layout, search, settings, favorites, and content cards
- `hooks/` — custom hooks including `useDebounce`
- `lib/` — shared constants and storage helpers
- `store/` — Redux store, API slices, and feature reducers
- `types/` — TypeScript models for content, movies, news, social posts, and preferences
- `mocks/` — local mock social dataset
- `tests/` — unit/integration tests
- `e2e/` — Playwright end-to-end tests
- `public/` — static assets shipped with the app

### High-level data flow

```mermaid
flowchart LR
  User[User] --> Dashboard[Dashboard UI]
  Dashboard --> Redux[Redux Store]
  Dashboard --> Search[Search Input]
  Redux --> NewsAPI[News API slice]
  Redux --> MovieAPI[TMDB API slice]
  Redux --> SocialAPI[Social mock slice]
  NewsAPI --> NewsRoute[/api/news]
  MovieAPI --> MovieRoute[/api/movies]
  SocialAPI --> Mock[mocks/socialPosts.ts]
  NewsRoute --> NewsExternal[NewsAPI]
  MovieRoute --> TMDB[TMDB API]
  Redux --> LocalStorage[localStorage]
  Redux --> UI[Content cards / favorites / settings]
```

## Project Structure

```text
app/
├── api/
│   ├── movies/
│   │   └── route.ts
│   └── news/
│       └── route.ts
├── dashboard/
│   └── page.tsx
├── favorites/
│   └── page.tsx
├── settings/
│   └── page.tsx
├── globals.css
├── layout.tsx
├── page.tsx
components/
├── content/
│   ├── ContentCard.tsx
│   ├── ContentGrid.tsx
│   ├── ContentSection.tsx
│   ├── EmptyState.tsx
│   ├── Feed.tsx
│   ├── LoadingCard.tsx
│   └── Trending.tsx
├── favorites/
│   └── FavoritesList.tsx
├── layout/
│   ├── DashboardLayout.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── providers/
│   └── ReduxProvider.tsx
├── search/
│   ├── SearchBar.tsx
│   └── SearchResults.tsx
├── settings/
│   ├── CategorySelector.tsx
│   ├── PreferencesPanel.tsx
│   └── ThemeToggle.tsx
├── ui/
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── Spinner.tsx
hooks/
├── useAppDispatch.ts
├── useAppSelector.ts
├── useDebounce.ts
├── useLocalStorage.ts
lib/
├── constants.ts
├── debounce.ts
├── storage.ts
├── utils.ts
mocks/
└── socialPosts.ts
store/
├── api/
│   ├── newsApi.ts
│   ├── socialApi.ts
│   └── tmdbApi.ts
├── slices/
│   ├── dashboardSlice.ts
│   ├── favoritesSlice.ts
│   ├── preferencesSlice.ts
│   └── themeSlice.ts
├── store.ts
tests/
├── components/
├── integration/
├── slices/
e2e/
public/
└── ...
```

### Important implementation notes

- `Feed.tsx` is the main content aggregation and infinite-scroll container.
- `ContentCard.tsx` handles title, image fallback, favorite toggle, and external link behavior.
- `SearchBar.tsx` uses a debounced input and renders a result preview dropdown.
- `SearchResults.tsx` combines results from the NewsAPI, TMDB API, and mock social content.
- `PreferencesPanel.tsx` and `CategorySelector.tsx` control the personalized category selection.
- `FavoritesList.tsx` renders all saved items in a grid.
- `store/slices/preferencesSlice.ts`, `themeSlice.ts`, and `favoritesSlice.ts` manage persistent app state.
- `store/api/newsApi.ts` and `store/api/tmdbApi.ts` define the RTK Query call structure used by the UI.

## API Integration

### News API

- Purpose: fetch news headlines and search results for the selected category
- Route: `app/api/news/route.ts`
- Flow: client-side query -> `/api/news` -> `fetch` to NewsAPI -> normalized response -> Redux/API state -> feed rendering
- Required env variable: `NEWS_API_KEY`
- Behavior: if the key is missing, the route responds with a 503 JSON message; if the upstream call fails, it returns a safe empty payload `{ articles: [], totalResults: 0 }`
- Error handling: the request has an 8s timeout and catches upstream errors, returning `{ articles: [], totalResults: 0 }`

### TMDB API

- Purpose: fetch trending movies and movie search results
- Route: `app/api/movies/route.ts`
- Flow: client-side query -> `/api/movies` -> `fetch` to TMDB -> normalized response -> movie cards in feed and trending panel
- Required env variable: `TMDB_API_KEY`
- Behavior: when the key is missing, the route responds with a 503 JSON message; when the upstream request fails, it returns `{ results: [], total_pages: 0 }`
- Error handling: requests are aborted after a timeout and invalid payloads are normalized to empty arrays

### Social content

- Purpose: provide local mock social data for the dashboard feed
- Source: `mocks/socialPosts.ts` and `store/api/socialApi.ts`
- Flow: React query hook uses `fakeBaseQuery()` and filters mock posts by query text
- Behavior: this is mock data, not an external live backend
- Notes: the UI treats it as a social content source while keeping the backend integration intentionally lightweight

### Route-handler and API layer role

The app separates server-side secret handling from the frontend:

- `app/api/` handles environment-specific secrets and external requests
- `store/api/` defines RTK Query endpoints that call the internal Next.js routes
- state is then rendered into the dashboard without exposing API credentials to the browser

## Environment Variables

The project expects API keys to be stored in a local environment file at the project root as `.env.local`.

Example:

```env
NEWS_API_KEY=your_news_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
```

Notes:

- These are server-side environment variables; the app does not read `NEXT_PUBLIC_*` keys for these integrations.
- The repo should not commit `.env.local`.
- If the keys are missing, the external content routes return server-side 503 JSON responses; the UI falls back to empty states when the data is unavailable.
- Social content does not require an API key.

## Installation & Setup

### Prerequisites

- Node.js
- npm
- Access to the required API keys for NewsAPI and TMDB if you want live external content

### Clone

```bash
git clone <repository-url>
cd personalized-content-dashboard
```

### Install dependencies

```bash
npm install
```

### Environment setup

Create a `.env.local` file in the project root and add the keys listed in the previous section.

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the built application |
| `npm run lint` | Run ESLint checks |
| `npm test` | Run Jest unit/integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Testing

The repository contains both unit/integration tests and Playwright-based end-to-end coverage.

### Unit tests

Unit tests are located in `tests/components/` and `tests/slices/`.

Verified test coverage includes:

- search input renders
- preferences panel renders
- favorite slice toggles add/remove behavior
- feed infinite scroll loading behavior
- preference category toggling

### Integration tests

The integration test in `tests/integration/api-fallback.test.ts` verifies that the API route handlers gracefully handle failed upstream fetches and return empty results instead of throwing.

### E2E tests

The Playwright suite under `e2e/` checks:

- dashboard loads
- search input is available and usable
- favorites toggle works
- dark mode toggles
- drag-and-drop reorders cards
- feed infinite scroll preserves scroll position

Run the suite with:

```bash
npm run test:e2e
```

The Playwright config in `playwright.config.ts` uses a local Next.js dev server and targets Chromium.

## User Flow

```text
Open Dashboard
  ↓
Load and persist preferences
  ↓
Fetch personalized content from NewsAPI, TMDB, and mock social feed
  ↓
Render unified content cards
  ↓
Search, scroll, and interact with the feed
  ↓
Save favorites from the card actions
  ↓
View favorites on the Favorites page
  ↓
Adjust categories and theme in Settings
```

## Performance Considerations

The app includes a few real optimization patterns that are actually implemented:

- `useDebounce` reduces excessive search-triggered re-renders and repeated requests
- `requestedNewsPagesRef` and `requestedMoviePagesRef` prevent duplicate fetches for the same page
- `IntersectionObserver` loads additional pages only when the sentinel enters view
- `newsPages` and `moviePages` caches keep previously rendered pages in memory instead of re-fetching them immediately
- loading states and `aria-live` feedback inform the user without reflowing the whole layout

These are practical, implemented behaviors rather than theoretical suggestions.

## Error Handling

The application handles common failures in a user-friendly way:

- API route misses or upstream errors return safe fallback payloads, not unhandled exceptions
- missing environment variables are surfaced as 503 responses from the route handlers
- empty result sets show `EmptyState` UI instead of blank containers
- broken images fall back to themed placeholder tiles
- `SearchResults` shows a no-results message when the filter returns nothing
- feed loading states display while additional pages are requested

## Design & UX

The UI is intentionally simple and dashboard-like:

- a left sidebar provides navigation between Dashboard, Favorites, and Settings
- a header contains the global search and theme toggle
- a content grid presents cards in a consistent layout
- the dashboard sidebar includes a trending section
- cards show supporting metadata such as category, source, and date
- dark mode colors are controlled with CSS variables and a `dark` class
- hover motion and drag interactions add a lightweight interactive feel
- the app keeps a responsive layout across desktop and mobile widths

## Assignment Requirements Coverage

| Requirement | Implementation |
| --- | --- |
| Personalized content feed | Implemented |
| User preferences | Implemented |
| News API integration | Implemented |
| Recommendation API integration | Implemented (TMDB trending/search) |
| Social content | Implemented (mock social dataset) |
| Interactive cards | Implemented |
| Infinite scrolling/pagination | Implemented |
| Responsive dashboard | Implemented |
| Search | Implemented |
| Debounced search | Implemented |
| Favorites | Implemented |
| Dark mode | Implemented |
| Animations | Implemented |
| Redux Toolkit | Implemented |
| Local storage persistence | Implemented |
| Unit testing | Implemented |
| Integration testing | Implemented |
| E2E testing | Implemented |
| Authentication | Not implemented |
| Real-time updates | Not implemented |
| Multi-language support | Not implemented |
| Advanced cache invalidation | Not implemented |

## Security Notes

The app follows a minimal, practical security approach consistent with the implemented code:

- API keys are read in server-side route handlers using `process.env.*`
- the app avoids exposing secret values through client-side `NEXT_PUBLIC_*` variables
- `.env.local` should not be committed to source control
- no secrets are hard-coded in the repository or documentation

## Screenshots

Screenshots can be added here before final submission.

## Live Demo

Coming soon.

## Demo Video

Coming soon.

## Future Improvements

Potential follow-up improvements include:

- authentication and user-specific saved states
- additional content providers and richer personalization rules
- real-time or refresh-driven updates
- more advanced caching and request deduplication
- accessibility enhancements for keyboard and screen-reader interactions
- broader test coverage and edge-case validation

## Troubleshooting

### Missing API keys

If the news or movie sections do not load, confirm that `.env.local` exists and contains valid values for `NEWS_API_KEY` and `TMDB_API_KEY`.

### Dependency installation issues

Run:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Local server already in use

If port 3000 is occupied, stop the conflicting process or start the app on a different port:

```bash
npm run dev -- --port 3001
```

### Playwright browser setup

If Playwright tests fail because browsers are missing, install the browser dependencies:

```bash
npx playwright install --with-deps chromium
```

## Final Submission Checklist

- [ ] README completed
- [ ] Environment variables documented
- [ ] No secrets committed
- [ ] Tests passing
- [ ] Production build passing
- [ ] GitHub repository updated
- [ ] Demo video added
- [ ] Live deployment added

> The demo video and deployment URL will be added separately before final submission.

---

This project is a working Next.js dashboard that combines real external APIs, mock social content, Redux state management, and a responsive interactive UI. The implementation reflects the current codebase rather than a hypothetical specification, and the README is intentionally scoped to the features and behaviors that are actually present.