import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const notes = await getCollection('notes');

  return rss({
    title: 'Blog by the Rocks',
    description: 'Clojure, programming, and occasional thoughts about bytes and nibbles',
    site: context.site!,
    items: notes
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((note) => ({
        title: note.data.title,
        pubDate: note.data.date,
        link: `/${note.slug}/`,
      })),
  });
}
