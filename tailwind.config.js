export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: "#3A5A9D",
        accent: "#F7941D",
        background: "#F5F5F5",
        surface: "#FFFFFF",
        text: {
          DEFAULT: "#333333",
          secondary: "#666666"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"]
      }
    },
  },
  plugins: [],
}