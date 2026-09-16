"use client";

import { useEffect, useState } from "react";

export default function Nav({ sections }: { sections: string[] }) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const label: Record<string, string> = {
    timeline: "发展史",
    agent: "Agent",
    hermes: "Hermes",
    harness: "Harness",
    stack: "六大组件",
    "rag-demo": "RAG 演示",
    prompts: "图解工坊",
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-night-950/80 backdrop-blur-md border-b border-night-700/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-wide text-white">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-violet animate-pulse" />
          AI 学院
        </a>
        <div className="hidden gap-1 text-sm md:flex">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                active === id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {label[id] ?? id}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
