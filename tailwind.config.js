/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cvmatch: {
          primary: "#07111F",
          navy: "#0B1628",
          teal: "#22D3EE",
          blue: "#3B82F6",
          gold: "#C8A96A",
          cream: "#F8F7F3",
          softBlue: "#EAF6FF"
        }
      },
      boxShadow: {
        premium: "0 24px 70px rgba(59,130,246,0.12)",
        gold: "0 18px 45px rgba(200,169,106,0.32)"
      }
    }
  },
  plugins: []
};
