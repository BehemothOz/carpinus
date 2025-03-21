import { type State, type Viewport } from '../states';
import { Formulas } from '../Formulas';

/**
 * Configuration options for the CanvasEvents class.
 * @interface
 */
interface CanvasEventsOptions {
    /** The HTML canvas element to attach event listeners to */
    canvas: HTMLCanvasElement;
    /** The application state containing viewport information */
    state: State;
    /** Optional callback function that is called when a search click event occurs (Ctrl + click) */
    onSearchClick?: (mouseX: number, mouseY: number) => boolean;
}

/**
 * Handles canvas-related events such as mouse interactions and zooming.
 * Extends Formulas class to provide coordinate transformation capabilities.
 * Manages viewport transformations including panning and zooming.
 */
export class CanvasEvents extends Formulas {
    /** The HTML canvas element that this class manages events for */
    private canvas: HTMLCanvasElement;
    /** The viewport state that controls the canvas view transformations */
    private viewport: Viewport;
    /** Optional callback function for handling search click events (Ctrl + click) */
    private onSearchClick?: (mouseX: number, mouseY: number) => boolean;

    /** Flag indicating whether the canvas is currently being dragged */
    private isDragging = false;
    /** The last recorded X position of the mouse during dragging */
    private lastMouseX = 0;
    /** The last recorded Y position of the mouse during dragging */
    private lastMouseY = 0;

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

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));
    }

    /**
     * Handles mouse down events to initiate dragging.
     * Sets initial mouse position and enables dragging state.
     * @param {MouseEvent} event - The mouse down event
     */
    private onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

    /**
     * Handles click events for search functionality.
     * Only triggers when Ctrl key is pressed.
     * Converts screen coordinates to scene coordinates before calling the search callback.
     * @param {MouseEvent} event - The click event
     */
    private onClick(event: MouseEvent) {
        if (!event.ctrlKey) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

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
    private onMouseMove(event: MouseEvent) {
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
    private onMouseUp() {
        this.isDragging = false;
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
}
