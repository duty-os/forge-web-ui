import { forgeElementReady } from "./utils.ts";

import type { ToolbarIcon } from "./ToolbarIcon.ts";
import type { Toolbar } from "./Toolbar.ts";

class ToolbarGridDivider extends HTMLElement {

    public readonly rootElement: HTMLDivElement;

    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("menu-grid-divider");
    }
}

class ToolbarGridRow extends HTMLElement {

    public readonly rootElement: HTMLDivElement;

    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("menu-grid-row");
    }

    connectedCallback() {
        this.handleChildrenUpdate();
    }

    private handleChildrenUpdate() {
        this.rootElement.replaceChildren();
        for (const child of Array.from(this.children)) {
            if (child.tagName.toLowerCase() === "forge-toolbar-icon") {
                const icon = child as ToolbarIcon;
                if (icon.rootElement) {
                    this.rootElement.appendChild(icon.rootElement);
                }
            }
            if (child.tagName.toLowerCase() === "forge-toolbar-menu") {
                this.rootElement.appendChild((child as ToolbarMenu).rootElement);
            }
        }
    }
}

class ToolbarGrid extends HTMLElement {

    public readonly rootElement: HTMLDivElement;
    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("menu-grid");
    }

    connectedCallback() {
        this.handleChildrenUpdate();
    }

    private handleChildrenUpdate() {
        forgeElementReady().then(() => {
            this.rootElement.replaceChildren();
            for (const child of Array.from(this.children)) {
                if (child.tagName.toLowerCase() === "forge-toolbar-grid-row") {
                    this.rootElement.appendChild((child as ToolbarGridRow).rootElement);
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-grid-divider") {
                    this.rootElement.appendChild((child as ToolbarGridDivider).rootElement);
                }
            }
        });
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
                this.querySelectorAll("& > forge-toolbar-icon").forEach((icon) => {
                    if (icon.getAttribute("icon") === newValue) {
                        const iconContainer = this.rootElement.querySelector("[data-icon-container]");
                        if (iconContainer) {
                            iconContainer.replaceChildren();
                            iconContainer.appendChild((icon as ToolbarIcon).rootElement);
                        }
                    }
                });
            }
        });
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

    private handleChildrenUpdate() {
        forgeElementReady().then(() => {
            this.rootElement.replaceChildren();
            const iconContainer = document.createElement("div");
            iconContainer.setAttribute("data-icon-container", "");
            this.rootElement.appendChild(iconContainer);
            let isGridAdded = false;
            for (const child of Array.from(this.children)) {
                if (child.tagName.toLowerCase() === "forge-toolbar-icon" && this.getAttribute("display-icon") === child.getAttribute("icon")) {
                    const icon = child as ToolbarIcon;
                    if (icon.rootElement) {
                        iconContainer.appendChild(icon.rootElement);
                    }
                }
                if (child.tagName.toLowerCase() === "forge-toolbar-grid") {
                    if (isGridAdded) {
                        console.warn("Multiple <forge-toolbar-grid> elements found inside <forge-toolbar-menu>. Only the first one will be used.");
                        continue;
                    }
                    isGridAdded = true;
                    this.rootElement.appendChild((child as ToolbarGrid).rootElement);
                }
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

export { ToolbarMenu, ToolbarGrid, ToolbarGridRow };
