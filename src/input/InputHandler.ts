export class InputHandler {
    private keysPressed: Set<string>;
    private mouseDelta: { x: number, y: number };
    private pointerLocked: boolean;

    constructor (canvas: HTMLCanvasElement) {
        this.keysPressed = new Set();
        this.mouseDelta = { x: 0, y: 0 };
        this.pointerLocked = false;

        // Create listener functions that update the internal state
        const keyDownListener = (e: KeyboardEvent) => {
            this.keysPressed.add(e.code);
        };
        const keyUpListener = (e: KeyboardEvent) => {
            this.keysPressed.delete(e.code);
        };
        const mouseMoveListener = (e: MouseEvent) => {
            if (this.pointerLocked) {
                this.mouseDelta.x += e.movementX;
                this.mouseDelta.y += e.movementY;
            }
        };
        const mouseDownListener = (e: MouseEvent) => {
            if (!this.pointerLocked) {
                canvas.requestPointerLock();
            }
        };
        const pointerLockChangeListener = () => {
            this.pointerLocked = document.pointerLockElement === canvas;
        };

        // Attach listeners
        window.addEventListener('keydown', keyDownListener);
        window.addEventListener('keyup', keyUpListener);
        window.addEventListener('mousemove', mouseMoveListener);
        canvas.addEventListener('mousedown', mouseDownListener);
        document.addEventListener('pointerlockchange', pointerLockChangeListener);

        // Clean up function to remove listeners when no longer needed
        const cleanup = () => {
            window.removeEventListener('keydown', keyDownListener);
            window.removeEventListener('keyup', keyUpListener);
            window.removeEventListener('mousemove', mouseMoveListener);
            canvas.removeEventListener('mousedown', mouseDownListener);
            document.removeEventListener('pointerlockchange', pointerLockChangeListener);
        };
    }

    isKeyPressed(keyCode: string): boolean {
        return this.keysPressed.has(keyCode);
    }

    getMouseDelta(): { x: number, y: number } {
        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    isPointerLocked(): boolean {
        return this.pointerLocked;
    }
}