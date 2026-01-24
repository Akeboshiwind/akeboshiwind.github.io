# Blog

Personal blog built with Astro, with interactive tools and presentations.

## Commands

```bash
npm run dev           # Dev server (drafts visible)
npm run build         # Build for production
npm run preview       # Preview production build
```

## Structure

```
src/
  content/blog/      # Blog posts (Markdown/MDX)
  pages/             # Astro pages
  layouts/           # Layout components
  components/        # Reusable components
  styles/            # Global CSS
public/              # Static assets (favicons, etc.)
packages/            # Frontend tools (each has own CLAUDE.md)
  bitemporal-playground/
  christmas-talk/
  chat-wrapped/
  ynab-reimbursement/
```

## Working on Packages

Each package in `/packages/` is self-contained with its own CLAUDE.md.
For focused context, run Claude from the package directory:

```bash
cd packages/chat-wrapped && claude
```

Packages build to `public/tools/*` or `public/talk/*` (gitignored).

## Code Style

- **Frontmatter**: YAML with title, date, draft, tags, discussLink
- **Components**: Use `<CodeBlock>` and `<Admonition>` in MDX files
- **Markdown**: Standard formatting

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- MDX for posts with components

Packages use [Bun](https://bun.sh/) + [Squint](https://github.com/squint-cljs/squint) - see each package's CLAUDE.md for details.
