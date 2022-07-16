import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawText } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class DicePlayer extends BasedObject {
    x: number = 0
    y: number = 0

    color: string = '#fff'
    radius: number = 10
    speed: number = 5

    playerName: string;

    target: XYCoordinateType = { x: 0, y: 0 }
    onTarget: boolean = false

    gridSize: number = 128

    async preload() { }

    initialize() {
        this.setTarget({
            x: this.x,
            y: this.y,
        })
     }

    setTarget(target: XYCoordinateType) {
        this.target = {
            x: target.x,
            y: target.y,
        }
    }

    handleInput() {}

    getGridCoordinates() {
        return {
            x: Math.floor(this.x / this.gridSize),
            y: Math.floor(this.y / this.gridSize),
        }
    }

    getGridKey() {
        const gridCoordinates = this.getGridCoordinates()
        return `${gridCoordinates.x}-${gridCoordinates.y}`
    }

    update() {
        this.onTarget = false        
        const moveSpeed = this.speed * this.gameRef.diffMulti
        if (distanceBetween(this, this.target) > moveSpeed) {
            const angle = angleBetween(this, this.target)
            const newPosition = pointOnCircle(angle, moveSpeed)
            this.x += newPosition.x
            this.y += newPosition.y
        } else {
            this.onTarget = true
        }
    }

    draw() {
        drawCircle({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.radius * this.gameRef.cameraZoom,
            fillColor: this.color,
        })

        if (this.playerName) {
            drawText({
                c: this.gameRef.ctx,
                x: (this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x,
                y: (this.y * this.gameRef.cameraZoom ) - (this.radius * this.gameRef.cameraZoom) - 5 + this.gameRef.cameraPos.y,
                align: 'center',
                text: this.playerName,
                fillColor: this.color,
                fontSize: 16 * this.gameRef.cameraZoom,
                fontFamily: 'sans-serif'
            })
        }
    }

    tearDown() { }
}