export class ToolbarAsset extends HTMLElement {

    public get rootElement(): Element {
        return this.children[0].cloneNode(true) as Element;
    }

    constructor() {
        super();
    }
}

if (!customElements.get('forge-toolbar-asset')) {
    customElements.define('forge-toolbar-asset', ToolbarAsset);
}