import { CarpinusScene } from './core/CarpinusScene';
import { source } from './__source';

import { Downloader } from './core/downloader';

export class Carpinus {
    constructor() {
        const sceneContainer = document.getElementById('scene') as HTMLDivElement;
        const button = document.querySelector('.button') as HTMLButtonElement;

        const scene = new CarpinusScene({
            container: sceneContainer,
            dataSource: source,
        });

        scene.initialize();

        // const downloader = new Downloader(scene);

        button.addEventListener('click', () => {
            // scene.toCenter();
            // downloader.download();
        });
    }
}
