/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // メインカラー：温かみのあるオレンジ
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // アクセントカラー：爽やかなミント
        accent: {
          light: '#f0fdfa',
          DEFAULT: '#2dd4bf',
          dark: '#0d9488',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        background: {
          light: '#fefce8',
          DEFAULT: '#fffbeb',
          dark: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
        display: ['Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 2px 8px -2px rgba(234, 88, 12, 0.1)',
        'warm-lg': '0 4px 12px -2px rgba(234, 88, 12, 0.15)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}