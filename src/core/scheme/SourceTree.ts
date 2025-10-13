import { SourceTreeNodeBuilder } from './SourceTreeNodeBuilder';
import { type SourceTreeNode } from './SourceTreeNode';
import { MeasureTextTool } from '../MeasureTextTool';
import { type State, type Scheme } from '../states';

import { type SourceItem } from '../../__source';
import { Size } from './Dimensions';

/**
 * Extended source item with width information.
 * @extends SourceItem
 * @property {number} width - Calculated node width
 * @property {ExtendedSourceItem[]} children - Child nodes
 */
interface ExtendedSourceItem extends SourceItem {
    width: number;
    children: ExtendedSourceItem[];
}

/**
 * Parameters for creating tree nodes.
 * @property {ExtendedSourceItem} node - The source data node
 * @property {number} x - X coordinate position
 * @property {number} y - Y coordinate position
 * @property {number} width - Node width
 * @property {number} level - Nesting level
 */
interface CreatedTreeNodeParams {
    node: ExtendedSourceItem;
    x: number;
    y: number;
    width: number;
    level: number;
}

/**
 * Parameters for initializing a SourceTree.
 * @property {State} state - Application state
 * @property {SourceItem} sourceData - Source data to visualize
 */
interface SourceTreeParams {
    state: State;
    sourceData: SourceItem;
}

/**
 * Represents a tree structure builder for source data visualization.
 * Handles creation and layout of hierarchical tree nodes with automatic sizing and positioning.
 */
export class SourceTree {
    /**
     * Tool for measuring text dimensions.
     * @private
     * @type {MeasureTextTool}
     */
    private measureTextTool: MeasureTextTool;
    /**
     * Initial X position for tree layout.
     * @private
     * @type {number}
     * @default 0
     */
    private initialX: number = 0;
    /**
     * Initial Y position for tree layout.
     * @private
     * @type {number}
     * @default 0
     */
    private initialY: number = 0;
    /**
     * Accumulated vertical offset for child nodes.
     * @private
     * @type {number}
     * @default 0
     */
    private accumulatedOffset: number = 0;
    /**
     * Reference to the scheme state manager.
     * @private
     * @type {Scheme}
     */
    private scheme: Scheme;
    /**
     * Canvas rendering context for measurements.
     * @private
     * @type {CanvasRenderingContext2D}
     */
    private ctx: CanvasRenderingContext2D;

    /**
     * The root node of the generated tree.
     * @type {SourceTreeNode}
     */
    private tree: SourceTreeNode;
    /**
     * Original source data used to build the tree.
     * @type {SourceItem}
     */
    private sourceData: SourceItem;
    /**
     * Current dimensions of the tree layout.
     * @private
     * @type {Size}
     */
    private measure: Size = new Size(0, 0);

    /**
     * Creates a new SourceTree instance.
     */
    constructor(params: SourceTreeParams) {
        this.measureTextTool = new MeasureTextTool();
        this.scheme = params.state.scheme;
        this.sourceData = params.sourceData;

        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    /**
     * Creates the initial tree structure from source data.
     * @method create
     * @returns {void}
     */
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

    /**
     * Rebuilds the tree structure while preserving node state.
     * @method rebuild
     * @returns {void}
     */
    rebuild() {
        const { tree } = this.scheme.getState();
        const rebuildedTree = this.rebuildTreeNodes(tree);

        this.updateSchemeState(rebuildedTree);
    }

    /**
     * Updates the scheme state with new tree data.
     * @private
     * @method updateSchemeState
     * @param {SourceTreeNode} tree - The tree to update in the scheme
     * @returns {void}
     */
    private updateSchemeState(tree: SourceTreeNode) {
        this.scheme.setState(tree, { width: this.measure.width, height: this.measure.height });

        this.accumulatedOffset = 0;
        this.measure = new Size(0, 0);
    }

    /**
     * Recursively creates tree nodes from source data.
     * @private
     * @method createTreeNodes
     * @param {CreatedTreeNodeParams} params - Node creation parameters
     * @returns {SourceTreeNode} The created tree node
     */
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

    /**
     * Recursively rebuilds tree nodes while preserving their state.
     * @private
     * @method rebuildTreeNodes
     * @param {SourceTreeNode} node - The node to rebuild
     * @returns {SourceTreeNode} The rebuilt node
     */
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

    /**
     * Calculates node width including all children recursively.
     * @private
     * @method calculateNodeWidth
     * @param {SourceItem} item - The source item to measure
     * @returns {ExtendedSourceItem} The extended item with width information
     */
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

     /**
     * Calculates the maximum width from a set of nodes.
     * @private
     * @method calculateMaxWidthFromNodes
     * @param {ExtendedSourceItem[]} nodes - Nodes to measure
     * @returns {number} The maximum width found
     */
    private calculateMaxWidthFromNodes(nodes: ExtendedSourceItem[]) {
        const widths = nodes.map((node) => node.width);

        return Math.max(...widths, this.scheme.minWidthNode);
    }
}
