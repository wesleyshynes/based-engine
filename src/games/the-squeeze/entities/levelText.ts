import { drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { BasedObject } from "../../../engine/BasedObject";

export interface LevelTextConfig {
    x: number
    y: number
    text: string
    fontSize: number
    color: string
    angle: number
    fontFamily?: string
    fontWeight?: string
}

export class LevelText extends BasedObject {
    x: number = 0
    y: number = 0
    text: string = 'Text'
    fontSize: number = 24
    color: string = '#ffffff'
    angle: number = 0  // degrees
    fontFamily: string = 'sans-serif'
    fontWeight: string = '700'

    initialize() {
        // No physics body needed for text - it's purely visual
    }

    update() {
        // Text is static, no updates needed
    }

    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: this.angle
        }, () => {
            drawText({
                c: this.gameRef.ctx,
                x: 0,
                // y: this.fontSize * 0.35,  // Adjust for vertical centering
                y: 0,
                align: 'center',
                fillColor: this.color,
                style: '',
                weight: this.fontWeight,
                fontFamily: this.fontFamily,
                fontSize: this.fontSize * this.gameRef.cameraZoom,
                text: this.text
            })
        })
    }

    tearDown() {
        // Nothing to clean up
    }
}
