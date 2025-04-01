/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ebba61",
        "secondary": "#f5f0e5",
        "text-primary": "#1c170d",
        "text-secondary": "#a1824a",
        "border": "#e8decf",
      },
    },
  },
  plugins: [],
};