import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawImage, drawText } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class DicePlayer extends BasedObject {
    x: number = 0
    y: number = 0

    selected: boolean = false
    selectedColor: string = '#ff0000'

    active: boolean = true
    gridRef: any = {};

    gridCoordinates: XYCoordinateType = {
        x: 0,
        y: 0
    }

    color: string = '#fff'
    radius: number = 10
    speed: number = 5

    playerName: string;

    targets: XYCoordinateType[] = []
    target: XYCoordinateType = { x: 0, y: 0 }
    onTarget: boolean = false

    gridSize: number = 128

    spriteSheet: any;

    async preload() { }

    initialize() {
        this.setTarget({
            x: this.x,
            y: this.y,
        })
        this.setGridCoordinates()
    }

    setTarget(target: XYCoordinateType) {
        this.target = {
            x: target.x,
            y: target.y,
        }
    }

    handleInput() { }

    setGridCoordinates() {
        this.gridCoordinates.x = Math.floor(this.x / this.gridSize)
        this.gridCoordinates.y = Math.floor(this.y / this.gridSize)
    }

    getGridKey() {
        return `${this.gridCoordinates.x}-${this.gridCoordinates.y}`
    }

    update() {
        this.onTarget = false
        const moveSpeed = this.speed * this.gameRef.diffMulti
        if (distanceBetween(this, this.target) <= moveSpeed) {
            this.onTarget = true
            return
        }
        const angle = angleBetween(this, this.target)
        const newPosition = pointOnCircle(angle, moveSpeed)
        this.x += newPosition.x
        this.y += newPosition.y
        this.setGridCoordinates()
    }

    otherOccupantsInGrid() {
        const gridKey = this.getGridKey()
        if (!this.gridRef[gridKey] || !this.gridRef[gridKey].occupants) {
            return false
        }
        const gridOccupants = Object.keys(this.gridRef[gridKey].occupants).length
        if (gridOccupants === 0) { return false }
        if (gridOccupants === 1 && this.gridRef[gridKey].occupants[this.objectKey]) { return false }
        return true
    }

    draw() {
        if(this.spriteSheet) {
            const spriteSize = 64 * this.gameRef.cameraZoom
            drawImage({
                ...this.spriteSheet,
                c: this.gameRef.ctx,
                dx: (this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x - spriteSize/2,
                dy: (this.y * this.gameRef.cameraZoom) + this.gameRef.cameraPos.y - spriteSize/2,
                dWidth: spriteSize,
                dHeight: spriteSize,
            })
            drawCircle({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y + spriteSize/2,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: this.selected ? this.otherOccupantsInGrid() ? 'green' :  this.selectedColor : this.color,
            })
            if (this.playerName) {
                drawText({
                    c: this.gameRef.ctx,
                    x: (this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x,
                    y: (this.y * this.gameRef.cameraZoom) - (this.radius * this.gameRef.cameraZoom) - 5 + this.gameRef.cameraPos.y - spriteSize/2,
                    align: 'center',
                    text: this.playerName,
                    fillColor: this.selected ? this.selectedColor : this.color,
                    fontSize: 16 * this.gameRef.cameraZoom,
                    fontFamily: 'sans-serif'
                })
            }
        } else {
            drawCircle({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: this.selected ? this.otherOccupantsInGrid() ? 'green' :  this.selectedColor : this.color,
            })
    
            if (this.playerName) {
                drawText({
                    c: this.gameRef.ctx,
                    x: (this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x,
                    y: (this.y * this.gameRef.cameraZoom) - (this.radius * this.gameRef.cameraZoom) - 5 + this.gameRef.cameraPos.y,
                    align: 'center',
                    text: this.playerName,
                    fillColor: this.selected ? this.selectedColor : this.color,
                    fontSize: 16 * this.gameRef.cameraZoom,
                    fontFamily: 'sans-serif'
                })
            }
        }
    }

    tearDown() { }
}