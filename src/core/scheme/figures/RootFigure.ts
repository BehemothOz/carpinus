import { Figure, type BaseFigureParams } from './Figure';

/*
    primary: #4c78f6
    secondary: #3752a7
*/
export class RootFigure extends Figure {
    constructor(options: BaseFigureParams) {
        super({
            ...options,
            title: 'R O O T',
            
            primaryColor: '#4c78f6',
            secondaryColor: '#3752a7',
        });
    }
}
