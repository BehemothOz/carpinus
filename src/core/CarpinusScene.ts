import { SourceTree, type SourceTreeNode } from './scheme';
import { Scene } from './scene';
import { State } from './states';

import { type SourceItem } from '../__source';

import { Rectangle } from './scheme/shapes/Rectangle';
import { Line } from './scheme/shapes/Line';
import { Point, Position, Size } from './scheme/Dimensions';
import { Figure, RootFigure } from './scheme/figures';
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
        const { position, size, children, text, type } = node;
        console.log('drawScene');

        if (node.isCollapsed) {
            return;
        }

        // Создаем фигуру каждый раз с текущим контекстом
        const figure = FigureFactory.create(type, {
            ctx: this.ctx,
            text,
            position,
            size,
        });

        figure.draw();

        if (children.length > 0) {
            const lastChildNode = children.at(-1) as SourceTreeNode;

            const startX = position.x + size.width / 2;
            const startY = position.y + size.height;

            const startPosition = new Position(startX, startY);

            const line = new Line({
                ctx: this.ctx,
                position: startPosition,
            });

            children.forEach((child) => {
                this.drawScene(child);
            });

            line.lineTo(lastChildNode.position.x, lastChildNode.position.y);
            line.draw();
        }
    }
}
