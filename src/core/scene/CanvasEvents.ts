import { type State, type Viewport } from '../states';
import { Formulas } from '../Formulas';

interface CanvasEventsOptions {
    canvas: HTMLCanvasElement;
    state: State;
    onSearchClick?: (mouseX: number, mouseY: number) => boolean;
}

export class CanvasEvents extends Formulas {
    private canvas: HTMLCanvasElement;
    private viewport: Viewport;
    private onSearchClick?: (mouseX: number, mouseY: number) => boolean;

    private isDragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;

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

    private onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }

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

    private onMouseUp() {
        this.isDragging = false;
    }

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
