import { Figure, type BaseFigureParams } from './Figure';

/*
    primary: #0c917c
    secondary: #086658
*/
export class RootFigure extends Figure {
    constructor(options: BaseFigureParams) {
        super({
            ...options,
            title: 'R O O T',
            primaryColor: '#0c917c',
            secondaryColor: '#086658',
        });
    }
}
