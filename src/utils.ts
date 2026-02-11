export async function forgeElementReady(): Promise<void> {
    await Promise.all([
        customElements.whenDefined("forge-toolbar-icon"),
        customElements.whenDefined("forge-toolbar-menu"),
        customElements.whenDefined("forge-toolbar-asset"),
        customElements.whenDefined("forge-toolbar"),
        customElements.whenDefined("forge-toolbar-grid-row"),
        customElements.whenDefined("forge-toolbar-grid"),
        customElements.whenDefined("forge-toolbar-grid-divider"),
        customElements.whenDefined("forge-drag-handle")
    ]);
}
