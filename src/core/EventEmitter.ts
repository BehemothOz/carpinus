/**
 * A generic typed event emitter built on the native EventTarget API.
 * Provides type-safe event listening and emitting capabilities.
 * @template T - An object type mapping event names to their payload types
 */
export class EventEmitter<T extends object> {
    /**
     * Internal EventTarget instance for handling events.
     * @private
     * @type {EventTarget}
     */
    private target: EventTarget;

    constructor() {
        this.target = new EventTarget();
    }

    /**
     * Registers an event listener for a specific event type.
     * @protected
     * @template K - The event name (keyof T)
     * @param {K} event - The event name to listen for
     * @param {(event: CustomEvent<T[K]>) => void} listener - Callback function
     * @returns {void}
     * @example
     * emitter.on('message', (event) => {
     *   console.log(event.detail); // Type-safe access to payload
     * });
     */
    protected on<K extends keyof T>(event: K, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.addEventListener(event.toString(), listener as EventListener);
    }

    /**
     * Removes an event listener for a specific event type.
     * @protected
     * @template K - The event name (keyof T)
     * @param {K} event - The event name to remove listener from
     * @param {(event: CustomEvent<T[K]>) => void} listener - Callback function to remove
     * @returns {void}
     * @example
     * const handler = (event) => console.log(event.detail);
     * emitter.on('message', handler);
     * emitter.off('message', handler);
     */
    protected off<K extends keyof T>(event: K, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.removeEventListener(event.toString(), listener as EventListener);
    }

    /**
     * Dispatches an event with optional payload data.
     * @protected
     * @template K - The event name (keyof T)
     * @param {K} event - The event name to emit
     * @param {T[K]} [detail] - Optional payload data
     * @returns {void}
     * @example
     * emitter.emit('message', { text: 'Hello' }); // Type-checked payload
     */
    protected emit<K extends keyof T>(event: K, detail?: T[K]): void {
        const customEvent = new CustomEvent(event.toString(), { detail });
        this.target.dispatchEvent(customEvent);
    }
}
