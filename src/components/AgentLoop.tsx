"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Step = {
  key: string;
  title: string;
  icon: string;
  color: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    key: "user",
    title: "用户指令",
    icon: "🧑‍💻",
    color: "#22d3ee",
    detail: "「帮我查一下明天北京的天气，如果是雨天就提醒我带伞」",
  },
  {
    key: "think",
    title: "LLM 思考",
    icon: "🧠",
    color: "#a78bfa",
    detail: "分析意图 → 需要天气信息 → 决定调用 weather 工具",
  },
  {
    key: "tool",
    title: "工具调用",
    icon: "🔧",
    color: "#fbbf24",
    detail: "GET /api/weather?city=北京&date=tomorrow",
  },
  {
    key: "result",
    title: "执行结果",
    icon: "📥",
    color: "#34d399",
    detail: "{ tomorrow: { condition: '小雨', temp: '12~18°C' } }",
  },
  {
    key: "answer",
    title: "生成回答",
    icon: "✅",
    color: "#f472b6",
    detail: "「明天北京有小雨（12~18°C），记得带伞 ☔」",
  },
];

export default function AgentLoop() {
  const [idx, setIdx] = useState(0);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = i + 1;
        if (next >= STEPS.length) {
          setLoop((l) => l + 1);
          return 1; // 回到 LLM 思考（任务结束则停在回答，演示里让它循环）
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[idx];

  return (
    <section id="agent-loop" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="rounded-3xl border border-aurora-violet/30 bg-night-900/60 p-8 backdrop-blur-md sm:p-12">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          ⚙️ Agent 循环 <span className="text-lg font-normal text-slate-500">实时演示</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          一次「思考 → 行动 → 观察」的完整循环。第
          <span className="mx-1 font-mono text-aurora-violet">{loop + 1}</span>
          轮
        </p>

        {/* 流程条 */}
        <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:gap-0">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center lg:flex-col lg:gap-3">
              <motion.div
                animate={
                  i === idx
                    ? { scale: 1.12, y: -6 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border transition-colors duration-500 lg:h-28 lg:w-28 ${
                  i === idx
                    ? "border-transparent bg-night-800"
                    : "border-night-700/60 bg-night-900/50 opacity-60"
                }`}
                style={i === idx ? { boxShadow: `0 0 32px -4px ${s.color}66`, borderColor: s.color } : undefined}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="mt-1 text-xs font-semibold" style={{ color: i === idx ? s.color : "#94a3b8" }}>
                  {s.title}
                </span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="mx-1 hidden text-slate-600 lg:block lg:mt-[-14px]">
                  <svg width="52" height="16" viewBox="0 0 52 16">
                    <line x1="0" y1="8" x2="40" y2="8" stroke={i < idx ? "#a78bfa" : "#334155"} strokeWidth="2" strokeDasharray="4 4" className={i < idx ? "svg-dash" : ""} />
                    <path d="M 40 3 L 50 8 L 40 13 Z" fill={i < idx ? "#a78bfa" : "#334155"} />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 回环箭头：观察 → 再思考 */}
        <div className="mt-2 flex justify-center">
          <svg width="300" height="42" viewBox="0 0 300 42" className="max-w-full">
            <path
              d="M 230 4 C 250 40, 60 40, 78 6"
              fill="none"
              stroke="#34d399"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="svg-dash"
            />
            <path d="M 74 12 L 78 2 L 86 10 Z" fill="#34d399" opacity="0.8" />
            <text x="152" y="38" textAnchor="middle" fill="#34d399" fontSize="11" opacity="0.8">
              结果回流 → 继续思考（循环直到完成）
            </text>
          </svg>
        </div>

        {/* 当前步骤详情（终端风格） */}
        <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-night-700 bg-night-950 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-night-700/60 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">agent-loop — step {idx + 1}/5</span>
          </div>
          <div className="px-5 py-4 font-mono text-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${step.key}-${loop}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                <span style={{ color: step.color }}>
                  [{step.title}]
                </span>{" "}
                <span className="text-slate-300">{step.detail}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Claude Code、Manus、Devin……所有 Agent 产品跑的都是这个循环
        </p>
      </div>
    </section>
  );
}
