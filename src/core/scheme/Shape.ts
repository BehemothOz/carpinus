interface ShapeParams {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    fillColor?: string;
}

abstract class Shape {
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

export interface RectangleParams extends ShapeParams {
    width: number;
    height: number;
}

export class Rectangle extends Shape {
    protected width: number;
    protected height: number;

    constructor(options: RectangleParams) {
        super(options);

        this.width = options.width;
        this.height = options.height;
    }

    draw(): void {
        const { ctx } = this;
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export class Line extends Shape {
    private endX: number;
    private endY: number;
    private strokeColor: string;
    private lineWidth: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        strokeColor: string,
        lineWidth: number
    ) {
        super(ctx, startX, startY, ''); // fillColor не используется для линий
        this.endX = endX;
        this.endY = endY;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }

    draw(): void {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }
}

