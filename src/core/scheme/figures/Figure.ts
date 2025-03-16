import { type RectangleParams, Rectangle, Text } from '../shapes';
import { Position, Size } from '../Dimensions';
import { Edge } from './Edge';
import { type SourceTreeNode } from '../SourceTreeNode';
import { FigureEdges } from './FigureEdges';

export interface BaseFigureParams extends RectangleParams {
    text: string;
    originalNode: SourceTreeNode;
}

export interface FigureParams extends BaseFigureParams {
    title: string;
    primaryColor: string;
    secondaryColor: string;
}

interface HeaderSettings {
    height: number;
    paddingLeft: number;
    fontSize: number;
}

interface BodySettings {
    fontSize: number;
}

/**
 * Class representing a figure on the scheme with header and body text
 * @extends Rectangle
 */
export class Figure extends Rectangle {
    private readonly header: Rectangle;
    private readonly headerText: Text;
    private readonly bodyText: Text;

    private readonly edges: Array<Edge> = [];

    private static readonly HEADER_SETTINGS: HeaderSettings = {
        height: 20,
        paddingLeft: 4,
        fontSize: 8,
    };

    private static readonly BODY_SETTINGS: BodySettings = {
        fontSize: 14,
    };

    /**
     * Creates a new instance of the figure
     * @param options - Figure parameters including dimensions, colors and texts
     */
    constructor(protected options: FigureParams) {
        super({
            ...options,
            fillColor: options.primaryColor,
        });

        this.header = this.createHeaderField();
        this.headerText = this.createHeaderText();
        this.bodyText = this.createBodyText();

        this.edges = FigureEdges.create({
            ctx: this.options.ctx,
            node: this.options.originalNode,
            color: this.options.primaryColor,
        });
    }

    /**
     * Creates the header rectangle of the figure
     * @returns Header rectangle
     * @private
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
     * Creates the header text element
     * @returns Header text element
     * @private
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
     * Creates the body text element
     * @returns Body text element
     * @private
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
     * Renders the figure on the canvas
     * @public
     */
    public draw(): void {
        super.draw();

        this.header.draw();
        this.headerText.draw();

        this.bodyText.draw();
    }

    public drawEdges(): void {
        this.edges.forEach((edge) => {
            edge.draw();
        });
    }
}
