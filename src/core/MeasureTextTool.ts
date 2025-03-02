interface MeasureTextToolParams {
    font: string;
    padding: number;
}

const initialOptions = {
    font: '14px Arial',
    padding: 10,
};

export class MeasureTextTool {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private widthPart: number;

    constructor(options: MeasureTextToolParams = initialOptions) {
        const { font, padding } = options;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.font = font;
        this.widthPart = padding * 2;
    }

    public calculateBlockWidth(text: string): number {
        const metrics = this.ctx.measureText(text);
        const width = metrics.width + this.widthPart;

        return Math.round(width);
    }

    public dispose(): void {
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null as unknown as HTMLCanvasElement;
        }
    }
}
