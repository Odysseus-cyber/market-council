# Market Council · 市场议事厅

A multi-model financial research chatroom supporting API and local models, scheduled market briefs, and token usage and cost tracking.

一个面向个人的多模型投研讨论 App：围绕同一话题邀请不同模型发言，保留讨论过程，并看清每次调用的用量。

**当前状态：已有深色静态桌面原型，可在开发模式启动；模型调用、业务存储和真实用量统计尚未实现，暂无独立 `.app` 产物。上述英文简介描述长期方向；完整 MVP 仍待完成。**

## 运行静态原型

原型包含聊天、Token 看板和模型设置三个可切换页面。所有文本与用量均为人工构造的演示数据，聊天输入、发送、停止、模型配置和连接测试均禁用，不接收真实 API Key。演示状态只存在于内存，重启后回到默认聊天页面。

环境要求：macOS Apple Silicon、Node **24.22.3**（见 `.nvmrc`），本次使用 npm **11.19.1**。在仓库根目录运行：

```sh
npm ci
npm start
```

如果没有 Node，可以从 [Node 官方下载](https://nodejs.org/en/download/) 安装对应版本；也可使用本项目的本地工具目录方式，不修改全局配置：

```sh
mkdir -p .tools
curl -fL https://nodejs.org/dist/v24.22.3/node-v24.22.3-darwin-arm64.tar.gz -o .tools/node-v24.22.3-darwin-arm64.tar.gz
tar -xzf .tools/node-v24.22.3-darwin-arm64.tar.gz -C .tools
export PATH="$PWD/.tools/node-v24.22.3-darwin-arm64/bin:$PATH"
npm ci
npm start
```

`export` 仅影响当前终端；再次打开终端时需要重新设置，或使用已经安装好的 Node 24.22.3。`npm start` 会启动 Vite 开发服务并打开 Electron 桌面窗口，常规开发期间保持该终端运行，使用 `Ctrl+C` 停止。当前没有独立安装包或 Finder 启动交付。

```sh
npm run typecheck
npm run lint
```

2026-11-15 已在 macOS 15.5 / Apple Silicon 上完成 `npm ci`、类型检查和 lint，并实际启动 Electron，检查三页切换、1280 × 820 与 960 × 640 窗口、禁用控件、演示数据一致性及关闭后重新启动。此记录只覆盖静态界面，不代表真实聊天或 Token 结算业务验收通过。首次安装依赖时会从官方发布源下载 Electron 运行文件，需要网络连接。

原型使用 Electron Forge 的 Vite/TypeScript 工程结构，React 负责三个页面，Tailwind CSS 与本地 shadcn/ui 组件负责样式，Recharts 展示固定样例。图表与调用明细共用同一份演示数据。Electron 不向页面开放 Node、文件系统或凭据 IPC；Python worker、SQLite 和 Keychain 尚未接入。

## 首个可展示 MVP

目标是做出一个可从 Finder 打开的 **macOS Apple Silicon `.app`**。你能在 App 内配置 **DeepSeek 与千问**，选择一家或同时邀请两家回答，看到流式回复，并查看 Token 监控看板。

| 功能 | MVP 内的行为 |
| --- | --- |
| 聊天 | 创建会话、发送文本、点名一个或两个模型、独立展示流式回答、继续追问和停止生成 |
| 模型设置 | 在 App 内填写 API Key、配置模型名称和千问地域，测试连接并保存；密钥存入 macOS Keychain |
| Token 看板 | 展示当前会话与全部会话的输入、输出和总 Token，按模型展示占比，并提供调用明细与状态 |
| 本地记录 | 会话、消息和用量保存在 SQLite，重启后可以继续查看 |
| 桌面交付 | 使用已打包的 Python worker，常规使用不需要打开终端或另行启动 Python |

MVP 以文本聊天为主，财经材料可以直接粘贴进消息。聊天和材料保存在本机；调用外部 API 时，选定的上下文仍会发送给对应模型供应商。

同一会话一次运行一轮。同时邀请两家模型时，它们使用本轮发送时固定的相同历史上下文；回答不会自动触发下一轮。某一路失败或取消，不影响另一路完成。

Token 看板展示供应商实际返回的统计。生成过程中可能只有部分数据，也可能尚未返回用量；完整 usage 到达后才结算。累计字段按最新快照更新，重复事件不重复入账，未知不等于零。

## 文档入口

| 文档 | 阅读目的 |
| --- | --- |
| [总体系统设计](docs/system-design.md) | 理解当前架构、数据归属、接口边界，以及候选扩展会怎样接入 |
| [MVP 执行与学习计划](docs/mvp-plan.md) | 查看四步开发顺序、交互与统计规则、展示验收和首个设计练习 |
| [Token 用量验收样例](docs/token-usage-examples.md) | 用具体数字核对累计快照、重复事件、未知用量、重试与统计范围；案例尚未执行 |

## 技术路线

| 层次 | 选择与职责 |
| --- | --- |
| 桌面容器 | Electron：窗口、文件系统入口、受控 IPC 和 Python worker 生命周期 |
| 界面 | React + TypeScript + Vite：聊天、设置和看板；Tailwind CSS + shadcn/ui 用于界面组件 |
| 图表 | Recharts：模型 Token 分布和汇总展示 |
| 本地业务 | Python + Pydantic：上下文组织、供应商适配、调用状态、持久化和统计 |
| 进程通信 | Electron 主进程与 Python worker 通过 JSON Lines 通信；React 通过 preload 的受控接口调用 |
| 数据与凭据 | SQLite 保存业务数据；Python keyring 接入 macOS Keychain 保存 API Key |
| 两家 API | DeepSeek 官方 Chat Completions；千问 DashScope 原生接口 |
| 打包 | Electron Forge + PyInstaller onedir，随 App 分发完整 Python 运行目录 |
| 工程检查 | pytest、Vitest、Ruff、ESLint；在实现阶段引入与行为相关的检查 |

Python 是业务数据库的唯一写入方。具体依赖版本在工程初始化时选择兼容的稳定版本并锁定。MVP 不需要云服务器、行情服务或独立网页客户端。

## 开发顺序

| 步骤 | 可演示成果 |
| --- | --- |
| 1. App 骨架与单模型 | 在 App 内配置 DeepSeek，完成流式聊天、本地保存和最小打包验证 |
| 2. 两模型讨论 | 接入千问，实现点名、同轮两路回答、取消与局部失败处理 |
| 3. Token 看板 | 完成用量归一化、调用明细、模型占比及持久化汇总 |
| 4. 完整展示验收 | 从 Finder 启动安装包，在 App 内配置、聊天、查看看板并验证重启恢复 |

步骤 1 是第一段可用链路；完成全部四步并通过验收后，才视为完成本次双模型 MVP。

## 候选扩展，不构成实现承诺

后续按实际使用价值决定是否加入：

- 更多 API 模型，包括 OpenAI；Ollama 等本地模型。
- 自动圆桌、独立同题比较、可配置角色与材料引用。
- 用户定义范围的云端财经日报，以及以美股为主的新闻、公司披露和日终行情接入。
- 结构化决策记录、文件解析、联网检索。
- 费用换算、预算提醒、趋势分析和报表导出。

若以后加入云端日报，聊天与手动材料仍留在本机，云端仅负责报告采集、生成和相应用量；桌面单向拉取报告与用量。具体方案需要在对应功能被选择后验证。

## 开发与学习方式

项目同时追求可用的软件和能独立解释设计取舍的能力。每个小功能都沿着同一条主线展开：

**需求 → 模块 → 数据 → 流程 → 并发与一致性 → 异常处理 → 扩展与验证**

默认采用“你先设计，我追问评审”：助手先给目标、已有约束和最多三个引导问题，你提出初稿后，再逐步讨论、实现和验证。需要示范或直接实现时，可以明确切换方式。

首个练习见 [MVP 计划](docs/mvp-plan.md)：先思考一次单模型对话的成功标准、模块分工和需要保存的数据，不预先附完整解法。

## 当前进度

- [x] 明确双模型 MVP 与候选扩展的边界。
- [x] 编写总体设计、执行顺序和验收计划。
- [x] 建立步骤 1 的静态桌面界面原型（开发模式，演示数据）。
- [ ] 完成首个设计练习与步骤 1。
- [ ] 完成步骤 2：两模型讨论。
- [ ] 完成步骤 3：Token 看板。
- [ ] 完成步骤 4：独立 App 展示验收。

原型是步骤 1 的界面子任务，不代表单模型链路或双模型 MVP 已完成。下一步仍从 MVP 计划中的第一个设计练习开始；八组 Token 业务验收案例保持未执行。
