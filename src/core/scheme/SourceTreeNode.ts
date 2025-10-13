import { type Position, type Size } from './Dimensions';

/**
 * Represents the possible types of nodes in the source tree
 */
export type NodeType = 'root' | 'context' | 'subcontext' | 'feature';

/**
 * Represents the possible view states of a node
 */
export type NodeView = 'usual' | 'collapsed' | 'hidden';

/**
 * Parameters required for creating a new SourceTreeNode instance.
 * @interface
 */
export interface SourceTreeNodeParams {
    /**
     * The canvas rendering context
     */
    ctx: CanvasRenderingContext2D;
    /**
     * The type of the node
     */
    type: NodeType;
    /**
     * The text content of the node
     */
    text: string;
    /**
     * The position of the node in the tree
     */
    position: Position;
    /**
     * The size of the node
     */
    size: Size;
    /**
     * Whether this node is the last child of its parent
     */
    isLast: boolean;
    /**
     * Array of child nodes
     */
    children: SourceTreeNode[];
}

/**
 * Represents a node in the source tree structure.
 * Manages node properties, state, and child relationships.
 */
export class SourceTreeNode {
    /**
     * The text content of the node
     */
    text: string;
    /**
     * The type of the node
     */
    type: NodeType;
    /**
     * The position of the node in the tree
     */
    position: Position;
    /**
     * The size of the node
     */
    size: Size;
    /**
     * The current view state of the node
     */
    view: NodeView;
    /**
     * Array of child nodes
     */
    children: Array<SourceTreeNode>;
    /**
     * Whether the node's children are collapsed
     */
    isChildrenCollapsed: boolean = false;
    /**
     * Whether the node itself is collapsed
     */
    isCollapsed: boolean = false;
    /**
     * Whether this node is the last child of its parent
     */
    isLast: boolean = false;

    /**
     * Creates a new SourceTreeNode instance.
     * @param {SourceTreeNodeParams} params - The parameters for creating the node
     */
    constructor(params: SourceTreeNodeParams) {
        this.text = params.text;
        this.type = params.type;

        this.position = params.position;
        this.size = params.size;

        this.isLast = params.isLast;
        this.children = params.children;

        this.view = 'usual';
    }

    /**
     * Changes the position of the node.
     * @param {number} x - The new x coordinate
     * @param {number} y - The new y coordinate
     */
    public changePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * Updates the children of the node.
     * @param {SourceTreeNode[]} children - The new array of child nodes
     */
    public changeChildren(children: SourceTreeNode[]) {
        this.children = children;
    }

    /**
     * Checks if the node has any children.
     * @returns {boolean} True if the node has children, false otherwise
     */
    get hasChildren(): boolean {
        return this.children.length > 0;
    }

    /**
     * Toggles the collapsed state of the node's children.
     * Recursively applies the collapse state to all child nodes.
     */
    public collapseChildren() {
        this.isChildrenCollapsed = !this.isChildrenCollapsed;
        this.setView();

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

    /**
     * Updates the view state of the node based on its collapsed state.
     * @private
     */
    private setView() {
        if (this.isChildrenCollapsed && !this.isLast) {
            this.view = 'collapsed';
        } else {
            this.view = 'usual';
        }
    }

    /**
     * Sets the collapsed state of the node and its children.
     * @param {boolean} flag - The new collapsed state
     */
    public collapse(flag: boolean) {
        this.isChildrenCollapsed = flag;
        this.isCollapsed = flag;
    }
}
