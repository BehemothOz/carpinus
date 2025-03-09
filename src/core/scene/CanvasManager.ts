import { Size } from '../scheme/Dimensions';

interface CanvasManagerOptions {
    container: HTMLElement;
    onResize: (width: number, height: number) => void;
}

export class CanvasManager {
    private resizeObserver: ResizeObserver;
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;

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

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.style.background = '#ffffff';

        this.container.append(canvas);
        return canvas;
    }

    public getScene(): HTMLCanvasElement {
        return this.canvas;
    }

    public getContainerSize(): Size {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        return new Size(width, height);
    }

    public destroyScene() {
        this.canvas.remove();
        this.resizeObserver.disconnect();
    }
}
