import { Figure, type BaseFigureParams } from './Figure';

/**
 * A specialized Figure component representing a feature node in the diagram.
 * @extends Figure
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
