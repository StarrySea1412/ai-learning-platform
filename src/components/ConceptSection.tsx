"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Concept } from "@/lib/content";
import ConceptSVG from "./ConceptSVG";

const COLOR_MAP = {
  cyan: {
    text: "text-aurora-cyan",
    border: "hover:border-aurora-cyan/60",
    glow: "shadow-[0_0_60px_-15px_rgba(8,145,178,0.25)]",
    badge: "bg-aurora-cyan/10 text-aurora-cyan border-aurora-cyan/30",
    bar: "from-aurora-cyan to-aurora-blue",
  },
  blue: {
    text: "text-aurora-blue",
    border: "hover:border-aurora-blue/60",
    glow: "shadow-[0_0_60px_-15px_rgba(37,99,235,0.22)]",
    badge: "bg-aurora-blue/10 text-aurora-blue border-aurora-blue/30",
    bar: "from-aurora-blue to-aurora-violet",
  },
  violet: {
    text: "text-aurora-violet",
    border: "hover:border-aurora-violet/60",
    glow: "shadow-[0_0_60px_-15px_rgba(124,58,237,0.22)]",
    badge: "bg-aurora-violet/10 text-aurora-violet border-aurora-violet/30",
    bar: "from-aurora-violet to-aurora-pink",
  },
  pink: {
    text: "text-aurora-pink",
    border: "hover:border-aurora-pink/60",
    glow: "shadow-[0_0_60px_-15px_rgba(219,39,119,0.2)]",
    badge: "bg-aurora-pink/10 text-aurora-pink border-aurora-pink/30",
    bar: "from-aurora-pink to-aurora-amber",
  },
  amber: {
    text: "text-aurora-amber",
    border: "hover:border-aurora-amber/60",
    glow: "shadow-[0_0_60px_-15px_rgba(217,119,6,0.2)]",
    badge: "bg-aurora-amber/10 text-aurora-amber border-aurora-amber/30",
    bar: "from-aurora-amber to-aurora-cyan",
  },
} as const;

export default function ConceptSection({ concept }: { concept: Concept }) {
  const c = COLOR_MAP[concept.color];
  const [openDeep, setOpenDeep] = useState<number | null>(0);

  return (
    <section id={concept.id} className="relative mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`rounded-3xl border border-paper-300/60 bg-paper-100/60 p-8 backdrop-blur-md sm:p-12 ${c.border} ${c.glow}`}
      >
        {/* 头部 */}
        <div className="flex flex-wrap items-center gap-4">
          <span className={`font-mono text-5xl font-black opacity-30 ${c.text}`}>
            {concept.order}
          </span>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{concept.name}</h2>
            <p className={`mt-1 text-sm ${c.text}`}>{concept.tagline}</p>
          </div>
          <span className={`ml-auto rounded-full border px-3 py-1 text-xs ${c.badge}`}>
            {concept.period}
          </span>
        </div>

        <div className={`mt-6 h-px w-full bg-gradient-to-r ${c.bar} opacity-40`} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* 左：文字内容 */}
          <div>
            <p className="leading-relaxed text-slate-700">{concept.summary}</p>

            <div className="mt-8 space-y-5">
              {concept.points.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-xl border border-paper-300/50 bg-paper-200/40 p-5"
                >
                  <h3 className={`font-semibold ${c.text}`}>{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.body}</p>
                </motion.div>
              ))}
            </div>

            <div className={`mt-8 rounded-xl border-l-4 border-aurora-violet/50 bg-aurora-violet/5 p-4`}>
              <p className="text-sm italic leading-relaxed text-slate-700">💡 {concept.analogy}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {concept.keyFacts.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-900/10"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* 右：SVG 动画图解 */}
          <div className="flex items-center justify-center rounded-2xl border border-paper-300/50 bg-paper-50/60 p-4">
            <ConceptSVG kind={concept.svg} />
          </div>
        </div>

        {/* 深度专栏 */}
        <div className="mt-12">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className={c.text}>🔬</span> 深水区 · 深度专栏
            <span className="text-xs font-normal text-slate-500">点击展开</span>
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {concept.deep.map((d, i) => {
              const open = openDeep === i;
              return (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.06 }}
                  className={`self-start rounded-xl border bg-paper-200/40 transition-colors ${
                    open ? `${c.border} border-paper-400` : "border-paper-300/50 hover:border-paper-400"
                  }`}
                >
                  <button
                    onClick={() => setOpenDeep(open ? null : i)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <span className={`font-mono text-xs font-bold ${c.text}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">{d.title}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-xs text-slate-500">
                      ▾
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <p className="overflow-hidden px-4 pb-4 text-sm leading-relaxed text-slate-500">
                          {d.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 关键公式 */}
        {concept.formulas.length > 0 && (
          <div className="mt-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className={c.text}>🧮</span> 关键公式
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {concept.formulas.map((f) => (
                <div key={f.title} className="rounded-xl border border-paper-300/50 bg-paper-50/60 p-5">
                  <h4 className={`text-sm font-semibold ${c.text}`}>{f.title}</h4>
                  <p className="mt-3 overflow-x-auto rounded-lg bg-paper-100 px-4 py-3 font-mono text-sm text-slate-700 ring-1 ring-slate-900/5">
                    {f.expr}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{f.explain}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 正反方辩论 */}
        <div className="mt-10">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className={c.text}>⚔️</span> 正反方辩论
            <span className="text-xs font-normal text-slate-500">行业里两拨人的真实分歧</span>
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border-l-4 border-green-500/60 bg-green-500/5 p-5">
              <p className="text-xs font-bold tracking-wider text-green-600">👍 正方</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{concept.debate.pro}</p>
            </div>
            <div className="rounded-xl border-l-4 border-red-500/60 bg-red-500/5 p-5">
              <p className="text-xs font-bold tracking-wider text-red-600">👎 反方</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{concept.debate.con}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
