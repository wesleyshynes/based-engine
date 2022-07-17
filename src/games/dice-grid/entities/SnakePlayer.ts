import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawLine } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

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

    async preload(){}
    initialize() {
        this.setGridCoordinates()
        this.target = {
            x: this.x,
            y: this.y,
        }
    }

    setTarget(target: XYCoordinateType) {
        if(this.onTarget) {            
            this.target = {
                x: target.x,
                y: target.y,
            }
            this.body.forEach((b,i) => {
                if(i === 0) {
                    b.target = {
                        x: this.x,
                        y: this.y,
                    }
                } else {
                    b.target = {
                        x: this.body[i-1].position.x,
                        y: this.body[i-1].position.y,
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
            })
            if(this.targets.length) {
                this.setTarget(this.targets.shift())
            }
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
    }
    draw() {
        this.body.forEach((b,i) => {
            drawCircle({
                c: this.gameRef.ctx,
                x: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: '#ff0000'
            })
            if(i > 0) {
                drawLine({
                    c: this.gameRef.ctx,
                    x: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    y: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    toX: (this.gridSize/2) * this.gameRef.cameraZoom + this.body[i-1].position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    toY: (this.gridSize/2) * this.gameRef.cameraZoom + this.body[i-1].position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    strokeColor: '#ff0000',
                    strokeWidth: this.radius * this.gameRef.cameraZoom
                })
            } else {
                drawLine({
                    c: this.gameRef.ctx,
                    x: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    y: (this.gridSize/2) * this.gameRef.cameraZoom + b.position.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    toX: (this.gridSize/2) * this.gameRef.cameraZoom + this.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                    toY: (this.gridSize/2) * this.gameRef.cameraZoom + this.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                    strokeColor: '#ff0000',
                    strokeWidth: this.radius * this.gameRef.cameraZoom
                })
            }
        })
        drawCircle({
            c: this.gameRef.ctx,
            x: (this.gridSize/2) * this.gameRef.cameraZoom + this.x * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.gridSize/2) * this.gameRef.cameraZoom + this.y * this.gridSize * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.radius * this.gameRef.cameraZoom,
            fillColor: '#ff0000'
        })
    }
    tearDown() {}

}