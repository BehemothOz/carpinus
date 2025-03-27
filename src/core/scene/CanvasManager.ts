import { Size } from '../scheme/Dimensions';

interface CanvasManagerOptions {
    /**
     * The DOM element to contain the canvas
     */
    container: HTMLElement;
    /**
     * Callback invoked when container is resized
     */
    onResize: (width: number, height: number) => void;
}

/**
 * A class that manages a canvas element within a container, handling creation,
 * resizing, and destruction of the canvas. It uses a ResizeObserver to detect
 * and respond to container size changes.
 */
export class CanvasManager {
    /**
     * Observer for tracking size changes of the container element
     * @private
     */
    private resizeObserver: ResizeObserver;
    /**
     * The DOM element that contains and constrains the canvas
     * @private
     */
    private container: HTMLElement;
    /**
     * The canvas element being managed
     * @private
     */
    private canvas: HTMLCanvasElement;
    /**
     * Callback function to be executed when container is resized.
     * Receives new dimensions (width, height) as parameters.
     * @private
     */
    private onResize: (width: number, height: number) => void;

    constructor(options: CanvasManagerOptions) {
        this.container = options.container;
        this.canvas = this.createCanvas();

        this.onResize = options.onResize;

        this.resizeObserver = new ResizeObserver(() => {
            const containerSize = this.getContainerSize();

            this.onResize(containerSize.width, containerSize.height);
        });

        this.resizeObserver.observe(this.container);
    }

    /**
     * Creates and appends a new canvas element to the container.
     * @private
     * @returns {HTMLCanvasElement} The newly created canvas element
     */
    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.style.background = '#ffffff';

        this.container.append(canvas);
        return canvas;
    }

    /**
     * Gets the current canvas element being managed.
     * @returns {HTMLCanvasElement} The canvas element
     */
    public getScene(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Calculates and returns the current size of the container.
     * @returns {Size} An object containing width and height of the container
     */
    public getContainerSize(): Size {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        return new Size(width, height);
    }

    /**
     * Cleans up resources by removing the canvas and disconnecting the ResizeObserver.
     * Should be called when the manager is no longer needed to prevent memory leaks.
     */
    public destroyScene() {
        this.canvas.remove();
        this.resizeObserver.disconnect();
    }
}
