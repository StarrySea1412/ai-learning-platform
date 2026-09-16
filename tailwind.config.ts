import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#05070f",
          900: "#0a0e1a",
          800: "#111726",
          700: "#1a2338",
          600: "#243050",
        },
        aurora: {
          cyan: "#22d3ee",
          blue: "#60a5fa",
          violet: "#a78bfa",
          pink: "#f472b6",
          amber: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
