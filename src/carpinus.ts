import { CarpinusScene } from './core/CarpinusScene';
import { source } from './__source';

export class Carpinus {
    constructor() {
        const sceneContainer = document.getElementById('scene') as HTMLDivElement;
        const button = document.querySelector('.button') as HTMLButtonElement;

        const scene = new CarpinusScene({
            container: sceneContainer,
            dataSource: source,
        });

        scene.initialize();

        button.addEventListener('click', () => {
            scene.toCenter();
        });
    }
}
