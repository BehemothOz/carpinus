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

    constructor(private params: ViewportParams) {}

    getState() {
        return {
            offset: this.offset,
            scale: this.scale,
            canvasSize: this.canvasSize,
        };
    }

    /**
     * Changes the scale of the scene and adjusts the offset to maintain the point under cursor.
     * When zooming, the point under the cursor should remain fixed in screen coordinates.
     * This requires adjusting both scale and offset together.
     *
     * @param {number} scale - The new scale value
     * @param {Offset} pivotOffset - The offset that should be maintained during zoom.
     *
     * This is typically the screen coordinates of the cursor position
     * when zooming, or the center of the viewport when centering.
     */
    public changeScale(scale: number, { x, y }: Offset) {
        if (this.scale === scale) return;

        this.scale = scale;

        this.offset.x = x;
        this.offset.y = y;

        this.emitTransformUpdate();
    }

    /**
     * Changes the offset of the scene.
     * This is typically used for panning operations.
     * @param {Offset} offset - The new offset value
     */
    public changeOffset({ x, y }: Offset) {
        if (this.offset.x === x && this.offset.y === y) return;

        this.offset.x = x;
        this.offset.y = y;

        this.emitTransformUpdate();
    }

    /**
     * Changes the size of the canvas.
     * This is called when the container size changes.
     * @param {number} width - The new width of the canvas
     * @param {number} height - The new height of the canvas
     */
    public changeCanvasSize(width: number, height: number) {
        this.canvasSize.width = width;
        this.canvasSize.height = height;

        this.emitTransformUpdate();
    }

    /**
     * Notifies about viewport state changes.
     * The actual rendering is handled by the Scene class using requestAnimationFrame.
     * @private
     */
    private emitTransformUpdate() {
        this.params.notify(this.getState());
    }
}
