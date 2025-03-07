import { Gap, Position, SchemeMeasure } from '../scheme/Dimensions';
import { SourceTreeNode } from '../scheme/SourceTreeNode';

interface SchemeParams {
    notify: (scheme: SourceTreeNode) => void;
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

    setSourceTree(tree: SourceTreeNode, measure: SchemeMeasure) {
        this.tree = tree;
        this.measure = measure;

        this.params.notify(this.tree);
    }

    collapseNodeChildren(mouseX: number, mouseY: number): boolean {
        const foundNode = this.findNodeByPosition(new Position(mouseX, mouseY));

        if (foundNode == null) {
            return false;
        }

        if (foundNode && foundNode.hasChildren) {
            for (const child of foundNode.children) {
                child.collapse();
            }
        }

        return true;
    }

    find(mouseX: number, mouseY: number) {
        const n = this.findNodeByPosition(new Position(mouseX, mouseY));
        console.log(n);
        return Boolean(n);
    }

    findNodeByPosition(targetPosition: Position) {
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
