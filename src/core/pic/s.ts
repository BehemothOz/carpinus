interface MeasureTextToolParams {
    font: string;
    padding: number;
}

export class MeasureTextTool {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private widthPart: number;

    constructor(options: MeasureTextToolParams) {
        const { font = '14px Arial', padding = 10 } = options;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.font = font;
        this.widthPart = padding * 2;
    }

    public calculateBlockWidth(text: string): number {
        const metrics = this.ctx.measureText(text);
        return metrics.width + this.widthPart;
    }

    public dispose(): void {
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null as unknown as HTMLCanvasElement;
        }
    }
}
