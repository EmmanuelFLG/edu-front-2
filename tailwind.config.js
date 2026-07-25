/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#eef0f9',
          100: '#dadee8',
          200: '#b3bbd4',
          300: '#8b98bf',
          400: '#5f6ea3',
          500: '#3d4a80',
          600: '#2a3563',
          700: '#222a4f',
          800: '#1b2140',
          900: '#141830',
        },
        brand: {
          50: '#eef0fd',
          100: '#dbe0fb',
          200: '#b6c0f7',
          300: '#8f9ff1',
          400: '#6d7dea',
          500: '#4c5fd5',
          600: '#3c4bb3',
          700: '#2f3b8c',
          800: '#242d69',
          900: '#1a2049',
        },
        amber: {
          50: '#fdf5e8',
          100: '#faead0',
          200: '#f3d29e',
          300: '#ecb96c',
          400: '#e8a33d',
          500: '#d18a24',
          600: '#a86c1b',
          700: '#7f5115',
          800: '#57370e',
        },
        good: {
          50: '#e9f8f1',
          100: '#c8eeda',
          400: '#3ab77f',
          500: '#2f9e6b',
          600: '#227a52',
        },
        bad: {
          50: '#fbebeb',
          100: '#f3caca',
          400: '#e05f5f',
          500: '#d64545',
          600: '#ab3535',
        },
        paper: '#f5f6fa',
      },
      fontFamily: {
        display: ['"Lexend"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 48, 0.04), 0 4px 16px rgba(20, 24, 48, 0.06)',
        pop: '0 8px 30px rgba(20, 24, 48, 0.16)',
      },
      borderRadius: {
        xl2: '1.15rem',
      },
    },
  },
  plugins: [],
}
