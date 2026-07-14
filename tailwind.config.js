/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#0a0b26',
          900: '#0f1138',
          800: '#171a4a',
          700: '#22265f',
        },
        gold: {
          300: '#f9dfa0',
          400: '#f5c76b',
          500: '#e9ac3e',
        },
        rose: {
          300: '#f6bcc4',
          400: '#f2a6b0',
          500: '#e97e8d',
        },
        cream: {
          100: '#fdf6ec',
          200: '#f7ecd9',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Quicksand', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
        float: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) rotate(-1deg)', opacity: 1 },
          '50%': { transform: 'scaleY(1.08) rotate(1deg)', opacity: 0.9 },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        twinkle: 'twinkle 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        flicker: 'flicker 0.6s ease-in-out infinite',
        drift: 'drift 40s linear infinite',
      },
    },
  },
  plugins: [],
}
