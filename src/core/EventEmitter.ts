export class EventEmitter<T extends object> {
    private target: EventTarget;

    constructor() {
        this.target = new EventTarget();
    }

    public on<K extends keyof T>(event: K, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.addEventListener(event.toString(), listener as EventListener);
    }

    public off<K extends keyof T>(event: string, listener: (event: CustomEvent<T[K]>) => void): void {
        this.target.removeEventListener(event.toString(), listener as EventListener);
    }

    public emit<K extends keyof T>(event: string, detail?: T[K]): void {
        const customEvent = new CustomEvent(event, { detail });
        this.target.dispatchEvent(customEvent);
    }
}
