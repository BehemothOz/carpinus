import { Circle } from '../shapes/Circle';
import { Line, type LineParams } from '../shapes/Line';

export interface EdgeParams extends LineParams {
    segment?: boolean;
}

export class Edge extends Line {
    private segment: boolean;

    constructor(options: EdgeParams) {
        const { segment = false, ...lineOptions } = options;
        super(lineOptions);

        this.segment = segment;
    }

    draw(): void {
        super.draw();

        if (this.segment) {
            this.drawSegment();
        }
    }

    private drawSegment(): void {
        const lastPoint = this.getLastPoint();

        const circle = new Circle({
            ctx: this.ctx,
            position: lastPoint,
            radius: 4,
        });

        circle.draw();
    }
}
