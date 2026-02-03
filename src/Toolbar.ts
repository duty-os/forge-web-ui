import { ToolbarIcon } from './ToolbarIcon';
import { ToolbarMenu } from './ToolbarMenu';

class Toolbar extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly styleElement: HTMLStyleElement;
    private icons: ToolbarIcon[] = [];
    private menus: ToolbarMenu[] = [];

    static get observedAttributes() {
        return ['direction', 'select'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        // Create style
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            :host {
                display: flex;
                gap: 12px;
                align-items: center;
                background: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            :host([direction="vertical"]) {
                flex-direction: column;
            }

            :host([direction="horizontal"]) {
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
        `;

        // Create container for slotted content
        this.container = document.createElement('div');
        this.container.style.display = 'flex';
        this.container.style.gap = '12px';
        this.container.style.alignItems = 'center';
        this.container.style.flexDirection = 'row';

        this.shadow.appendChild(this.styleElement);
        this.shadow.appendChild(this.container);
    }

    connectedCallback() {
        this.updateDirection();
        this.updateSelection();
        // Move any existing light DOM children into the shadow DOM
        const children = Array.from(this.children);
        children.forEach(child => {
            if (child instanceof ToolbarIcon) {
                this.addIcon(child);
            } else if (child instanceof ToolbarMenu) {
                this.addMenu(child);
            }
        });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        if (name === 'direction') {
            this.updateDirection();
        } else if (name === 'select') {
            this.updateSelection();
        }
    }

    private updateDirection() {
        const direction = this.getAttribute('direction') || 'horizontal';

        if (direction === 'vertical') {
            this.container.style.flexDirection = 'column';
        } else {
            this.container.style.flexDirection = 'row';
        }
    }

    private updateSelection() {
        const selectedTag = this.getAttribute('select');

        this.icons.forEach(icon => {
            const iconTag = icon.getAttribute('tag');
            if (selectedTag && iconTag === selectedTag) {
                icon.setAttribute('selected', '');
            } else {
                icon.removeAttribute('selected');
            }
        });

        // Notify menus to update their selection state
        this.menus.forEach(menu => {
            menu.updateSelection?.();
        });
    }

    addIcon(icon: ToolbarIcon): void {
        this.icons.push(icon);
        this.container.appendChild(icon);

        // Add click handler for icon
        icon.addEventListener('click', () => {
            this.icons.forEach(i => i.setActive(false));
            icon.setActive(true);
        });
    }

    removeIcon(icon: ToolbarIcon): void {
        const index = this.icons.indexOf(icon);
        if (index !== -1) {
            this.icons.splice(index, 1);
            this.container.removeChild(icon);
        }
    }

    addMenu(menu: ToolbarMenu): void {
        this.menus.push(menu);
        this.container.appendChild(menu);

        // Set parent toolbar reference
        menu.setParentToolbar(this);
    }

    removeMenu(menu: ToolbarMenu): void {
        const index = this.menus.indexOf(menu);
        if (index !== -1) {
            this.menus.splice(index, 1);
            this.container.removeChild(menu);
        }
    }
}

// Register the custom element
if (!customElements.get('forge-toolbar')) {
    customElements.define('forge-toolbar', Toolbar);
}