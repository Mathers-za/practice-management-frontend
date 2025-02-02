/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      height: {
        97: "31rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
