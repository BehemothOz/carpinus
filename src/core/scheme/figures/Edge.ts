import { Circle } from '../shapes/Circle';
import { Line, type LineParams } from '../shapes/Line';

/**
 * Configuration for an edge segment (endpoint marker).
 */
interface Segment {
    /**
     * The radius of the segment circle in pixels
     */
    radius: number;
    /**
     * The fill color of the segment
     */
    color: string;
}

/**
 * Parameters for creating an Edge, extending basic Line parameters.
 * @extends LineParams
 */
export interface EdgeParams extends LineParams {
    /**
     *  Optional configuration for the edge's end segment
     */
    segment?: Partial<Segment>;
}

/**
 * Default segment configuration values.
 * @constant {Segment}
 */
const defaultSegmentOptions: Segment = {
    radius: 4,
    color: '#000000',
};

/**
 * A specialized Line that can optionally display a circular segment at its end point.
 * @extends Line
 */
export class Edge extends Line {
    /**
     * Flag indicating whether to render the end segment.
     * @private
     * @type {boolean}
     */
    private readonly isUseSegment: boolean;
    /**
     * Configuration for the end segment appearance.
     * @private
     * @type {Segment}
     */
    private readonly segment: Segment;

    /**
     * Creates a new Edge instance.
     */
    constructor(options: EdgeParams) {
        const { segment, ...lineOptions } = options;

        super(lineOptions);

        this.isUseSegment = segment !== undefined;
        this.segment = this.mergeSegmentOptions(segment);
    }

    /**
     * Draws the complete edge (line + optional segment).
     * @method draw
     * @override
     * @returns {void}
     */
    public draw(): void {
        super.draw();

        if (this.isUseSegment) {
            this.drawSegment();
        }
    }

    /**
     * Draws the end segment as a filled circle.
     * @private
     * @returns {void}
     */
    private drawSegment(): void {
        const lastPoint = this.getLastPoint();

        const circle = new Circle({
            ctx: this.ctx,
            position: lastPoint,
            radius: this.segment.radius,
            fillColor: this.segment.color,
        });

        circle.draw();
    }

    /**
     * Merges provided segment options with defaults.
     * @private
     * @param {Partial<Segment>} [segment] - Partial segment configuration
     * @returns {Segment} Complete segment configuration
     */
    private mergeSegmentOptions(segment?: Partial<Segment>): Segment {
        if (segment === undefined) {
            return defaultSegmentOptions;
        }

        return { ...defaultSegmentOptions, ...segment };
    }
}
