// 导出所有工具栏组件
export { Toolbar } from './Toolbar.ts';
export { ToolbarAsset } from './ToolbarAsset.ts';
export { ToolbarIcon } from './ToolbarIcon.ts';
export { ToolbarMenu, ToolbarGrid, ToolbarGridRow } from './ToolbarMenu.ts';
export { DragHandle } from './DragHandle.ts';

// 自动注册所有自定义元素
export function registerComponents() {
  // 组件会自动注册，无需手动调用
  // 这些自定义元素在各自文件中已经注册
}

// 类型导出
export type { ToolbarStyle, Whiteboard, WhiteboardToolType } from '@netless/forge-whiteboard';
