import { SourceTreeNodeBuilder } from './SourceTreeNodeBuilder';
import { SourceTreeNode } from './SourceTreeNode';
import { MeasureTextTool } from '../MeasureTextTool';

import { type SourceItem } from '../../__source';

interface CreatedTreeNodeParams {
    node: SourceItem;
    x: number;
    y: number;
    level: number;
}

export class SourceTree {
    private measureTextTool: MeasureTextTool;
    private initialX: 50;
    private initialY: 50;
    private totalHeight = 50;

    tree: SourceTreeNode;

    constructor() {
        this.measureTextTool = new MeasureTextTool();
    }

    public create(source: SourceItem) {
        return this.createTreeNodes({
            node: source,
            x: this.initialX,
            y: this.initialY,
            level: 0,
        });
    }

    private createTreeNodes(params: CreatedTreeNodeParams) {
        const { node } = params;

        const nodeBuilder = new SourceTreeNodeBuilder();

        nodeBuilder.setText(node.name).setType(node.type);
        nodeBuilder.setPosition(params.x, params.y);

        const children: SourceTreeNode[] = [];

        if (node.children.length > 0) {
            for (const child of node.children) {
                const childOptions: CreatedTreeNodeParams = {
                    node: child,
                    x: 0,
                    y: params.y - this.totalHeight / 2,
                    level: params.level + 1,
                };

                const childNode = this.createTreeNodes(childOptions);
                children.push(childNode);
            }
        }

        const width = this.measureTextTool.calculateBlockWidth(node.name);

        return nodeBuilder.setSize(width, this.totalHeight).setChildren(children).build();
    }
}
