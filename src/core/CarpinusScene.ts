import { Scene, type SceneOptions } from './scene/Scene';
import { Rectangle } from './scheme/shapes/Rectangle';
import { SourceTreeNode } from './scheme/SourceTreeNode';

interface CarpinusSceneOptions extends SceneOptions {
    dataScheme: SourceTreeNode[];
}

export class CarpinusScene extends Scene {
    dataScheme: any;

    constructor(options: CarpinusSceneOptions) {
        super(options);

        this.dataScheme = options.dataScheme;
    }

    protected drawScene(): void {
        for (const node of this.dataScheme) {
            const rectangle = new Rectangle({
                ctx: this.ctx,
                x: node.position.x,
                y: node.position.y,
                width: node.size.width,
                height: node.size.height,
            });

            rectangle.draw();
        }
    }
}
