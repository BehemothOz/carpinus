import { Carpinus } from './carpinus';

class App {
    constructor() {
        new Carpinus();
    }
}

new App();
document.fonts.ready.then((r) => {
    console.log('Все шрифты загружены');
    console.log(r);

    document.fonts.forEach((fontFace) => {
        console.log('Загружен шрифт:', fontFace.family, fontFace.weight, fontFace.style);
    });
    // Ваш код, который должен выполниться после загрузки шрифтов
});
