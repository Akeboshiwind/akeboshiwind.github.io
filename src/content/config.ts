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

export const collections = { blog };
