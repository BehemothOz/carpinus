import { Figure, type BaseFigureParams } from './Figure';

/**
 * A specialized Figure component representing a subcontext node in hierarchical diagrams.
 * @extends Figure
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
