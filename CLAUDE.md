# Blog

Personal blog built with Hugo, with interactive tools and presentations.

## Commands

```bash
hugo server -D        # Dev server with drafts
hugo                  # Build site only
hugo new posts/my-post-name.md  # Create new post
```

## Structure

```
content/posts/     # Blog posts (Markdown)
layouts/           # Hugo templates
static/            # Static assets
packages/          # Frontend tools (each has own CLAUDE.md)
  bitemporal-playground/
  christmas-talk/
  chat-wrapped/
```

## Working on Packages

Each package in `/packages/` is self-contained with its own CLAUDE.md.
For focused context, run Claude from the package directory:

```bash
cd packages/chat-wrapped && claude
```

## Code Style

- **Frontmatter**: YAML with title, date, tags, discussLink
- **Shortcodes**: Use `codeblock-name` for code blocks with filenames
- **Markdown**: Standard formatting

## Tech Stack

- [Hugo](https://gohugo.io/) - Static site generator
- [Mainroad](https://github.com/Vimux/Mainroad) - Hugo theme

Packages use [Bun](https://bun.sh/) + [Squint](https://github.com/squint-cljs/squint) - see each package's CLAUDE.md for details.
