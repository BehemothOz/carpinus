import { Offset, Gap, Size } from '../scheme/Dimensions';

export interface ViewportNotifiedPayload {
    offset: Offset;
    canvasSize: Size;
    scale: number;
}

interface ViewportParams {
    notify: (payload: ViewportNotifiedPayload) => void;
}

export class Viewport {
    /**
     * The current scale of the viewport. Default is 1.
     */
    public scale = 1;
    /**
     * The current offset of the viewport.
     */
    public offset: Offset = new Offset(0, 0);
    /**
     * The horizontal and vertical gap between nodes.
     * @type {Gap}
     */
    public gap: Gap = new Gap(40, 20);
    /**
     * The size of the canvas.
     */
    public canvasSize: Size = new Size(0, 0);
    /**
     * The factor by which the scale changes during zoom operations.
     */
    public readonly zoomFactor: number = 0.05;
    /**
     * Indicates whether a scene update is pending.
     */
    private isUpdatePending: boolean = false;

    constructor(private params: ViewportParams) {}

    /**
     * Changes the scale of the scene.
     * @param {number} scale - The new scale value.
     */
    public changeScale(scale: number) {
        if (this.scale === scale) return;

        this.scale = scale;
        this.scheduleTransformUpdate();
    }

    /**
     * Changes the offset of the scene.
     * @param {Offset} offset - The new offset value.
     */
    public changeOffset({ x, y }: Offset) {
        if (this.offset.x === x && this.offset.y === y) return;

        this.offset.x = x;
        this.offset.y = y;

        this.scheduleTransformUpdate();
    }

    /**
     * Changes the size of the canvas.
     * @param {number} width - The new width of the canvas.
     * @param {number} height - The new height of the canvas.
     */
    public changeCanvasSize(width: number, height: number) {
        this.canvasSize.width = width;
        this.canvasSize.height = height;

        this.emitTransformUpdate();
    }

    /**
     * Schedules a transform update to be executed on the next animation frame.
     */
    private scheduleTransformUpdate() {
        if (this.isUpdatePending) return;

        this.isUpdatePending = true;
        requestAnimationFrame(() => {
            this.emitTransformUpdate();
        });
    }

    /**
     * Emits a transform update event.
     * Updates the transform and emits a 'viewport-update' event.
     */
    private emitTransformUpdate() {
        this.isUpdatePending = false;
        this.params.notify({
            offset: this.offset,
            scale: this.scale,
            canvasSize: this.canvasSize,
        });
    }
}
