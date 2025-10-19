export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: 'var(--primary)',
          500: 'var(--primary-light)',
          700: '#4338CA',
          400: '#818CF8',
        },
        secondary: {
          600: 'var(--secondary)',
          500: '#8B5CF6',
          700: '#6D28D9',
        },
        success: {
          600: 'var(--success)',
          500: '#34D399',
          700: '#059669',
        },
        danger: {
          600: 'var(--danger)',
          500: '#F87171',
          700: '#DC2626',
        },
        warning: {
          600: 'var(--warning)',
          500: '#FBBF24',
          700: '#D97706',
        },
        'blue-light': 'var(--blue-light)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.05)',
      }
    }
  },
  plugins: []
}
