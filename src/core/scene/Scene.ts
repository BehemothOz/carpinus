import { CanvasManager } from './CanvasManager';
import { CanvasEvents } from './CanvasEvents';

import { type State } from '../states';
import { type Size } from '../scheme/Dimensions';
import { type SourceTreeNode } from '../scheme';

/**
 * Options for creating a new Scene instance.
 */
export interface SceneOptions {
    /**
     * HTML container element for the canvas
     */
    container: HTMLElement;
    /**
     * Application state containing viewport and scheme data
     */
    state: State;
    /**
     * Optional callback for handling search click events (Ctrl + click)
     */
    onSearchClick?: (mouseX: number, mouseY: number) => boolean;
}

/**
 * Base class for rendering tree structures on canvas.
 * Handles canvas setup, event management, and viewport transformations.
 * Uses requestAnimationFrame for optimized rendering.
 */
export class Scene {
    /**
     * The canvas element used for rendering
     */
    protected canvas: HTMLCanvasElement;
    /**
     * The 2D rendering context for the canvas
     */
    protected ctx: CanvasRenderingContext2D;
    /**
     * The application state containing viewport and scheme data
     */
    protected state: State;
    /**
     * Manages canvas creation and resize handling
     */
    private canvasManager: CanvasManager;

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

        new CanvasEvents({
            canvas: this.canvas,
            state: this.state,
            onSearchClick,
        });

        this.setupDrawHandler();
    }

    /**
     * Sets up the draw handler using requestAnimationFrame for optimized rendering.
     * This ensures that multiple state changes within a single frame
     * result in only one actual render.
     * @private
     */
    private setupDrawHandler() {
        this.state.onDraw((payload) => {
            requestAnimationFrame(() => {
                const { viewport, scheme } = payload;
                const { offset, scale, canvasSize } = viewport;

                this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

                this.ctx.save();
                this.ctx.translate(offset.x, offset.y);
                this.ctx.scale(scale, scale);

                this.drawScene(scheme.tree);
                this.ctx.restore();
            });
        });
    }

    /**
     * Draws the scene on the canvas.
     * Must be implemented by child classes to provide specific rendering logic.
     * @param {SourceTreeNode} _tree - The tree structure to render
     * @protected
     */
    protected drawScene(_tree: SourceTreeNode) {
        throw new Error('Method drawScene must be implemented in child class');
    }

    /**
     * Centers the viewport on the current scheme.
     * Calculates the optimal scale to fit the scheme in the viewport
     * and positions it in the center.
     */
    public toCenter() {
        const { viewport, scheme } = this.state;
        const { measure: schemeSize } = scheme.getState();
        const sceneSize = this.canvasManager.getContainerSize();

        const scaleX = sceneSize.width / schemeSize.width;
        const scaleY = sceneSize.height / schemeSize.height;

        const newScale = Math.min(scaleX, scaleY);

        const offsetX = (sceneSize.width - schemeSize.width * newScale) / 2;
        const offsetY = (sceneSize.height - schemeSize.height * newScale) / 2;

        viewport.changeScale(newScale, { x: offsetX, y: offsetY });
    }

    /**
     * Returns the current size of the scheme.
     * @returns {Size} The size of the scheme
     */
    public getSchemeSize(): Size {
        const { scheme } = this.state;

        return scheme.getState().measure;
    }

    /**
     * Cleans up resources and removes event listeners.
     * Should be called when the scene is no longer needed.
     */
    public destroy() {
        this.canvasManager.destroyScene();
    }
}
