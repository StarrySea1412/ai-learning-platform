import type { Metadata } from "next";
import "./globals.css";

const title = "AI 学院 · 从 Transformer 到 Agent 工程体系";
const description =
  "看懂 AI 为什么突然能「做事」了：Transformer → LLM → Agent → Hermes → Harness → MCP → RAG，附六大工程组件与交互演示的开源学习站";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AI", "LLM", "Agent", "MCP", "RAG", "Transformer", "向量检索", "学习"],
  authors: [{ name: "AI Learning Platform contributors" }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_CN",
    siteName: "AI 学院",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
