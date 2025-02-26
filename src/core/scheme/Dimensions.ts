abstract class Dimensions {
    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Position extends Dimensions {}
export class Offset extends Dimensions {}
export class Gap extends Dimensions {}

export class Size {
    constructor(public width: number, public height: number) {
        this.width = width;
        this.height = height;
    }
}
