import { type RectangleParams, Rectangle } from '../shapes';
import { Text } from '../shapes/Text';

export interface FigureParams extends RectangleParams {
    title: string;
    text: string;
    primaryColor: string;
    secondaryColor: string;
}

// export function getColorByType(type: SourceItem['type']) {
//     if (type === 'root') {
//         return '#0c917c';
//     }

//     if (type === 'context') {
//         return '#f6584c';
//     }

//     if (type === 'subcontext') {
//         return '#fdb018';
//     }

//     if (type === 'feature') {
//         return '#343434';
//     }
// }


export class Figure extends Rectangle {
    headerFieldHeight: number = 20;

    header: Rectangle;

    titleText: Text;
    bodyText: Text;

    constructor(protected options: FigureParams) {
        super({
            ...options,
            fillColor: options.primaryColor,
        });

        this.header = this.createHeaderField();
        this.titleText = this.createHeaderText();
        this.bodyText = this.createBodyText();
    }

    createHeaderField() {
        return new Rectangle({
            ctx: this.options.ctx,
            x: this.options.x,
            y: this.options.y,
            width: this.options.width,
            height: this.headerFieldHeight,
            fillColor: this.options.secondaryColor,
        });
    }

    createHeaderText(): Text {
        const paddingLeft = 4;

        const x = this.options.x + paddingLeft;
        const y = this.options.y + this.headerFieldHeight / 2;

        return new Text({
            ctx: this.options.ctx,
            x,
            y,
            text: this.options.title,
            fontSize: 8,
            textAlign: 'left',
            textBaseline: 'middle',
        });
    }

    createBodyText(): Text {
        const x = this.options.x + this.options.width / 2;
        const y = this.options.y + this.options.height / 2 + this.headerFieldHeight / 2;

        return new Text({
            ctx: this.options.ctx,
            x,
            y,
            text: this.options.text,
            fontSize: 14,
            textAlign: 'center',
            textBaseline: 'middle',
        });
    }

    draw(): void {
        super.draw();
        this.header.draw();

        this.titleText.draw();
        this.bodyText.draw();
    }
}
