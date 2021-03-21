
class KeyPress {
    private static keycode: Map<string, boolean> = new Map();
    private static inited = false;

    private static init() {
        window.onkeydown = (event: KeyboardEvent) => {
            this.keycode.set(event.key, true);
        }
        window.onkeyup = (event: KeyboardEvent) => {
            this.keycode.set(event.key, false);
        }
        this.inited = true;
    }
    static get(code: string) {
        if (!this.inited) this.init();
        return this.keycode.has(code) && this.keycode.get(code);
    }
}

export default KeyPress;