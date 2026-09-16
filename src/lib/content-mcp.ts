import type { Concept } from "./types";

export const MCP: Concept = {
  id: "mcp",
  order: "06",
  name: "MCP 模型上下文协议",
  tagline: "AI 应用的 USB-C：N×M 集成变 N+M",
  period: "2024.11– · Anthropic",
  color: "cyan",
  summary:
    "Anthropic 2024 年 11 月发布的开放协议，标准化「模型 ↔ 外部工具/数据源」的连接方式——像 USB-C 统一了充电口。此前 M 个应用接 N 个工具要写 M×N 个适配器；有了 MCP，工具方写一次 Server、应用方实现一次 Client，即插即用。2025 年 OpenAI、Google 相继宣布兼容，MCP 成为事实上的工具连接标准。",
  points: [
    {
      title: "标准化连接（client-server）",
      body: "基于 JSON-RPC 2.0：Host（Claude Code、IDE、你的应用）内嵌 MCP Client，与独立的 MCP Server（文件系统、GitHub、数据库、浏览器……）通信。工具方只需实现一次 Server。",
    },
    {
      title: "三类能力原语",
      body: "Tools：模型可调用的动作（发请求、写文件）；Resources：应用可读取的数据（文件、记录，URI 标识）；Prompts：预置提示模板。另有 Sampling——Server 反过来请求宿主的 LLM 补全，形成双向协作。",
    },
    {
      title: "传输与生态",
      body: "协议消息与传输层解耦：本地用 stdio（子进程），远程用 Streamable HTTP。2025 年生态爆发，社区 Server 数以千计，OpenAI、Google 相继兼容——「写一次、到处接」成立了。",
    },
  ],
  deep: [
    {
      title: "M×N → N+M 的经济学",
      body: "没有协议时，M 个 AI 应用各自适配 N 个工具，适配器数量随两边增长相乘爆炸；有了 MCP，成本变成相加。这是典型的「标准化解网络效应难题」：USB-C、HTTP、SQL 都是同一剧本——先行者让渡一点灵活性，换整个生态的接入成本坍缩。",
    },
    {
      title: "与 Function Calling 的关系",
      body: "两层互补而非竞争：Function Calling 是「模型如何表达要调工具」的模型侧约定；MCP 是「工具从哪来、怎么接进来」的连接层标准。MCP Server 暴露的工具，最终仍以工具定义（JSON Schema）的形式喂给模型——MCP 管「进货」，FC 管「下单」。",
    },
    {
      title: "安全模型：Human-in-the-loop 是设计核心",
      body: "敏感调用默认要用户确认；Server 之间默认隔离；外部内容当数据而非指令。警惕两件事：提示注入（被污染的数据经 MCP 流进上下文）与工具描述污染（Server 的描述直接进模型上下文，恶意描述可诱导模型误操作）——供应链要审，来源要管。",
    },
    {
      title: "实战坑：上下文膨胀与命名冲突",
      body: "挂 20 个 MCP Server 可能吃掉几千 token 的工具定义——预算被固定开销吞掉。对策：按任务动态挂载子集、压缩工具描述、统一命名空间。工具描述质量参差是另一坑：写得差就拖累所有经过它的调用。",
    },
    {
      title: "握手与能力协商",
      body: "initialize 阶段双方交换协议版本与能力清单（支持哪些原语、是否支持通知），再进入正常通信。这套协商让协议可以平滑演进——老 Client 也能和新 Server 谈出共同可用的功能子集。",
    },
    {
      title: "MCP 的边界：连接 ≠ 信任",
      body: "MCP 解决「能不能接上」，不解决「该不该信任」。权限最小化、高危操作人审、输出内容消毒仍在应用层。把 MCP 当「即插即用的电源」而非「免检的信任证书」，是使用它的正确姿势。",
    },
  ],
  formulas: [
    {
      title: "集成成本坍缩",
      expr: "适配器数：无协议 M×N  →  有协议 M+N",
      explain: "应用数 M 与工具数 N 的增长从「相乘」变「相加」。M=N=100 时，从 10000 个适配器降到 200 个——标准化对生态成本的杠杆是数量级的。",
    },
  ],
  debate: {
    pro: "「开放标准让工具生态民主化」——小团队写一次 Server 就能进所有主流 AI 应用；协议开放、生态爆发，事实标准已经成立",
    con: "「抽象层总有税」——简单场景直接 function calling 更轻；协议演进被 Anthropic 主导，『标准化』本身也是标准化者的权力；Server 质量与安全参差不齐",
  },
  analogy:
    "MCP 是 AI 应用的 USB-C：过去每个设备一种专用插头，现在一个口通吃——工具厂商做一次「插头」，所有应用都能用。",
  keyFacts: ["Anthropic · 2024.11", "JSON-RPC 2.0", "Tools / Resources / Prompts", "N×M → N+M"],
  svg: "mcp",
};
