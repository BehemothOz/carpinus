import { SourceTree, type SourceTreeNode } from './scheme';
import { Scene } from './scene';
import { State } from './states';

import { type SourceItem } from '../__source';

import { FigureFactory } from './scheme/Factory';

interface CarpinusSceneOptions {
    container: HTMLElement;
    dataSource: SourceItem;
}

// TreeVisualizer

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

        this.sourceTree = sourceTree;
    }

    getState() {
        return this.state;
    }

    public initialize() {
        console.log('CarpinusScene initialize called');
        this.sourceTree.create();
        // this.toCenter();
    }

    public toCenter() {
        const { viewport } = this.state;

        const sceneSize = this.getSceneSize();
        const schemeSize = this.getSchemeSize();

        const scaleX = sceneSize.width / schemeSize.width;
        const scaleY = sceneSize.height / schemeSize.height;

        const newScale = Math.min(scaleX, scaleY);

        const offsetX = (sceneSize.width - schemeSize.width * newScale) / 2;
        const offsetY = (sceneSize.height - schemeSize.height * newScale) / 2;

        const worldOffsetX = offsetX / newScale;
        const worldOffsetY = offsetY / newScale;

        viewport.changeScale(newScale);
        viewport.changeOffset({ x: worldOffsetX, y: worldOffsetY });
    }

    protected drawScene(node: SourceTreeNode) {
        const view = node.isChildrenCollapsed && !node.isLast ? 'collapsed' : 'usual';

        if (node.isCollapsed) {
            return;
        }

        const figure = FigureFactory.create({ ctx: this.ctx, node });

        if (node.children.length > 0) {
            node.children.forEach((child) => {
                this.drawScene(child);
            });
        }

        figure.draw(view);

        if (!node.isChildrenCollapsed) {
            figure.drawEdges();
        }
    }
}
