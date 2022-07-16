import { BasedButton } from "../../../engine/BasedButton";
import { BasedObject } from "../../../engine/BasedObject";
import { SliderControl } from "../../../engine/controls/SliderControl";
import { drawBox, drawImage } from "../../../engine/libs/drawHelpers";

export class SpriteTiler extends BasedObject {
    x: number = 0
    y: number = 0

    active: boolean = false

    // Sprite tool
    spriteX: number = 0
    spriteY: number = 0
    spriteSheetWidth: number = 8
    spriteSheetHeight: number = 8
    selectedSprite: [number, number] = [0, 0]
    spriteXSlider: any
    spriteYSlider: any
    lastSpriteMove: number = 0
    spriteMoveDelay: number = 200
    saveSpriteSheetBtn: any
    toggleDrawModeBtn: any

    smallSpriteWidth: number = 16
    smallSpriteHeight: number = 16

    smallSpriteDrawWidth: number = 128
    smallSpriteDrawHeight: number = 128

    originalSpriteWidth: number = 1028
    originalSpriteHeight: number = 1028

    drawMode: string = 'delete'

    bgTilemap: any;
    saveFunction: () => void = () => { }

    async preload() { }
    initialize() {
        // Sprite tool
        this.spriteXSlider = new SliderControl({ key: 'slider-x', gameRef: this.gameRef })
        this.spriteXSlider.x = this.x + 110
        this.spriteXSlider.y = this.y + 20
        this.spriteXSlider.width = 100
        this.spriteXSlider.height = 20
        this.spriteXSlider.btnWidth = 20
        this.spriteXSlider.btnHeight = 20
        this.spriteXSlider.minValue = 0
        this.spriteXSlider.maxValue = this.spriteSheetWidth - 1
        this.spriteXSlider.tickAmount = 1
        this.spriteXSlider.initialize()

        this.spriteYSlider = new SliderControl({ key: 'slider-x', gameRef: this.gameRef })
        this.spriteYSlider.direction = 'vertical'
        this.spriteYSlider.x = this.x + 10
        this.spriteYSlider.y = this.y + 120
        this.spriteYSlider.width = 20
        this.spriteYSlider.height = 100
        this.spriteYSlider.btnWidth = 20
        this.spriteYSlider.btnHeight = 20
        this.spriteYSlider.minValue = 0
        this.spriteYSlider.maxValue = this.spriteSheetWidth - 1
        this.spriteYSlider.tickAmount = 1
        this.spriteYSlider.initialize()

        this.saveSpriteSheetBtn = new BasedButton({ gameRef: this.gameRef, key: 'saveSpriteSheetBtn' })
        this.saveSpriteSheetBtn.x = this.x + 40
        this.saveSpriteSheetBtn.y = this.y + 70 + this.smallSpriteDrawHeight
        this.saveSpriteSheetBtn.width = 60
        this.saveSpriteSheetBtn.height = 40
        this.saveSpriteSheetBtn.clickFunction = () => {
            this.saveFunction()
        }
        this.saveSpriteSheetBtn.buttonText = 'Save'
        this.saveSpriteSheetBtn.initialize()

        this.toggleDrawModeBtn = new BasedButton({ gameRef: this.gameRef, key: 'toggleDrawModeBtn' })
        this.toggleDrawModeBtn.x = this.x + 40
        this.toggleDrawModeBtn.y = this.y + 70 + this.smallSpriteDrawHeight + 50
        this.toggleDrawModeBtn.width = 60
        this.toggleDrawModeBtn.height = 40
        this.toggleDrawModeBtn.clickFunction = () => {
            if (this.drawMode === 'delete') {
                this.drawMode = 'draw'
            } else {
                this.drawMode = 'delete'
            }
            this.toggleDrawModeBtn.buttonText = this.drawMode
        }
        this.toggleDrawModeBtn.buttonText = this.drawMode
        this.toggleDrawModeBtn.initialize()
    }

    handleInput() {

        if (!this.active) { return }

        if (this.gameRef.lastUpdate > this.lastSpriteMove + this.spriteMoveDelay) {
            const pressedKeys = this.gameRef.pressedKeys
            if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
                this.spriteXSlider.tick(-1)
                this.lastSpriteMove = this.gameRef.lastUpdate
            }
            if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
                this.spriteXSlider.tick(1)
                this.lastSpriteMove = this.gameRef.lastUpdate
            }
            if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp'])) {
                this.spriteYSlider.tick(1)
                this.lastSpriteMove = this.gameRef.lastUpdate
            }
            if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
                this.spriteYSlider.tick(-1)
                this.lastSpriteMove = this.gameRef.lastUpdate
            }
        }
    }

    getCurrentSprite() {
        return {
            x: this.spriteXSlider.value,
            y: this.spriteSheetHeight - this.spriteYSlider.value - 1,
        }
    }

    update() {

        if (!this.active) { return }

        this.handleInput()
        this.spriteXSlider.update()
        this.spriteYSlider.update()
        this.saveSpriteSheetBtn.update()
        this.toggleDrawModeBtn.update()
    }

    draw() {

        if (!this.active) { return }

        this.spriteXSlider.draw()
        this.spriteYSlider.draw()
        this.saveSpriteSheetBtn.draw()
        this.toggleDrawModeBtn.draw()

        drawImage({
            ...this.bgTilemap,
            sWidth: this.originalSpriteWidth,
            sHeight: this.originalSpriteHeight,
            dx: this.x + 40,
            dy: this.y + 50,
            dWidth: this.smallSpriteDrawWidth,
            dHeight: this.smallSpriteDrawHeight,
        })

        drawBox({
            c: this.gameRef.ctx,
            x: this.x + 40 + this.smallSpriteWidth * this.spriteXSlider.value,
            y: this.y + 50 + this.smallSpriteHeight * Math.abs(7 - this.spriteYSlider.value),
            width: this.smallSpriteWidth,
            height: this.smallSpriteHeight,
            fillColor: 'rgba(0,0,0,0.2)',
            strokeWidth: 1,
            strokeColor: '#000',
        })
    }
    tearDown() { }
}