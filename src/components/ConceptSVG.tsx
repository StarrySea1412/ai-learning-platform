import type { ReactElement } from "react";

export type SvgKind = "transformer" | "llm" | "agent" | "hermes" | "harness" | "mcp" | "rag";

const SVG_MAP: Record<SvgKind, () => ReactElement> = {
  transformer: TransformerSVG,
  llm: LlmSVG,
  agent: AgentSVG,
  hermes: HermesSVG,
  harness: HarnessSVG,
  mcp: McpSVG,
  rag: RagSVG,
};

export default function ConceptSVG({ kind }: { kind: SvgKind }) {
  const Cmp = SVG_MAP[kind];
  return <Cmp />;
}

/* ---------- 01 Transformer：注意力连线图 ---------- */
function TransformerSVG() {
  const tokens = ["The", "cat", "sat", "on", "mat"];
  const w = 320;
  const positions = tokens.map((_, i) => 40 + (i * (w - 80)) / (tokens.length - 1));
  // 注意力权重（示意）：中心词 "sat" 与各词的关联度
  const weights = [0.25, 0.55, 1, 0.4, 0.7];

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="自注意力机制示意">
      <defs>
        <linearGradient id="att-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 注意力弧线：从中心词 sat (index 2) 到其他词 */}
      {positions.map((x, i) => {
        if (i === 2) return null;
        const strength = weights[i];
        return (
          <path
            key={i}
            d={`M ${positions[2]} 150 Q ${(positions[2] + x) / 2} ${150 - 60 - strength * 45} ${x} 150`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth={1 + strength * 3}
            strokeOpacity={0.15 + strength * 0.75}
            className="svg-dash"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        );
      })}

      {/* token 节点 */}
      {tokens.map((t, i) => (
        <g key={t} className={i === 2 ? "svg-breathe" : "svg-float"} style={{ animationDelay: `${i * 0.4}s` }}>
          <circle cx={positions[i]} cy={150} r={26} fill="#0a0e1a" stroke="#22d3ee" strokeOpacity={i === 2 ? 1 : 0.45} strokeWidth={i === 2 ? 2 : 1} />
          <text x={positions[i]} y={155} textAnchor="middle" fill={i === 2 ? "#22d3ee" : "#94a3b8"} fontSize="12" fontFamily="monospace">
            {t}
          </text>
        </g>
      ))}

      <text x="160" y="205" textAnchor="middle" fill="#64748b" fontSize="11">
        「sat」同时注视所有词 · 线宽 = 注意力权重
      </text>
    </svg>
  );
}

/* ---------- 02 LLM：参数规模滚动球 ---------- */
function LlmSVG() {
  const balls = [
    { label: "GPT-1", r: 16, x: 60, delay: "0s" },
    { label: "GPT-3", r: 34, x: 150, delay: "0.5s" },
    { label: "GPT-4", r: 58, x: 250, delay: "1s" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="模型规模增长示意">
      {balls.map((b, i) => (
        <g key={b.label} className="svg-float" style={{ animationDelay: b.delay }}>
          <circle cx={b.x} cy={140 - b.r} r={b.r} fill="#0a0e1a" stroke="#60a5fa" strokeWidth={1.5} strokeOpacity={0.4 + i * 0.3} />
          <circle cx={b.x} cy={140 - b.r} r={b.r} fill="url(#llm-g)" opacity={0.25} />
          <text x={b.x} y={140 - b.r + 4} textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="monospace">
            {b.label}
          </text>
        </g>
      ))}
      <defs>
        <radialGradient id="llm-g">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 地面 */}
      <line x1="20" y1="141" x2="300" y2="141" stroke="#334155" strokeWidth="1" />
      <text x="160" y="180" textAnchor="middle" fill="#64748b" fontSize="11">
        1 亿 → 1750 亿 → 万亿级参数 · 能力「涌现」
      </text>
      <text x="160" y="200" textAnchor="middle" fill="#475569" fontSize="10">
        圆的面积 ≈ 参数量级（示意）
      </text>
    </svg>
  );
}

/* ---------- 03 Agent：循环箭头图（另有大动画在 AgentLoop） ---------- */
function AgentSVG() {
  const cx = 160;
  const cy = 110;
  const r = 62;
  const steps = ["思考", "行动", "观察", "迭代"];
  const angles = [-90, 0, 90, 180];

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="Agent 循环示意">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a78bfa" strokeOpacity="0.35" strokeWidth="2" className="svg-dash" />

      {/* 中心 LLM */}
      <g className="svg-breathe">
        <rect x={cx - 34} y={cy - 22} width="68" height="44" rx="10" fill="#0a0e1a" stroke="#a78bfa" strokeWidth="1.5" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">
          LLM
        </text>
      </g>

      {/* 四个步骤节点 */}
      {steps.map((s, i) => {
        const a = (angles[i] * Math.PI) / 180;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        return (
          <g key={s} className="svg-float" style={{ animationDelay: `${i * 0.5}s` }}>
            <circle cx={x} cy={y} r={20} fill="#0a0e1a" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="1.2" />
            <text x={x} y={y + 4} textAnchor="middle" fill="#ddd6fe" fontSize="11">
              {s}
            </text>
          </g>
        );
      })}

      <text x="160" y="205" textAnchor="middle" fill="#64748b" fontSize="11">
        Agent = LLM + 工具 + 循环 · 详见下方大动画
      </text>
    </svg>
  );
}

/* ---------- 04 Hermes：双面信使（快思/慢想） ---------- */
function HermesSVG() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="Hermes 混合推理示意">
      {/* 主体 */}
      <g className="svg-float">
        <circle cx="160" cy="105" r="52" fill="#0a0e1a" stroke="#f472b6" strokeWidth="1.5" />
        <text x="160" y="98" textAnchor="middle" fill="#f9a8d4" fontSize="15" fontWeight="bold">
          Hermes
        </text>
        <text x="160" y="118" textAnchor="middle" fill="#f472b6" fontSize="10">
          混合推理
        </text>
      </g>

      {/* 左：快速模式（闪电） */}
      <g className="svg-glow">
        <path d="M 70 70 L 58 92 L 68 92 L 60 112 L 82 86 L 71 86 L 80 70 Z" fill="#22d3ee" opacity="0.9" />
        <text x="70" y="140" textAnchor="middle" fill="#67e8f9" fontSize="11">
          快思
        </text>
      </g>

      {/* 右：推理模式（思维链） */}
      <g className="svg-glow" style={{ animationDelay: "1.2s" }}>
        <circle cx="252" cy="78" r="4" fill="#a78bfa" />
        <circle cx="270" cy="92" r="4" fill="#a78bfa" opacity="0.8" />
        <circle cx="258" cy="108" r="4" fill="#a78bfa" opacity="0.6" />
        <path d="M 252 78 Q 264 84 270 92 Q 262 102 258 108" fill="none" stroke="#a78bfa" strokeWidth="1.5" className="svg-dash" />
        <text x="260" y="140" textAnchor="middle" fill="#c4b5fd" fontSize="11">
          慢想（思维链）
        </text>
      </g>

      {/* 连接 */}
      <line x1="92" y1="92" x2="118" y2="98" stroke="#f472b6" strokeOpacity="0.4" className="svg-dash" />
      <line x1="202" y1="98" x2="228" y2="92" stroke="#f472b6" strokeOpacity="0.4" className="svg-dash" />

      {/* 翅膀 */}
      <g className="svg-wing" style={{ transformOrigin: "212px 60px" }}>
        <path d="M 212 60 Q 240 42 258 52 Q 238 58 226 66 Z" fill="#f472b6" opacity="0.55" />
      </g>
      <g className="svg-wing" style={{ transformOrigin: "108px 60px", animationDelay: "0.45s" }}>
        <path d="M 108 60 Q 80 42 62 52 Q 82 58 94 66 Z" fill="#f472b6" opacity="0.55" />
      </g>

      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="11">
        一个模型两种脑：秒答 ⇄ 长思维链推理
      </text>
    </svg>
  );
}

/* ---------- 05 Harness：马具与缰绳 ---------- */
function HarnessSVG() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="Harness 马具隐喻示意">
      {/* 模型之马 */}
      <g className="svg-float">
        <circle cx="90" cy="100" r="40" fill="#0a0e1a" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="90" y="96" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="bold">
          LLM
        </text>
        <text x="90" y="114" textAnchor="middle" fill="#fbbf24" fontSize="9">
          千里马
        </text>
      </g>

      {/* 缰绳 */}
      <path d="M 130 100 C 170 70, 200 70, 235 100" fill="none" stroke="#fbbf24" strokeWidth="2" className="svg-dash" />
      <path d="M 130 100 C 170 130, 200 130, 235 100" fill="none" stroke="#fbbf24" strokeWidth="2" className="svg-dash" opacity="0.6" />

      {/* 操控台 */}
      <g>
        <rect x="235" y="72" width="70" height="56" rx="8" fill="#0a0e1a" stroke="#fbbf24" strokeWidth="1.5" />
        {/* 屏幕内容：模拟开关与代码行 */}
        <rect x="243" y="82" width="28" height="6" rx="2" fill="#fbbf24" opacity="0.8" />
        <rect x="243" y="94" width="44" height="4" rx="2" fill="#fbbf24" opacity="0.4" />
        <rect x="243" y="104" width="36" height="4" rx="2" fill="#fbbf24" opacity="0.4" />
        <circle cx="288" cy="85" r="5" fill="#22c55e" className="svg-glow" />
        <text x="270" y="146" textAnchor="middle" fill="#fcd34d" fontSize="10">
          Harness
        </text>
      </g>

      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="11">
        不换马，换马具：工程决定模型能否落地
      </text>
    </svg>
  );
}

/* ---------- 06 MCP：枢纽汇聚图（N×M → N+M） ---------- */
function McpSVG() {
  const apps = ["应用 A", "应用 B", "应用 C"];
  const tools = ["文件", "GitHub", "数据库"];
  const cx = 160;
  const cy = 105;

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="MCP 枢纽连接示意">
      {/* 左：应用侧 → 枢纽 */}
      {apps.map((a, i) => {
        const y = 45 + i * 60;
        return (
          <g key={a}>
            <rect x="18" y={y - 15} width="66" height="30" rx="7" fill="#0a0e1a" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="1.2" />
            <text x="51" y={y + 4} textAnchor="middle" fill="#67e8f9" fontSize="11">
              {a}
            </text>
            <path d={`M 84 ${y} Q 122 ${y} ${cx - 38} ${cy}`} fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="1.3" className="svg-dash" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        );
      })}

      {/* 中央六边形枢纽 */}
      <g className="svg-breathe">
        <polygon
          points={`${cx + 36},${cy} ${cx + 18},${cy + 31} ${cx - 18},${cy + 31} ${cx - 36},${cy} ${cx - 18},${cy - 31} ${cx + 18},${cy - 31}`}
          fill="#0a0e1a"
          stroke="#22d3ee"
          strokeWidth="1.8"
        />
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#a5f3fc" fontSize="13" fontWeight="bold">
          MCP
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#22d3ee" fontSize="9">
          枢纽
        </text>
      </g>

      {/* 枢纽 → 右：工具侧 */}
      {tools.map((t, i) => {
        const y = 45 + i * 60;
        return (
          <g key={t}>
            <path d={`M ${cx + 36} ${cy} Q 200 ${y} 236 ${y}`} fill="none" stroke="#34d399" strokeOpacity="0.45" strokeWidth="1.3" className="svg-dash" style={{ animationDelay: `${0.15 + i * 0.3}s` }} />
            <rect x="236" y={y - 15} width="66" height="30" rx="7" fill="#0a0e1a" stroke="#34d399" strokeOpacity="0.55" strokeWidth="1.2" />
            <text x="269" y={y + 4} textAnchor="middle" fill="#6ee7b7" fontSize="11">
              {t}
            </text>
          </g>
        );
      })}

      <text x="160" y="205" textAnchor="middle" fill="#64748b" fontSize="11">
        适配器 M×N → M+N：写一次 Server，处处即插即用
      </text>
    </svg>
  );
}

/* ---------- 07 RAG：检索流水线图 ---------- */
function RagSVG() {
  const stages = [
    { x: 24, w: 62, label: "文档库", color: "#60a5fa" },
    { x: 106, w: 62, label: "切块", color: "#a78bfa" },
    { x: 188, w: 66, label: "向量库", color: "#60a5fa" },
    { x: 264, w: 50, label: "LLM", color: "#34d399" },
  ];

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="RAG 检索流水线示意">
      {/* 流水线主体 */}
      {stages.map((s, i) => (
        <g key={s.label} className="svg-float" style={{ animationDelay: `${i * 0.4}s` }}>
          <rect x={s.x} y="52" width={s.w} height="42" rx="9" fill="#0a0e1a" stroke={s.color} strokeOpacity="0.7" strokeWidth="1.3" />
          <text x={s.x + s.w / 2} y="78" textAnchor="middle" fill={s.color} fontSize="12">
            {s.label}
          </text>
        </g>
      ))}

      {/* 文档库里的页 */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={36 + i * 12} y={40 - i * 3} width="14" height="18" rx="2" fill="#60a5fa" opacity={0.25 + i * 0.15} />
      ))}
      {/* 切块里的小块 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={114 + (i % 2) * 18} y={94 - Math.floor(i / 2) * 0} width="12" height="12" rx="2" fill="#a78bfa" opacity={0.3 + i * 0.12} />
      ))}
      {/* 向量库里的向量点 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={202 + (i % 3) * 16} cy={i < 3 ? 104 : 94} r="2.5" fill="#60a5fa" opacity={0.4 + i * 0.1} />
      ))}

      {/* 箭头 */}
      {[
        { x1: 86, x2: 104, c: "#60a5fa" },
        { x1: 168, x2: 186, c: "#a78bfa" },
      ].map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1="73" x2={a.x2} y2="73" stroke={a.c} strokeWidth="1.5" className="svg-dash" />
          <path d={`M ${a.x2} 68 L ${a.x2 + 8} 73 L ${a.x2} 78 Z`} fill={a.c} opacity="0.8" />
        </g>
      ))}

      {/* top-k 召回：向量库 → LLM（高亮） */}
      <g>
        <path d="M 254 66 Q 260 40 278 46 L 286 52" fill="none" stroke="#34d399" strokeWidth="1.6" className="svg-dash" />
        <text x="252" y="34" textAnchor="middle" fill="#34d399" fontSize="10">
          top-k 召回
        </text>
      </g>
      {/* 旁路：切块 → LLM 的注入线 */}
      <g>
        <path d="M 137 94 Q 137 130 240 96" fill="none" stroke="#34d399" strokeOpacity="0.35" strokeWidth="1.2" className="svg-dash" />
      </g>

      {/* 底部：提问进入向量库 */}
      <g>
        <circle cx="221" cy="150" r="15" fill="#0a0e1a" stroke="#f472b6" strokeOpacity="0.7" strokeWidth="1.2" />
        <text x="221" y="155" textAnchor="middle" fill="#f9a8d4" fontSize="12">
          ?
        </text>
        <text x="248" y="155" fill="#f472b6" fontSize="10">
          提问向量化
        </text>
        <line x1="221" y1="135" x2="221" y2="98" stroke="#f472b6" strokeOpacity="0.5" strokeWidth="1.3" className="svg-dash" />
      </g>

      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="11">
        开卷考试：先检索、再生成、附引用
      </text>
      <text x="160" y="216" textAnchor="middle" fill="#475569" fontSize="10">
        质量上限由「切块与召回」决定，而非生成端
      </text>
    </svg>
  );
}
