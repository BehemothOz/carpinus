import { Offset, Gap, Size, SchemeMeasure, Position } from '../scheme/Dimensions';
import { EventEmitter } from '../EventEmitter';

import { SourceTreeNode } from '../scheme/SourceTreeNode';

import { Viewport, type ViewportNotifiedPayload } from './Viewport';
import { Scheme } from './Scheme';

interface ViewportStateEvents {
    'viewport-transform': ViewportNotifiedPayload;
    'scheme-update': SourceTreeNode;
    'scheme-ready-drawing': SourceTreeNode;
}

export class State extends EventEmitter<ViewportStateEvents> {
    viewport: Viewport;
    scheme: Scheme;

    constructor() {
        super();

        this.viewport = new Viewport({
            notify: (payload) => {
                this.emit('viewport-transform', payload);
            },
        });

        this.scheme = new Scheme({
            notify: (scheme: SourceTreeNode) => {
                this.emit('scheme-ready-drawing', scheme);
            },
        });
    }

    /**
     * Registers a callback to be executed when the scene is updated.
     * @param {(payload: ViewportNotifiedPayload) => void} cb - The callback function.
     */
    public onViewportTransform(cb: (payload: ViewportNotifiedPayload) => void) {
        this.on('viewport-transform', (event) => {
            cb(event.detail);
        });
    }

    /*
        ! FIX type
    */
    // public onSchemeReadyDrawing(cb: (payload: any) => void) {
    //     this.on('scheme-ready-for-drawing', (event) => {
    //         cb(event.detail);
    //     });
    // }

    // schemeState.on('viewport-update', (payload) => {
    //     schemeState.viewport.handleViewportUpdate(payload);
    // });
    /*
        TODO: this.off('scene-update', cb);
    */
}
