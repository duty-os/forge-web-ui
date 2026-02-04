import type { ToolbarIcon } from './ToolbarIcon';
import type {ToolbarMenu} from "./ToolbarMenu.ts";

export class Toolbar extends HTMLElement {

    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly styleElement: HTMLStyleElement;
    private readonly ovserver: MutationObserver;

    static get observedAttributes() {
        return ['direction', 'tool'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        // Create style
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            div.container {
                display: flex;
                gap: 12px;
                align-items: center;
                background: white;
                padding: 8px !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
            }

            div.container[data-direction="vertical"] {
                flex-direction: column;
            }

            div.container[data-direction="horizontal"] {
                flex-direction: row;
            }

            forge-toolbar-icon {
                width: 34px;
                height: 34px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            forge-toolbar-icon[selected] {
                background-color: #e0e7ff;
            }

            forge-toolbar-menu {
                width: 34px;
                height: 34px;
                cursor: pointer;
            }
            
            img.toolbar-icon {
                display: inline-block;
                width: 34px;
                height: 34px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.2s;
                box-sizing: border-box;
                object-fit: contain;
            }

            img.toolbar-icon[data-active="true"] {
                background-color: #e0e7ff;
            }
            
            div.menu-container {
                position: relative;
                display: inline-block;
            }
            
            div.menu-grid {
                position: absolute;
                display: none;
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                z-index: 1000;
            }
            
            div.menu-grid[data-align="right"] {
                right: 0;
                top: 50%;
                transform: translate(calc(100% + var(--forge-menu-pop-gap, 12px)), -50%);
            }
            
            div.menu-grid[data-align="left"] {
                left: 0;
                top: 50%;
                transform: translate(calc(-100% - var(--forge-menu-pop-gap, 12px)), -50%);
            }
            
            div.menu-grid[data-align="top"] {
                left: 50%;
                top: 0;
                transform: translate(-50%, calc(-100% - var(--forge-menu-pop-gap, 12px)));
            }
            
            div.menu-grid[data-align="bottom"] {
                left: 50%;
                bottom: 0;
                transform: translate(-50%, calc(100% + var(--forge-menu-pop-gap, 12px)));
            }
            
            div.menu-grid[data-open="true"] {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            div.menu-grid-row {
                display: flex;
                gap: 8px;
            }
        `;

        this.shadow.appendChild(this.styleElement);
        this.container = document.createElement('div');
        this.container.classList.add('container');
        this.shadow.appendChild(this.container);
        this.ovserver = new MutationObserver(() => this.connectedCallback());
        this.ovserver.observe(this, {
            childList: true
        });
    }

    connectedCallback() {
        this.handleChildrenUpdate();
        this.handleToolUpdate();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'tool') {
            this.handleToolUpdate();
        }
        if (name === 'direction') {
            this.container.setAttribute('data-direction', newValue);
        }
    }

    private handleChildrenUpdate() {
        this.container.replaceChildren();
        for (const child of Array.from(this.children)) {
            if (child.tagName.toLowerCase() === "forge-toolbar-icon") {
                this.container.appendChild((child as ToolbarIcon).rootElement);
            }
            if (child.tagName.toLowerCase() === "forge-toolbar-menu") {
                this.container.appendChild((child as ToolbarMenu).rootElement);
            }
        }
    }

    private handleToolUpdate() {
        const currentTool = this.getAttribute('tool');
        if (currentTool) {
            this.querySelectorAll("forge-toolbar-icon").forEach((icon: Element) => {
                (icon as ToolbarIcon).updateImage();
            });
        }
    }
}

// Register the custom element
if (!customElements.get('forge-toolbar')) {
    customElements.define('forge-toolbar', Toolbar);
}