import { SourceTreeNode, type SourceTreeNodeParams, type NodeType } from './SourceTreeNode';
import { Position, Size } from './Dimensions';

export class SourceTreeNodeBuilder {
    private nodeParams: Partial<SourceTreeNodeParams> = {};

    setText(text: string) {
        this.nodeParams.text = text;
        return this;
    }

    setType(type: NodeType) {
        this.nodeParams.type = type;
        return this;
    }

    setPosition(x: number, y: number) {
        this.nodeParams.position = new Position(x, y);
        return this;
    }

    setSize(width: number, height: number) {
        this.nodeParams.size = new Size(width, height);
        return this;
    }

    setChildren(children: SourceTreeNode[]) {
        this.nodeParams.children = children;
        return this;
    }

    build() {
        return new SourceTreeNode(this.nodeParams as SourceTreeNodeParams);
    }
}
