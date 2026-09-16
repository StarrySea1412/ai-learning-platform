"use client";

import { motion } from "framer-motion";
import { TIMELINE } from "@/lib/content";

export default function Timeline() {
  return (
    <section id="timeline" className="relative mx-auto max-w-5xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
        八年，五次范式转移
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
        从「理解语言」到「执行任务」，每一步都在为下一步铺路
      </p>

      <div className="relative mt-16">
        {/* 中轴线（桌面端） */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-aurora-cyan/60 via-aurora-violet/40 to-transparent md:block" />
        {/* 移动端左侧线 */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-aurora-cyan/60 via-aurora-violet/40 to-transparent md:hidden" />

        <ol className="space-y-12">
          {TIMELINE.map((item, i) => (
            <motion.li
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className={`relative flex md:w-1/2 ${
                i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"
              } pl-8 md:pl-0 ${i % 2 === 0 ? "" : "md:pl-12"}`}
            >
              {/* 节点 */}
              <span
                className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-aurora-cyan bg-night-950 shadow-[0_0_12px_rgba(34,211,238,0.6)] left-[-1px] md:left-auto ${
                  i % 2 === 0 ? "md:left-auto md:-right-2" : "md:-left-2"
                }`}
              />
              <div className="w-full rounded-2xl border border-night-700/60 bg-night-900/70 p-5 backdrop-blur-sm transition-colors hover:border-aurora-violet/50">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-aurora-cyan">{item.year}</span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
