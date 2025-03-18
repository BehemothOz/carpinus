import { Figure, type BaseFigureParams } from './Figure';

/*
    primary: #0c917c
    secondary: #086658
*/
export class FeatureFigure extends Figure {
    constructor(options: BaseFigureParams) {
        super({
            ...options,
            title: 'F E A T U R E',
            primaryColor: '#0c917c',
            secondaryColor: '#086658',
        });
    }
}
