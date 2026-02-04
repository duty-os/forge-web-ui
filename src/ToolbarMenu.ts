import type { ToolbarIcon } from "./ToolbarIcon.ts";

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
                this.rootElement.appendChild((child as ToolbarIcon).rootElement);
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
        this.rootElement.replaceChildren();
        for (const child of Array.from(this.children)) {
            if (child.tagName.toLowerCase() === "forge-toolbar-grid-row") {
                this.rootElement.appendChild((child as ToolbarGridRow).rootElement);
            }
        }
    }
}

class ToolbarMenu extends HTMLElement {

    private menuGrid: ToolbarGrid | null = null;
    public readonly rootElement: HTMLDivElement;

    static get observedAttributes() {
        return ['align'];
    }

    constructor() {
        super();
        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("menu-container");
        this.rootElement.addEventListener("click", this.toggle);
    }

    private toggle = () => {
        if (this.menuGrid) {
            if (this.menuGrid.rootElement.classList.contains("menu-grid-open")) {
                this.menuGrid.rootElement.classList.remove("menu-grid-open");
            } else {
                this.menuGrid.rootElement.classList.add("menu-grid-open");
            }
        }
    };

    connectedCallback() {
        this.handleChildrenUpdate();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (name === 'align') {
            if (this.menuGrid) {
                this.menuGrid.rootElement.setAttribute("data-align", newValue);
            }
        }
    }

    private handleChildrenUpdate() {
        this.rootElement.replaceChildren();
        let isGridAdded = false;
        for (const child of Array.from(this.children)) {
            if (child.tagName.toLowerCase() === "forge-toolbar-icon") {
                this.rootElement.appendChild((child as ToolbarIcon).rootElement);
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
    }
}

// Register the custom elements
if (!customElements.get('forge-toolbar-grid-row')) {
    customElements.define('forge-toolbar-grid-row', ToolbarGridRow);
}

if (!customElements.get('forge-toolbar-grid')) {
    customElements.define('forge-toolbar-grid', ToolbarGrid);
}

if (!customElements.get('forge-toolbar-menu')) {
    customElements.define('forge-toolbar-menu', ToolbarMenu);
}

export { ToolbarMenu, ToolbarGrid, ToolbarGridRow };
