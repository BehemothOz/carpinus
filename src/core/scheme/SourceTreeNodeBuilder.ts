import { SourceTreeNode, type SourceTreeNodeParams, type NodeType } from './SourceTreeNode';
import { Position, Size } from './Dimensions';

/**
 * Builder class for creating SourceTreeNode instances.
 * Provides a fluent interface for setting node parameters.
 */
export class SourceTreeNodeBuilder {
    /**
     * Partial parameters for the node being built.
     * @private
     */
    private nodeParams: Partial<SourceTreeNodeParams> = {};

    /**
     * Sets the text content of the node.
     * @param {string} text - The text to set
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setText(text: string): SourceTreeNodeBuilder {
        this.nodeParams.text = text;
        return this;
    }

    /**
     * Sets the type of the node.
     * @param {NodeType} type - The node type to set
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setType(type: NodeType): SourceTreeNodeBuilder {
        this.nodeParams.type = type;
        return this;
    }

    /**
     * Sets the position of the node.
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setPosition(x: number, y: number): SourceTreeNodeBuilder {
        this.nodeParams.position = new Position(x, y);
        return this;
    }

    /**
     * Sets the size of the node.
     * @param {number} width - The width of the node
     * @param {number} height - The height of the node
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setSize(width: number, height: number): SourceTreeNodeBuilder {
        this.nodeParams.size = new Size(width, height);
        return this;
    }

    /**
     * Sets the child nodes of the current node.
     * @param {SourceTreeNode[]} children - Array of child nodes
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setChildren(children: SourceTreeNode[]): SourceTreeNodeBuilder {
        this.nodeParams.children = children;
        return this;
    }

    /**
     * Sets whether this node is the last child of its parent.
     * @param {boolean} isLast - Whether the node is the last child
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setIsLast(isLast: boolean): SourceTreeNodeBuilder {
        this.nodeParams.isLast = isLast;
        return this;
    }

    /**
     * Sets the canvas rendering context for the node.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to set
     * @returns {SourceTreeNodeBuilder} The builder instance for method chaining
     */
    setRenderingContext(ctx: CanvasRenderingContext2D): SourceTreeNodeBuilder {
        this.nodeParams.ctx = ctx;
        return this;
    }

    /**
     * Builds and returns a new SourceTreeNode instance with the set parameters.
     * @returns {SourceTreeNode} A new node instance with the configured parameters
     */
    build(): SourceTreeNode {
        return new SourceTreeNode(this.nodeParams as SourceTreeNodeParams);
    }
}
