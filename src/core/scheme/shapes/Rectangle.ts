import { Shape, type ShapeParams } from './Shape';
import { type Size } from '../Dimensions';

/**
 * Parameters required for creating a Rectangle shape.
 * Extends basic Shape parameters with size information.
 */
export interface RectangleParams extends ShapeParams {
    size: Size;
}

/**
 * A concrete implementation of Shape that represents a rectangle.
 * @extends Shape
 */
export class Rectangle extends Shape {
    /**
     * The dimensions of the rectangle (width and height).
     * @protected
     * @type {Size}
     */
    protected size: Size;

    constructor(options: RectangleParams) {
        super(options);

        this.size = options.size;
    }

    /**
     * Draws the rectangle on the canvas using the current fill color and dimensions.
     * Implements the abstract draw method from Shape class.
     * @method draw
     * @override
     * @returns {void}
     */
    draw(): void {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
