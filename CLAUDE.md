# By the Rocks

Personal digital garden built with Astro, with interactive works and presentations.

## Commands

```bash
npm run dev           # Dev server (all content visible)
npm run build         # Build for production
npm run preview       # Preview production build
npm test              # Run all tests
npm run favicons      # Regenerate public/ favicons from the header mark (cairn, seed 2)
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
  layouts/           # Layout.astro for notes, PixelAppLayout.astro for SPAs (on AppShell.astro)
  components/        # Reusable components
    pixel/           # The pixel kit's components (see Pixel UI)
  styles/            # theme.css (pixel theme + kit classes), global.css (notes' prose)
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

## Pixel UI

Tools and posts draw their UI from one kit. **Read both locations before styling a tool or post, and add to them instead of styling inline.**

- **Classes** — `src/styles/theme.css`, `@layer components`. They work unchanged in `.astro`, `.jsx`, `.md` and `.mdx`.
- **Components** — `src/components/pixel/`. Each is an `.astro` and `.jsx` pair: Astro pages here cannot render `.jsx` (no `@astrojs/react`), and React apps cannot import `.astro`. The pair carries no styling of its own; that lives in the classes.
- **Catalogue** — `/kit/` (`src/pages/kit/index.astro`) shows everything in both themes. `src/lib/pixel-kit.test.js` fails until a new class or component is on it.
- **Danger, warn and ok are never colour alone** — reach them through `data-variant="danger" | "warn" | "ok"` on the kit classes (`.pixel-button`, `.pixel-chip`, `.pixel-alert`, `.pixel-alert-text`, `.pixel-mark`). Danger is hatched, warn dotted, ok solid. `src/lib/pixel-colours.test.js` fails on a bare tone colour (`text-ok`, `bg-warn`, `border-danger`, `var(--ok)`, …).
- **Colours** — tokens only. `src/lib/pixel-colours.test.js` fails when a page on `PixelAppLayout` uses a Tailwind palette class, a `dark:` variant or a hex colour. A value that must leave CSS (a canvas, a library option) is a `PAGE_*` constant in `src/lib/accents.js`.

## Apps

All apps are built through Astro's Vite pipeline — no separate build step needed.

- **React apps** (.jsx) use `@vitejs/plugin-react` and `PixelAppLayout` — **strongly recommended for new apps**
- **Squint apps** (.cljs) are compiled by `plugins/vite-plugin-squint.js` — deprecated, new apps should use React
- **Standalone apps** (christmas, chat-wrapped, heartgold-battle-prep, coffee-merge, bridal-skincare) have bespoke designs and don't use `PixelAppLayout`

### Building a new React app

1. Run `npm run new-tool <slug> "<Title>"` — scaffolds index.astro, app.jsx, app.test.jsx and the works entry
2. Build the UI from the Pixel UI kit; Bill Splitter and TapBlok show it in use (NOT christmas/chat-wrapped — those are bespoke)
3. Add a screenshot at `src/assets/works/<slug>.png` for the front page card
4. Fill in the description in the generated works JSON
5. Set `category` and `icon` in the works JSON (defaults to `utilities` / `wrench`). Categories: finance, health, ai, images, utilities, fun, learning, talks, personal. `icon` is a [pixelarticons](https://pixelarticons.com/) name, or a [lucide](https://lucide.dev/icons/) name mapped in `LUCIDE_ALIASES` in `components/pixel/Icon.astro` (any other name fails the build).
6. Set `dither` in the works JSON to match the screenshot (the scaffold writes `"ui"`). The card shows the screenshot dithered in the accent colour until hovered:
   - `"ui"` — app UI: panels, text, buttons. Equalised so layout and colour blocks stay distinct.
   - `"image"` — mainly a picture, photo or illustration (e.g. `animal-crossing-hourly`, `wedding-celebration`). Treats near-white as empty page so the picture isn't flattened.
   The tone for each value is `IMAGE_TONES` in `src/lib/dither-dom.js`.

Key conventions the scaffold already sets up:
- `PixelAppLayout` provides the HTML shell, the pixel theme, the app bar (← Home, History, accent and theme toggles) and the `<div id="app">` mount point
- `PixelAppLayout` sits in the notes' 720px column; `wide` spans the window, for an app whose content is a canvas
- `useLocalStorage` from `src/lib/useLocalStorage.js` for persisting state
- Dark mode via the theme's tokens (`bg-bg`, `text-text`, `border-border`, `text-accent`, `text-link`, …), which swap with the theme
- Apps must work on both mobile and desktop — use responsive Tailwind classes
- `PixelAppLayout` has a `<slot name="head" />` for extra `<head>` content if needed

## Code Style

- **Note frontmatter**: YAML with title, stage, date, tags
- **Work entries**: JSON with title, stage, date, description, tags, optional url, `dither` (`ui` | `image`, default `ui`)
- **Components**: Use `<CodeBlock>` and `<Admonition>` in MDX files

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- MDX for notes with components
- [Squint](https://github.com/squint-cljs/squint) - ClojureScript to JS compiler (via Vite plugin)
- React - UI for some apps
- Tailwind CSS 4 - Styling
