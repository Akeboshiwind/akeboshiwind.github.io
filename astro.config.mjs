// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import squint from './plugins/vite-plugin-squint.js';

export default defineConfig({
  site: 'https://bythe.rocks',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    plugins: [squint(), tailwindcss(), react()],
  },
});
