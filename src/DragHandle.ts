import type { Toolbar } from "./Toolbar.ts";
import {forgeElementReady} from "./utils.ts";

class DragHandle extends HTMLElement {

    public readonly rootElement: HTMLDivElement;

    private get toolbar(): Toolbar | null {
        return this.closest('forge-toolbar') as Toolbar;
    }

    private initialX: number = 0;
    private initialY: number = 0;

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        this.rootElement = document.createElement('div');
    }

    connectedCallback() {
        forgeElementReady().then(() => {
            this.rootElement.appendChild(this.children[0]);
        });

        // Only add pointerdown listener initially
        this.rootElement.addEventListener('pointerdown', this.handlePointerDown);
    }

    private handlePointerDown = (event: PointerEvent) => {
        this.initialX = event.clientX;
        this.initialY = event.clientY;

        // Start listening to move and end events globally
        document.addEventListener('pointermove', this.handlePointerMove);
        document.addEventListener('pointerup', this.handlePointerEnd);
    }

    private handlePointerMove = (event: PointerEvent) => {
        const offsetX = event.clientX - this.initialX;
        const offsetY = event.clientY - this.initialY;

        // Update CSS variables on toolbar
        if (this.toolbar) {
            this.toolbar.style.setProperty('--drag-offset-x', `${offsetX}px`);
            this.toolbar.style.setProperty('--drag-offset-y', `${offsetY}px`);
        }
    }

    private handlePointerEnd = (event: PointerEvent) => {
        const offsetX = event.clientX - this.initialX;
        const offsetY = event.clientY - this.initialY;

        // Stop listening to move and end events globally
        document.removeEventListener('pointermove', this.handlePointerMove);
        document.removeEventListener('pointerup', this.handlePointerEnd);

        // Handle snap to edge or reset
        if (this.toolbar) {
            const parent = this.toolbar.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const rootRect = this.rootElement.getBoundingClientRect();

                // Calculate relative position (center of drag handle)
                const relativeX = rootRect.left + rootRect.width / 2 - parentRect.left;
                const relativeY = rootRect.top + rootRect.height / 2 - parentRect.top;

                // Divide parent into 5x5 grid
                const sectionWidth = parentRect.width / 5;
                const sectionHeight = parentRect.height / 5;

                // Determine which section the toolbar is in (0-4 for x and y)
                const sectionX = Math.floor(relativeX / sectionWidth);
                const sectionY = Math.floor(relativeY / sectionHeight);

                // Check if near edge (sections 0 or 4)
                const nearLeft = sectionX === 0;
                const nearRight = sectionX === 4;
                const nearTop = sectionY === 0;
                const nearBottom = sectionY === 4;

                let shouldSnap = false;
                let newAlign: string | null = null;

                // Determine new align based on position
                if (nearLeft && (nearTop || nearBottom)) {
                    // Corner cases - prioritize horizontal
                    newAlign = 'left';
                    shouldSnap = true;
                } else if (nearRight && (nearTop || nearBottom)) {
                    // Corner cases - prioritize horizontal
                    newAlign = 'right';
                    shouldSnap = true;
                } else if (nearLeft) {
                    newAlign = 'left';
                    shouldSnap = true;
                } else if (nearRight) {
                    newAlign = 'right';
                    shouldSnap = true;
                } else if (nearTop) {
                    newAlign = 'top';
                    shouldSnap = true;
                } else if (nearBottom) {
                    newAlign = 'bottom';
                    shouldSnap = true;
                }

                console.log(offsetX, offsetY);

                if (shouldSnap && newAlign) {
                    // Update align attribute
                    this.toolbar.setAttribute('align', newAlign);
                    // Reset offset after a short delay to allow align to take effect
                    setTimeout(() => {
                        this.resetOffsetWithAnimation();
                    }, 50);
                } else {
                    // Reset offset with animation
                    this.resetOffsetWithAnimation();
                }
            }
        }
    }

    private resetOffsetWithAnimation() {
        if (!this.toolbar) return;

        const animate = () => {
            const currentX = parseFloat(this.toolbar!.style.getPropertyValue('--drag-offset-x') || '0');
            const currentY = parseFloat(this.toolbar!.style.getPropertyValue('--drag-offset-y') || '0');

            const newX = currentX * 0.8;
            const newY = currentY * 0.8;

            console.log("[][][]", newX, newY);

            if (Math.abs(newX) < 0.5 && Math.abs(newY) < 0.5) {
                // Animation complete, reset to 0
                this.toolbar!.style.setProperty('--drag-offset-x', '0px');
                this.toolbar!.style.setProperty('--drag-offset-y', '0px');
            } else {
                // Continue animation
                this.toolbar!.style.setProperty('--drag-offset-x', `${newX}px`);
                this.toolbar!.style.setProperty('--drag-offset-y', `${newY}px`);
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
        console.log(_name, oldValue, newValue);
        console.log(this.toolbar);
    }
}

// Register the custom element
if (!customElements.get('forge-drag-handle')) {
    console.log("Defining <forge-drag-handle> custom element");
    customElements.define('forge-drag-handle', DragHandle);
}

export { DragHandle };
