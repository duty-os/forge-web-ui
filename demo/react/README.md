# Forge Web UI - React Demo

这是一个使用 React 框架演示 Forge Web UI 工具栏的示例项目。

## 项目结构

```
demo/react/
├── index.html          # HTML 入口文件
├── main.tsx            # React 应用入口
├── App.tsx             # 主应用组件
├── index.css           # 全局样式
├── config.example.ts   # 配置示例文件
├── vite.config.ts      # Vite 构建配置
├── tsconfig.json       # TypeScript 配置
└── README.md           # 说明文档
```

## 快速开始

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
```

### 2. 配置

复制配置示例文件并填入实际配置：

```bash
cp demo/react/config.example.ts demo/react/config.local.ts
```

编辑 `demo/react/config.local.ts`，填入你的 Netless 配置：

```typescript
const config = {
  appId: 'your-app-id',      // 你的 Netless appId
  roomId: 'your-room-id',    // 房间 ID
  userId: 'react-user',      // 用户 ID
  token: 'optional-token'    // 可选的 token
}

export default config
```

### 3. 运行开发服务器

```bash
npm run dev:react
```

服务器将在 http://localhost:3302 启动。

## 功能特点

- ✅ 使用 React 19 和 TypeScript
- ✅ 集成 Forge Web Components 工具栏
- ✅ 支持配置文件热重载
- ✅ 自动管理房间连接生命周期
- ✅ 响应式布局设计
- ✅ 完整的类型安全

## 使用说明

1. 配置文件支持：如果没有 `config.local.ts`，会显示配置界面提示
2. 工具栏自动集成：Web Components 工具栏会自动显示在白板顶部中央
3. 生命周期管理：组件卸载时自动清理房间连接和资源

## 技术栈

- **React 19**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 开发服务器和构建工具
- **@netless/forge-***: Netless Forge 系列 SDK

## 注意事项

- 确保 `appId` 和 `roomId` 配置正确
- 房间需要提前在 Netless 控制台创建
- 本地配置文件 `config.local.ts` 不会被提交到 Git

## 与 HTML Demo 的区别

| 特性 | HTML Demo | React Demo |
|------|-----------|------------|
| 框架 | 原生 HTML/JS | React 19 + TypeScript |
| 状态管理 | 手动管理 | React Hooks |
| 类型安全 | 无 | 完整 TypeScript 支持 |
| 组件化 | 无 | 组件化设计 |
| 生命周期 | 手动管理 | React 自动管理 |
