import { Shape, type ShapeParams } from './Shape';
import { Point } from '../Dimensions';

/**
 * Parameters required for creating a Line shape.
 * Extends basic Shape parameters with line-specific styling options.
 * @extends ShapeParams
 */
export interface LineParams extends ShapeParams {
    /**
     * The stroke color of the line
     */
    strokeColor?: string;
    /**
     * The width of the line in pixels
     */
    lineWidth?: number;
}

/**
 * A concrete implementation of Shape that represents a multi-segment line.
 * Supports building complex paths with multiple points and provides styling options.
 * @extends Shape
 */
export class Line extends Shape {
    /**
     * Collection of points that define the line path.
     * @private
     * @type {Point[]}
     */
    private points: Point[] = [];
    /**
     * The stroke color used to draw the line.
     * @private
     * @type {string}
     * @default '#000000'
     */
    private strokeColor: string;
    /**
     * The width of the line in pixels.
     * @private
     * @type {number}
     * @default 1
     */
    private lineWidth: number;

    constructor({ ctx, position, fillColor = '#000000', strokeColor = '#000000', lineWidth = 1 }: LineParams) {
        super({ ctx, position, fillColor });

        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;

        const startPoint = new Point(position.x, position.y);
        this.startAt(startPoint);
    }

    /**
     * Adds the initial point to start the line path (private method).
     * @private
     * @method startAt
     * @param {Point} point - The starting point of the line
     */
    private startAt(point: Point) {
        this.points.push(point);
    }

    /**
     * Adds a new point to the line path and returns the Line instance for chaining.
     * @method lineTo
     * @param {number} x - The x-coordinate of the next point
     * @param {number} y - The y-coordinate of the next point
     * @returns {Line} The current Line instance for method chaining
     */
    public lineTo(x: number, y: number): Line {
        const point = new Point(x, y);
        this.points.push(point);

        return this;
    }

    /**
     * Gets the last point added to the line path.
     * @method getLastPoint
     * @returns {Point} The most recently added point
     * @throws {Error} If no points exist in the path
     */
    public getLastPoint(): Point {
        if (this.points.length === 0) {
            throw new Error('No points exist in the line path');
        }

        return this.points.at(-1) as Point;
    }

    /**
     * Draws the line on the canvas using the current stroke style.
     * Implements the abstract draw method from Shape class.
     * @method draw
     * @override
     * @returns {void}
     * @throws {Error} If fewer than two points exist in the path
     */
    public draw(): void {
        if (this.points.length < 2) {
            throw new Error('At least two points are required to draw a line.');
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }
}
