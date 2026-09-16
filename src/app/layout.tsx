import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 学院 · 从 Transformer 到 Agent",
  description: "AI 发展全景学习站：Transformer、LLM、Agent、Hermes、Harness 一次讲透",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
