import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 明亮「纸感」层级：页面底 → 卡片 → 高亮层 → 边框
        paper: {
          50: "#f7f9fd",   // 页面底
          100: "#ffffff",  // 卡片
          200: "#eef2f9",  // 次级面板
          300: "#e2e8f2",  // 边框
          400: "#cdd6e6",  // 深边框
        },
        // AI 品牌色（600 级：白底上对比度达标）
        aurora: {
          cyan: "#0891b2",
          blue: "#2563eb",
          violet: "#7c3aed",
          pink: "#db2777",
          amber: "#d97706",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)",
        "card-hover": "0 2px 4px rgba(15, 23, 42, 0.05), 0 16px 40px -12px rgba(124, 58, 237, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
