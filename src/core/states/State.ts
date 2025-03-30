import { EventEmitter } from '../EventEmitter';
import { Viewport, type ViewportNotifiedPayload } from './Viewport';
import { Scheme, type SchemeNotifiedPayload } from './Scheme';

/**
 * Combined state payload for draw events.
 * @property {ViewportNotifiedPayload} viewport - Current viewport state
 * @property {SchemeNotifiedPayload} scheme - Current scheme state
 */
export interface NotifyPayload {
    viewport: ViewportNotifiedPayload;
    scheme: SchemeNotifiedPayload;
}

/**
 * Event type definitions for State class.
 * @property {CustomEvent<NotifyPayload>} draw - Emitted when rendering update is needed
 * @property {void} rebuild - Emitted when scheme requires reconstruction
 */
interface ViewportStateEvents {
    draw: NotifyPayload;
    rebuild: void;
}

/**
 * Central state management class that coordinates between Viewport and Scheme components.
 * Acts as an event hub for state changes and rendering updates.
 * @extends EventEmitter<ViewportStateEvents>
 */
export class State extends EventEmitter<ViewportStateEvents> {
    /**
     * Viewport instance managing canvas view state.
     * @type {Viewport}
     */
    viewport: Viewport;
    /**
     * Scheme instance managing the node hierarchy and layout.
     * @type {Scheme}
     */
    scheme: Scheme;

    /**
     * Creates a new State instance.
     * @description
     * Initializes Viewport and Scheme instances with notification callbacks
     * that emit unified state events.
     */
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

    /**
     * Registers a callback for rebuild events.
     * @param {Function} cb - Callback to execute on rebuild
     * @returns {void}
     * @example
     * state.onRebuild(() => {
     *   console.log('Scheme structure rebuild');
     * });
     */
    public onRebuild(cb: () => void): void {
        this.on('rebuild', () => {
            cb();
        });
    }

    /**
     * Registers a callback for draw events.
     * @param {Function} cb - Callback receiving the combined state payload
     * @returns {void}
     * @example
     * state.onDraw(({ viewport, scheme }) => {
     *   renderScene(viewport, scheme);
     * });
     */
    public onDraw(cb: (payload: NotifyPayload) => void): void {
        this.on('draw', (event) => {
            cb(event.detail);
        });
    }

    /*
        TODO: this.off('scene-update', cb);
    */
}
