import { Shape, type ShapeParams } from './Shape';
import { type Size } from '../Dimensions';

export interface RectangleParams extends ShapeParams {
    size: Size;
}

export class Rectangle extends Shape {
    protected size: Size;

    constructor(options: RectangleParams) {
        super(options);

        this.size = options.size;
    }

    draw(): void {
        console.log('this.options.primaryColor', this.fillColor);
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
