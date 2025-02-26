import { Scene, type SceneOptions } from './scene/Scene';

export class CarpinusScene extends Scene {
    constructor(options: SceneOptions) {
        super(options);
    }

    protected drawScene(): void {
        this.ctx.beginPath();
        this.ctx.rect(50, 50, 100, 75);
        this.ctx.stroke();
    }
}
