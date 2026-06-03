/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0D0618',
          900: '#130824',
          850: '#1A0B2E',
          800: '#220f3b'
        },
        purpleGlow: {
          500: '#6C2BD9'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(108,43,217,0.35), 0 10px 35px rgba(108,43,217,0.22)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

