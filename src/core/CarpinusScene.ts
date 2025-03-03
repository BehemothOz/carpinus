import { Scene, type SceneOptions } from './scene/Scene';
import { Rectangle } from './scheme/shapes/Rectangle';
import { Line } from './scheme/shapes/Line';
import { SourceTreeNode } from './scheme/SourceTreeNode';

interface CarpinusSceneOptions extends SceneOptions {
    dataScheme: SourceTreeNode;
}

export class CarpinusScene extends Scene {
    dataScheme: SourceTreeNode;

    constructor(options: CarpinusSceneOptions) {
        super(options);

        this.dataScheme = options.dataScheme;
    }

    protected drawScene(): void {
        this.drawScheme(this.dataScheme);
    }

    private drawScheme(node: SourceTreeNode) {
        const { position, size, children } = node;

        const rectangle = new Rectangle({
            ctx: this.ctx,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
        });

        if (children.length > 0) {
            const lastChildNode = children.at(-1) as SourceTreeNode;

            const startX = position.x + size.width / 2;
            const startY = position.y + size.height;

            const line = new Line({
                ctx: this.ctx,
                x: startX,
                y: startY,
            });

            children.forEach((child) => {
                this.drawScheme(child);
            });

            line.lineTo(lastChildNode.position.x, lastChildNode.position.y);
            line.draw();
        }

        rectangle.draw();
    }
}
