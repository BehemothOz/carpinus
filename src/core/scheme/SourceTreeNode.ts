import { type Position, type Size } from './Dimensions';

export type NodeType = 'root' | 'context' | 'subcontext' | 'feature';

export interface SourceTreeNodeParams {
    ctx: CanvasRenderingContext2D;
    type: NodeType;
    text: string;
    position: Position;
    size: Size;
    isLast: boolean;
    children: SourceTreeNode[];
}

export class SourceTreeNode {
    text: string;
    type: NodeType;

    position: Position;
    size: Size;

    children: Array<SourceTreeNode>;

    isChildrenCollapsed: boolean = false;
    isCollapsed: boolean = false;
    isLast: boolean = false;

    constructor(params: SourceTreeNodeParams) {
        this.text = params.text;
        this.type = params.type;

        this.position = params.position;
        this.size = params.size;

        this.isLast = params.isLast;
        this.children = params.children;
    }

    changePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    changeChildren(children: SourceTreeNode[]) {
        this.children = children;
    }

    get hasChildren() {
        return this.children.length > 0;
    }

    public collapseChildren() {
        this.isChildrenCollapsed = !this.isChildrenCollapsed;

        const recursivelyCollapseChildren = (node: SourceTreeNode) => {
            if (node.hasChildren) {
                for (const childNode of node.children) {
                    childNode.collapse(this.isChildrenCollapsed);
                    recursivelyCollapseChildren(childNode);
                }
            }
        };

        recursivelyCollapseChildren(this);
    }

    public collapse(flag: boolean) {
        this.isChildrenCollapsed = flag;
        this.isCollapsed = flag;
    }
}
