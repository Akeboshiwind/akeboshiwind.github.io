import { defineCollection, z } from 'astro:content';

const stage = z.enum(['scribble', 'draft', 'tale']);

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    stage: stage,
    date: z.date(),
    updated: z.date(),
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const works = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    stage: stage,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string(),
    url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    pinned: z.boolean().optional().default(false),
    category: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const collections = { notes, works };
