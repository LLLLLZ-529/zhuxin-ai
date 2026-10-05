# 🧡 筑心 AI

面向**建筑工地工友**的心理关怀 Web 应用：8 位不同定位的 AI 陪伴 Agent，覆盖情绪倾诉、睡眠、家庭、愤怒管理、树洞与安全关怀等场景，配合心情打卡、心理自测与减压工具。

> 本应用以「陪伴」而非「诊断」为原则，所有 Agent 均明确不做医疗诊断；涉及自伤/伤人风险时进入安全关怀模式。

## ✨ 功能特性

- 🤖 **8 个专属 Agent**：综合陪伴 / 工地支持 / 睡眠陪伴 / 家庭沟通 / 冷静支持 / 工友树洞 / 情绪整理 / 安全关怀（`lib/agents.ts`）
- 🎯 **场景化 Starter**：每个 Agent 提供贴合场景的快捷引导语，降低开口门槛
- 😊 **今日心情打卡**：10 秒情绪记录（首页 + `/mood`）
- 🧠 **心理自测**：`/assessment` 了解近期状态
- 😮‍💨 **快速减压**：`/relax` 30 秒放松练习
- 📊 **本周心理报告**：情绪/压力/睡眠指标可视化（recharts）
- 🏗️ **工地场景聚焦**：加班、欠薪、工头冲突、工伤风险、宿舍噪音等专门主题
- 🛟 **安全模式**：自伤/伤人风险时简短确认即时危险并引导求助
- 🔐 **隐私承诺**：聊天内容不提供给工头或公司

## 🛠️ 技术栈

- **框架**：Next.js 14（App Router）· React 18 · TypeScript
- **样式**：Tailwind CSS 3
- **图表**：recharts
- **AI**：DeepSeek API（`/api/chat` 路由）

## 🚀 快速开始

### 环境要求

- Node.js 18+ 与 pnpm（`npm i -g pnpm`）

### 安装与配置

```bash
# 1. 安装依赖
pnpm install

# 2. 创建本地配置（复制模板并重命名）
cp .env.example .env.local    # 若仓库缺少 .env.example，手动创建：
# 内容示例：
# DEEPSEEK_API_KEY=你的DeepSeek_API_Key
# DEEPSEEK_MODEL=deepseek-v4-flash
# DEEPSEEK_BASE_URL=https://api.deepseek.com

# 3. 启动开发服务器
pnpm dev
```

打开 `http://localhost:3000`。进入聊天页后，顶部显示「DeepSeek 已连接」即配置成功；若显示「连接异常」，检查 API Key 与网络。

### 构建与部署

```bash
pnpm build
pnpm start
```

项目已内置 `vercel.json`（Vercel 部署配置）与 `cloudbaserc.json`（腾讯云 CloudBase 配置），按平台指引部署即可。

## 📁 项目结构

```
筑心AI/
├── app/                  # Next.js App Router 页面
│   ├── page.tsx          # 首页（概览 + 心情打卡 + 快捷服务）
│   ├── chat/page.tsx     # 对话页
│   ├── mood/ sleep/ work/ family/ anger/ treehole/ relax/ assessment/ report/ safety/
│   │                      # 各功能页面
│   ├── api/chat/route.ts # DeepSeek 对话代理
│   └── globals.css
├── components/           # AppShell / TopicPage / UI 组件
├── lib/                  # agents.ts（Agent 定义）/ data.ts / mock-ai.ts
├── package.json          # pnpm 依赖与脚本
└── 配置说明.md            # 配置文档（已整理进本 README）
```

## 🔒 安全说明

- `.env.local` 含 API Key，**禁止提交到 git**；请确认 `.gitignore` 已包含它。
- 每位使用者应创建自己的 `.env.local`。

## 📄 许可

未指定开源许可（默认保留所有权利）。
