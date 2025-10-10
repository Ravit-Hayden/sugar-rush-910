import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      relative: false
    },
    prerender: {
      handleHttpError: 'warn'
    }
  },
  preprocess: [vitePreprocess()]
};

export default config;