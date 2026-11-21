/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#04170f',
          900: '#072418',
          800: '#0d3826',
          700: '#144d36',
          600: '#1c6648',
          500: '#26825c',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        charcoal: {
          950: '#0b0f14',
          900: '#111720',
          850: '#161e29',
          800: '#1c2633',
          700: '#273445',
          600: '#38485d',
          500: '#52667d',
          400: '#7c8fa3',
          300: '#a7b6c5',
          200: '#cbd5e1',
          100: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
