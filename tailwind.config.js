/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#F8F5F0',
          200: '#F5EBDD',
          300: '#E8E0D5',
          400: '#D5CBB8',
        },
        charcoal: {
          50: '#444E43',
          100: '#3A4339',
          200: '#30372F',
          300: '#262C25',
          400: '#1C211B',
          500: '#151914',
        },
        champagne: {
          100: '#F5EBDD',
          200: '#D4BE8A',
          300: '#C5A15A',
          400: '#B08E45',
          500: '#9A7A32',
        },
        beige: {
          100: '#F5EBDD',
          200: '#E8E0D5',
          300: '#D8CDB8',
        },
        pearl: {
          100: '#F5EBDD',
          200: '#E8E5E0',
          300: '#D5D0CA',
          400: '#C0BAB2',
        },
        cocoa: {
          100: '#5A4E48',
          200: '#3D332E',
          300: '#30372F',
          400: '#1C211B',
        },
        pearlIvory: {
          50: '#FFFDF8',
          100: '#F7F3EC',
          200: '#F5EBDD',
          300: '#E8DCD5',
          400: '#B8A99A',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        'widest-xl': '0.3em',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
};
