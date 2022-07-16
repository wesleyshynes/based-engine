import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { boxCollision } from "../../../engine/libs/collisionHelpers";
import { drawBox, drawCircle, drawText } from "../../../engine/libs/drawHelpers";
import { getRandomInt, normalizeVector } from "../../../engine/libs/mathHelpers";
import { DicePlayer } from "../entities/DicePlayer";

export class StandardLevel extends BasedLevel {
    levelWidth: number = 1400
    levelHeight: number = 1000

    player: any;

    levelGrid: { [p: string]: any } = {}
    levelGridX: number = 14
    levelGridY: number = 10
    levelGridSize: number = 100

    selectedGrid: string = ''

    winSpot = `3-2`

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    // Dice stuff
    diceValue: number = 0
    rollDiceBtn: any;

    async preload() {
        this.gameRef.drawLoading('Connecting', .1)
    }

    initialize(): void {

        // reset variables
        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight

        // create the player
        this.player = new DicePlayer({
            key: 'player',
            gameRef: this.gameRef,
        })
        this.player.color = '#ff0000'
        this.player.playerName = 'YOU'
        this.player.x = this.levelGridSize/2
        this.player.y = this.levelGridSize/2
        this.player.initialize()

        // create the grid
        this.levelGrid = {}
        for (let x = 0; x < this.levelGridX; x++) {
            for (let y = 0; y < this.levelGridY; y++) {
                this.levelGrid[`${x}-${y}`] = {
                    color: (x + y) % 2 === 0 ? '#fff' : '#000',
                }
            }
        }

        // setup interface
        this.cameraZoomButton = new BasedButton({ gameRef: this.gameRef, key: 'cameraZoomButton' })
        this.cameraZoomButton.x = 10
        this.cameraZoomButton.y = 10
        this.cameraZoomButton.width = 60
        this.cameraZoomButton.height = 40
        this.cameraZoomButton.clickFunction = () => {
            this.miniMapActive = !this.miniMapActive
            this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'
        }
        this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'

        this.rollDiceBtn = new BasedButton({ gameRef: this.gameRef, key: 'rollDiceBtn' })
        this.rollDiceBtn.x = 10
        this.rollDiceBtn.y = 60
        this.rollDiceBtn.width = 60
        this.rollDiceBtn.height = 40
        this.rollDiceBtn.clickFunction = () => {
            this.diceValue = getRandomInt(6) + 1
        }
        this.rollDiceBtn.buttonText = 'Roll'
    }

    checkGameCondition() {
        const playerXPos = Math.floor(this.player.x / this.levelGridSize)
        const playerYPos = Math.floor(this.player.y / this.levelGridSize)
        const playerGrid = `${playerXPos}-${playerYPos}`
        if (playerGrid === this.winSpot) {
            // this.gameRef.loadLevel('start-screen')
            this.player.color = 'green'
        } else {
            this.player.color = 'red'
        }
    }

    handleInput() {
        const xMousePos = Math.floor(((this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x) / this.gameRef.cameraZoom) / this.levelGridSize)
        const yMousePos = Math.floor(((this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y) / this.gameRef.cameraZoom) / this.levelGridSize)
        if (this.levelGrid[this.selectedGrid]) {
            this.levelGrid[this.selectedGrid].selected = false
        }
        this.selectedGrid = `${xMousePos}-${yMousePos}`
        if (this.levelGrid[this.selectedGrid]) {
            this.levelGrid[this.selectedGrid].selected = true
            let validTarget = false
            const playerXPos = Math.floor(this.player.x / this.levelGridSize)
            const playerYPos = Math.floor(this.player.y / this.levelGridSize)
            if(playerYPos === yMousePos && Math.abs(playerXPos - xMousePos) <= this.diceValue) {
                validTarget = true
            }
            if(playerXPos === xMousePos && Math.abs(playerYPos - yMousePos) <= this.diceValue) {
                validTarget = true
            }

            if (this.gameRef.mouseInfo.mouseDown && validTarget) {
                this.player.setTarget({
                    x: xMousePos * this.levelGridSize + this.levelGridSize / 2,
                    y: yMousePos * this.levelGridSize + this.levelGridSize / 2,
                })
                this.diceValue = 0
            }
        }
    }

    update(): void {
        // did we win?
        this.checkGameCondition()

        this.cameraZoomButton.update()
        this.rollDiceBtn.update()

        if (!this.cameraZoomButton.hovered && !this.rollDiceBtn.hovered) {
            this.handleInput()
        }

        this.player.update()

        this.updateCamera()
    }

    updateCamera() {
        this.followCam.setTarget(
            { x: this.player.x, y: this.player.y },
        )
        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
    }

    draw(): void {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#222'
        this.gameRef.ctx.fill()

        // draw the level
        const gridMulti = this.levelGridSize * this.gameRef.cameraZoom

        for (let x = 0; x < this.levelGridX; x++) {
            for (let y = 0; y < this.levelGridY; y++) {
                const gridKey = `${x}-${y}`
                const grid = this.levelGrid[gridKey]
                if (grid) {
                    const drawX = x * gridMulti + this.gameRef.cameraPos.x
                    const drawY = y * gridMulti + this.gameRef.cameraPos.y
                    if (boxCollision(
                        { x: 0, y: 0, w: this.gameRef.gameWidth, h: this.gameRef.gameHeight },
                        { x: drawX, y: drawY, w: gridMulti, h: gridMulti },
                    )) {
                        // draw the box
                        drawBox({
                            c: this.gameRef.ctx,
                            x: drawX,
                            y: drawY,
                            width: gridMulti,
                            height: gridMulti,
                            fillColor: grid.selected ? 'yellow' : grid.color,
                        })

                        // draw valid spot marker
                        let validSpot = false
                        if(this.diceValue > 0) {
                            const playerXPos = Math.floor(this.player.x / this.levelGridSize)
                            const playerYPos = Math.floor(this.player.y / this.levelGridSize)
                            if(playerYPos === y && Math.abs(playerXPos - x) <= this.diceValue) {
                                validSpot = true
                            }
                            if(playerXPos === x && Math.abs(playerYPos - y) <= this.diceValue) {
                                validSpot = true
                            }                            
                        }
                        if(validSpot) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: 8 * this.gameRef.cameraZoom,
                                fillColor: 'orange',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                            })
                        }

                        // draw the win spot
                        if (gridKey === this.winSpot) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: 5 * this.gameRef.cameraZoom,
                                fillColor: 'green',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                            })
                        }
                    }
                }
            }
        }

        // draw entities
        this.player.draw()

        // draw interface
        this.cameraZoomButton.draw()
        this.rollDiceBtn.draw()

        // text stuff
        drawText({
            c: this.gameRef.ctx,
            text: `Dice: ${this.diceValue}`,
            x: 10,
            y: this.gameRef.gameHeight - 50,
            fontSize: 20,
            fillColor: 'green',
            fontFamily: 'sans-serif',
            align: 'left'
        })
    }

    tearDown(): void { }
} 