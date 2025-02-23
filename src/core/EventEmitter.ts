export class EventEmitter {
    private target: EventTarget;

    constructor() {
        this.target = new EventTarget();
    }

    public on<T>(event: string, listener: (event: CustomEvent<T>) => void): void {
        this.target.addEventListener(event, listener as EventListener);
    }

    public off<T>(event: string, listener: (event: CustomEvent<T>) => void): void {
        this.target.removeEventListener(event, listener as EventListener);
    }

    public emit<T>(event: string, detail?: T): void {
        const customEvent = new CustomEvent(event, { detail });
        this.target.dispatchEvent(customEvent);
    }
}
