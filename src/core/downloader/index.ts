import { CarpinusScene } from "../CarpinusScene";
import { SourceTreeNode } from "../scheme";
import { FigureFactory } from "../scheme/Factory";

export class Downloader {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(private carpinusScene: CarpinusScene) {
        const backgroundCanvas = document.createElement('canvas');
        const ctx = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D;
        backgroundCanvas.style.background = '#ffffff';

        this.canvas = backgroundCanvas;
        this.ctx = ctx;

        const { scheme } = carpinusScene.getState();
        const schemeState = scheme.getState();

        backgroundCanvas.width = schemeState.measure.width;
        backgroundCanvas.height = schemeState.measure.height;

        this.drawScene(schemeState.tree);
    }

    download(scale = 2) {
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;

        this.canvas.width = originalWidth * scale;
        this.canvas.height = originalHeight * scale;

        this.ctx.scale(scale, scale);

        const { scheme } = this.carpinusScene.getState();
        this.drawScene(scheme.getState().tree);

        // Скачиваем изображение
        const img = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = `conway_errors_visualization_${Date.now()}.png`;
        link.click();
    }

    drawScene(node: SourceTreeNode) {
        const view = node.isChildrenCollapsed && !node.isLast ? 'collapsed' : 'usual';

        if (node.isCollapsed) {
            return;
        }

        const figure = FigureFactory.create({ ctx: this.ctx, node });

        if (node.children.length > 0) {
            node.children.forEach((child) => {
                this.drawScene(child);
            });
        }

        figure.draw();

        if (!node.isChildrenCollapsed) {
            figure.drawEdges();
        }
    }
}
