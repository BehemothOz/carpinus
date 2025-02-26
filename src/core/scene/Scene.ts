import { CanvasManager } from './CanvasManager';
import { CanvasEvents } from './CanvasEvents';

import { type State as SceneState } from './State';

export interface SceneOptions {
    container: HTMLElement;
    state: SceneState;
}

export class Scene {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    protected state: SceneState;

    private canvasManager: CanvasManager;
    private events: CanvasEvents;

    constructor(protected options: SceneOptions) {
        const { container, state } = options;

        this.state = state;
        this.canvasManager = new CanvasManager({
            container,
            onResize: (width, height) => {
                this.canvas.width = width;
                this.canvas.height = height;

                this.state.changeCanvasSize(width, height);
            },
        });

        this.canvas = this.canvasManager.getScene();
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.events = new CanvasEvents({
            canvas: this.canvas,
            state: this.state,
        });

        this.state.onSceneUpdate((currentState) => {
            const { offset, scale, canvasSize } = currentState;

            this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            this.ctx.save();
            this.ctx.translate(offset.x, offset.y);
            this.ctx.scale(scale, scale);

            this.drawScene();
            this.ctx.restore();
        });
    }

    public destroy() {
        this.canvasManager.destroyScene();
    }

    protected drawScene() {
        throw new Error('Method drawScene must be implemented in child class');
    }
}
