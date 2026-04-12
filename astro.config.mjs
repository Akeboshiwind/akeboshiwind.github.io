// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import squint from './plugins/vite-plugin-squint.js';

export default defineConfig({
  site: 'https://bythe.rocks',
  trailingSlash: 'always',
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
    }),
    mdx(),
  ],
  vite: {
    plugins: [squint(), tailwindcss(), react()],
  },
});
