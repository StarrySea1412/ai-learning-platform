"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { STACK_A, STACK_B, type StackItem } from "@/lib/stack";

/* ---------- 顶部架构分层图（SVG） ---------- */
function StackDiagram() {
  const layers = [
    { name: "用户 / 任务", items: ["🧑‍💻 指令"], color: "#94a3b8" },
    { name: "Harness 工程层", items: ["🔄 Loop", "📐 Context", "🧠 Memory"], color: "#34d399" },
    { name: "模型层", items: ["🧠 LLM", "⚡ Reasoning"], color: "#a78bfa" },
    { name: "接口层", items: ["🔧 Tools", "🔌 MCP"], color: "#fbbf24" },
    { name: "知识旁路", items: ["📚 RAG", "🧲 向量索引"], color: "#60a5fa" },
    { name: "外部世界", items: ["🖥️ 执行环境", "🌐 API / 数据"], color: "#f472b6" },
  ];
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-2">
      {layers.map((l, i) => (
        <motion.div
          key={l.name}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-28 shrink-0 rounded-md px-2 py-2 text-right text-xs font-semibold"
            style={{ color: l.color, background: `${l.color}14`, borderRight: `2px solid ${l.color}` }}
          >
            {l.name}
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            {l.items.map((it) => (
              <span
                key={it}
                className="rounded-md border px-3 py-1.5 text-xs"
                style={{ borderColor: `${l.color}55`, color: l.color, background: `${l.color}0a` }}
              >
                {it}
              </span>
            ))}
          </div>
          {i < layers.length - 1 && <span className="hidden text-slate-600 sm:block">↓</span>}
        </motion.div>
      ))}
      <p className="pt-3 text-center text-xs text-slate-500">
        数据流：任务进入 → 工程层组织上下文 → 模型决策 → 经接口层执行 → 知识旁路随时补给 → 结果回到世界
      </p>
    </div>
  );
}

/* ---------- 单张卡片 ---------- */
function StackCard({ item, index }: { item: StackItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
      className="overflow-hidden rounded-2xl border bg-night-900/70 backdrop-blur-sm transition-colors"
      style={{ borderColor: `${item.color}44` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: `${item.color}1a`, border: `1px solid ${item.color}55` }}
        >
          {item.icon}
        </span>
        <span className="flex-1">
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="font-semibold text-white">{item.name}</span>
            <span className="font-mono text-xs" style={{ color: item.color }}>{item.en}</span>
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">{item.tagline}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="shrink-0 text-slate-500"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4 border-t px-5 pb-5 pt-4" style={{ borderColor: `${item.color}33` }}>
              <p className="text-sm leading-relaxed text-slate-300">{item.what}</p>

              <div>
                <h4 className="mb-2 text-xs font-bold tracking-wider" style={{ color: item.color }}>
                  ▍工程要点
                </h4>
                <ul className="space-y-1.5">
                  {item.how.map((h) => (
                    <li key={h} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                      <span style={{ color: item.color }}>▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <h4 className="mb-1.5 text-xs font-bold tracking-wider text-red-400">
                  ⚠ 常见翻车点
                </h4>
                <ul className="space-y-1">
                  {item.pitfalls.map((p) => (
                    <li key={p} className="text-xs leading-relaxed text-slate-400">
                      · {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AgentStack() {
  return (
    <section id="stack" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <span className="mb-3 inline-block rounded-full border border-aurora-cyan/30 bg-aurora-cyan/10 px-4 py-1 text-xs text-aurora-cyan">
          深水区 · Agent 工程组件层
        </span>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">把 LLM 变成系统：六大组件</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Loop · Function Call · MCP · Memory · Context Control · RAG/向量索引——
          这是 Harness 内部的解剖图，也是 2025 年 Agent 工程师的技能树。点击每张卡片展开原理、工程要点与翻车点。
        </p>
      </div>

      <StackDiagram />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STACK_A.map((s, i) => (
          <StackCard key={s.id} item={s} index={i} />
        ))}
        {STACK_B.map((s, i) => (
          <StackCard key={s.id} item={s} index={i + 3} />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        💡 一个判断标准：你写的是 <span className="text-aurora-amber">workflow</span>（流程固定，模型填空）还是{" "}
        <span className="text-aurora-violet">agent</span>（模型自己决定路径）？
        能用前者就别用后者——可预测性本身就是生产力。
      </p>
    </section>
  );
}
