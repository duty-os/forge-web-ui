import type { ToolbarIcon } from './ToolbarIcon';
import type { ToolbarMenu } from "./ToolbarMenu.ts";
import type { ToolbarAsset } from "./ToolbarAsset.ts";
import {forgeElementReady} from "./utils.ts";

export class Toolbar extends HTMLElement {

    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly styleElement: HTMLStyleElement;
    private readonly ovserver: MutationObserver;
    private assets: Array<ToolbarAsset>;

    static get observedAttributes() {
        return ['direction', 'tool'];
    }

    constructor() {
        super();
        this.assets = [];
        this.shadow = this.attachShadow({ mode: 'closed' });
        // Create style
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            :host {
                --stroke-color: red;
            }
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
            
            div.toolbar-icon {
                display: inline-block;
                width: 34px;
                height: 34px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.2s;
                box-sizing: border-box;
                object-fit: contain;
            }
            
            div.toolbar-icon > svg {
                width: 100%;
                height: 100%;
            }

            div.toolbar-icon[data-active="true"] {
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
            
            div.menu-grid[data-open] {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            div.menu-grid-row {
                display: flex;
                gap: 8px;
            }
            
            div.menu-grid-divider {
                width: 100%;
                height: 1px;
                background-color: #e0e0e0;
                margin: 4px 0;
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
        forgeElementReady().then(() => {
            this.container.replaceChildren();
            this.assets = [];
            for (const child of Array.from(this.children)) {
                if (!customElements.get(child.tagName.toLowerCase())) {
                    continue;
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-icon") {
                    this.container.appendChild((child as ToolbarIcon).rootElement);
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-menu") {
                    this.container.appendChild((child as ToolbarMenu).rootElement);
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-asset") {
                    this.assets.push(child as ToolbarAsset);
                }
            }
        });
    }

    private handleToolUpdate() {
        forgeElementReady().then(() => {
            const currentTool = this.getAttribute('tool');
            if (currentTool) {
                this.querySelectorAll("forge-toolbar-icon").forEach((icon: Element) => {
                    if (customElements.get(icon.tagName.toLowerCase())) {
                        (icon as ToolbarIcon).updateImage();
                    }
                });
            }
        });
    }

    public getAssetByName(name: string): { regular: ToolbarAsset | null, active: ToolbarAsset | null } {
        const regular = this.assets.find(asset => asset.getAttribute('name') === name && !asset.hasAttribute('active'));
        const active = this.assets.find(asset => asset.getAttribute('name') === name && asset.hasAttribute('active'));
        return { regular: regular ?? null, active: active ?? regular ?? null };
    }
}

if (!customElements.get('forge-toolbar')) {
    console.log("Defining <forge-toolbar> custom element");
    customElements.define('forge-toolbar', Toolbar);
}