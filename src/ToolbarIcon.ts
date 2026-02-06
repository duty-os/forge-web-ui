import type { Toolbar } from "./Toolbar.ts";
import {forgeElementReady} from "./utils.ts";

class ToolbarIcon extends HTMLElement {

    public readonly rootElement: HTMLDivElement;

    private get toolbar(): Toolbar | null {
        return this.closest('forge-toolbar') as Toolbar;
    }

    private get _isActive(): boolean {
        if (!this.toolbar) { return false; }
        const match = this.getAttribute("match") || this.getAttribute("action");
        const predicates = match ? match.split(",").map(s => s.trim()) : [];
        if (predicates.length === 0) {
            return false;
        }
        return predicates.every(predicate => {
            const [attr, value] = predicate.split(".");
            return this.toolbar!.getAttribute(attr) === value;
        });
    }

    static get observedAttributes() {
        return ['icon', 'action'];
    }

    constructor() {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.classList.add("toolbar-icon");
        this.rootElement.addEventListener("click", this.handleClick);
    }

    private  handleClick = (e: PointerEvent) => {
        const action = this.getAttribute("action");
        if (action) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Icon clicked:", this.getAttribute("action"));
        }
    };

    connectedCallback() {
        this.updateImage();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.updateImage();
        }
    }

    public updateImage() {
        forgeElementReady().then(() => {
            const assetName = this.getAttribute('icon');
            if (!this.toolbar || !assetName) {
                return;
            }
            const {regular, active} = this.toolbar.getAssetByName(assetName);

            if (this._isActive) {
                if (active) {
                    this.rootElement.replaceChildren();
                    this.rootElement.appendChild(active.rootElement);
                } else {
                    console.warn(`[ForgeToolbar] Active asset not found for icon: ${assetName}`);
                }
                this.rootElement.setAttribute("data-active", "true");
            } else {
                if (regular) {
                    this.rootElement.replaceChildren();
                    this.rootElement.appendChild(regular.rootElement);
                } else {
                    console.warn(`[ForgeToolbar] Regular asset not found for icon: ${assetName}`);
                }
                this.rootElement.setAttribute("data-active", "false");
            }
        });
    }
}

// Register the custom element
if (!customElements.get('forge-toolbar-icon')) {
    console.log("Defining <forge-toolbar-icon> custom element");
    customElements.define('forge-toolbar-icon', ToolbarIcon);
}

export { ToolbarIcon };
