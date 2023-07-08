import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle, drawText } from "../../../engine/libs/drawHelpers";

export class CasinoPlayer extends BasedObject {
    x: number = 0
    y: number = 0
    name: string = 'Casino  Player'
    color: string = 'white'

    headSize: number = 40
    width: number = 100
    height: number = 150

    async preload() {}
    initialize() {}
    update() {}
    draw() {

        // draw body
        drawBox({
            c: this.gameRef.ctx,
            x: (this.x - this.width/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y - this.height/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            width: this.width * this.gameRef.cameraZoom,
            height: this.height * this.gameRef.cameraZoom,
            fillColor: this.color,
            borderRadius: [30 * this.gameRef.cameraZoom, 30 * this.gameRef.cameraZoom, 0, 0]
        }) 

        // draw head
        drawCircle({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y - this.height/2 - this.headSize/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.headSize * this.gameRef.cameraZoom,
            fillColor: '#ce192b'
        })

        // draw name
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            text: this.name,
            fontSize: 20 * this.gameRef.cameraZoom,
            fillColor: 'white',
            align: 'center',
            fontFamily: 'sans-serif'
        })
    }
    tearDown() {}
}