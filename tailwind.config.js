/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 색상
        'brand-pink': 'var(--brand-pink)',
        'hover-cyan': 'var(--hover-cyan)',
        
        // 텍스트 색상
        'text-base': 'var(--text-base)',
        'text-strong': 'var(--text-strong)',
        'text-muted': 'var(--text-muted)',
        
        // 배경 색상
        'bg': 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        
        // 테두리 색상
        'border-subtle': 'var(--border-subtle)',
        'border-base': 'var(--border-base)',
        
        // El Otte 브랜드 색상
        elotte: {
          green: 'var(--elotte-green)',
          orange: 'var(--elotte-orange)',
        },
        
        // 배지 색상
        'badge-high-urgent': 'var(--badge-high-urgent)',
        'badge-high-red': 'var(--badge-high-red)',
        'badge-medium-yellow': 'var(--badge-medium-yellow)',
        'badge-medium-lemon': 'var(--badge-medium-lemon)',
        'badge-medium-gold': 'var(--badge-medium-gold)',
        'badge-low-mint': 'var(--badge-low-mint)',
        'badge-low-green': 'var(--badge-low-green)',
        'badge-info-cyan': 'var(--badge-info-cyan)',
        'badge-info-blue': 'var(--badge-info-blue)',
        'badge-special-purple': 'var(--badge-special-purple)',
        'badge-special-violet': 'var(--badge-special-violet)',
      },
    },
  },
  plugins: [],
}
