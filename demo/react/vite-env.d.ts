/// <reference types="vite/client" />
import '@netless/forge-web-ui'

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            // 扩展现有的 div 元素，增加一个自定义属性 'myCustomProp'
            divv: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
                myCustomProp?: string;
            };
            // 定义一个全新的原生标签
            'my-custom-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                customAttribute?: boolean;
            };
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // 扩展现有的 div 元素，增加一个自定义属性 'myCustomProp'
            divv: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
                myCustomProp?: string;
            };
            // 定义一个全新的原生标签
            'my-custom-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                customAttribute?: boolean;
            };
        }
    }
}