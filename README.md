# Originium Chronicles

> 粉丝自制明日方舟简易 Wiki

一个用于展示明日方舟游戏世界观、角色关系和历史事件的 Vue3 Web 应用。

## 功能介绍

- **角色展示**: 展示游戏中的干员信息、头像和关系网络
- **派系系统**: 可视化展示各个派系（罗德岛、龙门、整合运动等）及其关系
- **时间线**: 泰拉大陆重大历史事件的交互式时间轴
- **关系图谱**: 角色之间的关系可视化网络图
- **更新日志**: 项目版本更新记录

## 技术架构

```
originium-chronicles/
├── public/
│   ├── data/           # JSON 数据文件
│   │   ├── characters.json    # 角色数据
│   │   ├── factions.json      # 派系数据
│   │   ├── operatives.json    # 干员数据
│   │   ├── timeline.json      # 时间线事件
│   │   └elog.json      # 更新日志
│   └── images/         # 图片资源
│       ├── avatars/    # 角色头像
│       └── portrait_art/ # 角色立绘
├── src/
│   ├── components/     # Vue 组件
│   │   ├── avatars/    # 头像组件
│   │   ├── cards/      # 卡片组件
│   │   ├── data-display/ # 数据展示组件
│   │   ├── home/       # 首页组件
│   │   ├── layout/     # 布局组件
│   │   ├── relation-graph/ # 关系图组件
│   │   └── ui/         # UI 基础组件
│   ├── views/          # 页面视图
│   ├── composables/    # Vue Composables
│   ├── services/       # 数据服务
│   ├── stores/         # Pinia 状态管理
│   └── router/         # Vue Router 路由配置
└── docs/               # 项目文档
```

## 技术栈

- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **纯 CSS** - 样式方案

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 声明

本项目为粉丝自制内容，仅用于学习和展示目的，不涉及任何商业行为。所有游戏素材版权归鹰角网络所有。

## License

MIT License
