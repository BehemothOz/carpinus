import { Figure, type FigureParams } from './Figure';

/*
    primary: #343434
    secondary: #252525
*/
export class FeatureFigure extends Figure {
    constructor(options: FigureParams) {
        super({
            ...options,
            title: 'F E A T U R E',
            primaryColor: '#343434',
            secondaryColor: '#252525',
        });
    }
}
