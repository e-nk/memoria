import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main theme colors
        photo: {
          primary: '#030303',      // Main dark background
          secondary: '#ffffff',    // White
          purple: '#a390f4',       // Purple for logo
          darkgray: '#1d1d1d',     // Dark gray for UI elements
          
          // Gradient colors
          blue: '#8ba3e8',         // Light blue for gradient
          pink: '#e8a5c9',         // Pink for gradient
          
          // Accent colors
          indigo: '#6366f1',       // Indigo accent
          rose: '#f43f5e',         // Rose accent
          violet: '#8b5cf6',       // Violet accent
          amber: '#f59e0b',        // Amber accent
          cyan: '#06b6d4',         // Cyan accent
          
          // UI element colors
          border: 'rgba(255, 255, 255, 0.1)',  // Border color with 10% opacity
          panel: 'rgba(255, 255, 255, 0.05)',  // Panel background with 5% opacity
        },
        
        // Keep the standard gray scale
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [
    
  ],
}

export default config