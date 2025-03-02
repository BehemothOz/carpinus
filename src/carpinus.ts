import { Scene } from './core/scene/Scene';
import { SourceTree } from './core/scheme';

import { State } from './core/scene/State';

import { CarpinusScene } from './core/CarpinusScene';

import { source } from './__source';

interface CarpinusSceneOptions {
    container: HTMLElement;
}

// class Panel {}

export class Carpinus {
    constructor() {
        const sceneContainer = document.getElementById('scene') as HTMLDivElement;

        const state = new State();

        const sourceTree = new SourceTree(state);

        const data = sourceTree.create(source);
        const array = sourceTree.toArray(data);

        new CarpinusScene({
            container: sceneContainer,
            state,
            dataScheme: array,
        });

        console.log(data);
        console.log(array);
    }
}
