export class EventEmitter<T extends object> {
    private target: EventTarget;

    constructor() {
        this.target = new EventTarget();
    }

    protected on<K extends keyof T>(event: K, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.addEventListener(event.toString(), listener as EventListener);
    }

    protected off<K extends keyof T>(event: K, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.removeEventListener(event.toString(), listener as EventListener);
    }

    protected emit<K extends keyof T>(event: K, detail?: T[K]): void {
        const customEvent = new CustomEvent(event.toString(), { detail });
        this.target.dispatchEvent(customEvent);
    }
}
