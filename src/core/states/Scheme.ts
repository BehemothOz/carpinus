import { Gap, Position, SchemeMeasure } from '../scheme/Dimensions';
import { SourceTreeNode } from '../scheme/SourceTreeNode';

interface SchemeParams {
    notify: (scheme: SchemeNotifiedPayload) => void;
}

export interface SchemeNotifiedPayload {
    tree: SourceTreeNode;
    measure: SchemeMeasure;
}

export class Scheme {
    tree: SourceTreeNode;
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

    public getState() {
        return {
            tree: this.tree,
            measure: this.measure,
        };
    }

    public setState(tree: SourceTreeNode, measure: SchemeMeasure): void {
        this.tree = tree;
        this.measure = measure;

        const currentState = this.getState();
        this.params.notify(currentState);
    }

    public findNodeByMouseCoordinates(mouseX: number, mouseY: number): boolean {
        const position = new Position(mouseX, mouseY);
        const foundNode = this.findNodeByPosition(position);

        if (foundNode == null) return false;
        if (foundNode.isCollapsed) return false;

        foundNode.collapseChildren();
        this.notify();

        return true;
    }

    private notify() {
        const currentState = this.getState();
        this.params.notify(currentState);
    }

    private findNodeByPosition(targetPosition: Position) {
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

    private checkIfPositionInsideNode(node: SourceTreeNode, position: Position): boolean {
        return (
            position.x >= node.position.x &&
            position.x <= node.position.x + node.size.width &&
            position.y >= node.position.y &&
            position.y <= node.position.y + node.size.height
        );
    }
}
