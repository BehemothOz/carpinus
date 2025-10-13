import { MeasureTextTool } from '../../MeasureTextTool';
import { type Position } from '../Dimensions';

/**
 * Parameters required for creating a Text element.
 */
export interface TextParams {
    /**
     * The canvas rendering context
     */
    ctx: CanvasRenderingContext2D;
    /**
     * The position of the text
     */
    position: Position;
    /**
     * The text content to display
     */
    text: string;
    /**
     * The fill color of the text
     */
    fillColor?: string;
    /**
     * The font size in pixels
     */
    fontSize?: number;
    /**
     * The horizontal alignment of the text
     */
    textAlign?: CanvasTextAlign;
    /**
     * The vertical alignment of the text
     */
    textBaseline?: CanvasTextBaseline;
}

/**
 * Default font size constant (16px).
 * @constant {number}
 */
const DEFAULT_FONT_SIZE = 16;
/**
 * Default text color constant (white).
 * @constant {string}
 */
const DEFAULT_COLOR = '#ffffff';

/**
 * A class representing a text element that can be drawn on a canvas.
 * Provides text styling and positioning capabilities.
 * @class Text
 */
export class Text {
    /**
     * The canvas rendering context.
     * @private
     * @type {CanvasRenderingContext2D}
     */
    private ctx: CanvasRenderingContext2D;
    /**
     * The position of the text on the canvas.
     * @private
     * @type {Position}
     */
    private position: Position;
    /**
     * The text content to display.
     * @private
     * @type {string}
     */
    private text: string;
    /**
     * The fill color of the text.
     * @private
     * @type {string}
     */
    private fillColor: string;
    /**
     * The complete font specification string.
     * @private
     * @type {string}
     */
    private font: string;
    /**
     * The horizontal alignment of the text.
     * @private
     * @type {CanvasTextAlign}
     */
    private textAlign: CanvasTextAlign;
    /**
     * The vertical alignment of the text.
     * @private
     * @type {CanvasTextBaseline}
     */
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

    /**
     * Generates the complete font rule string.
     * @private
     * @method getFontRule
     * @param {number} [fontSize=16] - The desired font size in pixels
     * @returns {string} The complete font specification string
     */
    private getFontRule(fontSize: number = DEFAULT_FONT_SIZE): string {
        return `${fontSize}px ${MeasureTextTool.fontFamily}`;
    }

    /**
     * Determines the final color to use for the text.
     * @private
     * @method getColorRule
     * @param {string} [fillColor='#ffffff'] - The desired fill color
     * @returns {string} The color that will be used
     */
    private getColorRule(fillColor: string = DEFAULT_COLOR): string {
        return fillColor;
    }

    /**
     * Draws the text on the canvas using the current styling.
     * @method draw
     * @returns {void}
     */
    public draw(): void {
        const { ctx } = this;

        ctx.fillStyle = this.fillColor;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
