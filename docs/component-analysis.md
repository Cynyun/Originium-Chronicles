# 源石纪事 - 组件功能与核心代码分析

> 本文档深入分析每个组件的主要功能、核心实现思路及关键代码片段，帮助开发者快速理解组件设计。

---

## 一、布局组件

### 1. TheNavbar (导航栏)

**主要功能**：应用顶部导航栏，包含Logo、导航菜单、搜索框和用户登录入口。负责全局导航和用户状态管理。

**核心思路**：
- 使用 `useRouter()` 获取路由实例，实现导航链接
- 通过 `useUserStore()` 管理用户登录状态
- 使用 `IntersectionObserver` 实现导航栏滚动效果（透明/不透明切换）

**关键代码**：
```vue
// 滚动监听实现导航栏样式切换
const handleScroll = () => {
  if (window.scrollY > 50) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}
```

---

### 2. TheFooter (页脚)

**主要功能**：应用底部信息栏，包含版权信息、导航链接和项目说明。

**核心思路**：
- 使用 `router-link` 实现底部导航链接
- 保持简洁的结构，仅展示必要的信息

**关键代码**：
```vue
<router-link to="/about">项目说明</router-link>
<router-link to="/contributing">贡献指南</router-link>
<router-link to="/changelog">更新日志</router-link>
```

---

## 二、首页组件

### 3. HomeHero (首页横幅)

**主要功能**：首页顶部主视觉区域，展示项目标题和核心标语，配合背景动画营造氛围。

**核心思路**：
- 使用 CSS 动画实现背景效果
- 通过 `BaseTag` 展示项目标签
- 提供"开始探索"按钮引导用户

**关键代码**：
```vue
<!-- 背景动画容器 -->
<div class="home-hero__bg">
  <div class="home-hero__pattern"></div>
</div>
```

---

### 4. IntroSection (介绍区域)

**主要功能**：展示项目简介和核心价值主张，引导用户了解项目定位。

**核心思路**：
- 使用 `BaseSectionTitle` 实现带动画的标题
- 响应式布局适配不同屏幕尺寸
- 渐入动画效果提升视觉体验

**关键代码**：
```vue
<BaseSectionTitle :visible="titleVisible">关于源石纪事</BaseSectionTitle>
```

---

### 5. FactionsPreview (派系预览)

**主要功能**：首页展示主要派系的预览卡片，支持左右滑动浏览。

**核心思路**：
- 使用 `scroll-container` 实现横向滚动
- 左右按钮控制滚动方向
- 动态加载派系数据

**关键代码**：
```vue
const scrollContainer = ref(null)

const scroll = (direction) => {
  if (scrollContainer.value) {
    const scrollAmount = 320
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}
```

---

### 6. CharactersPreview (角色预览)

**主要功能**：首页展示关键角色的预览卡片，支持左右滑动浏览。

**核心思路**：
- 与 `FactionsPreview` 类似的滚动机制
- 使用 `CharacterCard` 组件展示角色信息
- 点击卡片跳转至角色详情页

**关键代码**：
```vue
<CharacterCard 
  v-for="character in characters" 
  :key="character.id"
  :character="character"
  @click="goToCharacter(character.id)"
/>
```

---

### 7. TimelinePreview (时间线预览)

**主要功能**：首页展示历史年表的预览区域，展示关键历史事件。

**核心思路**：
- 复用 `Timeline` 组件
- 限制展示数量，保持首页简洁
- 点击跳转至完整时间线页面

**关键代码**：
```vue
<Timeline :events="events.slice(0, 5)" :compact="true" />
```

---

### 8. ChangelogSection (更新日志)

**主要功能**：首页展示最近更新记录，支持点击跳转至完整更新日志页面。

**核心思路**：
- 从 `changelog.json` 动态加载数据
- 按时间倒序排列
- 展示更新标题和简要描述

**关键代码**：
```vue
const loadData = async () => {
  const response = await fetch('/data/changelog.json')
  const data = await response.json()
  versions.value = data.versions.slice(0, 3)
}
```

---

## 三、数据展示组件

### 9. FactionCard (派系卡片)

**主要功能**：展示单个派系的基本信息卡片，包含图标、名称、类型和简要描述。

**核心思路**：
- 通过 props 接收派系数据
- 使用 `BaseTag` 展示派系类型
- 点击卡片触发跳转

**关键代码**：
```vue
<template>
  <div class="faction-card" @click="$emit('click')">
    <div class="faction-card__icon" :style="{ background: faction.color }">
      {{ faction.icon }}
    </div>
    <h3 class="faction-card__name">{{ faction.name }}</h3>
    <BaseTag variant="faction" size="small">{{ faction.type }}</BaseTag>
    <p class="faction-card__desc">{{ faction.description }}</p>
  </div>
</template>
```

---

### 10. CharacterCard (角色卡片)

**主要功能**：展示单个角色的基本信息卡片，包含头像、名称、种族和所属派系。

**核心思路**：
- 使用头像占位符（名字首字）或真实头像
- 展示角色关键属性
- 支持收藏功能

**关键代码**：
```vue
<div class="character-card__avatar">
  <span v-if="!character.avatar">{{ character.name[0] }}</span>
  <img v-else :src="character.avatar" :alt="character.name" />
</div>
```

---

### 11. CharacterGrid (角色网格)

**主要功能**：按派系分组展示角色网格列表，支持展开/收起功能。

**核心思路**：
- 使用 `computed` 按派系分组角色
- 支持展开/收起切换
- 根据角色类型选择不同的头像组件

**关键代码**：
```vue
const groupedCharacters = computed(() => {
  const groups = {}
  characters.value.forEach(char => {
    const faction = char.faction || '未知'
    if (!groups[faction]) groups[faction] = []
    groups[faction].push(char)
  })
  return groups
})
```

---

### 12. Timeline (时间线)

**主要功能**：展示历史事件的时间线组件，支持滑动浏览和事件详情展示。

**核心思路**：
- 自动加载 `timeline.json` 数据
- 使用 `IntersectionObserver` 实现动画
- 支持事件选中状态

**关键代码**：
```vue
const scrollContainer = ref(null)
const selectedIndex = ref(-1)

const selectEvent = (index) => {
  selectedIndex.value = index
}
```

---

## 四、卡片组件

### 13. CharacterAvatar (角色头像)

**主要功能**：角色头像展示组件，支持头像图片和名字首字占位符。

**核心思路**：
- 优先显示头像图片，失败则显示名字首字
- 使用 `@error` 处理图片加载失败

**关键代码**：
```vue
<img 
  v-if="character.avatar" 
  :src="character.avatar" 
  :alt="character.name"
  @error="showPlaceholder = true"
/>
<span v-else>{{ character.name[0] }}</span>
```

---

### 14. FactionLeaderCard (派系领袖卡片)

**主要功能**：展示派系领袖信息的卡片，用于派系详情页。

**核心思路**：
- 展示领袖头像和名称
- 点击跳转至领袖详情页

**关键代码**：
```vue
<div class="faction-leader-card" @click="$router.push(`/characters/${leader.id}`)">
  <CharacterAvatar :character="leader" />
  <span class="leader-name">{{ leader.name }}</span>
</div>
```

---

### 15. FactionStatsCard (派系统计卡片)

**主要功能**：展示派系统计数据的卡片，包含成员数量、势力范围等信息。

**核心思路**：
- 使用图标直观展示统计数据
- 响应式布局

**关键代码**：
```vue
<div class="stat-item">
  <span class="stat-icon">👥</span>
  <span class="stat-value">{{ stats.members }}</span>
  <span class="stat-label">成员</span>
</div>
```

---

### 16. FactionRelationCard (派系关系卡片)

**主要功能**：展示派系关联势力的卡片，用于展示友好/敌对关系。

**核心思路**：
- 使用颜色区分关系类型（友好/中立/敌对）
- 点击跳转至关联派系页面

**关键代码**：
```vue
<div class="relation-card" :class="relation.type">
  <div class="relation-icon" :style="{ background: relation.faction.color }">
    {{ relation.faction.icon }}
  </div>
  <span class="relation-name">{{ relation.faction.name }}</span>
  <span class="relation-type">{{ getRelationType(relation.type) }}</span>
</div>
```

---

## 五、头像组件

### 17. OperatorAvatar (干员头像)

**主要功能**：明日方舟风格的干员头像组件，支持星级、费用等信息展示，采用平行四边形造型。

**核心思路**：
- 使用 CSS 实现平行四边形效果（skewX）
- 动态计算星级颜色
- 展示干员费用

**关键代码**：
```vue
<div class="operator-avatar" :style="{ transform: 'skewX(-15deg)' }">
  <div class="operator-avatar__inner" :style="{ transform: 'skewX(15deg)' }">
    <img :src="operative.art" :alt="operative.name" />
  </div>
  <div class="operator-avatar__cost">{{ operative.cost }}</div>
</div>
```

---

### 18. BasicCharacterAvatar (基础角色头像)

**主要功能**：基础角色头像组件，展示圆形头像，支持图片或名字首字占位。

**核心思路**：
- 圆形布局
- 图片加载失败时显示名字首字

**关键代码**：
```vue
<div class="basic-avatar">
  <img v-if="avatar" :src="avatar" :alt="name" @error="showPlaceholder = true" />
  <span v-else>{{ name[0] }}</span>
</div>
```

---

### 19. CoreMemberAvatar (核心成员头像)

**主要功能**：核心成员头像组件，带有特殊标识，用于突出展示重要角色。

**核心思路**：
- 在基础头像上添加特殊标记
- 标识核心成员身份

**关键代码**：
```vue
<div class="core-avatar">
  <BasicCharacterAvatar :name="name" :avatar="avatar" />
  <div class="core-badge">★</div>
</div>
```

---

## 六、动画组件

### 20. FlowLines (流动线条)

**主要功能**：背景流动线条动画效果，用于页面顶部装饰。

**核心思路**：
- 使用 CSS animation 实现线条流动效果
- SVG 线条绘制

**关键代码**：
```css
@keyframes flow {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}
```

---

### 21. GridAnimation (网格动画)

**主要功能**：网格背景动画效果，营造科技感氛围。

**核心思路**：
- 使用 CSS Grid 创建网格
- 动画闪烁效果

**关键代码**：
```css
.grid-animation {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
}
```

---

### 22. GeometricPattern (几何图案)

**主要功能**：几何图案背景动画效果，用于页面背景装饰。

**核心思路**：
- SVG 几何图形
- 旋转动画

**关键代码**：
```vue
<svg class="geometric-pattern">
  <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" />
</svg>
```

---

## 七、通用UI组件

### 23. BaseButton (基础按钮)

**主要功能**：统一风格的按钮组件，支持多种变体（primary、outline、ghost等）。

**核心思路**：
- 通过 `variant` prop 切换样式
- 支持 `size` prop 控制尺寸

**关键代码**：
```vue
<button 
  class="base-button" 
  :class="[`base-button--${variant}`, `base-button--${size}`]"
  :disabled="disabled"
>
  <slot />
</button>
```

---

### 24. BaseTag (基础标签)

**主要功能**：统一风格的标签组件，用于分类和状态展示，支持多种颜色变体。

**核心思路**：
- 通过 CSS 变量控制颜色
- 支持不同尺寸

**关键代码**：
```vue
<span 
  class="base-tag" 
  :class="[`base-tag--${variant}`, `base-tag--${size}`]"
>
  <slot />
</span>
```

---

### 25. BaseInput (基础输入框)

**主要功能**：统一风格的输入框组件，支持placeholder和聚焦效果。

**核心思路**：
- 绑定 `v-model`
- 聚焦状态样式变化

**关键代码**：
```vue
<input 
  class="base-input" 
  :type="type" 
  :placeholder="placeholder"
  v-model="modelValue"
  @focus="isFocused = true"
  @blur="isFocused = false"
/>
```

---

### 26. BaseSelect (基础选择框)

**主要功能**：统一风格的下拉选择框组件，支持自定义选项和搜索功能。

**核心思路**：
- 使用 `ref` 管理下拉框状态
- 点击外部关闭下拉框

**关键代码**：
```vue
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (!selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}
```

---

### 27. BaseSectionTitle (基础章节标题)

**主要功能**：统一风格的章节标题组件，支持入场动画和视觉层次。

**核心思路**：
- 通过 `visible` prop 控制显示状态
- 渐入动画效果

**关键代码**：
```vue
<h2 class="section-title" :class="{ 'section-title--visible': visible }">
  <span class="section-title__line"></span>
  <slot />
</h2>
```

---

## 八、用户组件

### 28. LoginForm (登录表单)

**主要功能**：用户登录表单组件，支持账号密码输入和登录验证。

**核心思路**：
- 表单验证
- 使用 `useUserStore()` 管理登录状态

**关键代码**：
```vue
const handleSubmit = async () => {
  const result = await userStore.login({ username, password })
  if (result.success) {
    emit('success', result.user)
  }
}
```

---

### 29. LoginModal (登录弹窗)

**主要功能**：登录弹窗容器组件，包含登录表单和关闭按钮。

**核心思路**：
- 遮罩层 + 内容区域
- 点击遮罩关闭弹窗

**关键代码**：
```vue
<div class="modal-overlay" @click.self="$emit('close')">
  <div class="modal-content">
    <button class="modal-close" @click="$emit('close')">✕</button>
    <LoginForm @success="$emit('success', $event)" />
  </div>
</div>
```

---

### 30. UserProfile (用户资料)

**主要功能**：展示用户基本资料的组件，包含头像、昵称和统计信息。

**核心思路**：
- 从 `useUserStore()` 获取用户数据
- 展示收藏数、浏览数等统计

**关键代码**：
```vue
const user = computed(() => userStore.user)
const favorites = computed(() => userStore.favorites)
```

---

### 31. UserSettings (用户设置)

**主要功能**：用户账号设置组件，支持修改个人信息和偏好设置。

**核心思路**：
- 表单绑定用户设置
- 保存设置到 store

**关键代码**：
```vue
const settings = ref({ ...userStore.settings })

const saveSettings = () => {
  userStore.updateSettings(settings.value)
  emit('cancel')
}
```

---

## 九、关系图谱组件

### 32. RelationGraph (关系图谱)

**主要功能**：展示角色和派系之间关系的图谱组件，支持交互式节点浏览。

**核心思路**：
- 使用 `d3.js` 或自定义 SVG 实现力导向图
- 节点拖拽交互

**关键代码**：
```vue
<svg class="relation-graph">
  <g class="nodes">
    <circle 
      v-for="node in nodes" 
      :key="node.id"
      :cx="node.x" 
      :cy="node.y"
      :r="node.size"
    />
  </g>
  <g class="edges">
    <line 
      v-for="edge in edges" 
      :key="edge.id"
      :x1="edge.source.x"
      :y1="edge.source.y"
      :x2="edge.target.x"
      :y2="edge.target.y"
    />
  </g>
</svg>
```

---

## 十、最特别的组件分析

### 1. OperatorAvatar (干员头像)

**特别之处**：
- 采用明日方舟游戏风格的平行四边形造型
- 动态星级颜色（3星及以下白色，4星蓝色，5星橙色，6星橙红色）
- 费用显示在右下角
- 占位符使用 SVG 显示"暂无立绘"

**技术亮点**：
```css
.operator-avatar {
  transform: skewX(-15deg);
  overflow: hidden;
}
.operator-avatar__inner {
  transform: skewX(15deg);
}
```

---

### 2. CharacterGrid (角色网格)

**特别之处**：
- 按派系自动分组展示
- 支持展开/收起功能
- 根据角色类型自动选择头像组件（普通角色 vs 干员）
- 派系图标背景带透明效果

**技术亮点**：
```javascript
const showOperatorAvatar = (character) => {
  return character.isOperator && currentView === 'operatives'
}
```

---

### 3. Timeline (时间线)

**特别之处**：
- 自动加载 JSON 数据
- 平滑滚动浏览
- 事件选中状态管理
- 响应式设计

**技术亮点**：
```javascript
const scrollToEvent = (index) => {
  if (scrollContainer.value) {
    const eventElement = scrollContainer.value.children[index]
    eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
```

---

### 4. BaseSelect (基础选择框)

**特别之处**：
- 自定义下拉框样式，不依赖原生 select
- 点击外部关闭
- 支持搜索功能
- 滚动条隐藏（跨浏览器兼容）

**技术亮点**：
```css
.select__dropdown {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.select__dropdown::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
```

---

### 5. FlowLines (流动线条)

**特别之处**：
- SVG 动画实现流动效果
- 可配置的线条数量和速度
- 用于多个页面的背景装饰

**技术亮点**：
```css
.flow-line {
  stroke-dasharray: 1000;
  animation: flow 3s linear infinite;
}
```

---

### 6. ChangelogSection (更新日志)

**特别之处**：
- 自动从 JSON 加载数据
- 支持"查看全部"跳转
- 简洁的卡片式展示

**技术亮点**：
```javascript
const versions = ref([])

onMounted(async () => {
  const response = await fetch('/data/changelog.json')
  const data = await response.json()
  versions.value = data.versions.slice(0, 3)
})
```

---

### 7. CharacterCard (角色卡片)

**特别之处**：
- 头像图片失败时自动显示名字首字
- 支持收藏功能
- 悬停动画效果

**技术亮点**：
```vue
<img 
  :src="character.avatar" 
  :alt="character.name"
  @error="showPlaceholder = true"
/>
<span v-if="showPlaceholder">{{ character.name[0] }}</span>
```

---

### 8. TheNavbar (导航栏)

**特别之处**：
- 滚动时样式动态变化（透明→不透明）
- 响应式移动端菜单
- 集成搜索和用户登录

**技术亮点**：
```javascript
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
```

---

## 总结

本项目组件架构具有以下特点：

1. **职责分明**：每个组件专注于单一功能
2. **复用性强**：通用 UI 组件（BaseButton、BaseTag 等）在项目中广泛复用
3. **数据驱动**：大部分组件通过 JSON 数据动态渲染
4. **交互丰富**：大量使用动画和过渡效果提升用户体验
5. **响应式设计**：适配不同屏幕尺寸

**最值得关注的组件**：
1. `OperatorAvatar` - 明日方舟风格的干员头像
2. `CharacterGrid` - 智能分组的角色网格
3. `Timeline` - 交互式历史时间线
4. `BaseSelect` - 自定义下拉选择框
5. `FlowLines` - SVG 流动线条动画

---

**文档版本**: v1.0  
**生成日期**: 2026年5月9日  
**项目**: 源石纪事 (Originium Chronicles)
