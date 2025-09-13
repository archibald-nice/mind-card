# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 开发服务器
npm run dev
# 或
max dev

# 构建项目
npm run build
# 或
max build

# 代码格式化
npm run format

# 安装依赖后设置
npm run setup
# 或
max setup

# 启动项目
npm run start
```

## 项目架构

这是一个基于 UmiJS Max 的 React 全栈应用，集成了以下技术栈：

- **前端框架**: React + TypeScript + UmiJS Max
- **UI 组件**: Ant Design + Pro Components
- **状态管理**: Redux Toolkit + Redux Persist
- **网络请求**: Axios (通过 UmiJS request 插件)
- **包管理器**: pnpm

### 核心配置文件

- `.umirc.ts` - UmiJS 主配置文件，包含路由、代理、插件配置
- `src/app.ts` - 运行时配置，用于 Layout 用户信息和权限初始化

### 项目结构

```
src/
├── store/             # Redux 状态管理
│   └── redux/         # Redux 配置
│       ├── store.ts   # Redux store 配置，包含持久化设置
│       ├── slices/    # 各个状态 slice
│       └── Provider.tsx # Redux Provider 组件
├── pages/             # 页面组件
│   ├── Home/          # 首页
│   ├── Cards/         # 卡片管理
│   ├── Access/        # 权限演示
│   └── Table/         # CRUD 示例
├── services/          # API 服务层
├── models/            # UmiJS model (数据流)
├── utils/             # 工具函数
└── components/        # 公共组件
```

### 状态管理架构

项目使用 Redux Toolkit 管理状态，配置了持久化存储：

- `store.ts` - 主 store 配置，集成了 redux-persist
- `slices/` - 包含 appSlice、globalSlice、userSlice 三个主要状态模块
- 只有 user 和 global 状态会被持久化到 localStorage

### API 配置

- API 代理配置在 `.umirc.ts` 中，`/api` 请求会代理到 `http://localhost:8080`
- 请求工具使用 UmiJS 内置的 request 插件

### 路由结构

- `/` → 重定向到 `/home`
- `/home` → 首页
- `/cards` → 卡片管理
- `/access` → 权限演示
- `/table` → CRUD 示例页面

### 代码规范

- ESLint 配置在 `.eslintrc.js`，包含 TypeScript 和 React 规则
- Prettier 配置在 `.prettierrc.js`，包含详细格式化规则
- 配置了 lint-staged 和 husky 进行代码提交检查
- 使用 `@typescript-eslint/no-explicit-any: 'warn'` 允许 any 类型但会警告
