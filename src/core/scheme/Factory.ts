import { RootFigure, ContextFigure, SubcontextFigure, FeatureFigure, Figure, type BaseFigureParams } from './figures';
import { type NodeType } from './SourceTreeNode';

export class FigureFactory {
    private static factories: Record<NodeType, new (options: BaseFigureParams) => Figure> = {
        root: RootFigure,
        context: ContextFigure,
        subcontext: SubcontextFigure,
        feature: FeatureFigure,
    };

    static create(type: NodeType, options: BaseFigureParams): Figure {
        const factory = this.factories[type];

        if (!factory) {
            throw new Error(
                `Factory for type "${type}" not found. Available types: ${Object.keys(this.factories).join(', ')}`
            );
        }

        return new factory(options);
    }

    static registerFactory(type: NodeType, factory: new (options: BaseFigureParams) => Figure): void {
        this.factories[type] = factory;
    }
}
