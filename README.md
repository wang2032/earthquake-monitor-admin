# 地震监测管理系统

Earthquake Monitor Admin System

## 项目简介

这是一个基于Vue 3 + TypeScript + Element Plus + ECharts开发的地震监测管理系统，提供实时监测、数据分析、预警管理等功能。

## 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **UI组件库**: Element Plus
- **图表库**: ECharts + Vue-ECharts
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **构建工具**: Vite
- **代码规范**: ESLint

## 功能特性

### 🏠 仪表盘
- 实时统计数据显示
- 地震趋势图表
- 震级分布分析
- 最新预警信息

### 📡 实时监测
- 监测站点状态监控
- 实时数据展示
- 站点分布地图
- 自动刷新功能

### 📊 历史数据
- 历史地震数据查询
- 多条件筛选
- 数据导出功能
- 统计分析图表

### 📈 数据分析
- 趋势分析
- 区域分析
- 深度分析
- 地震预测模型

### 🚨 预警管理
- 预警规则配置
- 实时预警监控
- 预警记录管理
- 多级预警系统

### ⚙️ 系统设置
- 系统配置管理
- 用户权限管理
- 通知设置
- 系统日志

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── router/          # 路由配置
├── stores/          # 状态管理
├── views/           # 页面组件
│   ├── Login.vue    # 登录页面
│   ├── Layout.vue   # 主布局
│   ├── Dashboard.vue # 仪表盘
│   ├── Monitor.vue  # 实时监测
│   ├── History.vue  # 历史数据
│   ├── Analysis.vue # 数据分析
│   ├── Alerts.vue   # 预警管理
│   └── Settings.vue # 系统设置
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 默认账号

- **用户名**: admin
- **密码**: 123456

## 主要功能模块

### 1. 登录认证
- 用户登录验证
- 路由守卫
- 本地存储token

### 2. 实时监测
- 监测站点状态
- 实时数据流
- 地图可视化
- 自动刷新

### 3. 数据分析
- 多维度分析
- 图表展示
- 趋势预测
- 报告生成

### 4. 预警系统
- 规则配置
- 实时监控
- 多级预警
- 通知推送

### 5. 系统管理
- 用户管理
- 权限控制
- 系统配置
- 日志管理

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的Vue组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/views/Layout.vue` 中添加菜单项

### 添加新组件

1. 在 `src/components/` 目录下创建组件
2. 使用TypeScript编写组件逻辑
3. 添加适当的类型定义

### 状态管理

使用Pinia进行状态管理，在 `src/stores/` 目录下创建store文件。

### 样式规范

- 使用Element Plus的设计规范
- 遵循BEM命名规范
- 响应式设计

## 部署说明

### 构建

```bash
npm run build
```

### 部署到服务器

将 `dist` 目录下的文件部署到Web服务器即可。

### 环境变量

创建 `.env` 文件配置环境变量：

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=地震监测管理系统
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目维护者: JoeyWang
- 邮箱: 3114306330@qq.com
- 项目地址: https://github.com/wang2032/earthquake-monitor-admin#

## 更新日志

### v1.0.0 (2025-07-27)
- 初始版本发布
- 基础功能实现
- 用户界面完成
- 核心模块开发

---

**注意**: 这是一个演示项目，实际使用时需要连接真实的地震监测数据源和后端API。
