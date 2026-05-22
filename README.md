# private_code_workspace001

这是一个在 GitHub Codespaces 中使用的私有开发工作区。

## 当前项目内容

- `app/page.tsx`：移动端赛博朋克风首页，支持粘贴/上传聊天记录并调用 AI 诊断
- `app/api/roast/route.ts`：后端 API，使用 `@google/genai` 调用 `gemini-2.0-flash`
- `app/layout.tsx`：Next.js app Router 全局布局入口
- `app/globals.css`：Tailwind 样式和通用页面风格
- `package.json`：项目依赖和启动脚本
- `tsconfig.json`：TypeScript 配置
- `tailwind.config.ts` / `postcss.config.js`：Tailwind CSS 配置
- `.env.example`：示例环境变量配置

## 运行步骤

1. 复制环境变量文件：
   - `cp .env.example .env.local`
   - 将 `GOOGLE_API_KEY` 替换为你的 Google API 密钥
2. 安装依赖：
   - `npm install`
3. 启动开发服务器：
   - `npm run dev`
4. 打开浏览器访问：
   - `http://localhost:3000`

## 环境变量

- `GOOGLE_API_KEY`：用于 `@google/genai` SDK 的认证

## 说明

此项目已补齐基础运行所需配置，但仍需确保你的 Google API Key 有权限访问 Gemini 模型。