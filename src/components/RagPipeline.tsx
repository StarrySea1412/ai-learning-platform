"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* ---------- 数据：三个典型「模型答不了、检索才有救」的场景 ---------- */

type Chunk = {
  doc: string;
  text: string;
  score: number; // 与问题的余弦相似度（示意）
};

type Scenario = {
  id: string;
  q: string;
  chunks: Chunk[]; // 前 2 个为 top-k 命中
  rawAnswer: string;
  rawTag: string; // 直答模式的问题标签
  ragAnswer: string;
  sources: string[];
  lesson: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "annual-leave",
    q: "我们公司的年假有几天？",
    chunks: [
      { doc: "员工手册-2025版.pdf · §4 假期制度", text: "入职满 1 年享带薪年假 10 天；满 3 年 15 天；未满 1 年按剩余月份折算。", score: 0.93 },
      { doc: "HR 政策修订-2025-03.md", text: "2025-03 起满 3 年年假上限由 12 天调整为 15 天，旧政策同时作废。", score: 0.88 },
      { doc: "团队周会纪要-W12.md", text: "本周排期：支付网关联调、灰度发布 5%、客服话术更新。", score: 0.22 },
      { doc: "新员工入职指引.md", text: "第一天：开通邮箱与 VPN → 领电脑 → 导师 1v1。", score: 0.18 },
      { doc: "服务器巡检记录-0812.txt", text: "DB 主从延迟 0.3s，队列堆积 0，磁盘 61%。", score: 0.11 },
      { doc: "团建活动照片目录.txt", text: "pic_001.jpg ~ pic_248.jpg，定位：西湖。", score: 0.07 },
    ],
    rawAnswer:
      "按《职工带薪年休假条例》一般是工作满 1 年 5 天起，很多公司会给 5–15 天……具体建议查看你们公司的制度哦！",
    rawTag: "⚠ 幻觉风险：用公开常识猜私有制度",
    ragAnswer:
      "按《员工手册 2025 版》§4：入职满 1 年 10 天、满 3 年 15 天；2025-03 起满 3 年的上限由 12 天上调至 15 天；未满 1 年按剩余月份折算。",
    sources: ["员工手册-2025版.pdf · §4", "HR 政策修订-2025-03.md"],
    lesson: "私有知识不在模型权重里——不检索，就只能靠公开常识猜。",
  },
  {
    id: "rate-limit",
    q: "我们 v2.3 开放 API 的限流阈值是多少？",
    chunks: [
      { doc: "api-docs/v2.3/rate-limit.md", text: "默认 QPS 100，企业版 1000；超限返回 429，Retry-After 头携带冷却秒数。", score: 0.94 },
      { doc: "api-docs/v2.2/rate-limit.md", text: "v2.2 默认 QPS 60。注意：该版本已于 2025-06 停止服务。", score: 0.69 },
      { doc: "changelog/2025-08.md", text: "v2.3.1：修复网关偶发超时；控制台新增用量看板。", score: 0.31 },
      { doc: "oncall值班表.csv", text: "周一 张伟 · 周二 李娜 · 周三 王强 ……", score: 0.14 },
      { doc: "旧架构图-2023.png", text: "（二进制文件，无文本内容）", score: 0.09 },
      { doc: "会议室预订规则.md", text: "须提前 1 天预订，单次上限 2 小时。", score: 0.05 },
    ],
    rawAnswer:
      "通常开放平台限流在 10–100 QPS 之间，企业认证后可以申请提升……建议以你们官方文档为准。",
    rawTag: "⚠ 时效陷阱：权重里的旧知识 + 版本混淆",
    ragAnswer:
      "v2.3 默认 QPS 100、企业版 1000；超限返回 429，Retry-After 头给出冷却秒数。（检索时排除了已停服的 v2.2 文档）",
    sources: ["api-docs/v2.3/rate-limit.md"],
    lesson: "知识会过期：向量检索拿到的是最新文档，模型权重里只有训练截止时的旧世界。",
  },
  {
    id: "north-star",
    q: "去年 Q3 复盘会定的北极星指标是什么？",
    chunks: [
      { doc: "会议纪要/2024-Q3-复盘.md", text: "确定北极星指标 = 周活跃学习用户（WAU-L）；配套 OKR：次月留存 ≥ 45%。", score: 0.92 },
      { doc: "战略规划-2024H2.pptx 摘要", text: "下半年资源向学习完成率倾斜，注册量不再是核心 KPI。", score: 0.73 },
      { doc: "面试评价表-后端-0913.docx", text: "候选人系统设计扎实，倾向通过……", score: 0.17 },
      { doc: "周报模板.md", text: "本周进展 / 下周计划 / 风险与求助。", score: 0.12 },
      { doc: "云账单-2024-09.csv", text: "GPU 预留实例 $12,400，对象存储 $860……", score: 0.08 },
      { doc: "茶水间采购清单.txt", text: "咖啡豆 ×3，气泡水 ×24。", score: 0.04 },
    ],
    rawAnswer:
      "我没有参加过你们的内部会议，不过一般 Q3 复盘常以 MAU 或 GMV 作为北极星指标，比如「月活跃用户数」……",
    rawTag: "⚠ 一次性长尾知识：权重里根本没有",
    ragAnswer:
      "2024-Q3 复盘会确定：北极星指标 = 周活跃学习用户（WAU-L），配套 OKR 为次月留存 ≥ 45%；同期明确注册量不再是核心 KPI。",
    sources: ["会议纪要/2024-Q3-复盘.md", "战略规划-2024H2.pptx 摘要"],
    lesson: "越冷门、越一次性的知识，越只能靠检索——这就是「旁路知识库」存在的意义。",
  },
];

/* ---------- 流水线阶段 ---------- */

const RAW_STAGES = [
  { key: "ask", title: "提问", icon: "🧑‍💻", color: "#0891b2", detail: "问题直接进入模型——窗口里只有问题本身" },
  { key: "gen", title: "生成回答", icon: "🧠", color: "#db2777", detail: "模型只能用「权重里的记忆」作答：训练截止日期 + 公开语料" },
];

const RAG_STAGES = [
  { key: "ask", title: "提问", icon: "🧑‍💻", color: "#0891b2", detail: "同一个问题，但这次有旁路知识库可用" },
  { key: "embed", title: "Embedding 向量化", icon: "🧲", color: "#2563eb", detail: "问题被编码成向量——语义相近的文本在高维空间里彼此靠近" },
  { key: "search", title: "向量检索 top-k", icon: "🔍", color: "#2563eb", detail: "在索引里按余弦相似度召回最相关的 2 个片段（混合检索还会叠 BM25）" },
  { key: "inject", title: "注入上下文", icon: "📥", color: "#059669", detail: "命中的片段连同问题一起放进窗口——模型「开卷考试」" },
  { key: "gen", title: "生成回答", icon: "✅", color: "#059669", detail: "有据可依地作答，并附上来源引用" },
];

const RAW_DELAYS = [1000, 1600];
const RAG_DELAYS = [1000, 1400, 1600, 1300, 1700];

/* ---------- 组件 ---------- */

export default function RagPipeline() {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [mode, setMode] = useState<"raw" | "rag">("rag");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stages = mode === "rag" ? RAG_STAGES : RAW_STAGES;
    const delays = mode === "rag" ? RAG_DELAYS : RAW_DELAYS;
    setStage(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 0;
    for (let i = 1; i < stages.length; i++) {
      acc += delays[i];
      timers.push(setTimeout(() => setStage(i), acc));
    }
    return () => timers.forEach(clearTimeout);
  }, [mode, scenario]);

  const stages = mode === "rag" ? RAG_STAGES : RAW_STAGES;
  const isRag = mode === "rag";
  const topK = isRag ? scenario.chunks.slice(0, 2) : [];
  const done = stage === stages.length - 1;

  return (
    <section id="rag-demo" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="rounded-3xl border border-aurora-blue/30 bg-paper-100/60 p-8 backdrop-blur-md sm:p-12">
        <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          📚 RAG 检索流水线 <span className="text-lg font-normal text-slate-500">交互演示</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
          模型权重里的知识是冻结的：不知你的内部制度、不知最新文档、不记一次性的会议结论。
          RAG 在回答前先去「旁路知识库」查资料——选一个问题，切换两种模式对比。
        </p>

        {/* 问题选择 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenario(s)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                scenario.id === s.id
                  ? "border-aurora-blue bg-aurora-blue/15 text-aurora-blue"
                  : "border-paper-400 text-slate-500 hover:border-aurora-blue/60 hover:text-slate-900"
              }`}
            >
              {s.q}
            </button>
          ))}
        </div>

        {/* 模式切换 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setMode("raw")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !isRag
                ? "bg-red-500/20 text-red-500 ring-1 ring-red-500/50"
                : "bg-slate-900/5 text-slate-500 ring-1 ring-slate-900/10 hover:text-slate-900"
            }`}
          >
            🚫 直接问模型（闭卷）
          </button>
          <button
            onClick={() => setMode("rag")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              isRag
                ? "bg-aurora-blue/20 text-aurora-blue ring-1 ring-aurora-blue/50"
                : "bg-slate-900/5 text-slate-500 ring-1 ring-slate-900/10 hover:text-slate-900"
            }`}
          >
            📚 RAG 增强（开卷）
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* 左：流水线阶段 */}
          <div className="space-y-2">
            {stages.map((s, i) => {
              const active = i === stage;
              const past = i < stage;
              return (
                <div key={s.key} className="relative">
                  <motion.div
                    animate={active ? { scale: 1.02 } : { scale: 1 }}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition-colors duration-300 ${
                      active
                        ? "border-transparent bg-paper-200"
                        : "border-paper-300/50 bg-paper-100/40 opacity-60"
                    }`}
                    style={active ? { borderColor: s.color, boxShadow: `0 0 24px -6px ${s.color}66` } : undefined}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: active || past ? s.color : "#475569" }}>
                        {s.title}
                        {past && <span className="ml-2 text-xs opacity-70">✓</span>}
                      </p>
                      {active && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs leading-relaxed text-slate-500"
                        >
                          {s.detail}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                  {i < stages.length - 1 && (
                    <div className="ml-7 h-2 w-px bg-paper-400" />
                  )}
                </div>
              );
            })}
          </div>

          {/* 右：知识库 + 回答 */}
          <div className="space-y-6">
            {/* 向量索引面板 */}
            <div
              className={`relative overflow-hidden rounded-xl border p-4 transition-opacity ${
                isRag ? "border-aurora-blue/30 bg-white/60" : "border-paper-300/60 bg-white/60 opacity-40"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500">
                  vector-db · 6 chunks · {isRag ? "索引已就绪" : "未挂载"}
                </p>
                {isRag && stage >= 2 && (
                  <span className="rounded-full bg-aurora-blue/15 px-2.5 py-0.5 text-xs text-aurora-blue">
                    top-{topK.length} 命中
                  </span>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {(isRag ? scenario.chunks : scenario.chunks.slice(0, 2)).map((c, i) => {
                  const hit = isRag && stage >= 2 && i < 2;
                  const showScore = isRag && stage >= 2;
                  return (
                    <motion.div
                      key={c.doc}
                      animate={hit ? { scale: 1.02 } : { scale: 1 }}
                      className={`rounded-lg border p-2.5 transition-colors duration-500 ${
                        hit
                          ? "border-aurora-blue/70 bg-aurora-blue/10"
                          : "border-paper-300/50 bg-paper-100/40"
                      }`}
                    >
                      <p className={`truncate font-mono text-[10px] ${hit ? "text-aurora-blue" : "text-slate-400"}`}>
                        {c.doc}
                      </p>
                      <p className={`mt-1 text-xs leading-relaxed ${hit ? "text-slate-700" : "text-slate-500"}`}>
                        {hit ? c.text : isRag ? (showScore ? "（相似度过低，未召回）" : "▓▓▓▓ ▓▓▓▓▓ ▓▓▓") : "· · ·"}
                      </p>
                      {showScore && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper-300">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.score * 100}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-full rounded-full ${i < 2 ? "bg-aurora-blue" : "bg-slate-600"}`}
                            />
                          </div>
                          <span className={`font-mono text-[10px] ${i < 2 ? "text-aurora-blue" : "text-slate-400"}`}>
                            {c.score.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* embedding 向量示意 */}
              {isRag && stage >= 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 truncate font-mono text-[10px] text-slate-400"
                >
                  q_vec = [0.023, -0.117, 0.441, 0.078, -0.302, …] ({scenario.q})
                </motion.p>
              )}
              {!isRag && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                  闭卷模式：模型看不到任何外部知识
                </p>
              )}
            </div>

            {/* 回答终端 */}
            <div className="overflow-hidden rounded-xl border border-paper-300 bg-white shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-2 border-b border-paper-300/60 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-2 font-mono text-xs text-slate-500">
                  {isRag ? "rag-pipeline" : "direct-llm"} — {scenario.q}
                </span>
              </div>
              <div className="min-h-[120px] px-5 py-4 font-mono text-sm">
                <AnimatePresence mode="wait">
                  {!done ? (
                    <motion.div key={`${stage}-working`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span className="text-slate-500">
                        {isRag ? stages[stage].title : RAW_STAGES[stage].title}…
                      </span>
                      <span className="ml-1 inline-block animate-pulse text-slate-500">▌</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${mode}-answer`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {isRag ? (
                        <>
                          <span className="text-green-600">[有据可查]</span>
                          <p className="mt-2 leading-relaxed text-slate-700">{scenario.ragAnswer}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {scenario.sources.map((s) => (
                              <span key={s} className="rounded-full bg-aurora-blue/10 px-2.5 py-0.5 text-xs text-aurora-blue ring-1 ring-aurora-blue/30">
                                📄 {s}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-red-600">{scenario.rawTag}</span>
                          <p className="mt-2 leading-relaxed text-slate-500">{scenario.rawAnswer}</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          💡 {scenario.lesson}
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          生产级 RAG 还会做：切块（chunking）· 混合检索（向量 + BM25）· 重排（rerank）· 查询改写 · 增量索引
        </p>
      </div>
    </section>
  );
}
