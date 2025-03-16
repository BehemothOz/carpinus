import { Circle } from '../shapes/Circle';
import { Line, type LineParams } from '../shapes/Line';

interface Segment {
    radius: number;
    color: string;
}

export interface EdgeParams extends LineParams {
    segment?: Partial<Segment>;
}

const defaultSegmentOptions: Segment = {
    radius: 4,
    color: '#000000',
};

export class Edge extends Line {
    private readonly isUseSegment: boolean;
    private readonly segment: Segment;

    constructor(options: EdgeParams) {
        const { segment, ...lineOptions } = options;

        super(lineOptions);

        this.isUseSegment = segment !== undefined;
        this.segment = this.mergeSegmentOptions(segment);
    }

    draw(): void {
        super.draw();

        if (this.isUseSegment) {
            this.drawSegment();
        }
    }

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

    private mergeSegmentOptions(segment?: Partial<Segment>): Segment {
        if (segment === undefined) {
            return defaultSegmentOptions;
        }

        return { ...defaultSegmentOptions, ...segment };
    }
}
