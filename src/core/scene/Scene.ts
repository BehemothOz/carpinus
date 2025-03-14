import { CanvasManager } from './CanvasManager';
import { CanvasEvents } from './CanvasEvents';

import { type State } from '../states';
import { SourceTreeNode } from '../scheme';

export interface SceneOptions {
    container: HTMLElement;
    state: State;
    onSearchClick?: (mouseX: number, mouseY: number) => boolean;
}

export class Scene {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    protected state: State;

    private canvasManager: CanvasManager;
    private events: CanvasEvents;

    constructor(protected options: SceneOptions) {
        const { container, state, onSearchClick } = options;

        this.state = state;
        this.canvasManager = new CanvasManager({
            container,
            onResize: (width, height) => {
                this.canvas.width = width;
                this.canvas.height = height;

                this.state.viewport.changeCanvasSize(width, height);
            },
        });

        this.canvas = this.canvasManager.getScene();
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.events = new CanvasEvents({
            canvas: this.canvas,
            state: this.state,
            onSearchClick,
        });

        this.state.onDraw((payload) => {
            const { viewport, scheme } = payload;
            const { offset, scale, canvasSize } = viewport;

            this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            this.ctx.save();
            this.ctx.translate(offset.x, offset.y);
            this.ctx.scale(scale, scale);

            this.drawScene(scheme.tree);
            this.ctx.restore();
        });
    }

    protected drawScene(tree: SourceTreeNode) {
        throw new Error('Method drawScene must be implemented in child class');
    }

    public getSchemeSize() {
        const { scheme } = this.state;

        return scheme.getState().measure;
    }

    public getSceneSize() {
        return this.canvasManager.getContainerSize();
    }

    public destroy() {
        this.canvasManager.destroyScene();
    }
}
