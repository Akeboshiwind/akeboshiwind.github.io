# Blog

Personal blog built with Astro, with interactive tools and presentations.

## Commands

```bash
npm run dev           # Dev server (drafts visible, all apps included)
npm run build         # Build for production (blog + all apps)
npm run preview       # Preview production build
```

## Structure

```
src/
  content/blog/      # Blog posts (Markdown/MDX)
  pages/             # Astro pages
    tools/
      bitemporal/    # Bitemporal Visualizer (Squint + Reagami + Ably)
      ynab-reimbursement/  # YNAB Reimbursement (React)
      recommender/   # Recommender (React + Claude API)
    talk/
      christmas/     # Christmas Talk (Squint + Reagami + Ably)
      chat-wrapped/  # Chat Wrapped (Squint + React)
  layouts/           # Layout components
  components/        # Reusable components
  styles/            # Global CSS
public/              # Static assets (favicons, logos, images)
plugins/             # Vite plugins (squint compiler)
```

Each app page has an `index.astro` (SPA shell) and a `_app/` directory with source code.
The `_` prefix excludes it from Astro's file-based routing.

## Apps

All apps are built through Astro's Vite pipeline — no separate build step needed.

- **Squint apps** (.cljs) are compiled on-the-fly by `plugins/vite-plugin-squint.js`
- **React apps** (.jsx) use `@vitejs/plugin-react`

## Code Style

- **Frontmatter**: YAML with title, date, draft, tags, discussLink
- **Components**: Use `<CodeBlock>` and `<Admonition>` in MDX files
- **Markdown**: Standard formatting

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- MDX for posts with components
- [Squint](https://github.com/squint-cljs/squint) - ClojureScript to JS compiler (via Vite plugin)
- React - UI for some apps
- Tailwind CSS 4 - Styling
