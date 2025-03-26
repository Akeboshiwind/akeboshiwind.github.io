# CLAUDE.md: Project Guide

## Build Commands
- `hugo server` - Start the development server
- `hugo server -D` - Start the development server and include draft posts
- `hugo` - Build the site
- `hugo new posts/my-post-name.md` - Create a new post

## Project Structure
- `/content/posts/` - Markdown blog posts
- `/layouts/` - Custom HTML templates for site rendering
- `/static/` - Static assets (images, CSS, JS)
- `/archetypes/` - Templates for new content
- `/themes/` - Hugo themes

## Code Style Guidelines
- **Format**: Use Hugo's built-in templates and shortcodes
- **Frontmatter**: Include title, date, tags, and discussLink in YAML format
- **Shortcodes**: Use codeblock-name for code blocks with filenames
- **Markdown**: Use standard Markdown formatting for content

## Tools
- Built with [Hugo](https://gohugo.io/)
- Uses the [Mainroad](https://github.com/Vimux/Mainroad) theme