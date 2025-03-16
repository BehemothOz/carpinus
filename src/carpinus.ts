import { CarpinusScene } from './core/CarpinusScene';
import { source } from './__source';

// import { Downloader } from './core/downloader';

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

        // const downloader = new Downloader(scene);

        buttonCenter.addEventListener('click', () => {
            console.log('buttonCenter clicked');
        });

        buttonDownload.addEventListener('click', () => {
            console.log('buttonDownload clicked');
        });
    }
}
