# 更新日志

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.2.0] - 2026-09-16

### 新增
- MCP 模型上下文协议：完整概念章节 + 枢纽汇聚 SVG 动画图解
- RAG 检索增强生成：完整概念章节 + 检索流水线 SVG 动画图解
- RAG 交互演示（`#rag-demo`）：三个真实场景下「闭卷直答 vs 开卷 RAG」对比动画，含向量索引 top-k 召回可视化
- 六大工程组件总览（Agent Stack）正式接入页面与导航：Loop · Function Call · Tools · MCP · Memory · Context Control · RAG/向量索引
- 所有概念章节新增三大内容板块渲染：深度专栏（可展开）、关键公式、正反方辩论
- 图解工坊新增「MCP 万能接口」「RAG 外接图书馆」两张生图提示词卡

### 修复
- 概念章节的 deep / formulas / debate 字段此前未被任何组件渲染，现已在 ConceptSection 完整呈现
- content.ts 中 `TimelineItem` / `PromptCard` 类型未导入导致的编译错误

### 开源基建
- README（功能地图 / 快速开始 / 贡献流程 / Roadmap）、MIT LICENSE
- GitHub 模板：issue ×3、PR 模板、CI 工作流（tsc + lint + build）
- CONTRIBUTING / CODE_OF_CONDUCT / CHANGELOG
- SEO 与 Open Graph 元数据补全

## [0.1.0] - 2026-09-15

### 新增
- 五个概念章节：Transformer（注意力图解 + 交互）、LLM（温度实验台）、Agent（循环演示）、Hermes、Harness
- Agent 循环实时演示动画
- Three.js 全息粒子背景、发展时间线、图解工坊
