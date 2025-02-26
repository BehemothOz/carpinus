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
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            // this.canvas.width = width;
            // this.canvas.height = height;

            this.onResize(width, height);
        });

        this.resizeObserver.observe(this.container);
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.style.background = '#e1ecfd';

        this.container.append(canvas);
        return canvas;
    }

    public getScene(): HTMLCanvasElement {
        return this.canvas;
    }

    public destroyScene() {
        this.canvas.remove();
        this.resizeObserver.disconnect();
    }
}
