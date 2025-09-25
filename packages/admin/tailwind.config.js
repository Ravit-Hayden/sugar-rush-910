/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#FF3DAE',
        'hover-cyan': '#17E1BC',
        'danger-fg': '#FF6B6B',
        'warn-fg': '#fffa00',
        'ok-fg': '#00ddff',
        'tag-album': '#FF3DAE',
        'tag-track': '#68b1ff',
        'tag-deadline': '#7ea59e',
        'user-el': '#A6FF00',
        'user-ot': '#FF835C',
        'text-base': '#888888',
        'text-strong': '#B6B6B6',
        'text-muted': '#6F6F6F',
        'bg': '#000000',
        'surface-2': '#121212',
        'surface-1': '#1A1A1A',
        'border-subtle': '#252528'
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'system-ui', 'sans-serif']
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px'
      }
    }
  },
  plugins: []
}
