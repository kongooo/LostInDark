declare class EventBus {
    private static events;
    static addEventListener: (eventName: string, callback: Function) => void;
    static removeEventListener: (eventName: string) => void;
    static dispatch: (eventName: string, ...args: any[]) => void;
}
export default EventBus;
