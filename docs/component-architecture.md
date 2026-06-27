# 源石纪事 - 项目组件架构说明

> 本文档描述了《源石纪事》项目的组件架构，帮助开发者理解项目结构和组件职责。

---

## 一、整体组件结构概览

本项目采用模块化组件架构，按功能职责划分为以下目录结构：

```
components/
├── animations/           # 动画效果组件
│   ├── FlowLines.vue         # 流动线条动画
│   ├── GeometricPattern.vue  # 几何图案动画
│   └── GridAnimation.vue     # 网格背景动画
├── avatars/              # 头像展示组件
│   ├── BasicCharacterAvatar.vue  # 基础角色头像
│   ├── CoreMemberAvatar.vue      # 核心成员头像
│   └── OperatorAvatar.vue        # 干员头像
├── cards/                # 卡片展示组件
│   ├── CharacterAvatar.vue      # 角色头像卡片
│   ├── FactionLeaderCard.vue    # 派系领袖卡片
│   ├── FactionRelationCard.vue  # 派系关系卡片
│   └── FactionStatsCard.vue     # 派系统计卡片
├── data-display/         # 数据展示组件
│   ├── CharacterGrid/           # 角色网格子组件
│   │   ├── CharacterConnections.vue
│   │   ├── CharacterGridContainer.vue
│   │   ├── CharacterGridHeader.vue
│   │   ├── CharacterLegend.vue
│   │   └── CharacterNode.vue
│   ├── CharacterCard.vue        # 角色卡片
│   ├── CharacterGrid.vue        # 角色网格
│   ├── FactionCard.vue          # 派系卡片
│   ├── InfoDisplay.vue          # 信息展示（暂未使用）
│   ├── RelationshipGraph.vue    # 关系图谱（暂未使用）
│   └── Timeline.vue             # 时间线组件
├── home/                 # 首页专用组件
│   ├── ChangelogSection.vue    # 更新日志区域
│   ├── CharactersPreview.vue   # 角色预览
│   ├── FactionsPreview.vue     # 派系预览
│   ├── HomeHero.vue            # 首页横幅
│   ├── IntroSection.vue        # 介绍区域
│   └── TimelinePreview.vue     # 时间线预览
├── layout/               # 布局基础组件
│   ├── TheFooter.vue           # 页脚
│   └── TheNavbar.vue           # 导航栏
├── relation-graph/       # 关系图谱组件
│   ├── Edge.vue                # 边组件（暂未使用）
│   ├── Legend.vue              # 图例组件（暂未使用）
│   ├── Node.vue                # 节点组件（暂未使用）
│   ├── OldRelationGraph.vue    # 旧版关系图谱（已废弃）
│   └── RelationGraph.vue       # 关系图谱
├── ui/                   # 通用UI组件
│   ├── BaseButton.vue          # 基础按钮
│   ├── BaseCard.vue            # 基础卡片（暂未使用）
│   ├── BaseInput.vue           # 基础输入框
│   ├── BaseSectionTitle.vue    # 基础章节标题
│   ├── BaseSelect.vue          # 基础选择框
│   └── BaseTag.vue             # 基础标签
└── user/                 # 用户相关组件
    ├── LoginForm.vue           # 登录表单
    ├── LoginModal.vue          # 登录弹窗
    ├── UserProfile.vue         # 用户资料
    └── UserSettings.vue        # 用户设置
```

---

## 二、主要组件

### 1. 布局组件

#### `TheNavbar` (导航栏)
- **作用**：应用顶部导航栏，包含Logo、导航菜单、搜索框和用户登录入口。
- **子组件**：
  - `LoginModal` (登录弹窗)

#### `TheFooter` (页脚)
- **作用**：应用底部信息栏，包含版权信息、导航链接和项目说明。

---

### 2. 首页组件

#### `HomeHero` (首页横幅)
- **作用**：首页顶部主视觉区域，展示项目标题和核心标语，配合背景动画营造氛围。

#### `IntroSection` (介绍区域)
- **作用**：展示项目简介和核心价值主张，引导用户了解项目定位。
- **子组件**：
  - `BaseSectionTitle` (基础章节标题)

#### `FactionsPreview` (派系预览)
- **作用**：首页展示主要派系的预览卡片，支持左右滑动浏览。
- **子组件**：
  - `BaseSectionTitle` (基础章节标题)
  - `FactionCard` (派系卡片)

#### `CharactersPreview` (角色预览)
- **作用**：首页展示关键角色的预览卡片，支持左右滑动浏览。
- **子组件**：
  - `BaseSectionTitle` (基础章节标题)
  - `CharacterCard` (角色卡片)

#### `TimelinePreview` (时间线预览)
- **作用**：首页展示历史年表的预览区域，展示关键历史事件。
- **子组件**：
  - `BaseSectionTitle` (基础章节标题)
  - `Timeline` (时间线组件)

#### `ChangelogSection` (更新日志)
- **作用**：首页展示最近更新记录，支持点击跳转至完整更新日志页面。
- **子组件**：
  - `BaseSectionTitle` (基础章节标题)
  - `BaseTag` (标签组件)
  - `BaseButton` (基础按钮)

---

### 3. 数据展示组件

#### `FactionCard` (派系卡片)
- **作用**：展示单个派系的基本信息卡片，包含图标、名称、类型和简要描述。
- **子组件**：
  - `BaseTag` (标签组件)

#### `CharacterCard` (角色卡片)
- **作用**：展示单个角色的基本信息卡片，包含头像、名称、种族和所属派系。
- **子组件**：
  - `BaseTag` (标签组件)

#### `CharacterGrid` (角色网格)
- **作用**：按派系分组展示角色网格列表，支持展开/收起功能。
- **子组件**：
  - `CharacterAvatar` (角色头像)
  - `OperatorAvatar` (干员头像)

#### `Timeline` (时间线)
- **作用**：展示历史事件的时间线组件，支持滑动浏览和事件详情展示。
- **子组件**：
  - `BaseTag` (标签组件)

#### `InfoDisplay` (信息展示)
- **预期作用**：用于展示详细信息的通用组件。
- **状态**：暂未使用

---

### 4. 卡片组件

#### `CharacterAvatar` (角色头像)
- **作用**：角色头像展示组件，支持头像图片和名字首字占位符。

#### `FactionLeaderCard` (派系领袖卡片)
- **作用**：展示派系领袖信息的卡片，用于派系详情页。

#### `FactionStatsCard` (派系统计卡片)
- **作用**：展示派系统计数据的卡片，包含成员数量、势力范围等信息。

#### `FactionRelationCard` (派系关系卡片)
- **作用**：展示派系关联势力的卡片，用于展示友好/敌对关系。

---

### 5. 头像组件

#### `OperatorAvatar` (干员头像)
- **作用**：明日方舟风格的干员头像组件，支持星级、费用等信息展示，采用平行四边形造型。

#### `BasicCharacterAvatar` (基础角色头像)
- **作用**：基础角色头像组件，展示圆形头像，支持图片或名字首字占位。

#### `CoreMemberAvatar` (核心成员头像)
- **作用**：核心成员头像组件，带有特殊标识，用于突出展示重要角色。

---

### 6. 动画组件

#### `FlowLines` (流动线条)
- **作用**：背景流动线条动画效果，用于页面顶部装饰。

#### `GridAnimation` (网格动画)
- **作用**：网格背景动画效果，营造科技感氛围。

#### `GeometricPattern` (几何图案)
- **作用**：几何图案背景动画效果，用于页面背景装饰。

---

### 7. 通用UI组件

#### `BaseButton` (基础按钮)
- **作用**：统一风格的按钮组件，支持多种变体（primary、outline、ghost等）。

#### `BaseTag` (基础标签)
- **作用**：统一风格的标签组件，用于分类和状态展示，支持多种颜色变体。

#### `BaseInput` (基础输入框)
- **作用**：统一风格的输入框组件，支持placeholder和聚焦效果。

#### `BaseSelect` (基础选择框)
- **作用**：统一风格的下拉选择框组件，支持自定义选项和搜索功能。

#### `BaseSectionTitle` (基础章节标题)
- **作用**：统一风格的章节标题组件，支持入场动画和视觉层次。

#### `BaseCard` (基础卡片)
- **预期作用**：通用卡片容器组件。
- **状态**：暂未使用

---

### 8. 用户组件

#### `LoginForm` (登录表单)
- **作用**：用户登录表单组件，支持账号密码输入和登录验证。
- **子组件**：
  - `BaseInput` (基础输入框)
  - `BaseButton` (基础按钮)

#### `LoginModal` (登录弹窗)
- **作用**：登录弹窗容器组件，包含登录表单和关闭按钮。
- **子组件**：
  - `LoginForm` (登录表单)

#### `UserProfile` (用户资料)
- **作用**：展示用户基本资料的组件，包含头像、昵称和统计信息。

#### `UserSettings` (用户设置)
- **作用**：用户账号设置组件，支持修改个人信息和偏好设置。

---

### 9. 关系图谱组件

#### `RelationGraph` (关系图谱)
- **作用**：展示角色和派系之间关系的图谱组件，支持交互式节点浏览。
- **子组件**：
  - `BaseSelect` (基础选择框)

#### `Edge` (边组件)
- **预期作用**：关系图谱中的连接线组件。
- **状态**：暂未使用

#### `Legend` (图例组件)
- **预期作用**：关系图谱的图例说明组件。
- **状态**：暂未使用

#### `Node` (节点组件)
- **预期作用**：关系图谱中的节点组件。
- **状态**：暂未使用

#### `OldRelationGraph` (旧版关系图谱)
- **预期作用**：早期版本的关系图谱组件。
- **状态**：已废弃

---

### 10. 角色网格子组件

以下组件位于 `data-display/CharacterGrid/` 目录下：

#### `CharacterConnections` (角色连接)
- **预期作用**：展示角色之间连接关系的组件。
- **状态**：暂未使用

#### `CharacterGridContainer` (角色网格容器)
- **预期作用**：角色网格的容器组件。
- **状态**：暂未使用

#### `CharacterGridHeader` (角色网格头部)
- **预期作用**：角色网格的头部组件，包含标题和筛选器。
- **状态**：暂未使用

#### `CharacterLegend` (角色图例)
- **预期作用**：角色网格的图例说明组件。
- **状态**：暂未使用

#### `CharacterNode` (角色节点)
- **预期作用**：角色网格中的节点组件。
- **状态**：暂未使用

---

## 三、暂未使用/已废弃的组件汇总

| 组件路径 | 状态 | 原因 |
|----------|------|------|
| `data-display/CharacterGrid/CharacterConnections.vue` | 暂未使用 | 角色关系网格功能尚未完成 |
| `data-display/CharacterGrid/CharacterGridContainer.vue` | 暂未使用 | 角色关系网格功能尚未完成 |
| `data-display/CharacterGrid/CharacterGridHeader.vue` | 暂未使用 | 角色关系网格功能尚未完成 |
| `data-display/CharacterGrid/CharacterLegend.vue` | 暂未使用 | 角色关系网格功能尚未完成 |
| `data-display/CharacterGrid/CharacterNode.vue` | 暂未使用 | 角色关系网格功能尚未完成 |
| `data-display/InfoDisplay.vue` | 暂未使用 | 功能被其他组件替代 |
| `data-display/RelationshipGraph.vue` | 暂未使用 | 与 RelationGraph 功能重叠 |
| `relation-graph/Edge.vue` | 暂未使用 | 关系图谱功能开发停滞 |
| `relation-graph/Legend.vue` | 暂未使用 | 关系图谱功能开发停滞 |
| `relation-graph/Node.vue` | 暂未使用 | 关系图谱功能开发停滞 |
| `relation-graph/OldRelationGraph.vue` | 已废弃 | 被新版 RelationGraph 替代 |
| `ui/BaseCard.vue` | 暂未使用 | 设计思路变化，采用内联样式 |

---

## 四、组件引用关系图

```
App.vue
├── TheNavbar
│   └── LoginModal
│       └── LoginForm
│           ├── BaseInput
│           └── BaseButton
├── RouterView (动态渲染页面)
│   ├── HomeView
│   │   ├── HomeHero
│   │   │   ├── BaseButton
│   │   │   └── BaseTag
│   │   ├── IntroSection
│   │   │   └── BaseSectionTitle
│   │   ├── FactionsPreview
│   │   │   ├── BaseSectionTitle
│   │   │   └── FactionCard
│   │   ├── CharactersPreview
│   │   │   ├── BaseSectionTitle
│   │   │   └── CharacterCard
│   │   ├── TimelinePreview
│   │   │   ├── BaseSectionTitle
│   │   │   └── Timeline
│   │   └── ChangelogSection
│   │       ├── BaseSectionTitle
│   │       ├── BaseTag
│   │       └── BaseButton
│   ├── FactionsView
│   │   ├── FactionCard
│   │   ├── FactionLeaderCard
│   │   ├── FactionStatsCard
│   │   └── FactionRelationCard
│   ├── CharactersView
│   │   ├── CharacterGrid
│   │   │   ├── CharacterAvatar
│   │   │   └── OperatorAvatar
│   │   └── BaseSelect
│   ├── TimelineView
│   │   ├── Timeline
│   │   └── BaseTag
│   ├── UserView
│   │   ├── LoginForm
│   │   ├── UserProfile
│   │   ├── UserSettings
│   │   └── BaseButton
│   └── 其他页面...
└── TheFooter
```

---

## 五、路由与页面组件映射

| 路由路径 | 页面组件 | 功能描述 |
|----------|----------|----------|
| `/` | `HomeView` | 首页，展示各模块预览 |
| `/factions` | `FactionsView` | 派系档案页面 |
| `/factions/:id` | `FactionsView` | 派系详情页面 |
| `/characters` | `CharactersView` | 人物网络页面 |
| `/characters/:id` | `CharacterDetailView` | 角色详情页面 |
| `/timeline` | `TimelineView` | 历史年表页面 |
| `/events/:id` | `EventDetailView` | 事件详情页面 |
| `/user` | `UserView` | 用户中心页面 |
| `/about` | `AboutView` | 项目说明页面 |
| `/contributing` | `ContributingView` | 贡献指南页面 |
| `/changelog` | `ChangelogView` | 更新日志页面 |
| `/animations` | `AnimationTestView` | 动画测试页面（测试） |
| `/relation-graph` | `RelationGraphView` | 关系图谱页面（测试） |
| `/avatar-gallery` | `AvatarGalleryView` | 头像展示页面（测试） |

---

## 六、总结

本项目组件架构具有以下特点：

1. **职责分明**：组件按功能域划分，每个组件职责单一，便于维护和扩展。

2. **层次清晰**：从布局层到页面层，再到业务组件和UI基础组件，层次结构清晰。

3. **复用性强**：通用UI组件提供统一的样式和交互规范，提高开发效率。

4. **渐进式开发**：部分组件已完成开发，部分组件处于待完善状态，便于逐步迭代。

### 建议改进方向

1. **清理未使用组件**：定期检查并清理不再需要的组件，减少代码冗余。

2. **完善关系图谱**：完成关系图谱相关组件的开发，实现角色关系可视化功能。

3. **组件文档完善**：为每个组件添加JSDoc注释，提高代码可维护性。

---

**文档版本**: v1.0  
**生成日期**: 2026年5月9日  
**项目**: 源石纪事 (Originium Chronicles)
