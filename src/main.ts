import { Carpinus } from './carpinus';

new Carpinus();

document.fonts.ready.then((r) => {
    console.log('All fonts are loaded');

    document.fonts.forEach((fontFace) => {
        console.log('Font loaded:', fontFace.family, fontFace.weight, fontFace.style);
    });
});
