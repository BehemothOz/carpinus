import { type Position } from '../Dimensions';

/**
 * Parameters required for creating a Shape instance.
 * @interface ShapeParams
 * @property {CanvasRenderingContext2D} ctx - The canvas rendering context for drawing
 * @property {Position} position - The initial position of the shape
 * @property {string} [fillColor='#000000'] - The fill color of the shape (optional, defaults to black)
 */
export interface ShapeParams {
    ctx: CanvasRenderingContext2D;
    position: Position;
    fillColor?: string;
}

/**
 * An abstract base class for geometric shapes that provides common functionality
 * and requires concrete implementations to define their specific drawing logic.
 * @abstract
 * @class Shape
 */
export abstract class Shape {
    /**
     * The canvas rendering context used for drawing operations.
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    protected ctx: CanvasRenderingContext2D;
    /**
     * The current position of the shape on the canvas.
     * @protected
     * @type {Position}
     */
    protected position: Position;
    /**
     * The fill color of the shape.
     * @protected
     * @type {string}
     * @default '#000000'
     */
    protected fillColor: string;

    constructor({ ctx, position, fillColor = '#000000' }: ShapeParams) {
        this.ctx = ctx;
        this.position = position;
        this.fillColor = fillColor;
    }

    /**
     * Abstract method that must be implemented by derived classes to define
     * the specific drawing logic for the shape.
     * @abstract
     * @method draw
     * @returns {void}
     */
    abstract draw(): void;
}
