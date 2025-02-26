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

export class Circle extends Shape {
    private radius: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fillColor: string) {
        super(ctx, x, y, fillColor);
        this.radius = radius;
    }

    draw(): void {
        const { ctx } = this;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.closePath();
    }
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

interface TextParams {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    text: string;
    fillColor?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}

export class Caption {
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private text: string;
    private fillColor: string;
    private font: string;
    private textAlign: CanvasTextAlign;
    private textBaseline: CanvasTextBaseline;

    constructor(params: TextParams) {
        this.ctx = params.ctx;
        this.x = params.x;
        this.y = params.y;
        this.text = params.text;
        this.fillColor = '#ffffff';
        this.font = params.font || '16px Arial';
        this.textAlign = params.textAlign || 'center';
        this.textBaseline = params.textBaseline || 'middle';
    }

    draw(): void {
        const { ctx } = this;

        ctx.fillStyle = this.fillColor;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        ctx.fillText(this.text, this.x, this.y);
    }
}
