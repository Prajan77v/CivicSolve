/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
        },
        civic: {
          blue: '#2563eb', cyan: '#06b6d4', purple: '#7c3aed',
          emerald: '#059669', orange: '#ea580c', red: '#dc2626',
        },
        dark: {
          900: '#0a0f1e', 800: '#0f172a', 700: '#1e293b',
          600: '#334155', 500: '#475569',
        },
      },
      backgroundImage: {
        'gradient-civic': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2044 100%)',
        'gradient-hero': 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'counter': 'counter 2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(37,99,235,0.3)' }, '100%': { boxShadow: '0 0 20px rgba(37,99,235,0.6), 0 0 40px rgba(37,99,235,0.2)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
