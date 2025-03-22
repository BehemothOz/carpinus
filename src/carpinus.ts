import { CarpinusScene } from './core/CarpinusScene';
import { source } from './__source';

import { Downloader } from './core/downloader';

export class Carpinus {
    constructor() {
        const sceneContainer = document.getElementById('scene') as HTMLDivElement;

        const buttonCenter = document.querySelector('.button-center') as HTMLButtonElement;
        const buttonDownload = document.querySelector('.button-download') as HTMLButtonElement;

        const scene = new CarpinusScene({
            container: sceneContainer,
            dataSource: source,
        });

        scene.initialize();

        const downloader = new Downloader();

        buttonCenter.addEventListener('click', () => {
            scene.toCenter();
        });

        buttonDownload.addEventListener('click', () => {
            downloader.download(scene);
        });
    }
}
