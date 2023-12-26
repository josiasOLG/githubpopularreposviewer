module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      boxShadow: {
        "white-light": "0 2px 4px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
