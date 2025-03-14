import { type Position } from '../Dimensions';

export interface ShapeParams {
    ctx: CanvasRenderingContext2D;
    position: Position;
    fillColor?: string;
}

export abstract class Shape {
    protected ctx: CanvasRenderingContext2D;
    protected position: Position;
    protected fillColor: string;

    constructor({ ctx, position, fillColor = '#000000' }: ShapeParams) {
        this.ctx = ctx;
        this.position = position;
        this.fillColor = fillColor;
    }

    abstract draw(): void;
}
