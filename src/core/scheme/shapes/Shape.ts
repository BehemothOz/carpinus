export interface ShapeParams {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    fillColor?: string;
}

export abstract class Shape {
    protected ctx: CanvasRenderingContext2D;
    protected x: number;
    protected y: number;
    protected fillColor: string;

    constructor({ ctx, x, y, fillColor = '#000000' }: ShapeParams) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
    }

    abstract draw(): void;
}
