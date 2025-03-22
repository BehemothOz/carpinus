import { CarpinusScene } from '../CarpinusScene';
import { SourceTreeNode } from '../scheme';
import { FigureFactory } from '../scheme/Factory';

/**
 * A class responsible for downloading the current state of the CarpinusScene as an image.
 * Creates a temporary canvas, renders the scene, and triggers the download.
 */
export class Downloader {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private padding: number = 10;
    /**
     * The scale factor for the output image (e.g., 2 for 2x resolution)
     */
    private scale: number = 2;

    /**
     * Creates a new Downloader instance.
     * Initializes a temporary canvas for rendering.
     * @throws {Error} If canvas context cannot be obtained
     */
    constructor() {
        const backgroundCanvas = document.createElement('canvas');
        const ctx = backgroundCanvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }

        this.canvas = backgroundCanvas;
        this.ctx = ctx;
    }

    /**
     * Downloads the current state of the CarpinusScene as a PNG image.
     * @param {CarpinusScene} carpinusScene - The scene to capture
     * @throws {Error} If rendering or download fails
     */
    public download(carpinusScene: CarpinusScene) {
        try {
            const { scheme } = carpinusScene.getState();
            const schemeState = scheme.getState();

            this.canvas.width = (schemeState.measure.width + this.padding) * this.scale;
            this.canvas.height = (schemeState.measure.height + this.padding) * this.scale;

            this.drawScene(schemeState.tree);

            const link = this.createLink();
            link.click();
        } catch (error) {
            console.error('Failed to download scene:', error);
            throw error;
        }
    }

    /**
     * Creates a download link for the rendered canvas.
     * @returns {HTMLAnchorElement} A temporary link element for triggering the download
     */
    private createLink(): HTMLAnchorElement {
        const img = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.href = img;
        link.download = `conway_errors_visualization_${Date.now()}.png`;
        return link;
    }

    /**
     * Draws the complete scene on the canvas.
     * @param {SourceTreeNode} node - The root node of the tree to render
     */
    private drawScene(node: SourceTreeNode) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.padding, this.padding);
        this.ctx.scale(this.scale, this.scale);

        this.drawTree(node);
    }

    /**
     * Recursively draws the tree structure starting from a given node.
     * @param {SourceTreeNode} node - The current node to render
     */
    private drawTree(node: SourceTreeNode) {
        if (node.isCollapsed) {
            return;
        }

        const figure = FigureFactory.create({ ctx: this.ctx, node });

        if (node.children.length > 0) {
            node.children.forEach((child) => {
                this.drawTree(child);
            });
        }

        figure.draw();

        if (!node.isChildrenCollapsed) {
            figure.drawEdges();
        }
    }
}
