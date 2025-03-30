import { SourceTree, type SourceTreeNode } from './scheme';
import { Scene } from './scene';
import { State } from './states';
import { FigureFactory } from './scheme/Factory';

import { type SourceItem } from '../__source';

/**
 * Configuration options for CarpinusScene initialization.
 * @property {HTMLElement} container - DOM element to host the canvas
 * @property {SourceItem} dataSource - Hierarchical data structure to visualize
 */
interface CarpinusSceneOptions {
    container: HTMLElement;
    dataSource: SourceItem;
}

/**
 * The main scene class that orchestrates the visualization of hierarchical data.
 * Manages the complete rendering pipeline from data to visual representation.
 * @extends Scene
 */
export class CarpinusScene extends Scene {
    /**
     * The source tree manager that handles data-to-node conversion.
     * @type {SourceTree}
     */
    sourceTree: SourceTree;

    /**
     * Creates a new CarpinusScene instance.
     */
    constructor(options: CarpinusSceneOptions) {
        const { container, dataSource } = options;

        const state = new State();
        const sourceTree = new SourceTree({
            state,
            sourceData: dataSource,
        });

        super({
            container,
            state,
            onSearchClick: (mouseX, mouseY) => {
                return state.scheme.findNodeByMouseCoordinates(mouseX, mouseY);
            },
        });

        state.onRebuild(() => {
            this.sourceTree.rebuild();
        });

        this.sourceTree = sourceTree;
    }

    /**
     * Gets the current state manager instance.
     * @returns {State} The current state manager
     */
    public getState(): State {
        return this.state;
    }

    /**
     * Initializes the scene by creating the initial tree structure.
     * @returns {void}
     */
    public initialize(): void {
        this.sourceTree.create();
    }

    /**
     * Recursively draws the scene starting from a given node.
     * @protected
     * @param {SourceTreeNode} node - The root node to start drawing from
     * @returns {void}
     */
    protected drawScene(node: SourceTreeNode): void {
        if (node.isCollapsed) {
            return;
        }

        const figure = FigureFactory.create({ ctx: this.ctx, node });

        if (node.children.length > 0) {
            node.children.forEach((child) => {
                this.drawScene(child);
            });
        }

        figure.draw();

        if (!node.isChildrenCollapsed) {
            figure.drawEdges();
        }
    }
}
