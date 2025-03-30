import { type RectangleParams, Rectangle, Text } from '../shapes';
import { Position, Size } from '../Dimensions';
import { Edge } from './Edge';
import { NodeView, type SourceTreeNode } from '../SourceTreeNode';
import { FigureEdges } from './FigureEdges';

/**
 * Base parameters for creating a Figure, extending Rectangle parameters.
 * @extends RectangleParams
 */
export interface BaseFigureParams extends RectangleParams {
    /**
     * The main body text content
     */
    text: string;
    /**
     * The source tree node this figure represents
     */
    originalNode: SourceTreeNode;
}

/**
 * Complete parameters for creating a Figure.
 * @extends BaseFigureParams
 */
export interface FigureParams extends BaseFigureParams {
    /**
     * The header text content
     */
    title: string;
    /**
     * The main fill color of the figure
     */
    primaryColor: string;
    /**
     * The header background color
     */
    secondaryColor: string;
}

/**
 * Configuration settings for the figure header.
 * @property {number} height - Header height in pixels
 * @property {number} paddingLeft - Left padding for header text in pixels
 * @property {number} fontSize - Header text size in pixels
 */
interface HeaderSettings {
    height: number;
    paddingLeft: number;
    fontSize: number;
}

/**
 * Configuration settings for the figure body.
 * @property {number} fontSize - Body text size in pixels
 */
interface BodySettings {
    fontSize: number;
}

/**
 * Class representing a figure on the scheme with header and body text
 * @extends Rectangle
 */
export class Figure extends Rectangle {
    /**
     * The header rectangle element.
     * @private
     * @type {Rectangle}
     */
    private readonly header: Rectangle;
    /**
     * The header text element.
     * @private
     * @type {Text}
     */
    private readonly headerText: Text;
    /**
     * The header text element.
     * @private
     * @type {Text}
     */
    private readonly bodyText: Text;
    /**
     * Collection of edges connected to this figure.
     * @private
     * @type {Array<Edge>}
     */
    private readonly edges: Array<Edge> = [];
    /**
     * The current view state of the figure.
     * @private
     * @type {NodeView}
     */
    private readonly view: NodeView;

    /**
     * Static configuration for header appearance.
     * @static
     * @type {HeaderSettings}
     */
    private static readonly HEADER_SETTINGS: HeaderSettings = {
        height: 20,
        paddingLeft: 4,
        fontSize: 8,
    };
    /**
     * Static configuration for body appearance.
     * @static
     * @type {BodySettings}
     */
    private static readonly BODY_SETTINGS: BodySettings = {
        fontSize: 14,
    };

    /**
     * Creates a new instance of the figure
     * @param options - Figure parameters including dimensions, colors and texts
     */
    constructor(protected options: FigureParams) {
        const { ctx, primaryColor, originalNode } = options;
        super({
            ...options,
            fillColor: primaryColor,
        });

        this.header = this.createHeaderField();
        this.headerText = this.createHeaderText();
        this.bodyText = this.createBodyText();

        this.view = originalNode.view;

        this.edges = FigureEdges.create({
            ctx,
            node: originalNode,
            color: primaryColor,
        });
    }

    /**
     * Creates the header rectangle element for the figure.
     * @private
     * @returns {Rectangle} Configured header rectangle with secondary color background
     */
    private createHeaderField(): Rectangle {
        const size = new Size(this.options.size.width, Figure.HEADER_SETTINGS.height);

        return new Rectangle({
            ctx: this.options.ctx,
            position: this.options.position,
            size,
            fillColor: this.options.secondaryColor,
        });
    }

    /**
     * Creates the text element for the figure header.
     * @private
     * @returns {Text} Configured header text element
     * @description
     * Positions the header text slightly indented from the left edge (using HEADER_SETTINGS.paddingLeft)
     * and vertically centered within the header area. Uses a smaller font size (HEADER_SETTINGS.fontSize)
     * with left alignment.
     */
    private createHeaderText(): Text {
        const x = this.options.position.x + Figure.HEADER_SETTINGS.paddingLeft;
        const y = this.options.position.y + Figure.HEADER_SETTINGS.height / 2;

        const position = new Position(x, y);

        return new Text({
            ctx: this.options.ctx,
            position,
            text: this.options.title,
            fontSize: Figure.HEADER_SETTINGS.fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
        });
    }

    /**
     * Creates the main body text element for the figure.
     * @private
     * @returns {Text} Configured body text element
     * @description
     * Centers the body text both horizontally and vertically within the remaining space below the header.
     * Uses a larger font size (BODY_SETTINGS.fontSize) than the header for better readability.
     */
    private createBodyText(): Text {
        const x = this.options.position.x + this.options.size.width / 2;
        const y = this.options.position.y + this.options.size.height / 2 + Figure.HEADER_SETTINGS.height / 2;

        const position = new Position(x, y);

        return new Text({
            ctx: this.options.ctx,
            position,
            text: this.options.text,
            fontSize: Figure.BODY_SETTINGS.fontSize,
            textAlign: 'center',
            textBaseline: 'middle',
        });
    }

    /**
     * Renders a special visual representation when the figure is in collapsed state.
     * @private
     * @description
     * Creates a layered "stack" effect by drawing multiple offset rectangles with alternating colors.
     * The number of layers is controlled by the 'count' variable (5 layers) and the offset
     * determines the spacing between layers (3 pixels). Alternate layers use the primary color
     * and transparent white to create a visual depth effect.
     */
    private drawCollapsedView(): void {
        const offset = 3;
        const count = 5;
        const transparentColor = '#ffffff';

        for (let i = count; 0 <= i; i -= 1) {
            const { position, size, primaryColor } = this.options;

            const x = position.x + offset * i;
            const y = position.y - offset * i;

            const color = i % 2 === 0 ? primaryColor : transparentColor;

            const rect = new Rectangle({
                ctx: this.options.ctx,
                position: new Position(x, y),
                size,
                fillColor: color,
            });

            rect.draw();
        }
    }

    /**
     * Main drawing method that renders the complete figure on canvas.
     * @public
     * @override
     * @description
     * Handles two view states:
     * 1. Collapsed: Draws the layered stack effect using drawCollapsedView()
     * 2. Normal: Draws the base rectangle followed by header and body elements
     */
    public draw(): void {
        if (this.view === 'collapsed') {
            this.drawCollapsedView();
        }

        super.draw();

        const elementsToDraw = [this.header, this.headerText, this.bodyText];

        elementsToDraw.forEach((element) => {
            element.draw();
        });
    }

    /**
     * Draws all edges connected to this figure.
     * @public
     */
    public drawEdges(): void {
        this.edges.forEach((edge) => {
            edge.draw();
        });
    }
}
