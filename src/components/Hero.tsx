"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-aurora-cyan/30 bg-aurora-cyan/10 px-4 py-1.5 text-xs font-medium text-aurora-cyan"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan animate-pulse" />
          2017 → 2025 · 从一篇论文到 Agent 工程体系
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-black leading-tight text-white sm:text-6xl"
        >
          看懂 AI 的
          <span className="bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-pink bg-clip-text text-transparent">
            七个关键词
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Transformer · LLM · Agent · Hermes · Harness · MCP · RAG
          <br />+ 六大工程组件：Agent Loop · Function Call · Tools · Memory · Context Control · 向量索引
          <br />
          一条主线讲透 AI 为什么突然能「做事」了——配上 Three.js 粒子、SVG
          动画、交互演示和你可以自己生成的图解。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#timeline"
            className="rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-blue px-7 py-3 text-sm font-semibold text-night-950 transition-transform hover:scale-105"
          >
            开始学习 →
          </a>
          <a
            href="#prompts"
            className="rounded-full border border-night-600 px-7 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-aurora-violet hover:text-white"
          >
            直达图解工坊
          </a>
        </motion.div>
      </div>
    </section>
  );
}
