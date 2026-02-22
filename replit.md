# Overview

This is a personal portfolio website for "Yemi" (GitHub: aladesawe) that showcases programming projects, primarily focused on computer vision and deep learning. The site displays project cards with filtering by category, individual project detail pages, and the ability to view GitHub README files directly in the app. It's designed as a full-stack application but primarily functions as a static portfolio site, loading project data from a static JSON file rather than a database at runtime.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server/async state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Animations**: Framer Motion for layout transitions (category tab animations)
- **Build Tool**: Vite
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

The frontend loads project data from a static `/projects.json` file rather than calling API endpoints at runtime. This means the site can work as a purely static site (deployed to GitHub Pages via the `docs/` folder) or as a full-stack app.

## Backend

- **Framework**: Express.js running on Node with TypeScript (tsx)
- **Storage**: In-memory storage (`MemStorage` class in `server/storage.ts`) — projects are hardcoded in a JavaScript array, not stored in a database
- **API Routes**: RESTful endpoints defined in `server/routes.ts` under `/api/projects`
- **Dev Server**: Vite dev server is integrated with Express via middleware for HMR during development
- **Production Build**: Vite builds the client to `dist/public`, esbuild bundles the server to `dist/index.cjs`

## Data Flow

Projects are defined as a hardcoded array in `server/storage.ts`. During the build process, a script (`script/generate-projects.ts`) reads from storage and writes a `projects.json` file to `client/public/`. The frontend reads this static JSON file. The API routes exist but aren't used by the current frontend — the client fetches `/projects.json` directly.

## Key Pages

- **Home** (`/`): Grid of project cards with category filtering (All, Computer Vision, Deep Learning, Web, Mobile, Library, Tool)
- **Project Detail** (`/projects/:slug`): Individual project page with links to GitHub
- **README Page** (`/projects/:slug/docs`): Fetches and renders the project's GitHub README using `react-markdown` with GFM support

## Schema

The `Project` type is a simple TypeScript interface (not a Drizzle table), with fields: id, name, description, url, githubUrl, category, language, stars, isFeatured. While `drizzle.config.ts` exists and references PostgreSQL, the app currently does NOT use a database — Drizzle and PostgreSQL are not actively used.

## Static Deployment

The `docs/` folder contains a pre-built version of the site for GitHub Pages hosting. This includes compiled JS/CSS assets and a `projects.json` file.

# External Dependencies

- **PostgreSQL**: Referenced in `drizzle.config.ts` but NOT actively used. The app uses in-memory storage. If database features are added later, Drizzle ORM with PostgreSQL is the intended approach.
- **GitHub API**: The README page fetches raw README files from `raw.githubusercontent.com` (no authentication required for public repos). The server route also has logic to proxy GitHub README requests.
- **Google Fonts**: Inter, Fira Code, DM Sans, Architects Daughter, Geist Mono loaded via Google Fonts CDN
- **npm packages of note**: `react-markdown`, `remark-gfm`, `rehype-raw` for rendering GitHub READMEs; `framer-motion` for animations; `wouter` for routing; `react-icons` for GitHub icons