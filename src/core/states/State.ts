import { EventEmitter } from '../EventEmitter';
import { Viewport, type ViewportNotifiedPayload } from './Viewport';
import { Scheme, type SchemeNotifiedPayload } from './Scheme';

export interface NotifyPayload {
    viewport: ViewportNotifiedPayload;
    scheme: SchemeNotifiedPayload;
}

interface ViewportStateEvents {
    draw: NotifyPayload;
    rebuild: void;
}

export class State extends EventEmitter<ViewportStateEvents> {
    viewport: Viewport;
    scheme: Scheme;

    constructor() {
        super();

        const viewport = new Viewport({
            notify: (viewportPayload: ViewportNotifiedPayload) => {
                this.emit('draw', {
                    viewport: viewportPayload,
                    scheme: this.scheme.getState(),
                });
            },
        });

        const scheme = new Scheme({
            notify: (schemePayload: SchemeNotifiedPayload) => {
                this.emit('draw', {
                    viewport: this.viewport.getState(),
                    scheme: schemePayload,
                });
            },
            rebuild: () => {
                this.emit('rebuild');
            },
        });

        this.viewport = viewport;
        this.scheme = scheme;
    }

    public onRebuild(cb: () => void) {
        this.on('rebuild', () => {
            cb();
        });
    }

    public onDraw(cb: (payload: NotifyPayload) => void) {
        this.on('draw', (event) => {
            cb(event.detail);
        });
    }

    /*
        TODO: this.off('scene-update', cb);
    */
}
