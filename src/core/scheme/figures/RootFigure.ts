import { Figure, type FigureParams } from './Figure';

/*
    primary: #0c917c
    secondary: #086658
*/
export class RootFigure extends Figure {
    constructor(options: FigureParams) {
        super({
            ...options,
            title: 'R O O T',
            primaryColor: '#0c917c',
            secondaryColor: '#086658',
        });
    }
}
