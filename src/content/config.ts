import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().optional().default(false),
    discussLink: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const tools = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    url: z.string().url().optional(), // for external tools
  }),
});

export const collections = { blog, tools };
