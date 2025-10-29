/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5D5FEF',
        'primary-light': '#E0E1FF',
        'primary-dark': '#4A4BCF',
        secondary: '#4FD1C5',
        'secondary-dark': '#3DB8AC',
        dark: '#2D3748',
        light: '#F7FAFC',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#48BB78',
        'success-dark': '#38A169',
        warning: '#ED8936',
        'warning-dark': '#DD7826',
        danger: '#F56565',
        'danger-dark': '#E55353',
      }
    },
  },
  plugins: [],
}