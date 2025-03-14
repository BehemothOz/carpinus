import { Figure, type BaseFigureParams } from './Figure';

/*
    primary: #f6584c
    secondary: #a74037
*/
export class ContextFigure extends Figure {
    constructor(options: BaseFigureParams) {
        super({
            ...options,
            title: 'C O N T E X T',
            primaryColor: '#f6584c',
            secondaryColor: '#a74037',
        });
    }
}
