/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,vue,svelte,js,ts,jsx,tsx}", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSans: ["PlusJakartaSans-Regular", "sans-serif"],
        "PlusJakartaSans-Medium": ["PlusJakartaSans-Medium", "sans-serif"],
        "PlusJakartaSans-Bold": ["PlusJakartaSans-Bold", "sans-serif"],
      },
      colors: {
        "svrf-white": "#ffffff",
        "svrf-dark": "#1c170d",
        "svrf-brown": "#a1824a",
        "svrf-border": "#e8decf",
        "svrf-button": "#ebba61",
      },
    },
  },
};