class ToolbarIcon extends HTMLElement {
    private readonly shadow: ShadowRoot;
    private readonly imgElement: HTMLImageElement;
    private _isActive: boolean = false;

    static get observedAttributes() {
        return ['url', 'active-url'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        // Add default styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                width: 34px;
                height: 34px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.2s;
                box-sizing: border-box;
            }

            :host([selected]) {
                background-color: #e0e7ff;
            }
        `;

        this.imgElement = document.createElement('img');
        this.imgElement.style.width = '100%';
        this.imgElement.style.height = '100%';
        this.imgElement.style.objectFit = 'contain';

        this.shadow.appendChild(style);
        this.shadow.appendChild(this.imgElement);
    }

    connectedCallback() {
        this.updateImage();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
            this.updateImage();
        }
    }

    private updateImage() {
        const url = this.getAttribute('url');
        const activeUrl = this.getAttribute('active-url');

        if (this._isActive && activeUrl) {
            this.imgElement.src = activeUrl;
        } else if (url) {
            this.imgElement.src = url;
        }
    }

    setActive(isActive: boolean): void {
        if (this._isActive !== isActive) {
            this._isActive = isActive;
            this.updateImage();
        }
    }

    get isActive(): boolean {
        return this._isActive;
    }
}

// Register the custom element
if (!customElements.get('forge-toolbar-icon')) {
    customElements.define('forge-toolbar-icon', ToolbarIcon);
}

export { ToolbarIcon };
