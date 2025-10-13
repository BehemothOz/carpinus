import { Figure, type BaseFigureParams } from './Figure';

/**
 * A specialized Figure with predefined styling for context nodes.
 * @extends Figure
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
