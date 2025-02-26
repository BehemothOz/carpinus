import { type State as SceneState } from './State';
import { Formulas } from '../Formulas';

interface CanvasEventsOptions {
    canvas: HTMLCanvasElement;
    state: SceneState;
}

export class CanvasEvents extends Formulas {
    private canvas: HTMLCanvasElement;
    private state: SceneState;

    private isDragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;

    private elements = [
        {
            x: 50,
            y: 50,
            width: 200,
            height: 100,
        },
    ];

    constructor(options: CanvasEventsOptions) {
        const { canvas, state } = options;

        super(state);

        this.canvas = canvas;
        this.state = state;

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));

        this.canvas.addEventListener('click', this.onClick.bind(this));
    }

    private onClick(event: MouseEvent) {
        console.log('onClick');
    }

    private onMouseDown(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Координата X относительно холста
        const mouseY = event.clientY - rect.top; // Координата Y относительно холста

        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        // // Проверяем, находится ли курсор над элементом
        // const element = this.elements.find((el) => this.isMouseOverElement(mouseX, mouseY, el));

        // if (element) {
        //     // Если курсор над элементом, обрабатываем как клик
        //     // this.onClickElement(element);
        //     console.log('CLICK ELEMENT');
        // } else {
        //     console.log('CLICK FOR DRAG');
        //     // Если курсор над пустой областью, начинаем перетаскивание
        //     this.isDragging = true;
        //     this.lastMouseX = event.clientX;
        //     this.lastMouseY = event.clientY;
        // }
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        this.state.changeOffset({
            x: this.state.offset.x + deltaX,
            y: this.state.offset.y + deltaY,
        });
    }

    private onMouseUp() {
        this.isDragging = false;
    }

    private onWheel(event: WheelEvent) {
        event.preventDefault();
        const { scale, zoomFactor } = this.state;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // const worldX = (mouseX - this.offsetX) / this.scale;
        // const worldY = (mouseY - this.offsetY) / this.scale;
        const { sceneX, sceneY } = this.screenToScene(mouseX, mouseY);

        let changedScale = scale;

        if (event.deltaY < 0) {
            changedScale *= 1 + zoomFactor;
        } else {
            changedScale *= 1 - zoomFactor;
        }

        this.state.changeScale(changedScale);
        this.state.changeOffset({
            x: mouseX - sceneX * changedScale,
            y: mouseY - sceneY * changedScale
        });
    }

    // private isMouseOverElement(mouseX: number, mouseY: number, element: CanvasElement): boolean {
    //     return (
    //         mouseX >= element.x &&
    //         mouseX <= element.x + element.width &&
    //         mouseY >= element.y &&
    //         mouseY <= element.y + element.height
    //     );
    // }

    // private screenToWorld(x: number, y: number): { worldX: number; worldY: number } {
    //     return {
    //         worldX: (x - this.offsetX) / this.scale,
    //         worldY: (y - this.offsetY) / this.scale,
    //     };
    // }
}

// Функция для получения узла по позиции клика
function getNodeAtPosition(x: number, y: number) {
    const node = {
        x: 50,
        y: 50,
        width: 200,
        height: 100,
    };

    if (x >= node.x && x <= node.x + node.width && y >= node.y && y <= node.y + node.height) {
        return node; // Возврат узла, если клик попадает в его область
    }

    return null; // Если ничего не найдено
}
