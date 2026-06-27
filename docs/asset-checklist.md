# 源石纪事 - 项目待补充内容清单

> 本清单用于指导美术与文案人员为《源石纪事》项目补充必要的静态资源。所有资源需遵循项目统一的**视觉设计规范**。

---

## 一、角色相关图片

| 资源类型 | 用途说明 | 使用组件 | 存放路径 | 命名规范 | 格式与要求 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **角色头像 (Avatar)** | 用于 `CharacterCard` 等小组件，展示角色核心形象。 | `CharacterCard`, `CharacterGrid`, `CharacterAvatar`, `CoreMemberAvatar` | `public/images/characters/avatars/` | `[角色ID].png` | **必须为PNG格式，带透明通道(Alpha)**。尺寸建议128x128或256x256，采用胸像构图，确保面部清晰可辨。 |
| **角色立绘 (Full Art)** | 用于 `CharacterDetailView` 详情页，作为主要视觉元素。 | `CharacterDetailView` | `public/images/characters/full/` | `[角色ID]_full.png` 或 `[角色ID]_full.jpg` | **可接受PNG或JPG格式**。PNG用于需要透明背景的特殊场景，JPG用于带背景的常规立绘。建议尺寸1024x1024或更高，风格遵循明日方舟官方设定集。 |
| **角色小图标 (Icon)** | 用于关系图、标签等空间极小的区域。 | `RelationGraph`, `CharacterNode` | `public/images/characters/icons/` | `[角色ID]_icon.png` | **必须为PNG格式，带透明通道**。尺寸建议64x64或128x128，需保证在小尺寸下依然清晰可辨，采用极简风格。 |
| **干员立绘 (Operator Art)** | 用于干员头像组件，展示无背景的干员形象。 | `OperatorAvatar` | `public/images/characters/operators/` | `[角色ID]_op.png` | **必须为PNG格式，带透明通道**。尺寸建议512x512，采用明日方舟游戏中的立绘风格，人物居中，无背景。 |

---

## 二、派系相关图片

| 资源类型 | 用途说明 | 使用组件 | 存放路径 | 命名规范 | 格式与要求 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **派系徽标 (Logo)** | 作为派系的快速识别符号。 | `FactionCard`, `FactionsView`, `CharacterGrid` | `public/images/factions/logos/` | `[派系ID].png` | **必须为PNG格式，带透明通道**。设计应简洁，具备高辨识度，尺寸建议256x256或512x512。 |
| **派系背景 (Background)** | 用于派系详情页的背景，烘托氛围。 | `FactionsView` | `public/images/factions/bgs/` | `[派系ID]_bg.jpg` | **推荐使用JPG格式**以减小文件体积。尺寸需适配宽屏显示（如1920x1080或更高），色调与派系主题一致，建议使用深色系背景。 |
| **派系图标 (Icon)** | 用于小型展示区域，如标签、按钮等。 | `FactionTag`, `FactionRelationCard` | `public/images/factions/icons/` | `[派系ID]_icon.png` | **必须为PNG格式，带透明通道**。尺寸建议128x128，设计简洁，突出派系特征。 |

---

## 三、场景与背景图片

| 资源类型 | 用途说明 | 使用组件 | 存放路径 | 命名规范 | 格式与要求 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **首页背景 (Hero BG)** | 用于首页横幅区域，营造整体氛围。 | `HomeHero` | `public/images/backgrounds/` | `home_hero.jpg` | **推荐使用JPG格式**。尺寸建议1920x1080或更高，风格与明日方舟世界观一致，突出源石、科技、末世等元素。 |
| **通用背景纹理 (Pattern)** | 用于页面背景装饰，增加层次感。 | 全局 | `public/images/backgrounds/` | `pattern_[名称].png` | **PNG格式，带透明通道**。可重复平铺的纹理图案，建议尺寸512x512。 |

---

## 四、文案与数据

| 内容类型 | 用途说明 | 存放路径 | 文件格式 | 要求 |
| :--- | :--- | :--- | :--- | :--- |
| **角色数据** | 包含角色的所有文本信息（姓名、简介、故事、技能等）。 | `public/data/characters.json` | JSON | 需包含：id, name, alias, race, faction, description, story, skills, tags等字段，文本需校对无误，符合明日方舟官方设定。 |
| **派系数据** | 包含派系的所有文本信息（名称、领袖、历史、成员等）。 | `public/data/factions.json` | JSON | 需包含：id, name, type, founded, description, history, leader, members, relations等字段，文本需校对无误。 |
| **事件数据** | 包含历史年表事件的所有文本信息。 | `public/data/timeline.json` | JSON | 需包含：id, year, title, description, category, importance, location, quotes, relatedCharacters, relatedFactions等字段。 |
| **更新日志数据** | 包含项目更新记录。 | `public/data/changelog.json` | JSON | 需包含：version, date, title, changes等字段。 |
| **干员数据** | 包含可获取干员的特殊信息（星级、职业、费用等）。 | `public/data/operatives.json` | JSON | 需包含：id, characterId, rarity, class, cost, tags等字段。 |

---

## 五、图标与UI资源

| 资源类型 | 用途说明 | 存放路径 | 命名规范 | 格式与要求 |
| :--- | :--- | :--- | :--- | :--- |
| **UI图标 (Icons)** | 用于按钮、导航、状态指示等UI元素。 | `public/images/ui/icons/` | `[图标名称].svg` | **SVG格式**，支持缩放不失真，颜色可通过CSS调整。 |
| **加载动画 (Loading)** | 用于数据加载时的占位动画。 | `public/images/ui/` | `loading.svg` | **SVG格式**，简洁的加载动画效果。 |
| **Logo** | 项目主Logo。 | `public/images/ui/` | `logo.svg`, `logo.png` | SVG用于缩放场景，PNG用于固定尺寸展示。 |

---

## 六、资源命名规范详解

### 6.1 文件命名规则

| 类型 | 示例 | 说明 |
| :--- | :--- | :--- |
| 角色头像 | `amiya.png` | 使用角色ID作为文件名 |
| 角色立绘 | `amiya_full.png` | 角色ID + `_full` 后缀 |
| 角色图标 | `amiya_icon.png` | 角色ID + `_icon` 后缀 |
| 干员立绘 | `amiya_op.png` | 角色ID + `_op` 后缀 |
| 派系徽标 | `rhodes_island.png` | 使用派系ID作为文件名 |
| 派系背景 | `rhodes_island_bg.jpg` | 派系ID + `_bg` 后缀 |
| 派系图标 | `rhodes_island_icon.png` | 派系ID + `_icon` 后缀 |

### 6.2 ID命名规则

- **角色ID**：使用角色英文名（全小写，空格用下划线分隔），如 `amiya`, `doctor`, `kaltsit`
- **派系ID**：使用派系英文名（全小写，空格用下划线分隔），如 `rhodes_island`, `reunion`, `kjerag`

---

## 七、资源格式规范

### 7.1 图片格式选择

| 格式 | 适用场景 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **PNG** | 需要透明背景的图片（头像、图标、徽标） | 支持透明通道，无损压缩 | 文件体积较大 |
| **JPG** | 带背景的图片（立绘、背景图） | 文件体积小，兼容性好 | 不支持透明通道，有损压缩 |
| **SVG** | 图标、Logo、矢量图形 | 无限缩放不失真，可通过CSS调整颜色 | 不适合复杂照片 |

### 7.2 图片尺寸建议

| 资源类型 | 建议尺寸 | 备注 |
| :--- | :--- | :--- |
| 角色头像 | 128x128 或 256x256 | 正方形 |
| 角色立绘 | 1024x1024 或更高 | 可根据实际需要调整 |
| 角色图标 | 64x64 或 128x128 | 正方形 |
| 干员立绘 | 512x512 | 正方形，居中构图 |
| 派系徽标 | 256x256 或 512x512 | 正方形 |
| 派系背景 | 1920x1080 或更高 | 宽屏比例 |
| UI图标 | 64x64 或 128x128 | SVG格式，可缩放 |

---

## 八、数据字段规范

### 8.1 角色数据字段

```json
{
"id": "string",
"name": "string",
"alias": "string",
"race": "string",
"faction": "string",
"description": "string",
"story": "string",
"skills": ["string"],
"tags": ["string"],
"avatar": "string",
"fullArt": "string",
"icon": "string",
"isOperator": "boolean",
"operatorData": {
    "rarity": "number",
    "class": "string",
    "cost": "number"
}
}
```

### 8.2 派系数据字段

```json
{
"id": "string",
"name": "string",
"type": "string",
"founded": "string",
"description": "string",
"history": "string",
"leader": "string",
"members": ["string"],
"relations": [
    {
    "faction": "string",
    "type": "string"
    }
],
"logo": "string",
"bg": "string"
}
```

### 8.3 事件数据字段

```json
{
"id": "string",
"year": "string",
"title": "string",
"description": "string",
"category": "string",
"importance": "string",
"location": "string",
"quotes": [
    {
    "text": "string",
    "author": "string"
    }
],
"relatedCharacters": ["string"],
"relatedFactions": ["string"]
}
```

---

## 九、资源状态追踪

### 9.1 角色资源状态

| 角色名称 | ID | 头像 | 立绘 | 图标 | 干员立绘 | 数据 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 阿米娅 | `amiya` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 博士 | `doctor` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 凯尔希 | `kaltsit` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| W | `w` | ✅ | ⬜ | ⬜ | ⬜ | ✅ |
| 塔露拉 | `talulah` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### 9.2 派系资源状态

| 派系名称 | ID | 徽标 | 背景 | 图标 | 数据 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 罗德岛 | `rhodes_island` | ⬜ | ⬜ | ⬜ | ✅ |
| 整合运动 | `reunion` | ⬜ | ⬜ | ⬜ | ✅ |
| 龙门 | `lungmen` | ⬜ | ⬜ | ⬜ | ✅ |
| 卡西米尔 | `casimir` | ⬜ | ⬜ | ⬜ | ✅ |
| 谢拉格 | `kjerag` | ⬜ | ⬜ | ⬜ | ✅ |

---

## 重要提示

1. **设计规范**：所有图片资源的实际**尺寸、比例和艺术风格**，请务必以最新的 **UI/UX设计稿** 和 **角色/派系设定集** 为准。本清单仅规定了资源的分类、用途和基础格式要求。

2. **版权声明**：本项目为非商业性粉丝作品，所有资源均应基于《明日方舟》官方公开素材进行创作，不得使用未授权的第三方资源。

3. **文件组织**：请严格按照本清单规定的路径存放资源，确保项目结构清晰，便于开发和维护。

4. **版本控制**：建议对资源文件进行版本管理，定期备份，避免资源丢失。

---

**文档版本**: v1.0  
**生成日期**: 2026年5月9日  
**项目**: 源石纪事 (Originium Chronicles)
