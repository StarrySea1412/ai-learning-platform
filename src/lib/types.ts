export type Concept = {
  id: string;
  order: string;
  name: string;
  tagline: string;
  period: string;
  color: "cyan" | "blue" | "violet" | "pink" | "amber";
  summary: string;
  points: { title: string; body: string }[];
  deep: { title: string; body: string }[];
  formulas: { title: string; expr: string; explain: string }[];
  debate: { pro: string; con: string };
  analogy: string;
  keyFacts: string[];
  svg: "transformer" | "llm" | "agent" | "hermes" | "harness" | "mcp" | "rag";
  interactive?: "attention" | "temperature";
};

export type TimelineItem = { year: string; title: string; detail: string; tag: string };
export type PromptCard = { title: string; desc: string; prompt: string };
