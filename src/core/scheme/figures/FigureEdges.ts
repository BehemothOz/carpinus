import { Position } from '../Dimensions';
import { type SourceTreeNode } from '../SourceTreeNode';
import { Edge } from './Edge';

interface FigureEdgesOptions {
    ctx: CanvasRenderingContext2D;
    node: SourceTreeNode;
    color?: string;
}

export class FigureEdges {
    static create(options: FigureEdgesOptions) {
        const { position, size, children } = options.node;

        const edges: Array<Edge> = [];

        const figureX = position.x + size.width / 2;
        const figureY = position.y + size.height;

        const lastIndex = this.isLastIndex(children);

        children.forEach((child, index) => {
            const x = child.position.x;
            const y = child.position.y + child.size.height / 2;

            const edgeStartPosition = new Position(x, y);

            const childEdge = new Edge({
                ctx: options.ctx,
                position: edgeStartPosition,
                strokeColor: options.color,
                segment: {
                    color: options.color,
                },
            });

            childEdge.lineTo(figureX, y);
            edges.push(childEdge);

            if (index === lastIndex) {
                const position = new Position(figureX, figureY);
                const figureEdge = new Edge({ ctx: options.ctx, position, strokeColor: options.color });

                figureEdge.lineTo(figureX, y);
                edges.push(figureEdge);
            }
        });

        return edges;
    }

    private static isLastIndex(children: Array<SourceTreeNode>): number {
        return children.length - 1;
    }
}
