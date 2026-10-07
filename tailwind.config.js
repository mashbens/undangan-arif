/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F7F3EC', dark: '#EFE8DC' },
        ink: '#2B2A26',
        gold: { DEFAULT: '#B8975A', light: '#DCC69E' },
        sage: {
          50: '#F2F5F0',
          100: '#E3E9DF',
          200: '#C8D5C1',
          300: '#A7BB9D',
          400: '#879F7B',
          500: '#6C8661',
          600: '#556B4C',
          700: '#43553D',
          800: '#374233',
          900: '#2A3227',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -14px rgba(42, 50, 39, 0.28)',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.14) translate(-1.5%, -1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
        float: 'float 2.4s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
};
