/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F5E8",
          100: "#D5ECB0",
          500: "#4CAF50",
          600: "#388E3C",
          700: "#2E7D32",
        },
        secondary: {
          50: "#E3F2FD",
          100: "#BBDEFB",
          500: "#2196F3",
          600: "#1976D2",
          700: "#1565C0",
        },
        accent: {
          50: "#FFF3E0",
          100: "#FFE0B2",
          500: "#FF9800",
          600: "#F57C00",
          700: "#EF6C00",
        },
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3",
      },
      fontFamily: {
        "space-mono": ["SpaceMono-Regular"],
      },
    },
  },
  plugins: [],
};
