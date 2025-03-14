import { Figure, type BaseFigureParams } from './Figure';

/*
    primary: #fdb018
    secondary: #b17b12
*/
export class SubcontextFigure extends Figure {
    constructor(options: BaseFigureParams) {
        super({
            ...options,
            title: 'S U B - C O N T E X T',
            primaryColor: '#fdb018',
            secondaryColor: '#b17b12',
        });
    }
}
