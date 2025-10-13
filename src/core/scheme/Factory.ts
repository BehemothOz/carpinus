import { RootFigure, ContextFigure, SubcontextFigure, FeatureFigure, Figure, type BaseFigureParams } from './figures';
import { SourceTreeNode, type NodeType } from './SourceTreeNode';

/**
 * Parameters required for creating a figure through the factory.
 * @interface
 */
interface FigureFactoryCreatedParams {
    /**
     * The canvas rendering context
     */
    ctx: CanvasRenderingContext2D;
    /**
     * The source tree node to create a figure for
     */
    node: SourceTreeNode;
}

/**
 * Factory class for creating different types of figures based on node type.
 * Manages the creation of various figure types (root, context, subcontext, feature).
 */
export class FigureFactory {
    /**
     * Mapping of node types to their corresponding figure constructors.
     * @private
     * @static
     */
    private static factories: Record<NodeType, new (options: BaseFigureParams) => Figure> = {
        root: RootFigure,
        context: ContextFigure,
        subcontext: SubcontextFigure,
        feature: FeatureFigure,
    };

    /**
     * Creates a new figure instance based on the provided parameters.
     * @param {FigureFactoryCreatedParams} params - The parameters for figure creation
     * @returns {Figure} A new figure instance
     * @throws {Error} If the factory for the specified node type is not found
     */
    static create(params: FigureFactoryCreatedParams): Figure {
        const { ctx, node } = params;
        const { type, text, position, size } = node;

        const Factory = this.factories[type];

        if (!Factory) {
            throw new Error(
                `Factory for type "${type}" not found. Available types: ${Object.keys(this.factories).join(', ')}`
            );
        }

        return new Factory({ ctx, text, position, size, originalNode: node });
    }

    /**
     * Registers a new factory for a specific node type.
     * @param {NodeType} type - The node type to register the factory for
     * @param {new (options: BaseFigureParams) => Figure} factory - The factory constructor to register
     */
    static registerFactory(type: NodeType, factory: new (options: BaseFigureParams) => Figure): void {
        this.factories[type] = factory;
    }
}
