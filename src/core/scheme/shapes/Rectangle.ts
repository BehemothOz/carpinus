import { Shape, type ShapeParams } from './Shape';

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
