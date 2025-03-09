import { type Position, type Size } from './Dimensions';

export type NodeType = 'root' | 'context' | 'subcontext' | 'feature';

export interface SourceTreeNodeParams {
    type: NodeType;
    text: string;
    position: Position;
    size: Size;
    children: SourceTreeNode[];
}

export class SourceTreeNode {
    text: string;
    type: NodeType;

    position: Position;
    size: Size;

    children: Array<SourceTreeNode>;

    isCollapsed: boolean;

    constructor(params: SourceTreeNodeParams) {
        this.text = params.text;

        this.position = params.position;
        this.size = params.size;

        this.children = params.children;

        this.isCollapsed = false;
    }

    get hasChildren() {
        return this.children.length > 0;
    }

    collapse() {
        this.isCollapsed = !this.isCollapsed;
    }
}
