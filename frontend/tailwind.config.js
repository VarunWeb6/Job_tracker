/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // UI ENHANCEMENT: Defining a modern color palette
      colors: {
        primary: {
          DEFAULT: 'hsl(222.2, 47.4%, 11.2%)', // Dark Blue/Black
          foreground: 'hsl(210, 40%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210, 40%, 96.1%)', // Light Gray
          foreground: 'hsl(222.2, 47.4%, 11.2%)',
        },
        accent: {
          DEFAULT: 'hsl(216, 84%, 53%)', // Bright Blue
          foreground: 'hsl(210, 40%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
      },
      // ANIMATION: Adding keyframes for animations
      keyframes: {
        "fade-in": {
          "0%": { opacity: '0' },
          "100%": { opacity: '1' },
        },
        "slide-up": {
          "0%": { transform: 'translateY(10px)', opacity: '0' },
          "100%": { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        "fade-in": 'fade-in 0.5s ease-out forwards',
        "slide-up": 'slide-up 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}