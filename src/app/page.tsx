"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Timeline from "@/components/Timeline";
import AgentLoop from "@/components/AgentLoop";
import AgentStack from "@/components/AgentStack";
import RagPipeline from "@/components/RagPipeline";
import ConceptSection from "@/components/ConceptSection";
import PromptDeck from "@/components/PromptDeck";
import { CONTENT } from "@/lib/content";

// Three.js 场景较重，关闭 SSR
const NeuralBackground = dynamic(() => import("@/components/NeuralBackground"), {
  ssr: false,
});

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const sections = ["timeline", "agent", "hermes", "harness", "stack", "rag-demo", "prompts"];

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Three.js 全息粒子背景（fixed，全局氛围） */}
      <div className="fixed inset-0 -z-10">
        {ready && <NeuralBackground />}
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/40 via-night-950/70 to-night-950" />
      </div>

      <Nav sections={sections} />

      <Hero />

      {/* 发展时间线 */}
      <Timeline />

      {/* 四大概念章节 */}
      {CONTENT.map((c) => (
        <ConceptSection key={c.id} concept={c} />
      ))}

      {/* Agent 循环动画（放在 agent 概念之后的重点演示） */}
      <AgentLoop />

      {/* 六大工程组件：Loop · Function Call · MCP · Memory · Context · RAG */}
      <AgentStack />

      {/* RAG 向量检索流水线交互演示 */}
      <RagPipeline />

      {/* 生图提示词卡组 */}
      <PromptDeck />

      <footer className="border-t border-night-700/60 py-10 text-center text-sm text-slate-500">
        <p>
          AI 学院 · 开源学习项目 · 内容基于公开资料整理（Transformer → LLM →
          Agent → Hermes → Harness → MCP → RAG，附六大工程组件解剖）· MIT License
        </p>
        <p className="mt-1">动画：Three.js + SVG · 插画：生图模型（提示词见「图解工坊」）</p>
      </footer>
    </main>
  );
}
