import { SourceTreeNodeBuilder } from './SourceTreeNodeBuilder';
import { SourceTreeNode } from './SourceTreeNode';
import { MeasureTextTool } from '../MeasureTextTool';

import { type SourceItem } from '../../__source';

import { type Level, type LevelSize, type NodeLevelMeasure } from './Dimensions';

import { type State } from '../scene/State';

interface ExtendedSourceItem extends SourceItem {
    width: number;
    children: ExtendedSourceItem[];
}

interface CreatedTreeNodeParams {
    node: ExtendedSourceItem;
    x: number;
    y: number;
    width: number;
    level: number;
}

export class SourceTree {
    private measureTextTool: MeasureTextTool;
    private initialX: number = 0;
    private initialY: number = 0;
    private accumulatedOffset: number = 0;
    private levelSizes: Map<Level, LevelSize> = new Map();

    private state: State;

    tree: SourceTreeNode;

    constructor(state: State) {
        this.measureTextTool = new MeasureTextTool();
        this.state = state;
    }

    public create(source: SourceItem): SourceTreeNode {
        const extendedSource: ExtendedSourceItem = this.calculateNodeWidth(source);

        this.tree = this.createTreeNodes({
            node: extendedSource,
            x: this.initialX,
            y: this.initialY,
            width: 100,
            level: 0,
        });

        this.accumulatedOffset = 0;

        return this.tree;
    }

    private createTreeNodes(params: CreatedTreeNodeParams) {
        const { node, width } = params;

        const nodeBuilder = new SourceTreeNodeBuilder();

        nodeBuilder.setText(node.name).setType(node.type);
        nodeBuilder.setPosition(params.x, params.y);

        const children: SourceTreeNode[] = [];

        this.accumulatedOffset += 1;

        if (node.children.length > 0) {
            const width = this.calculateMaxWidthFromNodes(node.children);

            for (const child of node.children) {
                const x = params.x + params.width + this.state.gap.x;
                const y = (this.state.heightNode + this.state.gap.y) * this.accumulatedOffset;

                const childOptions: CreatedTreeNodeParams = {
                    node: child,
                    x,
                    y,
                    width,
                    level: params.level + 1,
                };

                const childNode = this.createTreeNodes(childOptions);
                children.push(childNode);
            }
        }

        this.calculateLevelSize({
            level: params.level,
            width,
            height: this.state.heightNode,
        });

        return nodeBuilder.setSize(width, this.state.heightNode).setChildren(children).build();
    }

    private calculateLevelSize(nodeLevel: NodeLevelMeasure) {
        const { level, width, height } = nodeLevel;
        const levelSize = this.levelSizes.get(level);

        let levelWidth = width;
        let levelHeight = height;

        if (levelSize) {
            levelWidth = Math.max(levelSize.width, width);
            levelHeight = levelSize.height + height;
        }

        this.levelSizes.set(level, { width: levelWidth, height: levelHeight });
    }

    getTotalMeasure() {
        const result = { width: 0, height: 0 };

        for (const levelSize of this.levelSizes.values()) {
            result.width += levelSize.width;
            result.height += levelSize.height;
        }

        result.width += this.state.gap.x * this.levelSizes.size - 1;
        result.height += this.state.gap.y * this.levelSizes.size - 1;

        return result;
    }

    public toArray(root: SourceTreeNode) {
        const queue: SourceTreeNode[] = [root];
        const result: SourceTreeNode[] = [];

        while (queue.length > 0) {
            if (queue.length === 0) {
                break;
            }

            const currentNode = queue.shift() as SourceTreeNode;
            result.push(currentNode);

            if (currentNode.children.length > 0) {
                queue.push(...currentNode.children);
            }
        }

        return result;
    }

    private calculateNodeWidth(item: SourceItem): ExtendedSourceItem {
        const children: Array<ExtendedSourceItem> = [];

        if (item.children.length > 0) {
            for (const childItem of item.children) {
                children.push(this.calculateNodeWidth(childItem));
            }
        }

        const nodeWidth = this.measureTextTool.calculateBlockWidth(item.name);

        return Object.assign({}, item, {
            children,
            width: nodeWidth,
        });
    }

    private calculateMaxWidthFromNodes(nodes: ExtendedSourceItem[]) {
        const widths = nodes.map((node) => node.width);

        return Math.max(...widths, this.state.minWidthNode);
    }
}
