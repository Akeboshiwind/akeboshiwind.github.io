import { defineCollection, z } from 'astro:content';

const stage = z.enum(['scribble', 'draft', 'tale']);

// Obsidian writes dates both quoted and unquoted. Coercing alone would also accept
// the null an empty `published:` key yields, silently dating the note 1970-01-01.
const yamlDate = z.union([z.date(), z.string().min(1)]).pipe(z.coerce.date());

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    stage: stage,
    published: yamlDate,
    updated: yamlDate,
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const works = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    stage: stage,
    published: yamlDate,
    updated: yamlDate.optional(),
    description: z.string(),
    url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().optional().default(false),
    category: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const collections = { notes, works };
