import { MeasureTextTool } from '../../MeasureTextTool';
import { type Position } from '../Dimensions';

export interface TextParams {
    ctx: CanvasRenderingContext2D;
    position: Position;
    text: string;
    fillColor?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}

const DEFAULT_FONT_SIZE = 16;
const DEFAULT_COLOR = '#ffffff';

export class Text {
    private ctx: CanvasRenderingContext2D;
    private position: Position;
    private text: string;
    private fillColor: string;
    private font: string;
    private textAlign: CanvasTextAlign;
    private textBaseline: CanvasTextBaseline;

    constructor(params: TextParams) {
        this.ctx = params.ctx;
        this.position = params.position;
        this.text = params.text;

        this.fillColor = this.getColorRule(params.fillColor);
        this.font = this.getFontRule(params.fontSize);

        this.textAlign = params.textAlign || 'center';
        this.textBaseline = params.textBaseline || 'middle';
    }

    getFontRule(fontSize: number = DEFAULT_FONT_SIZE) {
        return `${fontSize}px ${MeasureTextTool.fontFamily}`;
    }

    getColorRule(fillColor: string = DEFAULT_COLOR) {
        return fillColor;
    }

    draw(): void {
        const { ctx } = this;

        ctx.fillStyle = this.fillColor;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
