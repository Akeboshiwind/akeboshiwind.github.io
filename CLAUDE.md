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
  layouts/           # Layout components
  components/        # Reusable components
  styles/            # Global CSS
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
- **Stages** (see `content/notes/stages.md`):
  - **scribble** — quickly jotted down, unpolished. Tools may have bugs.
  - **draft** — more thought than the initial idea, but not confident enough to show around.
  - **tale** — significant thought and effort; happy to share. May still evolve over time.

## Apps

All apps are built through Astro's Vite pipeline — no separate build step needed.

- **Squint apps** (.cljs) are compiled on-the-fly by `plugins/vite-plugin-squint.js`
- **React apps** (.jsx) use `@vitejs/plugin-react`

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

## Git

- Default branch: `master`
