import { Carpinus } from './carpinus';

document.addEventListener('DOMContentLoaded', () => {
    new Carpinus();
});

document.fonts.ready.then(() => {
    console.log('All fonts are loaded');
});
