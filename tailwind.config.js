const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        product: ['"Playfair Display"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'verde-agua': '#5EA692',
        'nude': '#F5F2ED',
      },
    },
  },
  plugins: [],
}