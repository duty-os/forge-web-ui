# Forge Web UI - 自定义工具栏组件

一个轻量级的 Web 工具栏组件库，基于 Web Components 构建，专为白板应用设计。

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [组件列表](#组件列表)
  - [forge-toolbar](#forge-toolbar)
  - [forge-toolbar-asset](#forge-toolbar-asset)
  - [forge-toolbar-icon](#forge-toolbar-icon)
  - [forge-toolbar-menu](#forge-toolbar-menu)
  - [forge-toolbar-grid](#forge-toolbar-grid)
  - [forge-toolbar-grid-row](#forge-toolbar-grid-row)
  - [forge-toolbar-grid-divider](#forge-toolbar-grid-divider)
  - [forge-drag-handle](#forge-drag-handle)
- [CSS 变量](#css-变量)
- [完整示例](#完整示例)

## 安装

```bash
npm install
npm run dev
```

## 快速开始

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forge Toolbar Demo</title>
    <script type="module" src="/src/main.ts"></script>
</head>
<body>
    <forge-toolbar align="right" direction="vertical">
        <forge-toolbar-asset name="pencil">
            <svg width="28" height="28" viewBox="0 0 28 28">...</svg>
        </forge-toolbar-asset>
        <forge-toolbar-icon action="tool.pencil" icon="pencil"></forge-toolbar-icon>
    </forge-toolbar>
</body>
</html>
```

## 组件列表

### forge-toolbar

工具栏的主容器组件，管理所有工具栏子元素，并提供白板集成功能。

#### 属性 (Attributes)

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `align` | string | - | 工具栏对齐位置，可选值：`left`, `right`, `top`, `bottom` |
| `direction` | string | - | 工具栏排列方向，可选值：`horizontal`, `vertical` |
| `tool` | string | - | 当前选中的工具类型（只读，由白板同步） |
| `stroke-width` | string | - | 当前笔画宽度（只读，由白板同步） |
| `stroke-color` | string | - | 当前笔画颜色（只读，由白板同步） |
| `undoable` | string | - | 是否可撤销（只读，值为 `"true"` 或 `"false"`） |
| `redoable` | string | - | 是否可重做（只读，值为 `"true"` 或 `"false"`） |

#### 方法 (Methods)

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `connectWhiteboard` | `whiteboard: Whiteboard` | `void` | 连接白板实例，同步状态 |
| `setCurrentTool` | `tool: WhiteboardToolType` | `void` | 设置当前工具 |
| `setStrokeWidth` | `width: number` | `void` | 设置笔画宽度 |
| `setStrokeColor` | `color: string` | `void` | 设置笔画颜色 |
| `undo` | - | `void` | 执行撤销操作 |
| `redo` | - | `void` | 执行重做操作 |
| `clear` | - | `void` | 清空当前页面 |
| `getAssetByName` | `name: string` | `{regular, active}` | 根据名称获取图标资源 |

#### 使用示例

```html
<forge-toolbar align="right" direction="vertical" id="myToolbar">
    <!-- 工具栏内容 -->
</forge-toolbar>

<script>
    const toolbar = document.getElementById('myToolbar');
    toolbar.connectWhiteboard(whiteboardInstance);
</script>
```

---

### forge-toolbar-asset

定义工具栏图标的资源，支持常规状态和激活状态的 SVG 图标。

#### 属性 (Attributes)

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `name` | string | - | 资源名称，供 `forge-toolbar-icon` 引用 |
| `active` | - | - | 存在时表示这是激活状态的图标 |

#### 使用示例

```html
<!-- 定义常规状态的图标 -->
<forge-toolbar-asset name="pencil">
    <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="..." fill="black"/>
    </svg>
</forge-toolbar-asset>

<!-- 定义激活状态的图标 -->
<forge-toolbar-asset name="pencil" active>
    <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="..." fill="#4262FF"/>
    </svg>
</forge-toolbar-asset>
```

#### 说明

- 每个图标可以定义两个版本：常规状态和激活状态
- 如果只定义常规状态，激活时会自动使用相同的图标
- 图标应该是 SVG 格式，建议尺寸为 28x28

---

### forge-toolbar-icon

工具栏中的单个图标按钮，可执行特定操作或根据状态显示不同图标。

#### 属性 (Attributes)

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `icon` | string | - | 引用的资源名称（对应 `forge-toolbar-asset` 的 `name`） |
| `action` | string | - | 点击时执行的动作（详见下表） |
| `match` | string | - | 匹配条件，用于判断图标是否处于激活状态 |
| `theme` | string | - | 主题颜色，设置 CSS 变量 `--theme-color` |
| `disable-active-background` | - | - | 存在时禁用激活状态的背景色 |
| `auto-dismiss` | - | - | 存在时点击后自动关闭父级菜单 |

#### Action 动作格式

`action` 属性支持多个动作，用逗号分隔：

| Action 格式 | 示例 | 描述 |
|-------------|------|------|
| `tool.{工具名}` | `tool.pencil` | 设置当前工具 |
| `stroke-width.{宽度}` | `stroke-width.4` | 设置笔画宽度 |
| `stroke-color.{颜色}` | `stroke-color.#FF0000` | 设置笔画颜色 |
| `call.{方法名}` | `call.undo` | 调用工具栏的方法 |

#### Match 匹配规则

`match` 属性用于判断图标是否应该显示为激活状态，格式与 action 类似：

```html
<!-- 当 tool 属性为 "pencil" 时显示为激活 -->
<forge-toolbar-icon match="tool.pencil" icon="pencil"></forge-toolbar-icon>

<!-- 多个条件，全部满足时才激活 -->
<forge-toolbar-icon match="tool.curve,stroke-width.4" icon="curve"></forge-toolbar-icon>
```

#### 使用示例

```html
<!-- 设置工具 -->
<forge-toolbar-icon action="tool.pencil" icon="pencil"></forge-toolbar-icon>

<!-- 设置笔画宽度 -->
<forge-toolbar-icon action="stroke-width.2" icon="stroke-1"></forge-toolbar-icon>

<!-- 设置笔画颜色 -->
<forge-toolbar-icon action="stroke-color.#FF0000" icon="palette-icon" theme="#FF0000"></forge-toolbar-icon>

<!-- 调用撤销方法 -->
<forge-toolbar-icon action="call.undo" icon="undo"></forge-toolbar-icon>

<!-- 带自动关闭的菜单项 -->
<forge-toolbar-icon action="call.clear" icon="clear" auto-dismiss></forge-toolbar-icon>

<!-- 根据状态匹配显示激活图标 -->
<forge-toolbar-icon match="tool.pencil" icon="pencil"></forge-toolbar-icon>
```

---

### forge-toolbar-menu

弹出式菜单组件，点击后显示包含多个选项的网格面板。

#### 属性 (Attributes)

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `display-icon` | string | - | 显示在菜单按钮上的图标名称 |

#### 方法 (Methods)

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `close` | - | `void` | 关闭菜单面板 |

#### 使用示例

```html
<forge-toolbar-menu display-icon="shape-menu">
    <!-- 菜单按钮显示的图标（可选） -->
    <forge-toolbar-icon match="tool.rectangle" icon="rectangle-menu"></forge-toolbar-icon>

    <!-- 菜单内容网格 -->
    <forge-toolbar-grid>
        <forge-toolbar-grid-row>
            <forge-toolbar-icon action="tool.rectangle" icon="rectangle"></forge-toolbar-icon>
        </forge-toolbar-grid-row>
        <forge-toolbar-grid-row>
            <forge-toolbar-icon action="tool.circle" icon="circle"></forge-toolbar-icon>
        </forge-toolbar-grid-row>
    </forge-toolbar-grid>
</forge-toolbar-menu>
```

#### 说明

- 菜单会根据 `forge-toolbar` 的 `align` 属性自动定位弹出方向
- 点击菜单外的区域会自动关闭菜单
- 同一时间只能打开一个菜单
- 可以在菜单内嵌套其他菜单

---

### forge-toolbar-grid

菜单内容的网格容器，用于组织菜单项的布局。

#### 属性

无

#### 使用示例

```html
<forge-toolbar-grid>
    <forge-toolbar-grid-row>
        <forge-toolbar-icon action="tool.rectangle" icon="rectangle"></forge-toolbar-icon>
    </forge-toolbar-grid-row>
    <forge-toolbar-grid-divider></forge-toolbar-grid-divider>
    <forge-toolbar-grid-row>
        <forge-toolbar-icon action="tool.circle" icon="circle"></forge-toolbar-icon>
    </forge-toolbar-grid-row>
</forge-toolbar-grid>
```

---

### forge-toolbar-grid-row

网格中的一行，用于横向排列多个图标。

#### 属性

无

#### 使用示例

```html
<forge-toolbar-grid-row>
    <forge-toolbar-icon action="stroke-color.#E2E2E2" icon="palette-icon" theme="#E2E2E2"></forge-toolbar-icon>
    <forge-toolbar-icon action="stroke-color.#A1C473" icon="palette-icon" theme="#A1C473"></forge-toolbar-icon>
    <forge-toolbar-icon action="stroke-color.#FFC908" icon="palette-icon" theme="#FFC908"></forge-toolbar-icon>
    <forge-toolbar-icon action="stroke-color.#CC3100" icon="palette-icon" theme="#CC3100"></forge-toolbar-icon>
</forge-toolbar-grid-row>
```

---

### forge-toolbar-grid-divider

菜单项之间的分隔线。

#### 属性

无

#### 使用示例

```html
<forge-toolbar-grid>
    <forge-toolbar-grid-row>
        <forge-toolbar-icon action="tool.rectangle" icon="rectangle"></forge-toolbar-icon>
    </forge-toolbar-grid-row>
    <forge-toolbar-grid-divider></forge-toolbar-grid-divider>
    <forge-toolbar-grid-row>
        <forge-toolbar-icon action="tool.circle" icon="circle"></forge-toolbar-icon>
    </forge-toolbar-grid-row>
</forge-toolbar-grid>
```

---

### forge-drag-handle

拖拽手柄组件，允许用户拖动工具栏并自动吸附到页面边缘。

#### 属性

无

#### 功能说明

- **拖拽移动**：按住拖拽手柄可以移动工具栏
- **自动吸附**：释放时会自动吸附到最近的边缘（左、右、上、下）
- **方向切换**：吸附到上/下边缘时自动切换为水平方向，左/右边缘时切换为垂直方向
- **动画效果**：未吸附到边缘时会以动画方式回到原位置

#### 使用示例

```html
<forge-toolbar align="right" direction="vertical">
    <!-- 其他工具栏内容 -->
    <forge-drag-handle>
        <svg width="27" height="9" viewBox="0 0 27 9">
            <circle cx="1.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
            <circle cx="1.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
            <circle cx="9.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
            <circle cx="9.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
            <!-- 更多圆点... -->
        </svg>
    </forge-drag-handle>
</forge-toolbar>
```

---

## CSS 变量

工具栏组件支持以下 CSS 变量来自定义外观：

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `--forge-menu-align-gap` | `12px` (right), `-12px` (left) | 工具栏距离对齐边缘的间距 |
| `--forge-menu-pop-gap` | `12px` | 菜单弹出时与工具栏的间距 |
| `--stroke-color` | - | 当前笔画颜色（动态设置） |
| `--theme-color` | - | 主题颜色（用于图标） |
| `--drag-offset-x` | `0px` | 拖拽时的 X 轴偏移（内部使用） |
| `--drag-offset-y` | `0px` | 拖拽时的 Y 轴偏移（内部使用） |

#### 自定义示例

```css
:root {
    --forge-menu-pop-gap: 16px;
}

forge-toolbar {
    --forge-menu-align-gap: 20px;
}
```

---

## 完整示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forge Toolbar - Complete Example</title>
    <style>
        body {
            margin: 0;
            width: 100vw;
            height: 100vh;
        }
    </style>
    <script type="module" src="/src/main.ts"></script>
</head>
<body>
    <forge-toolbar align="right" direction="vertical" id="toolbar">
        <!-- 定义图标资源 -->
        <forge-toolbar-asset name="pencil">
            <svg width="28" height="28" viewBox="0 0 28 28">...</svg>
        </forge-toolbar-asset>
        <forge-toolbar-asset name="pencil" active>
            <svg width="28" height="28" viewBox="0 0 28 28">...</svg>
        </forge-toolbar-asset>

        <!-- 工具选择图标 -->
        <forge-toolbar-icon action="tool.pencil" icon="pencil"></forge-toolbar-icon>
        <forge-toolbar-icon action="tool.grab" icon="grab"></forge-toolbar-icon>

        <!-- 形状菜单 -->
        <forge-toolbar-menu display-icon="rectangle-menu">
            <forge-toolbar-icon match="tool.rectangle" icon="rectangle-menu"></forge-toolbar-icon>
            <forge-toolbar-grid>
                <forge-toolbar-grid-row>
                    <forge-toolbar-icon action="tool.rectangle" icon="rectangle"></forge-toolbar-icon>
                </forge-toolbar-grid-row>
                <forge-toolbar-grid-row>
                    <forge-toolbar-icon action="tool.circle" icon="circle"></forge-toolbar-icon>
                </forge-toolbar-grid-row>
            </forge-toolbar-grid>
        </forge-toolbar-menu>

        <!-- 颜色选择菜单 -->
        <forge-toolbar-menu display-icon="palette">
            <forge-toolbar-icon icon="palette"></forge-toolbar-icon>
            <forge-toolbar-grid>
                <forge-toolbar-grid-row>
                    <forge-toolbar-icon action="stroke-color.#E2E2E2" icon="palette-icon" theme="#E2E2E2" disable-active-background></forge-toolbar-icon>
                    <forge-toolbar-icon action="stroke-color.#FF0000" icon="palette-icon" theme="#FF0000" disable-active-background></forge-toolbar-icon>
                </forge-toolbar-grid-row>
            </forge-toolbar-grid>
        </forge-toolbar-menu>

        <!-- 撤销/重做 -->
        <forge-toolbar-icon match="undoable.true" action="call.undo" icon="undo" disable-active-background></forge-toolbar-icon>
        <forge-toolbar-icon match="redoable.true" action="call.redo" icon="redo" disable-active-background></forge-toolbar-icon>

        <!-- 拖拽手柄 -->
        <forge-drag-handle>
            <svg width="27" height="9" viewBox="0 0 27 9">
                <circle cx="1.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="1.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="9.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="9.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="17.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="17.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="25.5" cy="1.5" r="1.5" fill="black" fill-opacity="0.1"/>
                <circle cx="25.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.1"/>
            </svg>
        </forge-drag-handle>
    </forge-toolbar>

    <script>
        // 连接白板实例
        const toolbar = document.getElementById('toolbar');
        toolbar.connectWhiteboard(whiteboardInstance);
    </script>
</body>
</html>
```

---

## 技术特性

- **Web Components**：基于原生 Web Components 构建，无框架依赖
- **Shadow DOM**：使用 Shadow DOM 隔离样式，避免样式冲突
- **TypeScript**：完整的 TypeScript 类型支持
- **响应式设计**：自动适配不同的对齐方式和方向
- **可拖拽**：内置拖拽和自动吸附功能
- **可扩展**：易于自定义和扩展新功能

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge），需要支持以下特性：
- Custom Elements
- Shadow DOM
- ES6+ JavaScript

## 许可证

ISC
