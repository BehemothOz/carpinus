import { Shape, type ShapeParams } from './Shape';

export interface CircleParams extends ShapeParams {
    radius: number;
}

export class Circle extends Shape {
    private radius: number;

    constructor({ ctx, position, fillColor = '#000000', radius }: CircleParams) {
        super({ ctx, position, fillColor });

        this.radius = radius;
    }

    draw(): void {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
