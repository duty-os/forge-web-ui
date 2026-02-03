import {ToolbarIcon} from "./ToolbarIcon.ts";

class ToolbarGridRow extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                gap: 8px;
            }
        `;

        this.container = document.createElement('div');
        this.container.style.display = 'flex';
        this.container.style.gap = '8px';

        this.shadow.appendChild(style);
        this.shadow.appendChild(this.container);
    }

    connectedCallback() {
        // Move children to shadow DOM
        const children = Array.from(this.children);
        children.forEach(child => {
            if (child.tagName === 'FORGE-TOOLBAR-ICON') {
                this.container.appendChild(child);
            } else {
                console.warn('forge-toolbar-grid-row only accepts forge-toolbar-icon as direct child');
            }
        });
    }
}

class ToolbarGrid extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
        `;

        this.container = document.createElement('div');
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.gap = '8px';

        this.shadow.appendChild(style);
        this.shadow.appendChild(this.container);
    }

    connectedCallback() {
        // Move children to shadow DOM
        const children = Array.from(this.children);
        children.forEach(child => {
            if (child instanceof ToolbarGridRow) {
                this.container.appendChild(child);
            } else {
                console.warn('forge-toolbar-grid only accepts forge-toolbar-grid-row as direct child');
            }
        });
    }
}

class ToolbarMenu extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private readonly toolbarIcon: ToolbarIcon;
    private menuGrid: ToolbarGrid | null = null;
    private _isOpen: boolean = false;
    private _align: 'right' | 'left' | 'top' | 'bottom' = 'right';
    private parentToolbar: any = null;

    static get observedAttributes() {
        return ['url', 'active-url', 'align', 'tag'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        // Style for the menu component
        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: relative;
                display: inline-block;
            }

            forge-toolbar-grid {
                position: absolute;
                left: 0;
                top: 0;
                display: none;
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                z-index: 1000;
            }

            forge-toolbar-grid.open {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            forge-toolbar-grid-row {
                display: flex;
                gap: 8px;
            }
        `;

        // Create a ToolbarIcon for displaying the menu icon
        this.toolbarIcon = document.createElement('forge-toolbar-icon') as ToolbarIcon;
        this.shadow.appendChild(style);
        this.shadow.appendChild(this.toolbarIcon);

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this._isOpen && !this.contains(e.target as Node)) {
                this.close();
            }
        });

        // Toggle menu on icon click
        this.toolbarIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
    }

    connectedCallback() {
        this.updateIcon();
        this.updateMenuContent();
        this.updateAlign();
        this.updateSelection();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'url' || name === 'active-url') {
            this.updateIcon();
        } else if (name === 'align') {
            this.updateAlign();
        } else if (name === 'tag') {
            this.updateSelection();
        }
    }

    private updateIcon() {
        const url = this.getAttribute('url');
        const activeUrl = this.getAttribute('active-url');

        if (url) this.toolbarIcon.setAttribute('url', url);
        if (activeUrl) this.toolbarIcon.setAttribute('active-url', activeUrl);

        // Set active state based on menu open state
        this.toolbarIcon.setActive(this._isOpen);
    }

    private updateMenuContent() {
        const children = Array.from(this.children);

        let gridAdded = false;
        children.forEach(child => {
            // Only allow one ToolbarGrid as the root element
            if (child instanceof ToolbarGrid) {
                if (!gridAdded) {
                    this.menuGrid = child;
                    this.shadowRoot?.appendChild(child);
                    gridAdded = true;
                } else {
                    console.warn('forge-toolbar-menu only accepts one forge-toolbar-grid element');
                }
            } else {
                console.warn('forge-toolbar-menu only accepts forge-toolbar-grid as direct child');
            }
        });
    }

    private updateSelection() {
        // Get select from parent toolbar
        const selectedTag = this.parentToolbar?.getAttribute('select');
        const menuTag = this.getAttribute('tag');

        // Update the internal toolbarIcon based on select and tag match
        if (selectedTag && menuTag === selectedTag) {
            this.toolbarIcon.setAttribute('selected', '');
        } else {
            this.toolbarIcon.removeAttribute('selected');
        }
    }

    // Method to set parent toolbar reference
    setParentToolbar(toolbar: any): void {
        this.parentToolbar = toolbar;
    }

    close() {
        this._isOpen = false;
        this.menuGrid?.classList.remove('open');
        this.updateIcon();
    }

    private updateAlign() {
        const align = this.getAttribute('align');
        if (align && ['right', 'left', 'top', 'bottom'].includes(align)) {
            this._align = align as 'right' | 'left' | 'top' | 'bottom';
        } else {
            this._align = 'right';
        }
    }

    private calculatePosition(): { transform: string } {
        if (!this.menuGrid) {
            return { transform: 'translate(0, 0)' };
        }

        const gap = 8;

        const hostRect = this.getBoundingClientRect();
        const menuRect = this.menuGrid.getBoundingClientRect();

        let x = 0;
        let y = 0;

        switch (this._align) {
            case 'right':
                x = hostRect.width + gap;
                y = (hostRect.height - menuRect.height) / 2;
                break;
            case 'left':
                x = -gap - menuRect.width;
                y = (hostRect.height - menuRect.height) / 2;
                break;
            case 'top':
                x = (hostRect.width - menuRect.width) / 2;
                y = -gap - menuRect.height;
                break;
            case 'bottom':
                x = (hostRect.width - menuRect.width) / 2;
                y = hostRect.height + gap;
                break;
        }

        return { transform: `translate(${x}px, ${y}px)` };
    }

    toggle() {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this._isOpen = true;
        this.updateMenuContent();

        // First, make menu visible but positioned off-screen
        if (this.menuGrid) {
            this.menuGrid.classList.add('open');
            this.menuGrid.style.visibility = 'hidden';
        }

        requestAnimationFrame(() => {
            if (this.menuGrid) {
                const position = this.calculatePosition();
                this.menuGrid.style.transform = position.transform;
                this.menuGrid.style.visibility = 'visible';
            }
        });

        this.updateIcon();
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
