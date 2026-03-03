import { forgeElementReady } from "./utils.ts";

import type { ToolbarIcon } from "./ToolbarIcon.ts";
import type { Toolbar } from "./Toolbar.ts";

class ToolbarGridDivider extends HTMLElement {

    constructor() {
        super();

        const style = document.createElement("style");
        style.innerHTML = `
            div.menu-grid-divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 4px 0;
            }
        `;

        const shadow = this.attachShadow({ mode: 'closed' });
        const rootElement = document.createElement('div');
        rootElement.classList.add("menu-grid-divider");
        shadow.appendChild(style);
        shadow.appendChild(rootElement);
    }
}

class ToolbarGridRow extends HTMLElement {

    public readonly rootElement: HTMLDivElement;

    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("menu-grid-row");
        const shadow = this.attachShadow({ mode: 'closed' });
        this.rootElement.appendChild(document.createElement("slot"));

        const style = document.createElement("style");
        style.innerHTML = `
            div.menu-grid-row {
                display: flex;
                gap: 8px;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(this.rootElement);
    }
}

class ToolbarGrid extends HTMLElement {

    public readonly rootElement: HTMLDivElement;
    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("menu-grid");
        const shadow = this.attachShadow({ mode: 'closed' });
        this.rootElement.appendChild(document.createElement("slot"));

        const style = document.createElement("style");
        style.innerHTML = `
            div.menu-grid {
                position: absolute;
                visibility: hidden;
                opacity: 0;
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                transition: opacity 0.2s ease-out, transform 0.2s ease-out;
                pointer-events: none;
            }
            
            div.menu-grid[data-open] {
                visibility: visible;
                opacity: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: auto;
            }
            
            div.menu-grid[data-open][data-toolbar-align="left"] {
                transform: translate(calc(100% + var(--forge-menu-pop-gap, 12px)), -50%) scale(1);
            }

            div.menu-grid[data-open][data-toolbar-align="right"] {
                transform: translate(calc(-100% - var(--forge-menu-pop-gap, 12px)), -50%) scale(1);
            }

            div.menu-grid[data-open][data-toolbar-align="bottom"] {
                transform: translate(-50%, calc(-100% - var(--forge-menu-pop-gap, 12px))) scale(1);
            }

            div.menu-grid[data-open][data-toolbar-align="top"] {
                transform: translate(-50%, calc(100% + var(--forge-menu-pop-gap, 12px))) scale(1);
            }
            
            div.menu-grid[data-toolbar-align="right"] {
                left: 0;
                top: 50%;
                transform: translate(calc(-100% - var(--forge-menu-pop-gap, 12px)), -50%) scale(var(--forge-menu-animation-from-scale, 0.95));
            }
            div.menu-grid[data-toolbar-align="left"] {
                right: 0;
                top: 50%;
                transform: translate(calc(100% + var(--forge-menu-pop-gap, 12px)), -50%) scale(var(--forge-menu-animation-from-scale, 0.95));
            }

            div.menu-grid[data-toolbar-align="bottom"] {
                left: 50%;
                top: 0;
                transform: translate(-50%, calc(-100% - var(--forge-menu-pop-gap, 12px))) scale(var(--forge-menu-animation-from-scale, 0.95));
            }

            div.menu-grid[data-toolbar-align="top"] {
                left: 50%;
                bottom: 0;
                transform: translate(-50%, calc(100% + var(--forge-menu-pop-gap, 12px))) scale(var(--forge-menu-animation-from-scale, 0.95));
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(this.rootElement);
    }
}

class ToolbarMenu extends HTMLElement {

    static isToolbarMenu(element: any): element is ToolbarMenu {
        return element instanceof ToolbarMenu;
    }

    public readonly rootElement: HTMLDivElement;

    private get menuGrid(): ToolbarGrid | null {
        for (const child of Array.from(this.children)) {
            if (child.tagName.toLowerCase() === "forge-toolbar-grid") {
                return child as ToolbarGrid;
            }
        }
        return null;
    }

    static get observedAttributes() {
        return ['display-icon'];
    }

    constructor() {
        super();
        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("menu-container");
        this.rootElement.addEventListener("click", this.toggle);
        document.body.addEventListener("click", (event: any) => {
            forgeElementReady().then(() => {
                if (event.target.closest("forge-toolbar") === null && this.menuGrid && this.menuGrid.rootElement.hasAttribute("data-open")) {
                    this.menuGrid.rootElement.removeAttribute("data-open");
                }
            });
        }, { capture: true });

        const style = document.createElement("style");
        style.innerHTML = `
            div.menu-container {
                position: relative;
                display: inline-block;
            }
        `;

        const iconContainer = document.createElement("div");
        iconContainer.setAttribute("data-icon-container", "");
        const iconSlot = document.createElement("slot");
        iconSlot.setAttribute("name", "icon");
        iconContainer.appendChild(iconSlot);
        this.rootElement.appendChild(iconContainer);

        this.rootElement.appendChild(document.createElement("slot"));

        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.appendChild(style);
        shadow.appendChild(this.rootElement);
    }

    private toggle = () => {

        const toolbar = this.closest("forge-toolbar") as Toolbar;

        const menus = toolbar.querySelectorAll("forge-toolbar-menu") as NodeListOf<ToolbarMenu>;

        menus.forEach(menu => {
            menu.menuGrid?.rootElement.removeAttribute("data-open");
        });

        if (this.menuGrid) {
            if (this.menuGrid.rootElement.hasAttribute("data-open")) {
                this.menuGrid.rootElement.removeAttribute("data-open")
            } else {
                this.menuGrid.rootElement.setAttribute("data-open", "");
            }
        }
    };

    public close() {
        if (this.menuGrid) {
            this.menuGrid.rootElement.removeAttribute("data-open");
        }
    }

    connectedCallback() {
        this.handleChildrenUpdate();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        forgeElementReady().then(() => {
            if (oldValue === newValue) return;
            if (name === 'display-icon') {
                this.refreshActiveIcon(newValue);
            }
        });
    }

    private refreshActiveIcon(displayIconName: string) {
        const iconContainer = this.rootElement.querySelector("[data-icon-container]");
        if (iconContainer) {
            this.querySelectorAll("& > forge-toolbar-icon").forEach((icon: any) => {
                if (icon.getAttribute("icon") === displayIconName) {
                    icon.style.display = "block";
                } else {
                    icon.style.display = "none";
                }
            });
        }
    }

    public updateIcon() {
        const displayIcon = Array.from(this.querySelectorAll("& > forge-toolbar-icon")).filter(icon => {
            return (icon as ToolbarIcon).isActive
        })[0];
        const displayIconName = displayIcon?.getAttribute("icon")
        if (displayIcon && displayIconName) {
            this.setAttribute("display-icon", displayIconName);
        }
    }

    public updateToolbarAlign(align: string) {
        this.rootElement.setAttribute("data-toolbar-align", align);
        this.menuGrid?.rootElement.setAttribute("data-toolbar-align", align);
    }

    private handleChildrenUpdate() {
        forgeElementReady().then(() => {
            this.querySelectorAll("&>forge-toolbar-icon").forEach(icon => {
                icon.setAttribute("slot", "icon");
            });
            const displayIcon = this.getAttribute("display-icon");
            if (displayIcon) {
                this.refreshActiveIcon(displayIcon);
            }
        });
    }
}

if (!customElements.get('forge-toolbar-menu')) {
    console.log("Defining <forge-toolbar-menu> custom element");
    customElements.define('forge-toolbar-menu', ToolbarMenu);
}
if (!customElements.get('forge-toolbar-grid-row')) {
    console.log("Defining <forge-toolbar-grid-row> custom element");
    customElements.define('forge-toolbar-grid-row', ToolbarGridRow);
}
if (!customElements.get('forge-toolbar-grid')) {
    console.log("Defining <forge-toolbar-grid> custom element");
    customElements.define('forge-toolbar-grid', ToolbarGrid);
}
if (!customElements.get('forge-toolbar-grid-divider')) {
    console.log("Defining <forge-toolbar-grid-divider> custom element");
    customElements.define('forge-toolbar-grid-divider', ToolbarGridDivider);
}

export { ToolbarMenu, ToolbarGrid, ToolbarGridRow, ToolbarGridDivider };
