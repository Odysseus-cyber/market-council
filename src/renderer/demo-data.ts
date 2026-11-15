// Human-authored display fixtures. These are neither API responses nor real usage.
export type DemoModel = "deepseek" | "qwen";

export interface DemoCall {
  id: string;
  model: DemoModel;
  name: string;
  initial: string;
  color: string;
  inputTokens: number;
  outputTokens: number;
  headline: string;
  sections: { title: string; body: string }[];
  takeaway: string;
}

export const demoCalls: readonly DemoCall[] = [
  {
    id: "DEMO-001",
    model: "deepseek",
    name: "DeepSeek",
    initial: "D",
    color: "#5bd4d4",
    inputTokens: 100,
    outputTokens: 40,
    headline: "先建立研究框架，再寻找证据",
    sections: [
      {
        title: "拆开假设",
        body: "把利率路径、盈利预期和估值水平分开记录。每个判断都附上来源与日期，暂时不把市场叙事当作已确认的事实。",
      },
      {
        title: "缩小研究范围",
        body: "选一家公司，整理财报、现金流与管理层指引。先明确想回答的问题，再决定还缺哪些材料。",
      },
    ],
    takeaway: "下一步：列出三条研究假设，并标记待核实的证据。",
  },
  {
    id: "DEMO-002",
    model: "qwen",
    name: "千问 Qwen",
    initial: "Q",
    color: "#b39af4",
    inputTokens: 80,
    outputTokens: 20,
    headline: "也要为相反的解释留出位置",
    sections: [
      {
        title: "追问反方条件",
        body: "如果利率变化与预期不同，原来的判断还成立吗？如果公司业绩没有改善，又有哪些证据会让你重新考虑？",
      },
      {
        title: "区分观察与行动",
        body: "把值得关注的信号与尚待确认的条件分别写下。资料不足时保留问题，不急着把讨论变成入场结论。",
      },
    ],
    takeaway: "下一步：为每条假设补上一项可能推翻它的观察。",
  },
];

export const totalTokens = (call: DemoCall) =>
  call.inputTokens + call.outputTokens;
export const demoTotals = demoCalls.reduce(
  (sum, call) => ({
    input: sum.input + call.inputTokens,
    output: sum.output + call.outputTokens,
    total: sum.total + totalTokens(call),
  }),
  { input: 0, output: 0, total: 0 },
);
export const modelShare = (call: DemoCall) =>
  ((totalTokens(call) / demoTotals.total) * 100).toFixed(2);

export const demoQuestion =
  "如果市场开始讨论降息，研究成长股时，我应该先核对哪些信息？请分别给出分析框架与反方问题。";
