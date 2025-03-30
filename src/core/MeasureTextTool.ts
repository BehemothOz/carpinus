/**
 * Configuration parameters for MeasureTextTool.
 * @property {string} [font] - Font specification (e.g., '14px Arial')
 * @property {number} [padding] - Padding to add around measured text
 */
interface MeasureTextToolParams {
    font: string;
    padding: number;
}

/**
 * Default initialization options for MeasureTextTool.
 * @constant {MeasureTextToolParams}
 * @default { font: '14px Arial', padding: 10 }
 */
const initialOptions = {
    font: '14px Arial',
    padding: 10,
};

/**
 * A utility class for measuring text dimensions on canvas with padding calculations.
 * Creates an off-screen canvas for accurate text measurement.
 */
export class MeasureTextTool {
    /**
     * Default font family used for measurements.
     * @static
     * @type {string}
     * @default 'Arial'
     */
    static fontFamily: string = 'Arial';
    /**
     * Off-screen canvas element used for measurements.
     * @private
     * @type {HTMLCanvasElement}
     */
    private canvas: HTMLCanvasElement;
    /**
     * Rendering context of the measurement canvas.
     * @private
     * @type {CanvasRenderingContext2D}
     */
    private ctx: CanvasRenderingContext2D;
    /**
     * Total padding to add to text measurements (2 × padding).
     * @private
     * @type {number}
     */
    private widthPart: number;

    /**
     * Creates a new MeasureTextTool instance.
     */
    constructor(options: MeasureTextToolParams = initialOptions) {
        const { font, padding } = options;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.font = font;
        this.widthPart = padding * 2;
    }

    /**
     * Calculates the total width required to display text including padding.
     * @param {string} text - The text to measure
     * @returns {number} The total width including padding (rounded to nearest integer)
     * @example
     * const measurer = new MeasureTextTool();
     * const width = measurer.calculateBlockWidth('Hello World'); // Returns padded width
     */
    public calculateBlockWidth(text: string): number {
        const metrics = this.ctx.measureText(text);
        const width = metrics.width + this.widthPart;

        return Math.round(width);
    }

    /**
     * Cleans up the measurement canvas.
     * @returns {void}
     * @description
     * Removes the internal canvas element. Should be called when the tool is no longer needed
     * to prevent memory leaks.
     */
    public dispose(): void {
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null as unknown as HTMLCanvasElement;
        }
    }
}
