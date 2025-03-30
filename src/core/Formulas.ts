import { Position } from './scheme/Dimensions';
import { type Viewport } from './states';

export class Formulas {
    constructor(private state: Viewport) {}

    /**
     * Screen coordinates to scene coordinates (world)
     */
    public screenToScene(screenX: number, screenY: number): { sceneX: number; sceneY: number } {
        const { offset, scale } = this.state;

        return {
            sceneX: (screenX - offset.x) / scale,
            sceneY: (screenY - offset.y) / scale,
        };
    }

    /**
     * Scene coordinates (world) to screen coordinates
     */
    public sceneToScreen(sceneX: number, sceneY: number): { screenX: number; screenY: number } {
        const { offset, scale } = this.state;

        return {
            screenX: sceneX * scale + offset.x,
            screenY: sceneY * scale + offset.y,
        };
    }

    public toSceneCoordinates(mouseX: number, mouseY: number): Position {
        const { offset, scale } = this.state;

        const x = (mouseX - offset.x) / scale;
        const y = (mouseY - offset.y) / scale;

        return new Position(x, y);
    }
}
