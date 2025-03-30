import { Figure, type BaseFigureParams } from './Figure';

/**
 * A specialized Figure component representing the root node in a hierarchical diagram.
 * @extends Figure
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
