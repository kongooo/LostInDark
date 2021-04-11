
class KeyPress {
    private static keycode: Map<string, boolean> = new Map();
    private static inited = false;

    private static init() {
        window.onkeydown = (event: KeyboardEvent) => {
            this.keycode.set(event.code, true);
        }
        window.onkeyup = (event: KeyboardEvent) => {
            this.keycode.set(event.code, false);
        }
        this.inited = true;
    }
    static get(code: string) {
        if (!this.inited) this.init();
        const keyCode = 'Key' + code;
        return this.keycode.has(keyCode) && this.keycode.get(keyCode);
    }
}

export default KeyPress;