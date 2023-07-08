import { BasedObject } from "../BasedObject";
import { drawText } from "../libs/drawHelpers";

export default class Toasts extends BasedObject {

    toastMessages: { text: string, duration: number, yOffset: number, xOffset: number }[] = []

    async preload() { }
    initialize() {
        this.toastMessages = []
    }

    addToast(text: string, options: any = {}) {
        const {
            duration,
            yOffset,
            xOffset,
        } = options
        this.toastMessages.push({
            text: text,
            duration: duration ? duration : 1000,
            yOffset: yOffset ? yOffset : 0,
            xOffset: xOffset ? xOffset : 0,
        })
    }

    update() {
        if (this.toastMessages.length > 0) {
            this.toastMessages = this.toastMessages.map(x => {
                return {
                    ...x,
                    duration: x.duration - this.gameRef.updateDiff
                }
            }).filter(x => {
                return x.duration > 0
            })
        }
    }

    draw() {
        if (this.toastMessages.length) {
            this.toastMessages.forEach((toast, idx) => {
                const toastOpacity = toast.duration > 500 ? 1 : toast.duration / 500
                const toastOffset = toast.duration > 500 ? 0 : ((500 - toast.duration) / 500) * 60
                drawText({
                    c: this.gameRef.ctx,
                    x: this.gameRef.gameWidth / 2 + toast.xOffset + 2,
                    y: this.gameRef.gameHeight / 2 + toast.yOffset + 2 - toastOffset,
                    // y: this.gameRef.gameHeight/2 + (idx * 40) + 1 - toastOffset,
                    align: 'center',
                    fontSize: 28,
                    fontFamily: 'sans-serif',
                    weight: 'bold',
                    fillColor: `rgba(0,0,0,${toastOpacity})`,
                    text: toast.text
                })
                drawText({
                    c: this.gameRef.ctx,
                    x: this.gameRef.gameWidth / 2 + toast.xOffset,
                    y: this.gameRef.gameHeight / 2 + toast.yOffset - toastOffset,
                    // y: this.gameRef.gameHeight/2 + (idx * 40) - toastOffset,
                    align: 'center',
                    fontSize: 28,
                    fontFamily: 'sans-serif',
                    weight: 'bold',
                    fillColor: `rgba(255,255,255,${toastOpacity})`,
                    text: toast.text
                })
            })
        }
    }
    
    tearDown() { }
}