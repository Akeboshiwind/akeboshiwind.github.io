// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import squint from './plugins/vite-plugin-squint.js';

export default defineConfig({
  site: 'https://blog.bythe.rocks',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    plugins: [squint(), tailwindcss(), react()],
    server: {
      proxy: {
        '/notion-proxy': {
          target: 'https://api.notion.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/notion-proxy/, '/v1'),
        },
      },
    },
  },
});
