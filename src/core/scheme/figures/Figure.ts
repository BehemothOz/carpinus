import { type RectangleParams, Rectangle } from '../shapes';
import { Text } from './Text';

export interface SchemeShapeParams extends RectangleParams {
    title: string;
    text: string;
    primaryColor: string;
    secondaryColor: string;
}

export class SchemeShape extends Rectangle {
    headerFieldHeight: number = 20;

    header: Rectangle;

    titleText: Text;
    bodyText: Text;

    constructor(protected options: SchemeShapeParams) {
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
