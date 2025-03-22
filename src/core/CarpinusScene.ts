import { SourceTree, type SourceTreeNode } from './scheme';
import { Scene } from './scene';
import { State } from './states';

import { type SourceItem } from '../__source';

import { FigureFactory } from './scheme/Factory';

interface CarpinusSceneOptions {
    container: HTMLElement;
    dataSource: SourceItem;
}

export class CarpinusScene extends Scene {
    sourceTree: SourceTree;

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

    getState() {
        return this.state;
    }

    public initialize() {
        this.sourceTree.create();
    }

    protected drawScene(node: SourceTreeNode) {
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
