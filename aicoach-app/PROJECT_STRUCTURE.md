# AICoach 项目结构说明

## 项目概述

AICoach 是一个全栈 Web 应用，提供课程学习、模拟面试、简历优化等功能。

## 目录结构详解

```
aicoach-app/
├── src/
│   ├── pages/                  # 功能页面（自动路由）
│   │   ├── index/              # 首页
│   │   ├── login/              # 登录页
│   │   ├── interview/          # 面试页
│   │   ├── resume/             # 简历页
│   │   ├── courses/            # 课程页
│   │   └── profile/            # 个人设置页
│   │
│   ├── components/             # 可复用UI组件
│   │   ├── ui/                 # 基础UI组件
│   │   ├── auth/               # 认证相关组件
│   │   ├── course/             # 课程相关组件
│   │   ├── interview/          # 面试相关组件
│   │   ├── resume/             # 简历相关组件
│   │   ├── profile/            # 用户档案组件
│   │   └── layout/             # 布局组件
│   │
│   ├── stores/                 # Pinia 状态管理
│   │   ├── auth.ts             # 认证状态
│   │   ├── app.ts              # 应用全局状态
│   │   ├── course.ts            # 课程状态
│   │   ├── interview.ts         # 面试状态
│   │   └── index.ts            # 导出文件
│   │
│   ├── api/                    # API 调用模块
│   │   ├── client.ts           # Axios 基础配置
│   │   ├── auth.ts             # 认证API
│   │   ├── course.ts           # 课程API
│   │   ├── interview.ts        # 面试API
│   │   ├── resume.ts           # 简历API
│   │   └── index.ts            # 导出文件
│   │
│   ├── hooks/                  # 组合式 API Hooks
│   │   ├── useDebounce.ts      # 防抖/节流
│   │   ├── useLoading.ts       # 加载状态
│   │   ├── useFetch.ts         # 数据获取
│   │   └── index.ts            # 导出文件
│   │
│   ├── utils/                  # 工具函数
│   │   ├── helpers.ts          # 通用工具函数
│   │   ├── validators.ts       # 验证函数
│   │   ├── formatters.ts       # 格式化函数
│   │   └── index.ts            # 导出文件
│   │
│   ├── styles/                 # 全局样式
│   │   ├── variables.scss      # SCSS 变量
│   │   ├── index.scss          # 全局样式
│   │   └── mixins.scss         # 样式混合
│   │
│   ├── locales/                # i18n 国际化
│   │   ├── en.json             # 英文翻译
│   │   └── zh.json             # 中文翻译
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── common.ts           # 通用类型
│   │   ├── api.ts              # API 响应类型
│   │   ├── course.ts           # 课程相关类型
│   │   ├── interview.ts        # 面试相关类型
│   │   └── resume.ts           # 简历相关类型
│   │
│   ├── App.vue                 # 应用主组件
│   ├── main.ts                 # 应用入口
│   ├── manifest.json           # 应用清单
│   ├── pages.json              # 页面配置
│   ├── env.d.ts                # 环境变量类型
│   └── uni.scss                # UNI 框架样式
│
├── public/                     # 静态资源
│   └── robots.txt
│
├── static/                     # 静态文件
│   ├── icons/                  # 图标文件
│   └── images/                 # 图片文件
│
├── vite.config.ts              # Vite 配置
├── uniapp.config.ts            # UNI-APP 路由和页面配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 项目依赖配置
└── index.html                  # HTML 入口
```

## 主要模块说明

### Pages (页面)

- 使用自动路由，每个页面对应一个 .vue 文件
- 页面组件只负责页面逻辑和布局
- 复用代码应提取到 components、hooks、stores

### Components (组件)

- 可复用的 UI 组件和业务组件
- 组件应该足够通用和灵活
- 使用 props 接收外部数据，使用 emits 通知父级

### Stores (状态管理)

- 使用 Pinia 管理应用状态
- 分模块管理不同的业务状态
- 支持 TypeScript 类型推断

### API (接口层)

- 基于 Axios 的 HTTP 客户端
- 自动添加认证 token
- 统一错误处理

### Hooks (组合式 API)

- 可复用的逻辑组件
- 包含通用的业务逻辑
- 易于测试和维护

### Utils (工具函数)

- 纯函数工具库
- 不依赖 Vue 实例
- 易于在任何地方复用

### Styles (样式)

- SCSS 变量和 mixins
- 全局样式定义
- 响应式设计支持

### Locales (国际化)

- JSON 格式的翻译文件
- 支持多语言切换
- 与 i18n 插件配套

## 开发规范

### 命名规范

- 页面: PascalCase (首字母大写)
- 组件: PascalCase
- 函数: camelCase
- 常量: UPPER_SNAKE_CASE
- 文件: kebab-case 或 PascalCase

### TypeScript 使用

- 所有文件都应使用 TypeScript
- 定义清晰的接口和类型
- 避免使用 `any` 类型

### 样式编写

- 使用 SCSS 和 CSS 变量
- 遵循 BEM 命名规范
- 使用预定义的间距、颜色等变量

### Git 提交

- feat: 新功能
- fix: 修复 bug
- refactor: 代码重构
- docs: 文档更新
- style: 代码风格调整
- test: 测试用例
