export type StackItem = {
  id: string;
  icon: string;
  name: string;
  en: string;
  color: string;
  tagline: string;
  what: string;
  how: string[];
  pitfalls: string[];
};

export const STACK_A: StackItem[] = [
  {
    id: "loop",
    icon: "🔄",
    name: "Agent 循环",
    en: "Agent Loop",
    color: "#7c3aed",
    tagline: "整个 Agentic AI 的心脏：一段 while 循环",
    what:
      "Agent 的本质小到惊人：while(未完成) { 上下文 → 模型 → 工具调用 → 结果回填 }。模型只负责「决定下一步」，循环体负责让决定真实发生。所有 Agent 框架（LangChain、Manus、Claude Code）都是这段循环的工程化包装。",
    how: [
      "终止条件三件套：模型主动声明完成（task_complete 工具）、达到步数/预算上限、需要人工输入时挂起",
      "每轮都要「观测回填」：工具结果必须进入下一轮的上下文，否则模型在盲飞",
      "失败处理：工具报错也回填（模型看到报错能自我纠正），而不是让循环直接崩掉",
      "预算守卫：max_turns、token 上限、费用上限——没有守卫的循环会转成碎钞机",
    ],
    pitfalls: [
      "死循环：模型反复调用同一个失败工具 → 需要重复检测与强制升级/求助机制",
      "过早终止：模型「宣布完成」但任务没做完 → 关键步骤要加验证工具（跑测试、读回显）",
    ],
  },
  {
    id: "tools",
    icon: "🔧",
    name: "工具与函数调用",
    en: "Function Calling / Tools",
    color: "#d97706",
    tagline: "模型的手：从「说」到「做」的标准化接口",
    what:
      "Function Calling 是 2023 年起形成的标准协议：你把工具的名称、用途、JSON Schema 参数描述发给模型；模型不直接执行，而是输出一个结构化的 tool_call（JSON）；由你的代码执行后把结果作为 tool_result 回填。模型是「点菜的人」，harness 是「厨房」。",
    how: [
      "工具定义 = 给模型看的 API 文档：name + description + JSON Schema 参数（含枚举、必填、说明）",
      "模型输出 tool_use JSON → harness 校验参数 → 执行 → 把结果（成功或报错）回填上下文",
      "并行工具调用：一个轮次发多个独立调用（读 3 个文件一次完成），大幅减少循环轮数",
      "工具集设计原则：语义正交（一个工具一件事）、描述信息密度高、错误消息可指导修正、幂等可重试",
    ],
    pitfalls: [
      "工具太多 → 模型选择困难、误选率高；按任务动态挂载子集比全家桶更好",
      "返回值塞一大坨原文 → 污染上下文；应返回压缩、定向的信息（行号、摘要、只回相关字段）",
      "无副作用的读工具和有副作用的写工具不加区分 → 权限失控的起点",
    ],
  },
  {
    id: "mcp",
    icon: "🔌",
    name: "模型上下文协议",
    en: "MCP · Model Context Protocol",
    color: "#0891b2",
    tagline: "AI 应用的 USB-C：把 N×M 集成变成 N+M",
    what:
      "Anthropic 2024.11 发布的开放协议，标准化模型与外部工具/数据源的连接方式。基于 JSON-RPC 2.0，client-server 架构——Host（Claude Code、IDE、你的应用）内嵌 MCP Client，与独立的 MCP Server（文件系统、GitHub、数据库、浏览器……）通信。没有 MCP：M 个应用 × N 个工具要写 M×N 个适配器；有了 MCP：工具方写一次 Server，应用方实现一次 Client，即插即用。",
    how: [
      "三类能力原语：Tools（模型可调用的动作）、Resources（应用可读取的数据）、Prompts（预置提示模板）",
      "传输层：本地用 stdio（子进程），远程用 Streamable HTTP；协议消息与传输解耦",
      "安全模型：Human-in-the-loop 是设计核心——敏感调用要用户确认，Server 之间默认隔离",
      "生态：2025 年 OpenAI、Google 相继宣布兼容，MCP 成为事实上的工具连接标准",
    ],
    pitfalls: [
      "工具描述质量参差 → 服务端描述直接进模型上下文，写得差就拖累所有调用",
      "命名冲突与上下文膨胀：挂 20 个 MCP server 可能吃掉几千 token 的工具定义",
      "供应链风险：第三方 MCP Server 是被注入指令的潜在入口，来源要审",
    ],
  },
];

export const STACK_B: StackItem[] = [
  {
    id: "memory",
    icon: "🧠",
    name: "记忆系统",
    en: "Memory",
    color: "#db2777",
    tagline: "给没有海马体的模型装上长期记忆",
    what:
      "LLM 的「记忆」只有上下文窗口——会话结束即失忆。Memory 系统解决「跨会话、跨任务记住并回忆」：短期记忆靠工作窗口与任务备忘（scratchpad），长期记忆靠外部存储（向量库/数据库/记忆文件），按需检索回填。Claude Code 的 CLAUDE.md/auto-memory、ChatGPT 的 Memory、MemGPT/Letta 的分层记忆都是这一层的产品化。",
    how: [
      "写入时机：不是什么都记——记「用户偏好、项目决策、失败教训」，不记一次性中间结果",
      "读出时机：每轮/每会话开始，按当前任务检索相关记忆注入系统提示（recall → inject）",
      "组织方式：按主题分文件/条目 + 索引（MEMORY.md 式目录），优于单一巨库",
      "生命周期：记忆要可修订、可过期、可删除——错误记忆比没有记忆更糟",
    ],
    pitfalls: [
      "记忆污染：一次错误写入被反复召回，错误随时间放大 → 需要置信度与来源标注",
      "全文塞上下文 vs 检索注入：前者烧 token 且稀释注意力，后者召回质量决定一切",
      "隐私与遗忘权：长期记忆是数据合规雷区，需 retention 策略",
    ],
  },
  {
    id: "context",
    icon: "📐",
    name: "上下文控制",
    en: "Context Control / Engineering",
    color: "#059669",
    tagline: "有限窗口里的信息调度艺术",
    what:
      "上下文窗口是 Agent 唯一的工作记忆，也是最容易浪费的资源。上下文工程 = 决定「每一轮把什么放进窗口」：系统提示、工具定义、历史消息、检索内容、工具结果的取舍与压缩。Anthropic 的四字诀：Write（落盘卸载）、Select（检索注入）、Compress（摘要压缩）、Isolate（子代理隔离）。",
    how: [
      "预算分配：固定开销（系统提示+工具定义）先算账，动态内容按优先级排队",
      "压缩（compaction）：历史满时对旧轮次做结构化摘要，保留决策与教训、丢弃原文",
      "卸载：把中间产物写到文件/状态存储，上下文里只留指针（路径/ID）",
      "子代理隔离：给子任务独立窗口，只回传结论——主窗口保持干净",
    ],
    pitfalls: [
      "context rot：窗口越满，注意力越稀释，模型对中间内容的记忆呈 U 型（中间盲区）",
      "压缩失真：摘要丢掉关键约束 → 模型后期违反开头的要求而不自知",
      "无界增长：工具结果不设限，几轮就把窗口吃满",
    ],
  },
  {
    id: "rag",
    icon: "📚",
    name: "知识库与向量索引",
    en: "RAG / Vector Index",
    color: "#2563eb",
    tagline: "旁路的知识：不改模型，给它外接图书馆",
    what:
      "RAG（检索增强生成）= 回答前先从外部知识库检索相关片段，塞进上下文再生成。向量索引是它的核心基建：文本切块 → embedding 模型编码成向量 → 存入向量数据库（HNSW/IVF 索引）→ 查询时把问题也编码成向量，按余弦相似度召回 top-k。它解决两个模型原生缺陷：知识过时（训练截止之后的事它不知道）、知识私有（你的内部文档不在权重里）。",
    how: [
      "五步流水线：加载 → 切块（chunking，带重叠）→ embedding → 索引存储 → 检索注入",
      "切块是第一杠杆：按语义边界（标题/段落）切，块 256~1024 token、重叠 10~20%",
      "混合检索：向量（语义）+ BM25（关键词）双路召回再融合（RRF），比单路召回强一大截",
      "进阶：重排（rerank 精排）、查询改写（HyDE/多查询）、GraphRAG（知识图谱旁路）、Agentic RAG（让 Agent 自己决定查不查、查什么）",
    ],
    pitfalls: [
      "检索失败但模型仍会答 → 召回质量差时幻觉率上升；要给模型「知识库里没有」的出口",
      "embedding 维度不是越大越好，领域适配（微调 embedding）常比换大模型更有效",
      "索引不更新 = 知识过期：文档变更要触发重建/增量索引",
    ],
  },
];
