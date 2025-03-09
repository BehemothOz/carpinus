import { SourceTree, type SourceTreeNode } from './scheme';
import { Scene } from './scene';
import { State } from './states';

import { type SourceItem } from '../__source';

import { Rectangle } from './scheme/shapes/Rectangle';
import { Line } from './scheme/shapes/Line';

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
                return state.scheme.find(mouseX, mouseY);
            },
        });

        this.sourceTree = sourceTree;
    }

    public initialize() {
        this.sourceTree.create();
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
        const { position, size, children } = node;
        console.log('drawScene');
        const rectangle = new Rectangle({
            ctx: this.ctx,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
        });

        if (children.length > 0) {
            const lastChildNode = children.at(-1) as SourceTreeNode;

            const startX = position.x + size.width / 2;
            const startY = position.y + size.height;

            const line = new Line({
                ctx: this.ctx,
                x: startX,
                y: startY,
            });

            children.forEach((child) => {
                this.drawScene(child);
            });

            line.lineTo(lastChildNode.position.x, lastChildNode.position.y);
            line.draw();
        }

        rectangle.draw();
    }
}
