import { RootFigure, ContextFigure, SubcontextFigure, FeatureFigure, Figure, type BaseFigureParams } from './figures';
import { SourceTreeNode, type NodeType } from './SourceTreeNode';

interface FigureFactoryCreatedParams {
    ctx: CanvasRenderingContext2D;
    node: SourceTreeNode;
}

export class FigureFactory {
    private static factories: Record<NodeType, new (options: BaseFigureParams) => Figure> = {
        root: RootFigure,
        context: ContextFigure,
        subcontext: SubcontextFigure,
        feature: FeatureFigure,
    };

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

    static registerFactory(type: NodeType, factory: new (options: BaseFigureParams) => Figure): void {
        this.factories[type] = factory;
    }
}
