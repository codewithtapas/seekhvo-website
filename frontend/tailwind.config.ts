import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        seekhvo: {
          bg: "#030B20",
          bgSecondary: "#071A3D",
          card: "#0A1D40",
          electric: "#087BFF",
          cyan: "#00D4FF",
          lightBlue: "#42A5FF",
          text: "#FFFFFF",
          muted: "#A8B8D8",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 24px rgba(0, 212, 255, 0.25)",
        "neon-strong": "0 0 40px rgba(8, 123, 255, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

