import { Shape, type ShapeParams } from './Shape';

/**
 * Parameters required for creating a Circle shape.
 * Extends basic Shape parameters with radius information.
 * @extends ShapeParams
 */
export interface CircleParams extends ShapeParams {
    /**
     * The radius of the circle in pixels
     */
    radius: number;
}

/**
 * A concrete implementation of Shape that represents a circle.
 * @extends Shape
 */
export class Circle extends Shape {
    /**
     * The radius of the circle in pixels.
     * @private
     * @type {number}
     */
    private radius: number;

    constructor({ ctx, position, fillColor = '#000000', radius }: CircleParams) {
        super({ ctx, position, fillColor });

        this.radius = radius;
    }

    /**
     * Draws the circle on the canvas using the current fill color and radius.
     * Implements the abstract draw method from Shape class.
     * @method draw
     * @override
     * @returns {void}
     */
    draw(): void {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
