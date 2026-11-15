import { useState, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FlaskConical,
  KeyRound,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Plus,
  Send,
  Settings2,
  ShieldCheck,
  Square,
  Terminal,
  UserRound,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  demoCalls,
  demoQuestion,
  demoTotals,
  modelShare,
  totalTokens,
  type DemoCall,
} from "./demo-data";

type Page = "chat" | "tokens" | "settings";
const pages = [
  { id: "chat" as const, title: "圆桌讨论", icon: MessageSquare },
  { id: "tokens" as const, title: "Token 看板", icon: BarChart3 },
  { id: "settings" as const, title: "模型设置", icon: Settings2 },
];

function ModelAvatar({
  call,
  small = false,
}: {
  call: DemoCall;
  small?: boolean;
}) {
  return (
    <span
      className={`model-avatar ${call.model} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      {call.initial}
    </span>
  );
}

function Sidebar({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Layers3 size={20} strokeWidth={1.8} />
        </span>
        <div>
          <strong>Market Council</strong>
          <span>市场议事厅</span>
        </div>
      </div>
      <div className="workspace-label">
        个人工作空间<span>LOCAL</span>
      </div>
      <nav className="primary-nav" aria-label="主导航">
        {pages.map(({ id, title, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            aria-current={page === id ? "page" : undefined}
            onClick={() => setPage(id)}
          >
            <Icon size={17} strokeWidth={1.65} />
            <span>{title}</span>
            {page === id && <span className="active-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-rule" />
      <div className="section-label">
        讨论会话
        <Button
          variant="ghost"
          size="icon"
          disabled
          aria-label="新建会话尚未实现"
        >
          <Plus size={15} />
        </Button>
      </div>
      <button
        className={`conversation-item ${page === "chat" ? "selected" : ""}`}
        onClick={() => setPage("chat")}
      >
        <span className="conversation-dot" />
        <span>
          <strong>利率变化与成长股</strong>
          <small>固定示例会话</small>
        </span>
      </button>
      <div className="sidebar-bottom">
        <div className="prototype-note">
          <FlaskConical size={16} />
          <div>
            <strong>先看见产品的样子</strong>
            <p>
              界面原型已就位，真实模型
              <br />
              与本地记录将在后续接入。
            </p>
          </div>
        </div>
        <div className="sidebar-footer">
          <span className="profile-avatar">我</span>
          <div>
            <strong>个人研究空间</strong>
            <span>开发预览版本</span>
          </div>
          <LockKeyhole size={13} />
        </div>
      </div>
    </aside>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

function ChatPage() {
  return (
    <div className="chat-page">
      <div className="page-scroll">
        <PageHeading
          eyebrow="COUNCIL / 001"
          title="把一个问题，看得更完整"
          description="同一个话题，两种视角。让判断从充分的讨论开始。"
        >
          <div className="participant-stack">
            {demoCalls.map((call) => (
              <ModelAvatar key={call.id} call={call} small />
            ))}
            <span>2 位参与者</span>
          </div>
        </PageHeading>
        <div className="conversation-caption">
          <span>利率变化与成长股</span>
          <span className="caption-line" />
          <span>示例讨论</span>
        </div>
        <Card className="question-card">
          <div className="question-author">
            <span className="user-avatar">
              <UserRound size={16} />
            </span>
            <strong>你</strong>
            <span>提出问题</span>
          </div>
          <p>{demoQuestion}</p>
        </Card>
        <div className="answers-caption">
          <FlaskConical size={13} />
          以下内容由人工编写，用于展示界面，并非模型实际回答。
        </div>
        <div className="answer-grid">
          {demoCalls.map((call) => (
            <Card key={call.id} className={`answer-card ${call.model}`}>
              <div className="answer-header">
                <ModelAvatar call={call} />
                <div>
                  <strong>{call.name}</strong>
                  <span>独立视角 · 示例回答</span>
                </div>
                <span className="sample-pill">示例</span>
              </div>
              <div className="answer-body">
                <h2>{call.headline}</h2>
                {call.sections.map((section, index) => (
                  <section key={section.title}>
                    <h3>
                      <span>0{index + 1}</span>
                      {section.title}
                    </h3>
                    <p>{section.body}</p>
                  </section>
                ))}
                <div className="answer-takeaway">{call.takeaway}</div>
              </div>
              <div className="answer-footer">
                <span>
                  <CircleDot size={12} />
                  演示用量
                </span>
                <strong>
                  {totalTokens(call)}
                  <span> tokens</span>
                </strong>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="composer-region">
        <div className="composer">
          <textarea
            aria-label="消息输入，原型暂不可用"
            placeholder="写下你的问题，让不同视角参与讨论…"
            disabled
            rows={2}
          />
          <div className="composer-toolbar">
            <div className="model-chips">
              {demoCalls.map((call) => (
                <span key={call.id} className={`model-chip ${call.model}`}>
                  <Check size={12} />
                  {call.name}
                </span>
              ))}
            </div>
            <div className="composer-actions">
              <Button variant="ghost" size="sm" disabled>
                <Square size={12} />
                停止
              </Button>
              <Button size="sm" disabled>
                <Send size={14} />
                发送
              </Button>
            </div>
          </div>
        </div>
        <div className="composer-helper">
          <LockKeyhole size={11} />
          尚未接入模型，消息输入与生成暂不可用。
        </div>
      </div>
    </div>
  );
}

function TokenPage() {
  const chartData = demoCalls.map((call) => ({
    name: call.name,
    value: totalTokens(call),
    color: call.color,
  }));
  const chartDescription = `演示 Token 分布：${demoCalls.map((call) => `${call.name} ${modelShare(call)}%`).join("，")}`;
  return (
    <div className="page-scroll dashboard-page">
      <PageHeading
        eyebrow="USAGE OVERVIEW"
        title="看清每一次消耗"
        description="从调用明细到模型分布，让用量有据可查。"
      >
        <span className="scope-label">
          <MessageSquare size={14} />
          示例会话
          <ChevronDown size={13} />
        </span>
      </PageHeading>
      <div className="data-notice">
        <FlaskConical size={15} />
        <span>以下为人工构造的演示用量，并非实际 API 消耗。</span>
        <span className="notice-tag">固定样例</span>
      </div>
      <div className="metrics-grid">
        <Card className="metric-card">
          <div className="metric-label">
            总 Token
            <span className="metric-icon">
              <BarChart3 size={16} />
            </span>
          </div>
          <div className="metric-value">
            {demoTotals.total}
            <span>tokens</span>
          </div>
          <div className="metric-subtitle">
            <span className="subtle-dot" />
            {demoCalls.length} 次示例调用
          </div>
        </Card>
        <Card className="metric-card">
          <div className="metric-label">
            输入 Token
            <span className="metric-icon">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="metric-value">
            {demoTotals.input}
            <span>tokens</span>
          </div>
          <div className="metric-subtitle">问题与上下文的演示用量</div>
        </Card>
        <Card className="metric-card">
          <div className="metric-label">
            输出 Token
            <span className="metric-icon">
              <ArrowDownLeft size={16} />
            </span>
          </div>
          <div className="metric-value">
            {demoTotals.output}
            <span>tokens</span>
          </div>
          <div className="metric-subtitle">模型回答的演示用量</div>
        </Card>
      </div>
      <div className="distribution-grid">
        <Card className="distribution-card">
          <div className="panel-heading">
            <h2>模型用量分布</h2>
            <span>按总 Token</span>
          </div>
          <div className="distribution-body">
            <div
              className="donut-chart"
              role="img"
              aria-label={chartDescription}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius="73%"
                    outerRadius="93%"
                    paddingAngle={5}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    cornerRadius={3}
                    isAnimationActive={false}
                  >
                    {chartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <strong>{demoTotals.total}</strong>
                <span>总 Token</span>
              </div>
            </div>
            <div className="chart-legend">
              {demoCalls.map((call) => (
                <div className="legend-row" key={call.id}>
                  <span className={`legend-dot ${call.model}`} />
                  <div>
                    <strong>{call.name}</strong>
                    <span>{totalTokens(call)} tokens</span>
                  </div>
                  <b>
                    {modelShare(call)}
                    <small>%</small>
                  </b>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="composition-card">
          <div className="panel-heading">
            <h2>输入与输出</h2>
            <span>Token 构成</span>
          </div>
          <div className="bar-legend">
            <span>
              <i />
              输入
            </span>
            <span>
              <i />
              输出
            </span>
          </div>
          {demoCalls.map((call) => (
            <div className={`composition-row ${call.model}`} key={call.id}>
              <div className="composition-label">
                <span>{call.name}</span>
                <strong>{totalTokens(call)}</strong>
              </div>
              <div
                className="stacked-bar"
                aria-label={`${call.name}：输入 ${call.inputTokens}，输出 ${call.outputTokens}`}
              >
                <span style={{ flex: call.inputTokens }} />
                <span style={{ flex: call.outputTokens }} />
              </div>
              <div className="composition-details">
                <span>输入 {call.inputTokens}</span>
                <span>输出 {call.outputTokens}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card className="calls-card">
        <div className="panel-heading">
          <h2>
            调用明细<span className="count-badge">{demoCalls.length}</span>
          </h2>
          <span>全部为演示记录</span>
        </div>
        <table>
          <caption className="sr-only">固定示例调用的 Token 明细</caption>
          <thead>
            <tr>
              <th>模型 / 调用</th>
              <th>输入</th>
              <th>输出</th>
              <th>总 Token</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {demoCalls.map((call) => (
              <tr key={call.id}>
                <td>
                  <div className="table-model">
                    <ModelAvatar call={call} small />
                    <div>
                      <strong>{call.name}</strong>
                      <small>{call.id}</small>
                    </div>
                  </div>
                </td>
                <td>{call.inputTokens}</td>
                <td>{call.outputTokens}</td>
                <td className="table-total">{totalTokens(call)}</td>
                <td>
                  <span className="settled-badge">
                    <Check size={11} />
                    已结算 · 示例
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>合计</td>
              <td>{demoTotals.input}</td>
              <td>{demoTotals.output}</td>
              <td>{demoTotals.total}</td>
              <td>示例会话</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page-scroll settings-page">
      <PageHeading
        eyebrow="MODEL CONNECTIONS"
        title="让不同模型，坐到一起"
        description="未来在这里配置模型连接，选择参与讨论的视角。"
      />
      <div className="data-notice">
        <LockKeyhole size={15} />
        <span>设置功能尚未接入。当前不接受或保存任何 API Key。</span>
        <span className="notice-tag">仅展示布局</span>
      </div>
      <div className="settings-grid">
        {demoCalls.map((call) => (
          <Card className="provider-card" key={call.id}>
            <div className="provider-header">
              <ModelAvatar call={call} />
              <div>
                <h2>{call.name}</h2>
                <p>
                  {call.model === "deepseek"
                    ? "DeepSeek API"
                    : "阿里云百炼 · DashScope"}
                </p>
              </div>
              <span className="unconnected">
                <span />
                未接入
              </span>
            </div>
            <div className="provider-fields">
              <label htmlFor={`${call.model}-model`}>
                模型名称
                <Input
                  id={`${call.model}-model`}
                  placeholder="接入后选择可用模型"
                  disabled
                />
              </label>
              {call.model === "qwen" && (
                <label htmlFor="qwen-region">
                  服务地域
                  <div className="select-wrap">
                    <select id="qwen-region" disabled defaultValue="">
                      <option value="">接入后选择与凭据匹配的地域</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </label>
              )}
              <label htmlFor={`${call.model}-key`}>
                API Key<span className="field-sublabel">当前不可填写</span>
                <Input
                  id={`${call.model}-key`}
                  type="password"
                  placeholder="尚未开放密钥配置"
                  disabled
                  autoComplete="off"
                />
              </label>
              <p className="key-hint">
                <KeyRound size={12} />
                正式接入后计划使用 macOS Keychain 保存密钥。
              </p>
            </div>
            <div className="provider-footer">
              <Button variant="outline" size="sm" disabled>
                测试连接
              </Button>
              <Button size="sm" disabled>
                保存配置
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <div className="settings-roadmap">
        <span className="roadmap-icon">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h3>连接能力，分步接入</h3>
          <p>
            接下来将逐步实现模型调用、凭据管理与本地记录。当前仅提供界面预览，不会发送模型
            API 请求。
          </p>
        </div>
      </div>
      <div className="development-meta">
        <Terminal size={14} />
        <span>开发模式</span>
        <span className="meta-separator">/</span>
        <span>桌面界面原型</span>
        <span className="meta-separator">/</span>
        <span>业务能力尚未实现</span>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("chat");
  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>工作空间</span>
            <ChevronRight size={13} />
            <strong>{pages.find((item) => item.id === page)?.title}</strong>
          </div>
          <div className="demo-badge">
            <span />
            静态原型 · 演示数据
          </div>
        </header>
        {page === "chat" ? (
          <ChatPage />
        ) : page === "tokens" ? (
          <TokenPage />
        ) : (
          <SettingsPage />
        )}
      </main>
    </div>
  );
}
