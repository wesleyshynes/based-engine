import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawText } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class NetmoPlayer extends BasedObject {
    x: number = 0
    y: number = 0

    color: string = '#fff'
    radius: number = 10
    speed: number = 5

    playerName: string;

    target: XYCoordinateType = { x: 500, y: 500 }

    async preload() {}
    
    initialize() {}

    setTarget(target: XYCoordinateType) {
        this.target = {
            x: target.x,
            y: target.y,
        }
    }

    update() {
        const moveSpeed = this.speed * this.gameRef.diffMulti
        if(distanceBetween(this, this.target) > moveSpeed ) {
            const angle = angleBetween(this, this.target)
            const newPosition = pointOnCircle(angle, moveSpeed)
            this.x += newPosition.x
            this.y += newPosition.y
        }
    }

    draw() {
        drawCircle({
            c: this.gameRef.ctx,
            x: this.x,
            y: this.y,
            radius: this.radius,
            fillColor: this.color,
        })

        if(this.playerName) {
            drawText({
                c: this.gameRef.ctx,
                x: this.x,
                y: this.y - this.radius - 5,
                align: 'center',
                text: this.playerName,
                fillColor: this.color,
                fontSize: 16,
                fontFamily: 'sans-serif'
            })
        }
    }

    tearDown() { }
}