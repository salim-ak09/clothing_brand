import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx,html}"
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe5e9',
          200: '#f7ced6',
          300: '#f0a8b7',
          400: '#e5758d',
          500: '#d64667',
          600: '#be294d',
          700: '#9e1e3c',
          800: '#831c35',
          900: '#6f1b31',
          950: '#400918',
          accent: '#800b28',
          bright: '#a81338',
          light: '#c41e3a',
          deep: '#4a0818'
        },
        obsidian: {
          bg: '#050507',
          surface: '#0b0a0f',
          card: '#110f17',
          border: 'rgba(255, 255, 255, 0.08)',
          panel: 'rgba(12, 10, 16, 0.88)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
};
export default config;
