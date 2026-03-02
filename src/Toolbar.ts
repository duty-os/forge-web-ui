import type {ToolbarStyle, Whiteboard, WhiteboardToolType} from "@netless/forge-whiteboard";

import type { ToolbarIcon } from './ToolbarIcon';
import type { ToolbarMenu } from "./ToolbarMenu.ts";
import type { ToolbarAsset } from "./ToolbarAsset.ts";
import { forgeElementReady } from "./utils.ts";
// import {DragHandle} from "./DragHandle.ts";

export class Toolbar extends HTMLElement {

    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly styleElement: HTMLStyleElement;
    private readonly ovserver: MutationObserver;
    private assets: Array<ToolbarAsset>;
    private whiteboard: Whiteboard | null = null;

    static get observedAttributes() {
        return ['align', 'direction', 'tool', 'stroke-width', 'stroke-color', 'undoable', 'redoable'];
    }

    constructor() {
        super();
        this.assets = [];
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
                position: absolute;
                z-index: 999;
            }

            div.container[data-align="right"] {
                right: 0;
                top: 50%;
                transform: translate(calc(var(--forge-menu-align-gap, -12px) + var(--drag-offset-x, 0px)), calc(-50% + var(--drag-offset-y, 0px)));
            }

            div.container[data-align="left"] {
                left: 0;
                top: 50%;
                transform: translate(calc(var(--forge-menu-align-gap, 12px) + var(--drag-offset-x, 0px)), calc(-50% + var(--drag-offset-y, 0px)));
            }

            div.container[data-align="top"] {
                left: 50%;
                top: 0;
                transform: translate(calc(-50% + var(--drag-offset-x, 0px)), calc(var(--forge-menu-align-gap, 12px) + var(--drag-offset-y, 0px)));
            }

            div.container[data-align="bottom"] {
                left: 50%;
                bottom: 0;
                transform: translate(calc(-50% + var(--drag-offset-x, 0px)), calc(var(--drag-offset-y, 0px) - var(--forge-menu-align-gap, 12px)));
            }

            div.container[data-direction="vertical"] {
                flex-direction: column;
            }

            div.container[data-direction="horizontal"] {
                flex-direction: row;
            }
        `;

        this.shadow.appendChild(this.styleElement);
        this.container = document.createElement('div');
        this.container.classList.add('container');
        this.container.appendChild(document.createElement("slot"));
        this.shadow.appendChild(this.container);
        this.ovserver = new MutationObserver(() => this.connectedCallback());
        this.ovserver.observe(this, {
            childList: true
        });
    }

    connectedCallback() {
        this.handleChildrenUpdate();
        this.handleWhiteboardAttrUpdate();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        forgeElementReady().then(() => {
            if (oldValue === newValue) return;

            if (name === 'tool' || name === 'stroke-width' || name === 'stroke-color' || name === 'undoable' || name === 'redoable') {
                this.handleWhiteboardAttrUpdate();
            }
            if (name === 'direction') {
                this.container.setAttribute('data-direction', newValue);
            }
            if (name === 'align') {
                this.container.setAttribute('data-align', newValue);
                this.querySelectorAll("forge-toolbar-menu").forEach(menu => {
                    (menu as ToolbarMenu).updateToolbarAlign(newValue);
                });
            }
        });
    }

    public connectWhiteboard(whiteboard: Whiteboard) {
        whiteboard.addListener("toolbarStyleChange", this.handleWhiteboardStyleUpdate);

        this.setAttribute("tool", whiteboard.tool);
        this.setAttribute("stroke-width", whiteboard.strokeWidth?.toString() ?? "1");
        this.setAttribute("stroke-color", whiteboard.strokeColor);
        this.container.style.setProperty("--stroke-color", whiteboard.strokeColor);

        this.setAttribute("undoable", "false");
        this.setAttribute("redoable", "false");

        whiteboard.addListener("undoStackLength", this.handleUndoStackChange);
        whiteboard.addListener("redoStackLength", this.handleRedoStackChange);

        this.whiteboard = whiteboard;
    }

    private handleRedoStackChange = (length: number) => {
        if (length > 0) {
            this.setAttribute("redoable", "true");
        } else {
            this.setAttribute("redoable", "false");
        }
    }

    private handleUndoStackChange = (length: number) => {
        if (length > 0) {
            this.setAttribute("undoable", "true");
        } else {
            this.setAttribute("undoable", "false");
        }
    };

    private handleWhiteboardStyleUpdate = (style: ToolbarStyle) => {
        this.setAttribute("tool", style.tool);
        this.setAttribute("stroke-width", style.strokeWidth?.toString() ?? "1");
        this.setAttribute("stroke-color", style.strokeColor);
        this.container.style.setProperty("--stroke-color", style.strokeColor);
    };

    public setCurrentTool(tool: WhiteboardToolType) {
        if (this.whiteboard) {
            this.whiteboard.tool = tool;
        }
    }

    public setStrokeWidth(width: number) {
        if (this.whiteboard) {
            this.whiteboard.strokeWidth = width;
        }
    }

    public setStrokeColor(color: string) {
        if (this.whiteboard) {
            this.whiteboard.strokeColor = color;
        }
    }

    public undo() {
        if (this.whiteboard) {
            this.whiteboard.undo();
        }
    }

    public redo() {
        if (this.whiteboard) {
            this.whiteboard.redo();
        }
    }

    public clear() {
        if (this.whiteboard) {
            this.whiteboard.clearPage();
        }
    }

    private handleChildrenUpdate() {
        forgeElementReady().then(() => {
            this.assets = [];
            for (const child of Array.from(this.children)) {
                if (!customElements.get(child.tagName.toLowerCase())) {
                    continue;
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-asset") {
                    this.assets.push(child as ToolbarAsset);
                    child.remove();
                }
            }
        });
    }

    private handleWhiteboardAttrUpdate() {
        forgeElementReady().then(() => {
            this.querySelectorAll("forge-toolbar-icon").forEach((icon: Element) => {
                (icon as ToolbarIcon).updateImage();
            });
            this.querySelectorAll("forge-toolbar-menu").forEach((menu: Element) => {
                (menu as ToolbarMenu).updateIcon();
            });
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