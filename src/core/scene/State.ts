import { Offset, Gap, Size } from '../scheme/Dimensions';
import { EventEmitter } from '../EventEmitter';

const initialState = {
    /**
     * ...
     */
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    horizontal: 40,
    verticalGap: 60,
};

interface StateEvents {
    'scene-update': TransformPayload;
}

interface TransformPayload {
    offset: Offset;
    scale: number;
    canvasSize: Size;
}

export class State extends EventEmitter {
    public scale = 1;

    public offset: Offset = new Offset(initialState.offsetX, initialState.offsetY);
    public gap: Gap = new Gap(initialState.horizontal, initialState.verticalGap);

    public canvasSize: Size = new Size(0, 0);

    public zoomFactor: number = 0.1;

    private isUpdatePending: boolean = false;

    constructor(initialState: typeof initialState = initialState) {
        super();

        this.scale = initialState.scale;
    }

    public changeScale(scale: number) {
        this.scale = scale;
        this.scheduleTransformUpdate();
    }

    public changeOffset({ x, y }: Offset) {
        if (this.offset.x === x && this.offset.y === y) return;

        this.offset.x = x;
        this.offset.y = y;
        this.scheduleTransformUpdate();
    }

    public changeCanvasSize(width: number, height: number) {
        this.canvasSize = new Size(width, height);
        this.scheduleTransformUpdate();
    }

    private scheduleTransformUpdate() {
        if (this.isUpdatePending) return; // Если обновление уже запланировано, ничего не делаем
        this.isUpdatePending = true; // Устанавливаем флаг
        requestAnimationFrame(() => {
            this.emitTransformUpdate(); // Вызываем обновление
        });
    }

    private emitTransformUpdate() {
        // Сбрасываем флаг
        this.isUpdatePending = false;

        // Генерируем событие с актуальными данными
        this.updateTransform();
    }

    public onSceneUpdate(cb: (payload: TransformPayload) => void) {
        this.on<TransformPayload>('scene-update', (event) => {
            cb(event.detail);
        });
    }

    private updateTransform() {
        this.emit<TransformPayload>('scene-update', {
            offset: this.offset,
            scale: this.scale,
            canvasSize: this.canvasSize,
        });
    }

    public offSceneUpdate(cb: (payload: TransformPayload) => void) {
        if (!this.hasListener('scene-update', cb)) {
            console.warn('Attempted to remove a non-existent listener');
            return;
        }
        this.off('scene-update', cb);
    }
}
