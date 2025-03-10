import { CarpinusScene } from '../CarpinusScene';
import { SourceTreeNode } from '../scheme';
import { Line } from '../scheme/shapes/Line';
import { Rectangle } from '../scheme/shapes/Rectangle';

export class Downloader {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(private carpinusScene: CarpinusScene) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.style.background = '#ffffff';

        this.canvas = canvas;
        this.ctx = ctx;

        const { scheme } = carpinusScene.getState();

        const schemeState = scheme.getState();

        canvas.width = schemeState.measure.width;
        canvas.height = schemeState.measure.height;

        console.log(schemeState);

        this.drawScene(schemeState.tree);

        document.body.append(canvas);
    }

    download() {
        const img = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'tree.png';
        link.click();
    }

    protected drawScene(node: SourceTreeNode) {
        const { position, size, children } = node;
        console.log('drawScene');

        if (node.isCollapsed) {
            return;
        }

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
                this.drawScene(child);
            });

            line.lineTo(lastChildNode.position.x, lastChildNode.position.y);
            line.draw();
        }

        rectangle.draw();
    }
}
