class EventBus {
    private static events: Map<string, Function> = new Map();

    static addEventListener = (eventName: string, callback: Function) => {
        if (!EventBus.events.has(eventName)) {
            EventBus.events.set(eventName, callback)
        }
    }

    static removeEventListener = (eventName: string) => {
        if (EventBus.events.has(eventName)) {
            EventBus.events.delete(eventName);
        }
    }

    static dispatch = (eventName: string, ...args: any[]) => {
        if (EventBus.events.has(eventName)) {
            const callback = EventBus.events.get(eventName);
            callback(...args);
        }
    }
}

export default EventBus;