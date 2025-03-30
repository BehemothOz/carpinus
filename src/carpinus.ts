import { CarpinusScene } from './core/CarpinusScene';
import { Downloader } from './core/downloader';

import { source } from './__source';

/**
 * The main application class that orchestrates the Carpinus visualization system.
 * Handles scene initialization, UI interactions, and core functionality.
 */
export class Carpinus {
    /**
     * Creates a new Carpinus application instance.
     * @constructor
     * @description
     * Initializes the visualization scene, sets up UI event handlers, and prepares
     * utility services like the download functionality.
     *
     * Expected HTML Structure:
     * - A container div with id="scene" to host the visualization canvas
     * - A button with class="button-center" for centering the view
     * - A button with class="button-download" for exporting the visualization
     */
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
