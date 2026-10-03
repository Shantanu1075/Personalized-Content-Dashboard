# Setup Guide

This document covers the practical steps required to run the project locally and verify the configured implementation.

## 1. Prerequisites

Before you begin, make sure the following are available:

- Node.js
- npm
- A local `.env.local` file if you want live external content from NewsAPI and TMDB

## 2. Clone the repository

```bash
git clone <repository-url>
cd personalized-content-dashboard
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create a file named `.env.local` in the project root.

```env
NEWS_API_KEY=your_news_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
```

Notes:

- These values are read by the server-side route handlers in `app/api/news/route.ts` and `app/api/movies/route.ts`.
- Do not commit `.env.local` to the repository.
- The social feed does not require an API key.

## 5. Run the app in development mode

```bash
npm run dev
```

Open the application in a browser at:

```text
http://localhost:3000
```

## 6. Production build

To build the project for production:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## 7. Run tests

### Unit and integration tests

```bash
npm test
```

### End-to-end tests

```bash
npm run test:e2e
```

The Playwright suite expects the local dev server to be available on `http://localhost:3000`.

## 8. Linting

```bash
npm run lint
```

## 9. Useful commands

```bash
npm run dev
npm run build
npm run start
npm test
npm run test:watch
npm run test:e2e
npm run lint
```

## 10. Troubleshooting

### The app loads but content is empty

Check that:

- `.env.local` exists
- `NEWS_API_KEY` and `TMDB_API_KEY` are valid
- the route handlers are receiving requests correctly

### Port 3000 is already in use

Run:

```bash
npm run dev -- --port 3001
```

### Playwright cannot start

Install browser dependencies if needed:

```bash
npx playwright install --with-deps chromium
```

### Dependency issues

If installation behaves unexpectedly:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 11. Notes

This project uses the current repository implementation as the source of truth. The app is fully functional without external keys for mock/social scenarios, but the live news and movie sections require valid environment variables to populate real upstream data.
