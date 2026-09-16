import type { Concept } from "./types";

export const TRANSFORMER: Concept = {
  id: "transformer",
  order: "01",
  name: "Transformer",
  tagline: "一切的起点：注意力就是一切",
  period: "2017",
  color: "cyan",
  summary:
    "2017 年 Google 论文《Attention Is All You Need》提出的架构。它抛弃了 RNN 的顺序处理，用「自注意力机制」让每个词同时看见句子里所有其他词，并行计算、效果更好，成为后续所有大模型的通用底座。",
  points: [
    {
      title: "自注意力（Self-Attention）",
      body: "每个 token 通过 Q/K/V 三组矩阵计算与所有 token 的关联度，一句话里「它」指代什么，模型自己学出来。并行处理让训练速度碾压 RNN。",
    },
    {
      title: "位置编码",
      body: "注意力本身不感知顺序，需要额外注入位置信息（正弦编码 → RoPE 旋转位置编码），模型才知道「词序」。",
    },
    {
      title: "堆叠与缩放",
      body: "一层 Transformer block = 注意力 + 前馈网络 + 残差连接 + 层归一化。GPT-3 堆了 96 层，深度带来能力涌现。",
    },
  ],
  deep: [
    {
      title: "为什么除以 √d_k？",
      body: "Q·K 点积的方差随维度 d_k 线性增长，不缩放会让 softmax 进入饱和区——梯度消失，模型学不动。除以 √d_k 把方差拉回 1，这是「缩放点积注意力」中『缩放』二字的由来。",
    },
    {
      title: "多头注意力：分工而非复制",
      body: "8~128 个头各自在低维子空间学一种关系：有的追语法（主谓宾），有的追指代（『它』指向『猫』），有的只看局部相邻词。单头的注意力是平均化的模糊，多头才是高分辨率。",
    },
    {
      title: "O(n²)：原罪与军备竞赛",
      body: "注意力要算 n×n 的相关度矩阵，序列长度翻倍、计算量翻四倍——长上下文是架构级奢侈品。于是有了 MQA/GQA（多 query 共享 KV 头）、滑窗注意力、FlashAttention（I/O 感知的精确注意力）、稀疏/线性注意力等整条优化战线。",
    },
    {
      title: "KV Cache：推理的记忆术",
      body: "生成时逐 token 解码，历史 token 的 K/V 不变，缓存起来避免重算——代价是显存占用随上下文线性增长。这就是「长上下文很贵」的物理原因，也是 vLLM 的 PagedAttention（像操作系统分页一样管理 KV 显存）要解决的问题。",
    },
  ],
  formulas: [
    {
      title: "缩放点积注意力",
      expr: "Attention(Q, K, V) = softmax( QKᵀ / √d_k ) · V",
      explain:
        "Q 是「我在找什么」，K 是「我有什么」，V 是「我能给什么」。QKᵀ 算相关度，√d_k 稳定梯度，softmax 归一化成权重，最后加权求和 V——每个词的新表示就是全场信息的加和。",
    },
  ],
  debate: {
    pro: "「Transformer 是通用架构的终局」——它统一了 NLP、CV（ViT）、语音、生物（AlphaFold）甚至机器人（RT-2）",
    con: "「O(n²) 与静态权重是死路」——Mamba/SSM、MoE、神经-符号混合等后 Transformer 路线持续挑战；实际上主流选择是混合架构（Jamba、Griffin）而非彻底替代",
  },
  analogy:
    "就像把一间教室里所有学生互相连线，每个人发言时都参考全场——而不是像 RNN 那样只传话给下一位。",
  keyFacts: ["论文引用 17 万+", "所有主流 LLM 的底座", "Scaling Law 的前提", "注意力可视化是可解释性起点"],
  svg: "transformer",
  interactive: "attention",
};
