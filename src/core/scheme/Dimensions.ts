/**
 * Abstract base class for two-dimensional coordinates.
 * @abstract
 */
abstract class Dimensions {
    /**
     * Creates a new instance of Dimensions.
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents a position in two-dimensional space.
 * @extends {Dimensions}
 */
export class Position extends Dimensions {}

/**
 * Represents an offset or displacement in two-dimensional space.
 * @extends {Dimensions}
 */
export class Offset extends Dimensions {}

/**
 * Represents a gap or spacing in two-dimensional space.
 * @extends {Dimensions}
 */
export class Gap extends Dimensions {}

/**
 * Represents a point in two-dimensional space.
 * @extends {Position}
 */
export class Point extends Position {}

/**
 * Represents a size with width and height.
 */
export class Size {
    /**
     * Creates a new instance of Size.
     * @param {number} width - The width dimension
     * @param {number} height - The height dimension
     */
    constructor(public width: number, public height: number) {
        this.width = width;
        this.height = height;
    }
}

/**
 * Interface for scheme measurements.
 * @extends {Size}
 */
export interface SchemeMeasure extends Size {}
