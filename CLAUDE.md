# By the Rocks

Personal digital garden built with Astro, with interactive works and presentations.

## Commands

```bash
npm run dev           # Dev server (all content visible)
npm run build         # Build for production
npm run preview       # Preview production build
```

## Structure

```
src/
  content/notes/     # Written content (Markdown/MDX)
  content/works/     # Built things metadata (JSON, points to pages)
  pages/             # Astro pages
    [...slug].astro  # Top-level note renderer
    index.astro      # Front page (mixed feed of notes + works)
    bitemporal/      # SPA pages (each with index.astro + _app/)
    sorting-comparator/
    christmas/
    ...              # All SPAs at top level
  layouts/           # Layout components (Layout.astro for notes, AppLayout.astro for SPAs)
  components/        # Reusable components
  styles/            # Global CSS (global.css for notes, app.css for SPAs)
public/              # Static assets (favicons, logos, images)
plugins/             # Vite plugins (squint compiler)
```

Each app page has an `index.astro` (SPA shell) and a `_app/` directory with source code.
The `_` prefix excludes it from Astro's file-based routing.

## Content Model

Two collections, rendered together on the front page:

- **notes** (`content/notes/`) — Markdown/MDX with rendered body. URLs at `/<slug>/`.
- **works** (`content/works/`) — JSON metadata pointing to tool/talk pages. URLs vary.

### Shared metadata

- `title`, `stage` (scribble/draft/tale), `date`, `updated`, `tags`, `pinned`
- Stage prefix ("A scribble:", etc.) is added at render time, not in the data.

## Apps

All apps are built through Astro's Vite pipeline — no separate build step needed.

- **React apps** (.jsx) use `@vitejs/plugin-react` and `AppLayout` — **strongly recommended for new apps**
- **Squint apps** (.cljs) are compiled by `plugins/vite-plugin-squint.js` — deprecated, new apps should use React
- **Standalone apps** (bitemporal, christmas, chat-wrapped) have bespoke structures and don't use `AppLayout`

### Building a new React app

1. Run `npm run new-tool <slug> "<Title>"` — scaffolds index.astro, app.jsx, hooks.js, and works entry
2. Study 2-3 existing React apps for patterns (NOT bitemporal/christmas/chat-wrapped — those are bespoke)
3. Add a screenshot at `src/assets/works/<slug>.png` for the front page card
4. Fill in the description in the generated works JSON

Key conventions the scaffold already sets up:
- `AppLayout` provides Tailwind, HTML shell, and `<div id="app">` mount point
- "← Home" link top-left via `<a href="../">`
- `useLocalStorage` hook in hooks.js for persisting state
- Dark mode via Tailwind `dark:` variants
- Apps must work on both mobile and desktop — use responsive Tailwind classes
- `AppLayout` has a `<slot name="head" />` for extra `<head>` content if needed

## Code Style

- **Note frontmatter**: YAML with title, stage, date, tags
- **Work entries**: JSON with title, stage, date, description, tags, optional url
- **Components**: Use `<CodeBlock>` and `<Admonition>` in MDX files

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- MDX for notes with components
- [Squint](https://github.com/squint-cljs/squint) - ClojureScript to JS compiler (via Vite plugin)
- React - UI for some apps
- Tailwind CSS 4 - Styling
