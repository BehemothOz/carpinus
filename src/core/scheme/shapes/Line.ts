import { Shape, type ShapeParams } from './Shape';
import { Point } from '../Dimensions';

interface LineParams extends ShapeParams {
    strokeColor?: string;
    lineWidth?: number;
}

export class Line extends Shape {
    private points: Point[] = [];
    private strokeColor: string;
    private lineWidth: number;

    constructor({ ctx, position, fillColor = '#000000', strokeColor = '#000000', lineWidth = 1 }: LineParams) {
        super({ ctx, position, fillColor });

        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;

        const startPoint = new Point(position.x, position.y);
        this.startAt(startPoint);
    }

    private startAt(point: Point) {
        this.points.push(point);
    }

    lineTo(x: number, y: number): Line {
        const point = new Point(x, y);
        this.points.push(point);

        return this;
    }

    draw(): void {
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
