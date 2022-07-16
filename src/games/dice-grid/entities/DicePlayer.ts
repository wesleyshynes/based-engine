import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawEllipse, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class DicePlayer extends BasedObject {
    x: number = 0
    y: number = 0

    selected: boolean = false
    selectedColor: string = '#ff0000'

    owner: string = 'none'

    active: boolean = true
    gridRef: any = {};

    gridCoordinates: XYCoordinateType = {
        x: 0,
        y: 0
    }

    color: string = '#fff'
    radius: number = 4
    speed: number = 2

    playerName: string;

    targets: XYCoordinateType[] = []
    target: XYCoordinateType = { x: 0, y: 0 }
    onTarget: boolean = false

    gridSize: number = 16

    spriteSheet: any;
    spriteSize: number = 32
    spriteSheetLength: number = 10

    lastDirection: number = 1

    animationIndex: any = {
        'idle': 0,
        'dance': 1,
        'walk': 2,
        'attack': 3,
        'die': 4,
    }
    activeAnimation: string = 'idle'

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
            this.updateSprite('idle')
            return
        }

        const angle = angleBetween(this, this.target)
        const newPosition = pointOnCircle(angle, moveSpeed)
        this.x += newPosition.x
        this.y += newPosition.y
        if (newPosition.x >= 0) {
            this.lastDirection = 1
        } else {
            this.lastDirection = -1
        }
        this.setGridCoordinates()
        this.updateSprite('walk')
    }

    updateSprite(animation: string = 'idle') {

        if (this.gameRef.lastUpdate > this.spriteSheet.lastUpdate + this.spriteSheet.updateDiff) {
            this.spriteSheet.lastUpdate = this.gameRef.lastUpdate
            this.spriteSheet.flipX = this.lastDirection === -1
            this.spriteSheet.flipY = false

            if (!this.active) {
                if (this.activeAnimation === 'die' && this.spriteSheet.frame < this.spriteSheetLength - 1) {
                    this.spriteSheet.frame = this.spriteSheet.frame + 1
                }
                if (this.activeAnimation !== 'die') {
                    this.spriteSheet.sy = this.animationIndex['die'] * this.spriteSheet.sHeight
                    this.spriteSheet.frame = 0
                    this.activeAnimation = 'die'
                }
                this.spriteSheet.sx = this.spriteSheet.sWidth * this.spriteSheet.frame
                return
            }

            if (this.activeAnimation === 'attack') {
                if (this.spriteSheet.frame < this.spriteSheetLength - 1) {
                    this.spriteSheet.frame = this.spriteSheet.frame + 1
                } else {
                    this.dance()
                }
                this.spriteSheet.sx = this.spriteSheet.sWidth * this.spriteSheet.frame
                return
            }

            if (this.activeAnimation === 'dance') {
                if (this.spriteSheet.frame < this.spriteSheetLength - 1) {
                    this.spriteSheet.frame = this.spriteSheet.frame + 1
                } else {
                    this.activeAnimation = 'idle'
                    this.spriteSheet.sy = this.animationIndex['idle'] * this.spriteSheet.sHeight
                }
                this.spriteSheet.sx = this.spriteSheet.sWidth * this.spriteSheet.frame
                return
            }

            if (this.activeAnimation === animation) {
                this.spriteSheet.frame = (this.spriteSheet.frame + 1) % this.spriteSheetLength
            }
            if (this.activeAnimation !== animation) {
                this.spriteSheet.sy = this.animationIndex[animation] * this.spriteSheet.sHeight
                this.spriteSheet.frame = 0
                this.activeAnimation = animation
            }
            this.spriteSheet.sx = this.spriteSheet.sWidth * this.spriteSheet.frame

        }
    }

    attack() {
        if (this.activeAnimation !== 'attack') {
            this.activeAnimation = 'attack'
            this.spriteSheet.frame = 0
            this.spriteSheet.sy = this.animationIndex['attack'] * this.spriteSheet.sHeight
        }
    }

    dance() {
        if (this.activeAnimation !== 'dance') {
            this.activeAnimation = 'dance'
            this.spriteSheet.frame = 0
            this.spriteSheet.sy = this.animationIndex['dance'] * this.spriteSheet.sHeight
        }
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

    drawPlayerUI() {
        if (this.playerName && this.selected) {
            const spriteSize = this.spriteSize * this.gameRef.cameraZoom
            drawText({
                c: this.gameRef.ctx,
                x: (this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x,
                y: (this.y * this.gameRef.cameraZoom) - (this.radius * this.gameRef.cameraZoom) - 5 + this.gameRef.cameraPos.y - spriteSize,
                align: 'center',
                text: this.playerName,
                fillColor: this.color,
                fontSize: 12,
                fontFamily: 'sans-serif'
            })
        }
    }

    draw() {

        // if(!this.active) {
        //     return
        // }
        if (this.spriteSheet) {

            const spriteSize = this.spriteSize * this.gameRef.cameraZoom
            drawEllipse({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                radiusX: spriteSize / (this.active ? 5 : 3),
                radiusY: spriteSize / 8,
                fillColor: 'rgba(0,0,0,0.5)',
            })
            // drawImage({
            //     ...this.spriteSheet,
            //     c: this.gameRef.ctx,
            //     dx: Math.floor((this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x - spriteSize / 2),
            //     dy: Math.floor((this.y * this.gameRef.cameraZoom) + this.gameRef.cameraPos.y - spriteSize),
            //     dWidth: Math.floor(spriteSize),
            //     dHeight: Math.floor(spriteSize),
            //     flipX: this.lastDirection === -1,
            //     flipY: false
            // })

            rotateDraw({
                c: this.gameRef.ctx,
                x: Math.floor((this.x * this.gameRef.cameraZoom) + this.gameRef.cameraPos.x + (this.spriteSheet.flipX ? spriteSize / 2 : -spriteSize / 2)),
                y: Math.floor((this.y * this.gameRef.cameraZoom) + this.gameRef.cameraPos.y - spriteSize),
                a: 0
            }, () => {
                // this.sprite.flipX = this.velocity.x < 0
                drawImage({
                    ...this.spriteSheet,
                    dWidth: Math.floor(spriteSize),
                    dHeight: Math.floor(spriteSize),
                })
            })

            this.drawPlayerUI()
        } else {
            drawCircle({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: this.selected ? this.otherOccupantsInGrid() ? 'green' : this.selectedColor : this.color,
            })
        }
    }

    tearDown() { }
}