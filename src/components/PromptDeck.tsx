"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PROMPTS } from "@/lib/content";

export default function PromptDeck() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(title);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="prompts" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">🎨 图解工坊</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          本站配套插画的生图提示词——复制到即梦 / Midjourney / DALL·E
          就能生成同款图解，改几个词就能做自己的课件
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PROMPTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
            className="group flex flex-col rounded-2xl border border-paper-300/60 bg-paper-100/70 p-6 transition-colors hover:border-aurora-amber/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              </div>
              <button
                onClick={() => copy(p.prompt, p.title)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  copied === p.title
                    ? "border-green-500/50 bg-green-500/10 text-green-600"
                    : "border-paper-400 text-slate-500 hover:border-aurora-amber hover:text-aurora-amber"
                }`}
              >
                {copied === p.title ? "✓ 已复制" : "复制提示词"}
              </button>
            </div>

            <div className="mt-4 flex-1 rounded-xl bg-white/80 p-4">
              <p className="font-mono text-xs leading-relaxed text-slate-500 group-hover:text-slate-700">
                {p.prompt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
