export class ToolbarAsset extends HTMLElement {

    public get rootElement(): SVGAElement {
        return this.children[0].cloneNode(true) as SVGAElement;
    }

    constructor() {
        super();
        this.rootElement.style.display = "none";
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this.rootElement);
    }
}

if (!customElements.get('forge-toolbar-asset')) {
    customElements.define('forge-toolbar-asset', ToolbarAsset);
}