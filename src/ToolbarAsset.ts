export class ToolbarAsset extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.display = "none";
    }
}

if (!customElements.get('forge-toolbar-asset')) {
    customElements.define('forge-toolbar-asset', ToolbarAsset);
}