import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  extend: {
    colors: {
      primary: "#32bb78",
      secondary: "#00AA00",
      accent: "#FFE4C4",
      background: "#FFFFFF",
      card: "#F8F8F8",
      text: "#000000",
      border: "#E5E5E5",
      notification: "#FF3B30",
      success: "#00D200",
      warning: "#FF9500",
      error: "#FF3B30",
      inactive: "#A0A0A0",
      white: "#FFFFFF",
      black: "#000000",
      grey: "#808080",
      overlay: "rgba(0, 0, 0, 0.4)",
      driverGreen: "#00B300",
      riderBlack: "#1A1A1A",
    },
    animation: {
      "slide-in": "slideIn 0.3s ease-out",
    },
    keyframes: {
      slideIn: {
        "0%": { transform: "translateX(100%)", opacity: 0 },
        "100%": { transform: "translateX(0)", opacity: 1 },
      },
    },
  },
});
