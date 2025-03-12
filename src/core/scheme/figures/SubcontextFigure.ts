import { Figure, type FigureParams } from './Figure';

/*
    primary: #fdb018
    secondary: #b17b12
*/
export class SubcontextFigure extends Figure {
    constructor(options: FigureParams) {
        super({
            ...options,
            title: 'S U B - C O N T E X T',
            primaryColor: '#fdb018',
            secondaryColor: '#b17b12',
        });
    }
}
