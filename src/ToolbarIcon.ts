import {Toolbar} from "./Toolbar.ts";

class ToolbarIcon extends HTMLElement {

    public readonly rootElement: HTMLImageElement;

    private get toolbar(): Toolbar | null {
        return this.closest('forge-toolbar') as Toolbar | null;
    }

    private get _isActive(): boolean {
        if (!this.toolbar) { return false; }
        const tool = this.toolbar.getAttribute("tool");
        if (tool && this.getAttribute("action") === `tool.${tool}`) {
            return true;
        }
        return false;
    }

    static get observedAttributes() {
        return ['icon', 'active-icon', 'action'];
    }

    constructor() {
        super();
        this.rootElement = document.createElement('img');
        this.rootElement.classList.add("toolbar-icon");
    }

    connectedCallback() {
        this.updateImage();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.updateImage();
        }
    }

    public updateImage() {

        const url = this.getAttribute('icon');
        const activeUrl = this.getAttribute('active-icon');

        if (this._isActive) {
            this.rootElement.src = activeUrl ?? (url ?? '');
            this.rootElement.setAttribute("data-active", "true");
        } else if (url) {
            this.rootElement.setAttribute("data-active", "false");
            this.rootElement.src = url;
        }
    }
}

// Register the custom element
if (!customElements.get('forge-toolbar-icon')) {
    customElements.define('forge-toolbar-icon', ToolbarIcon);
}

export { ToolbarIcon };
