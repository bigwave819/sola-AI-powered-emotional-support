/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FBF7F1',
        surface: '#F4EDE2',
        'surface-elevated': '#FFFFFF',
        'text-primary': '#2B2622',
        'text-secondary': '#6B6259',
        border: '#E6DCCC',
        accent: '#C97B4A',
        'accent-muted': '#E8C9B3',
        success: '#6B8F71',
        warning: '#C99A4A',
        danger: '#B85C4A',
      },
      fontFamily: {
        headline: ['Fraunces_600SemiBold'],
        'headline-light': ['Fraunces_400Regular'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        full: '999px',
      },
    },
  },
  plugins: [],
};