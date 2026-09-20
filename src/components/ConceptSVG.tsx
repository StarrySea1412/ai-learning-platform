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
          <stop offset="0%" stopColor="#0891b2" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#0891b2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="att-halo">
          <stop offset="0%" stopColor="#0891b2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 中心词光环 */}
      <circle cx={positions[2]} cy={150} r={44} fill="url(#att-halo)" className="svg-glow-ring" />

      {/* 注意力弧线：从中心词 sat (index 2) 到其他词 */}
      {positions.map((x, i) => {
        if (i === 2) return null;
        const strength = weights[i];
        return (
          <path
            key={i}
            d={`M ${positions[2]} 150 Q ${(positions[2] + x) / 2} ${150 - 60 - strength * 45} ${x} 150`}
            fill="none"
            stroke="#0891b2"
            strokeWidth={1 + strength * 3}
            strokeOpacity={0.15 + strength * 0.75}
            className="svg-dash"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        );
      })}

      {/* 注意力权重小刻度 */}
      {positions.map((x, i) => {
        if (i === 2) return null;
        return (
          <text key={`w-${i}`} x={x} y={128} textAnchor="middle" fill="#0891b2" fontSize="9" fontFamily="monospace" opacity={0.55 + weights[i] * 0.4}>
            {weights[i].toFixed(2)}
          </text>
        );
      })}

      {/* token 节点 */}
      {tokens.map((t, i) => (
        <g key={t} className={i === 2 ? "svg-breathe" : "svg-float"} style={{ animationDelay: `${i * 0.4}s` }}>
          {i === 2 && (
            <circle cx={positions[i]} cy={150} r={31} fill="none" stroke="#0891b2" strokeOpacity="0.3" strokeWidth="1" className="svg-glow-ring" />
          )}
          <circle cx={positions[i]} cy={150} r={26} fill="#ffffff" stroke="#0891b2" strokeOpacity={i === 2 ? 1 : 0.45} strokeWidth={i === 2 ? 2 : 1} />
          <text x={positions[i]} y={155} textAnchor="middle" fill={i === 2 ? "#0891b2" : "#475569"} fontSize="12" fontFamily="monospace" fontWeight={i === 2 ? "bold" : "normal"}>
            {t}
          </text>
        </g>
      ))}

      {/* Q/K/V 标注 */}
      <text x={positions[2]} y={182} textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="monospace">
        Q ← 查询
      </text>
      <text x={positions[0] - 6} y={182} textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="monospace">
        K/V ← 键值
      </text>

      <text x="160" y="205" textAnchor="middle" fill="#64748b" fontSize="11">
        「sat」同时注视所有词 · 线宽 = 注意力权重
      </text>
    </svg>
  );
}

/* ---------- 02 LLM：参数规模滚动球 ---------- */
function LlmSVG() {
  const balls = [
    { label: "GPT-1", sub: "1.2亿", r: 16, x: 60, delay: "0s" },
    { label: "GPT-3", sub: "1750亿", r: 34, x: 150, delay: "0.5s" },
    { label: "GPT-4", sub: "万亿级", r: 58, x: 250, delay: "1s" },
  ];
  const sparks = [
    { x: 232, y: 52, tx: -18, ty: -14, d: "0s" },
    { x: 258, y: 40, tx: 12, ty: -18, d: "0.6s" },
    { x: 276, y: 62, tx: 16, ty: 6, d: "1.1s" },
    { x: 246, y: 74, tx: -10, ty: 14, d: "1.6s" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="模型规模增长示意">
      <defs>
        <radialGradient id="llm-g">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
      </defs>

      {balls.map((b, i) => (
        <g key={b.label} className="svg-float" style={{ animationDelay: b.delay }}>
          <circle cx={b.x} cy={140 - b.r} r={b.r} fill="#ffffff" stroke="#2563eb" strokeWidth={1.5} strokeOpacity={0.4 + i * 0.3} />
          <circle cx={b.x} cy={140 - b.r} r={b.r} fill="url(#llm-g)" opacity={0.25} />
          <text x={b.x} y={140 - b.r + 1} textAnchor="middle" fill="#2563eb" fontSize="11" fontFamily="monospace" fontWeight="bold">
            {b.label}
          </text>
          <text x={b.x} y={142} textAnchor="middle" fill="#64748b" fontSize="9">
            {b.sub}
          </text>
        </g>
      ))}

      {/* 涌现火花：GPT-4 球顶上迸发 */}
      {sparks.map((s, i) => (
        <g key={i} className="svg-glow" style={{ animationDelay: s.d }}>
          <circle cx={s.x} cy={s.y} r={2.5} fill="#7c3aed" />
        </g>
      ))}
      <text x={264} y={28} textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="bold">
        ✦ 能力涌现
      </text>

      {/* 增长趋势线 */}
      <path d="M 60 116 Q 150 92 250 56" fill="none" stroke="#2563eb" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" className="svg-dash" />

      {/* 地面 */}
      <line x1="20" y1="141" x2="300" y2="141" stroke="#cbd5e1" strokeWidth="1" />
      <text x="160" y="180" textAnchor="middle" fill="#64748b" fontSize="11">
        1 亿 → 1750 亿 → 万亿级参数 · 能力「涌现」
      </text>
      <text x="160" y="200" textAnchor="middle" fill="#94a3b8" fontSize="10">
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
  // 循环方向箭头（顺时针）：在两节点之间的弧上放小箭头
  const arrowAngles = [-45, 45, 135, 225];

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="Agent 循环示意">
      <defs>
        <radialGradient id="agent-halo">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 中心辐射光晕 */}
      <circle cx={cx} cy={cy} r={r} fill="url(#agent-halo)" className="svg-glow-ring" />
      {/* 外圈虚线轨道（反向缓旋） */}
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke="#7c3aed" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 6" className="svg-spin-slow-reverse" />
      {/* 主循环轨道 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7c3aed" strokeOpacity="0.35" strokeWidth="2" className="svg-dash" />

      {/* 中心 LLM */}
      <g className="svg-breathe">
        <rect x={cx - 34} y={cy - 22} width="68" height="44" rx="10" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#7c3aed" fontSize="13" fontWeight="bold">
          LLM
        </text>
      </g>

      {/* 循环方向箭头 */}
      {arrowAngles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const rot = deg + 90; // 切线方向
        return (
          <path
            key={i}
            d="M -4 3 L 4 0 L -4 -3 Z"
            fill="#7c3aed"
            opacity="0.7"
            transform={`translate(${x} ${y}) rotate(${rot})`}
          />
        );
      })}

      {/* 四个步骤节点 */}
      {steps.map((s, i) => {
        const a = (angles[i] * Math.PI) / 180;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        return (
          <g key={s} className="svg-float" style={{ animationDelay: `${i * 0.5}s` }}>
            <circle cx={x} cy={y} r={24} fill="#ffffff" stroke="#7c3aed" strokeOpacity="0.25" strokeWidth="1" className="svg-glow-ring" style={{ animationDelay: `${i * 0.7}s` }} />
            <circle cx={x} cy={y} r={20} fill="#ffffff" stroke="#7c3aed" strokeOpacity="0.7" strokeWidth="1.2" />
            <text x={x} y={y + 4} textAnchor="middle" fill="#7c3aed" fontSize="11">
              {s}
            </text>
          </g>
        );
      })}

      {/* 中心到节点的能量连线 */}
      {steps.map((s, i) => {
        const a = (angles[i] * Math.PI) / 180;
        const x1 = cx + 34 * Math.cos(a);
        const y1 = cy + 22 * Math.sin(a);
        const x2 = cx + (r - 21) * Math.cos(a);
        const y2 = cy + (r - 21) * Math.sin(a);
        return (
          <line key={`l-${s}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c3aed" strokeOpacity="0.3" strokeWidth="1" className="svg-dash" style={{ animationDelay: `${i * 0.4}s` }} />
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
  // 思维链节点上的流动粒子
  const chainDots = [
    { t: "M 252 78 Q 264 84 270 92", d: "0s" },
    { t: "M 270 92 Q 262 102 258 108", d: "0.5s" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="Hermes 混合推理示意">
      {/* 主体 */}
      <g className="svg-float">
        <circle cx="160" cy="105" r="62" fill="none" stroke="#db2777" strokeOpacity="0.15" strokeWidth="1" className="svg-glow-ring" />
        <circle cx="160" cy="105" r="52" fill="#ffffff" stroke="#db2777" strokeWidth="1.5" />
        <text x="160" y="98" textAnchor="middle" fill="#db2777" fontSize="15" fontWeight="bold">
          Hermes
        </text>
        <text x="160" y="118" textAnchor="middle" fill="#db2777" fontSize="10">
          混合推理
        </text>
      </g>

      {/* 左：快速模式（闪电） */}
      <g className="svg-glow">
        <path d="M 70 70 L 58 92 L 68 92 L 60 112 L 82 86 L 71 86 L 80 70 Z" fill="#0891b2" opacity="0.9" />
        <text x="70" y="140" textAnchor="middle" fill="#0891b2" fontSize="11" fontWeight="bold">
          快思
        </text>
        <text x="70" y="154" textAnchor="middle" fill="#94a3b8" fontSize="8">
          秒回 · 直接输出
        </text>
      </g>

      {/* 右：推理模式（思维链） */}
      <g className="svg-glow" style={{ animationDelay: "1.2s" }}>
        <circle cx="252" cy="78" r="4" fill="#7c3aed" />
        <circle cx="270" cy="92" r="4" fill="#7c3aed" opacity="0.8" />
        <circle cx="258" cy="108" r="4" fill="#7c3aed" opacity="0.6" />
        <path d="M 252 78 Q 264 84 270 92 Q 262 102 258 108" fill="none" stroke="#7c3aed" strokeWidth="1.5" className="svg-dash" />
        {/* 思维链上的流动粒子 */}
        {chainDots.map((c, i) => (
          <circle key={i} r="2" fill="#7c3aed" opacity="0.9">
            <animateMotion dur="1.6s" repeatCount="indefinite" path={c.t} begin={c.d} />
          </circle>
        ))}
        <text x="260" y="140" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="bold">
          慢想（思维链）
        </text>
        <text x="260" y="154" textAnchor="middle" fill="#94a3b8" fontSize="8">
          写草稿 · 多步推理
        </text>
      </g>

      {/* 连接 */}
      <line x1="92" y1="92" x2="118" y2="98" stroke="#db2777" strokeOpacity="0.4" className="svg-dash" />
      <line x1="202" y1="98" x2="228" y2="92" stroke="#db2777" strokeOpacity="0.4" className="svg-dash" />

      {/* 翅膀 */}
      <g className="svg-wing" style={{ transformOrigin: "212px 60px" }}>
        <path d="M 212 60 Q 240 42 258 52 Q 238 58 226 66 Z" fill="#db2777" opacity="0.55" />
      </g>
      <g className="svg-wing" style={{ transformOrigin: "108px 60px", animationDelay: "0.45s" }}>
        <path d="M 108 60 Q 80 42 62 52 Q 82 58 94 66 Z" fill="#db2777" opacity="0.55" />
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
        <circle cx="90" cy="100" r="48" fill="none" stroke="#d97706" strokeOpacity="0.15" className="svg-glow-ring" />
        <circle cx="90" cy="100" r="40" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
        <text x="90" y="96" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="bold">
          LLM
        </text>
        <text x="90" y="114" textAnchor="middle" fill="#d97706" fontSize="9">
          千里马
        </text>
      </g>

      {/* 缰绳（数据流动方向：马 → 操控台） */}
      <path d="M 130 100 C 170 70, 200 70, 235 100" fill="none" stroke="#d97706" strokeWidth="2" className="svg-data-flow" />
      <path d="M 130 100 C 170 130, 200 130, 235 100" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" className="svg-dash" opacity="0.5" />
      <text x="182" y="60" textAnchor="middle" fill="#d97706" fontSize="9">
        工具调用 →
      </text>
      <text x="182" y="152" textAnchor="middle" fill="#d97706" fontSize="9">
        ← 结果回填
      </text>

      {/* 操控台 */}
      <g>
        <rect x="235" y="72" width="70" height="56" rx="8" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
        {/* 屏幕内容：模拟开关与代码行 */}
        <rect x="243" y="82" width="28" height="6" rx="2" fill="#d97706" opacity="0.8" />
        <rect x="243" y="94" width="44" height="4" rx="2" fill="#d97706" opacity="0.4" />
        <rect x="243" y="104" width="36" height="4" rx="2" fill="#d97706" opacity="0.4" />
        <circle cx="288" cy="85" r="5" fill="#22c55e" className="svg-glow" />
        {/* 屏幕扫描线 */}
        <rect x="236" y="76" width="68" height="2" fill="#d97706" opacity="0.35" className="svg-glow" />
        <text x="270" y="146" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">
          Harness
        </text>
      </g>

      {/* 底部：权限门控示意 */}
      <g>
        <rect x="52" y="164" width="100" height="20" rx="10" fill="#fef3c7" stroke="#d97706" strokeOpacity="0.4" strokeWidth="1" />
        <text x="102" y="178" textAnchor="middle" fill="#92400e" fontSize="9">
          危险操作 ⚠ 人审
        </text>
        <rect x="168" y="164" width="100" height="20" rx="10" fill="#ecfdf5" stroke="#059669" strokeOpacity="0.4" strokeWidth="1" />
        <text x="218" y="178" textAnchor="middle" fill="#065f46" fontSize="9">
          沙箱内 ✓ 自主
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
        const path = `M 84 ${y} Q 122 ${y} ${cx - 38} ${cy}`;
        return (
          <g key={a}>
            <rect x="18" y={y - 15} width="66" height="30" rx="7" fill="#ffffff" stroke="#0891b2" strokeOpacity="0.55" strokeWidth="1.2" />
            <text x="51" y={y + 4} textAnchor="middle" fill="#0891b2" fontSize="11">
              {a}
            </text>
            <path d={path} fill="none" stroke="#0891b2" strokeOpacity="0.45" strokeWidth="1.3" className="svg-dash" style={{ animationDelay: `${i * 0.3}s` }} />
            {/* 流动数据粒子 */}
            <circle r="2.2" fill="#0891b2" opacity="0.85">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={path} begin={`${i * 0.7}s`} />
            </circle>
          </g>
        );
      })}

      {/* 中央六边形枢纽 */}
      <g className="svg-breathe">
        <polygon
          points={`${cx + 44},${cy} ${cx + 22},${cy + 38} ${cx - 22},${cy + 38} ${cx - 44},${cy} ${cx - 22},${cy - 38} ${cx + 22},${cy - 38}`}
          fill="none"
          stroke="#0891b2"
          strokeOpacity="0.2"
          strokeWidth="1"
          className="svg-spin-slow"
        />
        <polygon
          points={`${cx + 36},${cy} ${cx + 18},${cy + 31} ${cx - 18},${cy + 31} ${cx - 36},${cy} ${cx - 18},${cy - 31} ${cx + 18},${cy - 31}`}
          fill="#ffffff"
          stroke="#0891b2"
          strokeWidth="1.8"
        />
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#0891b2" fontSize="13" fontWeight="bold">
          MCP
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#0891b2" fontSize="9">
          枢纽
        </text>
      </g>

      {/* 枢纽 → 右：工具侧 */}
      {tools.map((t, i) => {
        const y = 45 + i * 60;
        const path = `M ${cx + 36} ${cy} Q 200 ${y} 236 ${y}`;
        return (
          <g key={t}>
            <path d={path} fill="none" stroke="#059669" strokeOpacity="0.45" strokeWidth="1.3" className="svg-dash" style={{ animationDelay: `${0.15 + i * 0.3}s` }} />
            {/* 流动数据粒子 */}
            <circle r="2.2" fill="#059669" opacity="0.85">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={path} begin={`${0.4 + i * 0.7}s`} />
            </circle>
            <rect x="236" y={y - 15} width="66" height="30" rx="7" fill="#ffffff" stroke="#059669" strokeOpacity="0.55" strokeWidth="1.2" />
            <text x="269" y={y + 4} textAnchor="middle" fill="#059669" fontSize="11">
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
    { x: 24, w: 62, label: "文档库", color: "#2563eb" },
    { x: 106, w: 62, label: "切块", color: "#7c3aed" },
    { x: 188, w: 66, label: "向量库", color: "#2563eb" },
    { x: 264, w: 50, label: "LLM", color: "#059669" },
  ];
  const flow1 = "M 86 73 L 104 73";
  const flow2 = "M 168 73 L 186 73";
  const queryFlow = "M 221 135 L 221 98";
  const bypassFlow = "M 137 94 Q 137 130 240 96";

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" role="img" aria-label="RAG 检索流水线示意">
      {/* 流水线主体 */}
      {stages.map((s, i) => (
        <g key={s.label} className="svg-float" style={{ animationDelay: `${i * 0.4}s` }}>
          <rect x={s.x} y="52" width={s.w} height="42" rx="9" fill="#ffffff" stroke={s.color} strokeOpacity="0.7" strokeWidth="1.3" />
          <text x={s.x + s.w / 2} y="78" textAnchor="middle" fill={s.color} fontSize="12">
            {s.label}
          </text>
        </g>
      ))}

      {/* 文档库里的页 */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={36 + i * 12} y={40 - i * 3} width="14" height="18" rx="2" fill="#2563eb" opacity={0.25 + i * 0.15} className="svg-float" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      {/* 切块里的小块 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={114 + (i % 2) * 18} y={94 - Math.floor(i / 2) * 0} width="12" height="12" rx="2" fill="#7c3aed" opacity={0.3 + i * 0.12} className="svg-float" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {/* 向量库里的向量点 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={202 + (i % 3) * 16} cy={i < 3 ? 104 : 94} r="2.5" fill="#2563eb" opacity={0.4 + i * 0.1} className="svg-glow" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}

      {/* 箭头 + 流动粒子 */}
      {[
        { x1: 86, x2: 104, c: "#2563eb", d: flow1 },
        { x1: 168, x2: 186, c: "#7c3aed", d: flow2 },
      ].map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1="73" x2={a.x2} y2="73" stroke={a.c} strokeWidth="1.5" className="svg-dash" />
          <path d={`M ${a.x2} 68 L ${a.x2 + 8} 73 L ${a.x2} 78 Z`} fill={a.c} opacity="0.8" />
          <circle r="2" fill={a.c} opacity="0.9">
            <animateMotion dur="1.4s" repeatCount="indefinite" path={a.d} begin={`${i * 0.5}s`} />
          </circle>
        </g>
      ))}

      {/* top-k 召回：向量库 → LLM（高亮） */}
      <g>
        <path d="M 254 66 Q 260 40 278 46 L 286 52" fill="none" stroke="#059669" strokeWidth="1.6" className="svg-data-flow" />
        <text x="252" y="34" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">
          top-k 召回
        </text>
      </g>
      {/* 旁路：切块 → LLM 的注入线 */}
      <g>
        <path d={bypassFlow} fill="none" stroke="#059669" strokeOpacity="0.35" strokeWidth="1.2" className="svg-dash" />
        <circle r="2" fill="#059669" opacity="0.7">
          <animateMotion dur="2.6s" repeatCount="indefinite" path={bypassFlow} />
        </circle>
      </g>

      {/* 底部：提问进入向量库 */}
      <g>
        <circle cx="221" cy="150" r="15" fill="#ffffff" stroke="#db2777" strokeOpacity="0.7" strokeWidth="1.2" className="svg-breathe" />
        <text x="221" y="155" textAnchor="middle" fill="#db2777" fontSize="12" fontWeight="bold">
          ?
        </text>
        <text x="248" y="155" fill="#db2777" fontSize="10">
          提问向量化
        </text>
        <line x1="221" y1="135" x2="221" y2="98" stroke="#db2777" strokeOpacity="0.5" strokeWidth="1.3" className="svg-dash" />
        <circle r="2" fill="#db2777" opacity="0.85">
          <animateMotion dur="1.2s" repeatCount="indefinite" path={queryFlow} />
        </circle>
      </g>

      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="11">
        开卷考试：先检索、再生成、附引用
      </text>
      <text x="160" y="216" textAnchor="middle" fill="#94a3b8" fontSize="10">
        质量上限由「切块与召回」决定，而非生成端
      </text>
    </svg>
  );
}
