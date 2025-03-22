import { type State, type Viewport } from '../states';
import { Formulas } from '../Formulas';

/**
 * Configuration options for the CanvasEvents class.
 * @interface
 */
interface CanvasEventsOptions {
    /**
     * The HTML canvas element to attach event listeners to
     * @type {HTMLCanvasElement}
     */
    canvas: HTMLCanvasElement;
    /**
     * The application state containing viewport information
     * @type {State}
     */
    state: State;
    /**
     * Optional callback function that is called when a search click event occurs (Ctrl + click)
     * @type {(mouseX: number, mouseY: number) => boolean}
     */
    onSearchClick?: (mouseX: number, mouseY: number) => boolean;
}

/**
 * Handles canvas-related events such as mouse interactions and zooming.
 * Extends Formulas class to provide coordinate transformation capabilities.
 * Manages viewport transformations including panning and zooming.
 */
export class CanvasEvents extends Formulas {
    /**
     * The HTML canvas element that this class manages events for
     * @type {HTMLCanvasElement}
     */
    private canvas: HTMLCanvasElement;
    /**
     * The viewport state that controls the canvas view transformations
     * @type {Viewport}
     */
    private viewport: Viewport;
    /**
     * Optional callback function for handling search click events (Ctrl + click)
     * @type {(mouseX: number, mouseY: number) => boolean}
     */
    private onSearchClick?: (mouseX: number, mouseY: number) => boolean;

    /**
     * Flag indicating whether the canvas is currently being dragged
     * @type {boolean}
     */
    private isDragging: boolean = false;
    /**
     * The last recorded X position of the mouse during dragging
     * @type {number}
     */
    private lastMouseX: number = 0;
    /**
     * The last recorded Y position of the mouse during dragging
     * @type {number}
     */
    private lastMouseY: number = 0;

    /**
     * Creates a new instance of CanvasEvents.
     * @param {Object} options - Configuration options
     * @param {HTMLCanvasElement} options.canvas - The canvas element to attach events to
     * @param {State} options.state - The application state containing viewport information
     * @param {(mouseX: number, mouseY: number) => boolean} [options.onSearchClick] - Optional callback for search click events
     */
    constructor(options: CanvasEventsOptions) {
        const { canvas, state, onSearchClick } = options;

        super(state.viewport);

        this.canvas = canvas;
        this.viewport = state.viewport;
        this.onSearchClick = onSearchClick;

        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));
    }

    /**
     * Handles mouse down events to initiate dragging.
     * Sets initial mouse position and enables dragging state.
     * @param {PointerEvent} event - The pointer down event
     */
    private onPointerDown(event: PointerEvent) {
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        console.log('pointerdown', event);
        this.canvas.setPointerCapture(event.pointerId);
    }

    /**
     * Handles click events for search functionality.
     * Only triggers when Ctrl key is pressed.
     * Converts screen coordinates to scene coordinates before calling the search callback.
     * @param {MouseEvent} event - The click event
     */
    private onClick(event: MouseEvent) {
        if (!event.ctrlKey) return;

        const clientRect = this.canvas.getBoundingClientRect();

        const mouseX = event.clientX - clientRect.left;
        const mouseY = event.clientY - clientRect.top;

        if (this.onSearchClick) {
            const coordinates = this.toSceneCoordinates(mouseX, mouseY);
            this.onSearchClick(coordinates.x, coordinates.y);
        }
    }

    /**
     * Handles mouse move events for dragging functionality.
     * Updates viewport offset based on mouse movement delta.
     * Only active when dragging is enabled.
     * @param {MouseEvent} event - The mouse move event
     */
    private onPointerMove(event: PointerEvent) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        this.viewport.changeOffset({
            x: this.viewport.offset.x + deltaX,
            y: this.viewport.offset.y + deltaY,
        });
    }

    /**
     * Handles mouse up events to end dragging.
     * Disables the dragging state.
     */
    private onPointerUp(event: PointerEvent) {
        this.isDragging = false;
        this.canvas.releasePointerCapture(event.pointerId);
    }

    /**
     * Handles wheel events for zooming functionality.
     * Updates viewport scale and offset based on wheel delta.
     * Maintains the point under the cursor as the zoom center.
     * @param {WheelEvent} event - The wheel event
     */
    private onWheel(event: WheelEvent) {
        event.preventDefault();
        const { scale, zoomFactor } = this.viewport;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const { sceneX, sceneY } = this.screenToScene(mouseX, mouseY);

        let changedScale = scale;

        if (event.deltaY < 0) {
            changedScale *= 1 + zoomFactor;
        } else {
            changedScale *= 1 - zoomFactor;
        }

        this.viewport.changeScale(changedScale);
        this.viewport.changeOffset({
            x: mouseX - sceneX * changedScale,
            y: mouseY - sceneY * changedScale,
        });
    }

    /**
     * Removes all event listeners from the canvas.
     */
    public destroy() {
        this.canvas.removeEventListener('pointerdown', this.onPointerDown);
        this.canvas.removeEventListener('pointermove', this.onPointerMove);
        this.canvas.removeEventListener('pointerup', this.onPointerUp);
        this.canvas.removeEventListener('click', this.onClick);
        this.canvas.removeEventListener('wheel', this.onWheel);
    }
}
