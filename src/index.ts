export {Toolbar} from './Toolbar.ts';
export {ToolbarAsset} from './ToolbarAsset.ts';
export {ToolbarIcon} from './ToolbarIcon.ts';
export {ToolbarMenu, ToolbarGrid, ToolbarGridRow, ToolbarGridDivider} from './ToolbarMenu.ts';
export {DragHandle} from './DragHandle.ts';

import type {Toolbar} from './Toolbar';
import type {ToolbarAsset} from './ToolbarAsset';
import type {ToolbarIcon} from './ToolbarIcon';
import type {ToolbarMenu, ToolbarGrid, ToolbarGridRow, ToolbarGridDivider} from './ToolbarMenu';
import type {DragHandle} from './DragHandle';

declare global {
    /**
     * 扩展原生 DOM 元素标签映射
     * 支持 document.createElement('forge-toolbar')
     */
    interface HTMLElementTagNameMap {
        'forge-toolbar': Toolbar & HTMLElement
        'forge-toolbar-asset': ToolbarAsset & HTMLElement
        'forge-toolbar-icon': ToolbarIcon & HTMLElement
        'forge-toolbar-menu': ToolbarMenu & HTMLElement
        'forge-toolbar-grid': ToolbarGrid & HTMLElement
        'forge-toolbar-grid-row': ToolbarGridRow & HTMLElement
        'forge-toolbar-grid-divider': ToolbarGridDivider & HTMLElement
        'forge-drag-handle': DragHandle & HTMLElement
    }

    /**
     * 扩展 JSX 内置元素
     * 支持 React/TSX 中使用 <forge-toolbar /> 等
     */
    namespace JSX {
        interface IntrinsicElements {
            'forge-toolbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<Toolbar & HTMLElement>
                align?: 'left' | 'top' | 'right' | 'bottom'
                direction?: 'horizontal' | 'vertical'
            }
            'forge-toolbar-asset': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarAsset & HTMLElement>
                name?: string
                active?: boolean
            }
            'forge-toolbar-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarIcon & HTMLElement>
                action?: string
                icon?: string
                match?: string
                'auto-dismiss'?: boolean
                theme?: string
                'disable-active-background'?: boolean
            }
            'forge-toolbar-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarMenu & HTMLElement>
                'display-icon'?: string
            }
            'forge-toolbar-grid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGrid & HTMLElement>
            }
            'forge-toolbar-grid-row': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGridRow & HTMLElement>
            }
            'forge-toolbar-grid-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGridDivider & HTMLElement>
            }
            'forge-drag-handle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<DragHandle & HTMLElement>
            }
        }
    }
}

// @ts-ignore
declare module 'react/jsx-runtime' {
    /**
     * 扩展 JSX 内置元素
     * 支持 React/TSX 中使用 <forge-toolbar /> 等
     */
    namespace JSX {
        interface IntrinsicElements {
            'forge-toolbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<Toolbar & HTMLElement>
                align?: 'left' | 'top' | 'right' | 'bottom'
                direction?: 'horizontal' | 'vertical'
            }
            'forge-toolbar-asset': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarAsset & HTMLElement>
                name?: string
                active?: boolean
            }
            'forge-toolbar-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarIcon & HTMLElement>
                action?: string
                icon?: string
                match?: string
                'auto-dismiss'?: boolean
                theme?: string
                'disable-active-background'?: boolean
            }
            'forge-toolbar-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarMenu & HTMLElement>
                'display-icon'?: string
            }
            'forge-toolbar-grid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGrid & HTMLElement>
            }
            'forge-toolbar-grid-row': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGridRow & HTMLElement>
            }
            'forge-toolbar-grid-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<ToolbarGridDivider & HTMLElement>
            }
            'forge-drag-handle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<DragHandle & HTMLElement>
            }
        }
    }
}


// 保持此文件为模块
export {}
