import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawLine } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, getRandomInt, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class SnakePlayer extends BasedObject {
    x: number = 4
    y: number = 4

    length: number = 4
    body: {
        target: XYCoordinateType,
        position: XYCoordinateType,
        gridCoordinates: XYCoordinateType,
    }[] = []

    speed: number = .2
    color: string = '#fffaff'

    diceFrame: number = 0

    bodyRef: { [key: string]: boolean } = {}

    gridSize: number = 16
    gridCoordinates: XYCoordinateType = {
        x: 0,
        y: 0
    }

    gridRef: any;

    targets: XYCoordinateType[] = []
    target: XYCoordinateType = { x: 0, y: 0 }
    onTarget: boolean = false

    radius: number = 5

    swooshNoise: any;

    async preload() { }
    initialize() {
        this.setGridCoordinates()
        this.target = {
            x: this.x,
            y: this.y,
        }
    }

    setTarget(target: XYCoordinateType) {
        if (this.onTarget) {
            if(this.swooshNoise){
                this.gameRef.soundPlayer.playSound(this.swooshNoise)
                this.diceFrame = getRandomInt(6)
            }
            this.target = {
                x: target.x,
                y: target.y,
            }
            this.body.forEach((b, i) => {
                if (i === 0) {
                    b.target = {
                        x: this.x,
                        y: this.y,
                    }
                } else {
                    b.target = {
                        x: this.body[i - 1].position.x,
                        y: this.body[i - 1].position.y,
                    }
                }
            })
        }
    }

    setGridCoordinates() {
        this.gridCoordinates = {
            x: Math.floor(this.x),
            y: Math.floor(this.y),
        }
        this.bodyRef = {}
        this.bodyRef[this.getGridKey()] = true
        this.body.forEach((b, i) => {
            b.gridCoordinates = {
                x: Math.floor(b.position.x),
                y: Math.floor(b.position.y),
            }
            this.bodyRef[`${b.gridCoordinates.x}-${b.gridCoordinates.y}`] = true
        })
    }

    getGridKey() {
        return `${this.gridCoordinates.x}-${this.gridCoordinates.y}`
    }

    update() {
        this.onTarget = false
        const moveSpeed = this.speed * this.gameRef.diffMulti
        if (distanceBetween(this, this.target) <= moveSpeed) {
            this.onTarget = true
            this.x = this.target.x
            this.y = this.target.y
            this.body.forEach((b, i) => {
                b.position.x = b.target.x
                b.position.y = b.target.y
                b.gridCoordinates.x = b.target.x
                b.gridCoordinates.y = b.target.y
            })
            if (this.targets.length > 0) {
                this.setTarget(this.targets.shift())
                this.onTarget = false
            }
            this.setGridCoordinates()
            return
        }
        const angle = angleBetween(this, this.target)
        const newPosition = pointOnCircle(angle, moveSpeed)
        this.x += newPosition.x
        this.y += newPosition.y

        this.body.forEach((b, i) => {
            const angle = angleBetween(b.position, b.target)
            const newPosition = pointOnCircle(angle, moveSpeed)
            b.position.x += newPosition.x
            b.position.y += newPosition.y
        })
        this.setGridCoordinates()
    }

    addBodyPart() {
        this.body.push({
            target: { x: this.body[this.body.length - 1].position.x, y: this.body[this.body.length - 1].position.y },
            position: { x: this.body[this.body.length - 1].position.x, y: this.body[this.body.length - 1].position.y },
            gridCoordinates: { x: this.body[this.body.length - 1].gridCoordinates.x, y: this.body[this.body.length - 1].gridCoordinates.y },
        })
    }

    draw() {
        // this.color = this.onTarget ? 'red' : 'blue'
        const gridOffset = this.gridSize / 2 * this.gameRef.cameraZoom

        this.body.forEach((b, i) => {
            drawCircle({
                c: this.gameRef.ctx,
                x: gridOffset + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: gridOffset + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: this.color
            })
            if (i > 0) {
                drawLine({
                    c: this.gameRef.ctx,
                    x: gridOffset + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    y: gridOffset + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    toX: gridOffset + this.body[i - 1].position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    toY: gridOffset + this.body[i - 1].position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    strokeColor: this.color,
                    strokeWidth: this.radius * 2 * this.gameRef.cameraZoom
                })
            } else {
                drawLine({
                    c: this.gameRef.ctx,
                    x: gridOffset + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    y: gridOffset + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    toX: gridOffset + this.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    toY: gridOffset + this.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    strokeColor: this.color,
                    strokeWidth: this.radius * 2 * this.gameRef.cameraZoom
                })
            }
        })

        // draw head
        drawCircle({
            c: this.gameRef.ctx,
            x: gridOffset + this.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: gridOffset + this.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.radius * this.gameRef.cameraZoom,
            fillColor: this.color
        })
    }
    tearDown() { }

}