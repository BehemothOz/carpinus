import { SourceTreeNodeBuilder } from './SourceTreeNodeBuilder';
import { type SourceTreeNode } from './SourceTreeNode';
import { MeasureTextTool } from '../MeasureTextTool';
import { type State, type Scheme } from '../states';

import { type SourceItem } from '../../__source';
import { Size } from './Dimensions';

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

interface SourceTreeParams {
    state: State;
    sourceData: SourceItem;
}

export class SourceTree {
    private measureTextTool: MeasureTextTool;
    private initialX: number = 0;
    private initialY: number = 0;
    private accumulatedOffset: number = 0;
    private scheme: Scheme;
    private ctx: CanvasRenderingContext2D;

    tree: SourceTreeNode;
    sourceData: SourceItem;

    private measure: Size = new Size(0, 0);

    constructor(params: SourceTreeParams) {
        this.measureTextTool = new MeasureTextTool();
        this.scheme = params.state.scheme;
        this.sourceData = params.sourceData;

        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public create() {
        const extendedSource: ExtendedSourceItem = this.calculateNodeWidth(this.sourceData);

        const tree = this.createTreeNodes({
            node: extendedSource,
            x: this.initialX,
            y: this.initialY,
            width: 100,
            level: 0,
        });

        this.updateSchemeState(tree);
    }

    rebuild() {
        const { tree } = this.scheme.getState();
        const rebuildedTree = this.rebuildTreeNodes(tree);

        this.updateSchemeState(rebuildedTree);
    }

    private updateSchemeState(tree: SourceTreeNode) {
        this.scheme.setState(tree, { width: this.measure.width, height: this.measure.height });

        this.accumulatedOffset = 0;
        this.measure = new Size(0, 0);
    }

    private createTreeNodes(params: CreatedTreeNodeParams) {
        const { node, width } = params;

        const nodeBuilder = new SourceTreeNodeBuilder();

        nodeBuilder.setText(node.name).setType(node.type);
        nodeBuilder.setRenderingContext(this.ctx).setPosition(params.x, params.y);

        const children: SourceTreeNode[] = [];

        this.accumulatedOffset += 1;

        this.measure.width = Math.max(this.measure.width, params.x + width);
        this.measure.height = Math.max(this.measure.height, params.y + this.scheme.heightNode);

        if (node.children.length > 0) {
            const width = this.calculateMaxWidthFromNodes(node.children);

            for (const child of node.children) {
                const x = params.x + params.width + this.scheme.gap.x;
                const y = (this.scheme.heightNode + this.scheme.gap.y) * this.accumulatedOffset;

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
        } else {
            nodeBuilder.setIsLast(true);
        }

        return nodeBuilder.setSize(width, this.scheme.heightNode).setChildren(children).build();
    }

    private rebuildTreeNodes(node: SourceTreeNode) {
        const { position, size } = node;

        const children: SourceTreeNode[] = [];

        this.accumulatedOffset += 1;

        this.measure.width = Math.max(this.measure.width, position.x + size.width);
        this.measure.height = Math.max(this.measure.height, position.y + size.height);

        if (node.isChildrenCollapsed) {
            return node;
        }

        if (node.children.length > 0) {
            for (const child of node.children) {
                const y = (child.size.height + this.scheme.gap.y) * this.accumulatedOffset;

                child.changePosition(child.position.x, y);

                const childNode = this.rebuildTreeNodes(child);
                children.push(childNode);
            }
        }

        node.changeChildren(children);
        return node;
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

        return Math.max(...widths, this.scheme.minWidthNode);
    }
}
