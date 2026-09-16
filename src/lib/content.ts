import type { Concept, TimelineItem, PromptCard } from "./types";
import { TRANSFORMER } from "./content-transformer";
import { LLM } from "./content-llm";
import { MCP } from "./content-mcp";
import { RAG } from "./content-rag";

export type { Concept, TimelineItem, PromptCard } from "./types";
export { TRANSFORMER, LLM, MCP, RAG };

export const AGENT: Concept = {
  id: "agent",
  order: "03",
  name: "Agent 智能体",
  tagline: "从「会说话」到「会做事」",
  period: "2023–2025",
  color: "violet",
  summary:
    "LLM 本身只会生成文本。Agent = LLM + 工具 + 循环：模型在循环中决定调用什么工具（搜索、写文件、跑命令），拿到结果再继续思考，直到完成任务。2025 年被广泛称为「Agent 元年」。",
  points: [
    {
      title: "Agent Loop（智能体循环）",
      body: "收集上下文 → 模型思考 → 调用工具 → 观察结果 → 继续或结束。这个循环是所有 Agent 框架的心脏，下方有可交互的任务模拟器。",
    },
    {
      title: "工具调用（Tool Use）",
      body: "模型输出结构化的「工具调用请求」，执行环境跑完把结果塞回上下文。Function Calling / MCP 让工具接入标准化。",
    },
    {
      title: "ReAct 与规划",
      body: "推理（Reasoning）与行动（Acting）交替进行：先想一步、做一步、看结果、再想。配合任务分解，能处理多步骤复杂任务。",
    },
  ],
  deep: [
    {
      title: "错误复利：Agent 为什么在半途崩溃",
      body: "每步 95% 正确率，20 步串联后只剩 0.95²⁰ ≈ 36%。Agent 的失败不是单点错误，而是误差沿轨迹累积放大。对策：每步可验证（测试/断言）、失败即回滚、把长任务切成带验收的短里程碑。",
    },
    {
      title: "上下文窗口 = 工作记忆上限",
      body: "Agent 没有持久大脑，它能推理的只有窗口里的东西。跑久了上下文塞满 → 关键信息被挤出或被压缩失真（context rot）。子代理架构的动机：让每个子任务有干净、专注的上下文。",
    },
    {
      title: "ReAct → Reflexion → Plan-and-Execute",
      body: "ReAct 让模型「说出来再行动」；Reflexion 加了失败后的自我语言化反思并写入记忆；Plan-and-Execute 先出全局计划再逐步执行，牺牲灵活性换稳定。没有银弹——简单任务 ReAct 足够，复杂长任务需要显式规划。",
    },
    {
      title: "编排模式：单循环、多角色、图执行",
      body: "单 agent 循环（够用且可调试）→ 多 agent 分工（orchestrator-worker、辩论、 critic）→ 有向图/状态机编排（LangGraph）。反直觉事实：多 agent 常带来协调开销与错误传播，Anthropic、Cognition 都写过「先别上多 agent」。",
    },
    {
      title: "评测：从静态题库到可验证环境",
      body: "SWE-bench（真实 GitHub issue）、WebArena/GAIA（网页与工具）、Terminal-Bench（命令行）。核心难点是 Agent 输出多样、路径不唯一——必须判「目标达成」而非「字符串匹配」，且环境要可复现、可回滚。",
    },
    {
      title: "安全：提示注入即 RCE",
      body: "当 Agent 能读网页/邮件、又能执行命令，被污染的数据就能变成指令（lethal trifecta：私有数据 + 不可信内容 + 对外通道）。防御靠权限最小化、人审高危动作、工具层强制约束、把外部内容当数据而非指令。",
    },
  ],
  formulas: [
    {
      title: "端到端成功率衰减",
      expr: "P(success) = ∏ᵢ P(stepᵢ | steps₁…ᵢ₋₁)",
      explain: "整条任务轨迹成功 = 每一步成功的连乘。单步再准，步数一多概率就指数塌方——这解释了为什么 Agent 在长任务上「差最后一步」，也是错误复利的数学形式。",
    },
  ],
  debate: {
    pro: "「Agentic 是必然方向」——纯聊天已见顶，真正价值在替人完成多步工作；工具 + 循环是通向自动化的最短路径",
    con: "「多数『Agent』只是昂贵的 if-else」——能用固定 workflow 就别用自主 agent；可预测性、成本、安全都反对过度自主。行业在『自主性 vs 可控性』之间反复拉扯",
  },
  analogy:
    "LLM 是一位顾问，Agent 是给他配了电脑、电话和执行权——不只是给建议，而是直接把活干完。",
  keyFacts: ["2025 = Agent 元年", "核心 = 循环 + 工具", "错误沿轨迹复利累积", "Manus / Claude Code / Devin"],
  svg: "agent",
};

export const HERMES: Concept = {
  id: "hermes",
  order: "04",
  name: "Hermes",
  tagline: "开源模型界的信使之神",
  period: "2023–2025 · Nous Research",
  color: "pink",
  summary:
    "Nous Research 的开源模型系列，名字取自希腊神话信使之神。Hermes 2/3 基于 Llama 微调，以「可引导性（steerability）」著称；Hermes 4（2025.8）引入混合推理模式：同一个模型既可秒答，也可进入长思维链深度推理。",
  points: [
    {
      title: "可引导性（Steerability）",
      body: "对系统提示词极度服从——你定义的人设、语气、输出格式它都照做，是定制 Agent 底座模型的热门选择。",
    },
    {
      title: "混合推理（Hybrid Reasoning）",
      body: "Hermes 4 用特殊标记切换「快思」与「慢想」：简单问题直接答，复杂问题先输出  长思维链再作答，一个模型两种脑。",
    },
    {
      title: "开放权重",
      body: "全部在 Hugging Face 开源（Llama 底座，8B/14B/70B/405B），可本地部署、可商用改造，社区生态活跃。",
    },
  ],
  deep: [
    {
      title: "可引导性从哪来：数据配比 + 系统提示随机化",
      body: "Hermes 的微调数据刻意混入大量「带多样化 system prompt 的对话」，并做 persona/风格扰动。模型学会「把系统提示当硬约束」而非可忽略的建议——这正是做 Agent 底座最需要的品质：你能用提示词真正「编程」它。",
    },
    {
      title: "混合推理的实现：think 标记 + 推理预算",
      body: "在特殊 token 之间生成中间推理，再由 harness 决定是否展示/丢弃。工程上要做的是「推理预算」控制——允许模型按需分配思考长度（低/中/高），把 token 花在刀刃上。这与 OpenAI o 系列、Claude 的 extended thinking 是同一思路的开源实现。",
    },
    {
      title: "合成数据 + 自我博弈（self-play）",
      body: "Nous 的代表作是 Evol-Instruct 式数据进化与 self-play：让模型互当出题人/答题人，批量生成高质量推理数据。开源模型能以极低成本逼近闭源能力，靠的往往就是数据配方而非算力蛮力。",
    },
    {
      title: "开源 vs 闭源的真实差距",
      body: "差距在收窄但不在「模型本身」：闭源领先来自 RLHF 数据质量、评测流水线、以及 harness（工具、检索、执行环境）。70B~405B 开源模型套上强 harness，在编码/Agent 任务上已能对标顶级闭源——代价是你得自己搭这套工程。",
    },
    {
      title: "为什么选它做本地 Agent 底座",
      body: "可审计（权重在手里）、可微调（贴自己的工具格式）、无速率限制、数据不出域。配合 GGUF/AWQ 量化 + vLLM，一张 4090 能跑量化的 Hermes，隐私敏感的自动化场景这是杀手级组合。",
    },
  ],
  formulas: [
    {
      title: "混合推理的两种「计算分配」",
      expr: "answer = Direct(x)  或  Reason(x) = decode(  think  ),  |think| 受预算约束",
      explain: "同一个模型两条路径：简单题走 Direct（几乎零额外 token），难题展开思维链。核心权衡是「思考预算」——多花 token 换更高准确率，需要按问题难度动态分配。",
    },
  ],
  debate: {
    pro: "「开放权重是 AI 的基础设施层」——可本地部署、可微调、不被厂商锁定，Hermes 类模型让能力真正民主化",
    con: "「开源追的是昨天的闭源」——顶级 RLHF 与工具生态仍在闭源侧；且『开源』往往指开放权重而非开放数据/训练码，可复现性存疑",
  },
  analogy:
    "Hermes 像一位「听话且会深思」的员工：普通问题秒回，难题会主动进入冥想模式写草稿，且完全按你的章程办事。",
  keyFacts: ["Nous Research 出品", "Hermes 4 = 混合推理", "开放权重可本地部署", "可引导性=能用提示词编程模型"],
  svg: "hermes",
};

export const HARNESS: Concept = {
  id: "harness",
  order: "05",
  name: "Harness",
  tagline: "把模型变成员工的「马具」",
  period: "2024–2025 · 工程实践",
  color: "amber",
  summary:
    "Harness（马具/脚手架）是包裹在 LLM 外面的工程系统：负责 Agent 循环、工具分发、上下文管理、权限门控、错误重试。同一个模型，套上不同的 harness，表现天差地别——Claude Code、Codex CLI 都是 harness 的代表作品。",
  points: [
    {
      title: "循环与工具分发",
      body: "Harness 实现标准的 agent loop：把模型的工具调用请求路由给真实执行器（终端、文件系统、浏览器），再把结果回填给模型。",
    },
    {
      title: "上下文工程",
      body: "长任务必然撑爆上下文窗口。现代 harness 用压缩（compaction）、子代理（sub-agent）、备忘录（note-taking）等手段管理记忆。",
    },
    {
      title: "权限与安全门控",
      body: "高危操作（删文件、发网络请求）需要人工审批；计划模式（plan mode）让模型先出方案、人批准再动手。",
    },
  ],
  deep: [
    {
      title: "模型 ≠ 产品的证据",
      body: "同一个模型放进不同 harness，编码评测分数能差几十个点——差距来自工具描述写得好不好、反馈及不及时、上下文喂得对不对。所谓『换模型』很多其实是『换 harness』，这是 2025 最重要的工程认知。",
    },
    {
      title: "上下文工程四大件",
      body: "Write（把中间结论落盘/写备忘，卸载出窗口）· Select（检索把对的片段放进来）· Compress（对旧对话摘要式压缩，即 compaction）· Isolate（子代理各占独立窗口，只回传结论）。本质是在有限注意力预算下做「信息调度」。",
    },
    {
      title: "工具设计是一门学科",
      body: "工具是模型与世界的接口，描述即提示词。好工具：语义清晰、参数正交、返回信息密度高、错误可恢复、幂等。差工具（返回一大坨无关文本）会污染上下文、诱导模型误判。『给模型一把剪刀』远好于『给它一个瑞士军刀+说明书』。",
    },
    {
      title: "护栏：机制 vs 政策",
      body: "权限系统用『机制』（sandbox、allowlist、human-in-the-loop、git 回滚点）而非只靠『政策』（提示词里写别乱删）。Anthropic 的 Claude Code 用 permission modes + 危险命令确认；沙箱化执行是不可信环境的底线。",
    },
    {
      title: "可观测性与『黄灯』问题",
      body: "Agent 会自信地做错误的事（confidently wrong），不像程序会崩。需要 tracing（每步 input/output/tool）、成本与 token 监控、以及『及时交还控制权』的兜底——找不到路时要会停下求助，而不是原地打转。",
    },
    {
      title: "Scaffold vs Harness 的措辞",
      body: "学界 paper 常说 scaffold（脚手架，为评测临时搭的薄壳），工程界说 harness（马具，长期承载生产的厚系统）。含义高度重叠：都指『模型之外、决定实际表现的整套软件』。",
    },
  ],
  formulas: [
    {
      title: "系统能力分解",
      expr: "Product_能力 = Model_能力 × Harness_质量  （近似，且对长任务 Harness 权重更高）",
      explain: "模型是能力的上限，harness 决定你实际能用到的比例。任务越长、越依赖外部动作，harness 对最终结果的杠杆越大——这解释了为何『同模型、不同产品』体验差异巨大。",
    },
  ],
  debate: {
    pro: "「简单可组合 > 复杂框架」——裸 API + 手写循环（Claude Code 早期、Codex CLI）常常胜过重框架；harness 应与模型协同设计",
    con: "「框架终将收敛为运行时」——LangGraph/Agent SDK 也在补上下文管理、可观测、护栏；争论焦点已从『要不要工程』变成『自己造还是用现成的』",
  },
  analogy:
    "模型是千里马，harness 是马具与缰绳：不改变马的品种，却决定了它能不能拉车、会不会翻车。",
  keyFacts: ["Scaffold ≈ Harness", "Claude Code / Codex CLI", "上下文工程四件套", "同模型不同 harness 天差地别"],
  svg: "harness",
};

export const CONTENT: Concept[] = [TRANSFORMER, LLM, AGENT, HERMES, HARNESS, MCP, RAG];

export const TIMELINE: TimelineItem[] = [
  { year: "2017", title: "Transformer 诞生", detail: "《Attention Is All You Need》，自注意力架构奠基", tag: "架构" },
  { year: "2018–20", title: "预训练时代", detail: "GPT-1/2/3 + BERT，Scaling Law 显现威力", tag: "预训练" },
  { year: "2022", title: "ChatGPT 引爆", detail: "RLHF 对齐 + 对话形态，两个月用户破亿", tag: "对齐" },
  { year: "2023", title: "多模态与百模大战", detail: "GPT-4 看图说话；文心一言/通义千问等百花齐放", tag: "多模态" },
  { year: "2024", title: "推理模型兴起", detail: "o1 开启「慢思考」；Sora 文生视频惊艳全球", tag: "推理" },
  { year: "2025", title: "Agent 元年", detail: "DeepSeek-R1 开源震动业界；Manus/Claude Code 让 AI 从说到做", tag: "Agent" },
];

export const PROMPTS: PromptCard[] = [
  {
    title: "Transformer 注意力图解",
    desc: "信息流让每个 token 彼此相连，高亮 Q/K/V 路径",
    prompt:
      "科技信息图风格插画，深蓝背景，中央是发光的神经网络连接图，多个 token 节点彼此用彩色曲线连接，每条曲线粗细代表注意力权重，曲线末端有 Q、K、V 三个发光字母标签，赛博插画风，干净构图，无文字段落，4k",
  },
  {
    title: "Agent 循环海报",
    desc: "适合做章节头图或 PPT 配图",
    prompt:
      "扁平插画海报，一个机器人站在循环传送带中央，传送带四个站点分别标注「思考→工具→观察→再思考」，机器人手上拿着扳手，周围漂浮代码符号与齿轮，紫色霓虹配色，深色背景，极简风格，无其他文字",
  },
  {
    title: "Hermes 信使之神",
    desc: "拟人化呈现混合推理的双面性",
    prompt:
      "数字插画，希腊信使之神 Hermes 的赛博朋克化身，带翼凉鞋喷出数据流光轨，左手持双蛇杖缠绕成 USB 线，右手举着一枚发光的双面面具（一面平静=直接回答，一面沉思=思维链），粉紫霓虹打光，深蓝夜空背景，史诗感构图",
  },
  {
    title: "Harness 马具隐喻",
    desc: "讲清「模型 ≠ 产品」的关键一环",
    prompt:
      "概念插画，一匹由发光线条构成的全息机械马，身上佩戴精致的深金色马具与缰绳，缰绳另一端连着一个悬浮的机械操控台，操控台屏幕显示代码与开关，琥珀金与深蓝配色，博物馆展陈打光，极简未来主义",
  },
  {
    title: "MCP 万能接口",
    desc: "AI 应用的 USB-C：N×M 集成变 N+M",
    prompt:
      "科技概念插画，深色背景中央一个发光的六边形枢纽模块，标着「MCP」，左右两侧各有多条不同颜色的数据线缆接入：左侧是机器人、电脑、手机图标（应用侧），右侧是文件夹、齿轮、数据库、地球图标（工具侧），线缆接口是统一的 USB-C 造型，青色霓虹光效，等距视角，扁平插画风，无文字段落",
  },
  {
    title: "RAG 外接图书馆",
    desc: "旁路知识库：给冻结的大脑开卷考试",
    prompt:
      "概念插画，深蓝色场景中一个发光的半透明机器人头部，后脑勺通过一根发光光缆连接到一座悬浮的环形图书馆，书架上漂浮着许多发光书页，其中几页化作光点沿光缆飞入机器人头部，头顶浮现问号变感叹号的符号，蓝色与金色配色，赛博插画风，干净构图",
  },
];
