/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        elotte: {
          green: '#39FF14',
          orange: '#FF7A00',
        },
      },
    },
  },
  plugins: [],
}
