import { Gap, Position, SchemeMeasure } from '../scheme/Dimensions';
import { SourceTreeNode } from '../scheme/SourceTreeNode';

/**
 * Parameters for initializing a Scheme instance.
 * @property {Function} notify - Callback for state changes
 * @property {Function} rebuild - Callback for tree reconstruction
 */
interface SchemeParams {
    notify: (scheme: SchemeNotifiedPayload) => void;
    rebuild: () => void;
}

/**
 * Payload structure for scheme state notifications.
 * @property {SourceTreeNode} tree - Current node hierarchy
 * @property {SchemeMeasure} measure - Current layout dimensions
 */
export interface SchemeNotifiedPayload {
    tree: SourceTreeNode;
    measure: SchemeMeasure;
}

/**
 * Manages the hierarchical node structure and layout measurements for the visualization.
 */
export class Scheme {
    /**
     * The root node of the hierarchical tree structure.
     * @type {SourceTreeNode}
     */
    tree: SourceTreeNode;
    /**
     * Current dimensions and layout measurements of the scheme.
     * @type {SchemeMeasure}
     */
    measure: SchemeMeasure;

    /**
     * The horizontal and vertical gap between nodes.
     * @type {Gap}
     */
    public readonly gap: Gap = new Gap(40, 20);
    /**
     * The minimum width of a node.
     */
    public readonly minWidthNode: number = 100;
    /**
     * The height of a node.
     */
    public readonly heightNode: number = 50;

    constructor(private params: SchemeParams) {}

    /**
     * Gets the current state of the scheme.
     * @returns {SchemeNotifiedPayload} Current tree and measurement state
     */
    public getState(): SchemeNotifiedPayload {
        return {
            tree: this.tree,
            measure: this.measure,
        };
    }

    /**
     * Updates the scheme state and triggers notifications.
     * @param {SourceTreeNode} tree - New tree structure
     * @param {SchemeMeasure} measure - New layout measurements
     * @returns {void}
     */
    public setState(tree: SourceTreeNode, measure: SchemeMeasure): void {
        this.tree = tree;
        this.measure = measure;

        this.notify();
    }

    /**
     * Finds and collapses a node based on mouse coordinates.
     * @param {number} mouseX - X coordinate in canvas space
     * @param {number} mouseY - Y coordinate in canvas space
     * @returns {boolean} True if a node was found and collapsed
     */
    public findNodeByMouseCoordinates(mouseX: number, mouseY: number): boolean {
        const position = new Position(mouseX, mouseY);
        const foundNode = this.findNodeByPosition(position);

        if (foundNode == null) return false;
        if (foundNode.isCollapsed) return false;

        foundNode.collapseChildren();

        this.params.rebuild();
        return true;
    }

    /**
     * Triggers state change notification.
     * @private
     * @returns {void}
     */
    private notify(): void {
        const currentState = this.getState();
        this.params.notify(currentState);
    }

    /**
     * Finds a node by position using BFS traversal.
     * @private
     * @param {Position} targetPosition - The position to search for
     * @returns {SourceTreeNode|null} The found node or null
     */
    private findNodeByPosition(targetPosition: Position): SourceTreeNode | null {
        const queue: SourceTreeNode[] = [this.tree];

        while (queue.length > 0) {
            if (queue.length === 0) {
                break;
            }

            const currentNode = queue.shift() as SourceTreeNode;

            if (this.checkIfPositionInsideNode(currentNode, targetPosition)) {
                return currentNode;
            }

            if (currentNode.children.length > 0) {
                queue.push(...currentNode.children);
            }
        }

        return null;
    }

    /**
     * Checks if a position is inside a node's bounds.
     * @private
     * @param {SourceTreeNode} node - The node to check
     * @param {Position} position - The position to test
     * @returns {boolean} True if the position is inside the node
     */
    private checkIfPositionInsideNode(node: SourceTreeNode, position: Position): boolean {
        return (
            position.x >= node.position.x &&
            position.x <= node.position.x + node.size.width &&
            position.y >= node.position.y &&
            position.y <= node.position.y + node.size.height
        );
    }
}
