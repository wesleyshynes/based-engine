import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { boxCollision } from "../../../engine/libs/collisionHelpers";
import { createSprite, drawBox, drawCircle, drawImage, drawText } from "../../../engine/libs/drawHelpers";
import { getRandomInt } from "../../../engine/libs/mathHelpers";

// sprites
import BgTilemap from '../../../assets/dice-grid/tilemap_big.png'
// import BgTilemap from '../../../assets/dice-grid/tilemap.png'
import SkeletonTileSheet from '../../../assets/dice-grid/skeleton spritesheet calciumtrice_big.png'
import { sampleLayout } from "../layouts/sampleLayouts";
import { SpriteTiler } from "../utils/SpriteTiler";
import { SnakePlayer } from "../entities/SnakePlayer";
import TextContainer from "../ui/TextContainer";

import BgMusic from '../../../assets/dice-grid/FastFeelBananaPeel-320bit.mp3'
import EpicBgMusic from '../../../assets/dice-grid/BoxCat-Games-Epic-Song.mp3'
import LoseMusic from '../../../assets/dice-grid/03-Meydan-Tired-of-life.mp3'
import CrunchNoise from '../../../assets/dice-grid/232955__ramstush__crunch_.mp3'

export class StandardLevel extends BasedLevel {

    levelWidth: number = 1000
    levelHeight: number = 1000

    levelGrid: { [p: string]: any } = {}
    levelGridX: number = 20
    levelGridY: number = 20
    levelGridSize: number = 16

    selectedGrid: string = ''

    snakePlayer: any;

    scoreSpots: { [s: string]: boolean } = {}
    validScoreSpots: { [s: string]: boolean } = {}

    validMoves: { [k: string]: boolean } = {}

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    textBox: any;

    lastKeyPress = 0

    // Tools
    spriteTiler: any

    // Dice stuff
    diceValue: number = 0

    // rollDiceBtn: any;

    // Sprites stuff
    bgTilemap: any;
    skeletonTileSheet: any

    toastMessages: { text: string, duration: number, yOffset: number, xOffset: number }[] = []

    // growy things
    scoreRadius: number = 3
    scoreMaxRadius: number = 4
    scoreMinRadius: number = 2
    scoreRadiusGrow: number = .2

    moveSpotRadius: number = 4
    moveSpotMaxRadius: number = 5
    moveSpotMinRadius: number = 3
    moveSpotRadiusGrow: number = .05

    // SOUNDS
    crunchNoise: any

    // MUSIC
    activeSound: any = {
        playing: false,
        soundRef: null,
    }
    bgSong: any;
    epicBgSong: any;
    loseSong: any;

    gameState: string = 'active'

    async preload() {
        this.gameRef.drawLoading('Tile map', .1)
        this.bgTilemap = await createSprite({
            c: this.gameRef.ctx,
            sprite: BgTilemap,
            sx: 0,
            sy: 0,
            sWidth: 128,
            sHeight: 128,
            dx: 0,
            dy: 0,
            dWidth: 1028,
            dHeight: 1028,
            frame: 0,
            lastUpdate: 0,
            updateDiff: 1000 / 60 * 10
        })

        this.gameRef.drawLoading('Picking Apples', .4)
        this.crunchNoise = await this.gameRef.soundPlayer.loadSound(CrunchNoise)

        this.gameRef.drawLoading('Some Tunes', .6)
        this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
        this.gameRef.drawLoading('Epic Smphony', .7)
        this.epicBgSong = await this.gameRef.soundPlayer.loadSound(EpicBgMusic)
        this.gameRef.drawLoading('The Feels', .7)
        this.loseSong = await this.gameRef.soundPlayer.loadSound(LoseMusic)
        this.activeSound.playing = false
    }

    initialize(): void {

        this.gameState = 'active'
        // reset variables
        this.gameRef.cameraZoom = 1
        this.levelWidth = this.levelGridX * this.levelGridSize
        this.levelHeight = this.levelGridY * this.levelGridSize

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = 2
        this.followCam.initialize()

        this.levelGrid = {}
        this.validScoreSpots = {}
        this.scoreSpots = {}
        this.toastMessages = []

        // create the grid
        for (let x = 0; x < this.levelGridX; x++) {
            for (let y = 0; y < this.levelGridY; y++) {
                this.levelGrid[`${x}-${y}`] = {
                    color: (x + y) % 2 === 0 ? '#0a2463' : '#3e92cc',
                    occupants: {},
                }
                if (sampleLayout[`${x}-${y}`]) {
                    this.levelGrid[`${x}-${y}`].tile = sampleLayout[`${x}-${y}`]
                }
                if (x < 1 || x >= this.levelGridX - 1 || y < 1 || y >= this.levelGridY - 1) {
                    this.levelGrid[`${x}-${y}`].blocked = true
                    this.levelGrid[`${x}-${y}`].color = '#1e1b18'
                } else {
                    this.validScoreSpots[`${x}-${y}`] = true
                }
            }
        }

        this.snakePlayer = new SnakePlayer({
            gameRef: this.gameRef,
            key: 'snakePlayer',
        })
        this.snakePlayer.x = Math.floor(this.levelGridX / 2)
        this.snakePlayer.y = Math.floor(this.levelGridY / 2)

        while (this.snakePlayer.length > this.snakePlayer.body.length) {
            const sPos = { x: this.snakePlayer.x, y: this.snakePlayer.y, }
            // const sPos = { x: this.snakePlayer.x + (this.snakePlayer.body.length + 1), y: this.snakePlayer.y, }
            this.snakePlayer.body.push({
                target: { ...sPos },
                position: { ...sPos },
                gridCoordinates: { ...sPos },
            })
        }
        this.snakePlayer.initialize()

        this.generateScoreSpots(6)

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

        // this.rollDiceBtn = new BasedButton({ gameRef: this.gameRef, key: 'rollDiceBtn' })
        // this.rollDiceBtn.x = 10
        // this.rollDiceBtn.y = 60
        // this.rollDiceBtn.width = 60
        // this.rollDiceBtn.height = 40
        // this.rollDiceBtn.clickFunction = () => {
        //     // if (this.selectedPlayer.onTarget) {
        //     this.diceValue = getRandomInt(6) + 1
        //     // }
        // }
        // this.rollDiceBtn.buttonText = 'Roll'

        this.textBox = new TextContainer({ key: 'text-container', gameRef: this.gameRef })
        this.textBox.setText('Everytime you move a dice is rolled. You have to move that many spaces. If you roll more than spaces available to move you lose.')
        this.textBox.y = 80
        this.textBox.x = 80
        this.textBox.active = true
        this.textBox.closeFunction = () => {
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.textBox.fontFillColor = 'white'
        this.textBox.fontStrokeColor = 'black'
        this.textBox.containerFillColor = 'rgba(0,0,0,0.7)'
        this.textBox.containerBorderColor = 'rgba(0,0,0,0.7)'
        this.textBox.closeButtonFillColor = '#D8315B'
        this.textBox.closeButtonFocusColor = '#3E92CC'
        this.textBox.closeButtonHoverColor = '#3E92CC'
        this.textBox.closeButtonWidth = 80
        this.textBox.closeButtonHeight = 40
        this.textBox.initialize()

        // Sprite tool
        this.spriteTiler = new SpriteTiler({ gameRef: this.gameRef, key: 'spriteTiler' })
        this.spriteTiler.bgTilemap = this.bgTilemap
        this.spriteTiler.x = 10
        this.spriteTiler.y = 100
        this.spriteTiler.saveFunction = () => {
            console.log('save sprite sheet')
            const sampleSpriter: any = {}
            for (let x = 0; x < this.levelGridX; x++) {
                for (let y = 0; y < this.levelGridY; y++) {
                    const spriteEntry = this.levelGrid[`${x}-${y}`]
                    if (spriteEntry && spriteEntry.tile) {
                        sampleSpriter[`${x}-${y}`] = spriteEntry.tile
                    }
                }
            }
            console.log(JSON.stringify(sampleSpriter))
        }
        this.spriteTiler.initialize()
    }

    generateScoreSpots(count: number) {
        const maxPossible = Object.keys(this.validScoreSpots).length - this.snakePlayer.body.length - 5

        if (maxPossible < count) {
            count = maxPossible
        }

        if (maxPossible < 0) {
            this.textBox.setText('You Win! Your score is ' + Math.ceil(this.snakePlayer.length * Math.PI))
            this.textBox.closeFunction = () => {
                this.gameRef.loadLevel('start-screen')
            }
            this.textBox.active = true
            return
        }

        const availableScoreSpots = { ...this.validScoreSpots }
        delete availableScoreSpots[this.snakePlayer.getGridKey()]
        this.snakePlayer.body.forEach((x: any) => {
            delete availableScoreSpots[x.gridCoordinates.x + '-' + x.gridCoordinates.y]
        })
        while (Object.keys(this.scoreSpots).length < count) {
            const newSpot = Object.keys(availableScoreSpots)[getRandomInt(Object.keys(availableScoreSpots).length - 1)]
            if (
                this.levelGrid[newSpot] &&
                !this.levelGrid[newSpot].blocked &&
                !this.snakePlayer.bodyRef[newSpot] &&
                !this.scoreSpots[newSpot]
            ) {
                this.scoreSpots[newSpot] = true
                delete availableScoreSpots[newSpot]
            }
        }
    }

    checkGameCondition() {
        const snakeGridPos = this.snakePlayer.getGridKey()
        if (this.scoreSpots[snakeGridPos]) {
            // this.snakePlayer.color = 'green'
            this.snakePlayer.addBodyPart()
            delete this.scoreSpots[snakeGridPos]
            this.addToast(`Scored!`, { yOffset: -60 })
            this.gameRef.soundPlayer.playSound(this.crunchNoise)
            this.gameRef.shakeCamera()
            this.generateScoreSpots(getRandomInt(6) + 1)
        }

        // if(!this.snakePlayer.onTarget && this.snakePlayer.targets.length > 0) {
        //     const targetGridCoordinates = `${Math.floor(this.snakePlayer.target.x)}-${Math.floor(this.snakePlayer.y)}`
        //     if (this.snakePlayer.bodyRef[targetGridCoordinates]) {
        //         alert('you lose')
        //         console.log(targetGridCoordinates, this.snakePlayer.bodyRef)
        //         this.gameRef.loadLevel('start-screen')
        //     }
        // }
        // const playerGrid = this.selectedPlayer.getGridKey()
        // if (playerGrid === this.winSpot) {
        //     // this.gameRef.loadLevel('start-screen')
        //     this.selectedPlayer.color = 'green'
        // } else {
        //     this.selectedPlayer.color = 'red'
        // }
    }

    setValidMoves() {
        this.validMoves = {}
        if (this.snakePlayer.onTarget && this.snakePlayer.targets.length === 0 && this.diceValue > 0) {
            const snakePos = this.snakePlayer.gridCoordinates
            const validLeft: any = {}
            const validRight: any = {}
            const validUp: any = {}
            const validDown: any = {}
            for (let i = 1; i <= this.diceValue; i++) {
                const leftKey = `${snakePos.x - i}-${snakePos.y}`
                if (!this.snakePlayer.bodyRef[leftKey] && this.levelGrid[leftKey] && !this.levelGrid[leftKey].blocked) {
                    validLeft[leftKey] = true
                }
                const rightKey = `${snakePos.x + i}-${snakePos.y}`
                if (!this.snakePlayer.bodyRef[rightKey] && this.levelGrid[rightKey] && !this.levelGrid[rightKey].blocked) {
                    validRight[rightKey] = true
                }
                const upKey = `${snakePos.x}-${snakePos.y - i}`
                if (!this.snakePlayer.bodyRef[upKey] && this.levelGrid[upKey] && !this.levelGrid[upKey].blocked) {
                    validUp[upKey] = true
                }
                const downKey = `${snakePos.x}-${snakePos.y + i}`
                if (!this.snakePlayer.bodyRef[downKey] && this.levelGrid[downKey] && !this.levelGrid[downKey].blocked) {
                    validDown[downKey] = true
                }
            }
            this.validMoves = {
                ...(Object.keys(validLeft).length === this.diceValue ? validLeft : {}),
                ...(Object.keys(validRight).length === this.diceValue ? validRight : {}),
                ...(Object.keys(validUp).length === this.diceValue ? validUp : {}),
                ...(Object.keys(validDown).length === this.diceValue ? validDown : {}),
            }

            if (Object.keys(this.validMoves).length === 0) {
                // alert('you lose')
                // this.gameRef.loadLevel('start-screen')
                this.textBox.setText('Game Over! Your score is ' + Math.ceil(this.snakePlayer.length * Math.PI))
                if(this.gameState !== 'lose') {
                    this.activeSound.soundRef.stop()
                    this.gameState = 'lose'
                }
                this.textBox.closeFunction = () => {
                    this.gameRef.loadLevel('start-screen')
                }
                this.textBox.active = true
            }
        } else if (this.snakePlayer.onTarget && this.snakePlayer.targets.length === 0) {
            this.diceValue = getRandomInt(6) + 1
            this.addToast('Rolled a ' + this.diceValue)
        }
    }

    addToast(text: string, options: any = {}) {
        const {
            duration,
            yOffset,
            xOffset,
        } = options
        this.toastMessages.push({
            text: text,
            duration: duration ? duration : 1000,
            yOffset: yOffset ? yOffset : 0,
            xOffset: xOffset ? xOffset : 0,
        })
    }

    handleToasts() {
        if (this.toastMessages.length > 0) {
            this.toastMessages = this.toastMessages.map(x => {
                return {
                    ...x,
                    duration: x.duration - this.gameRef.updateDiff
                }
            }).filter(x => {
                return x.duration > 0
            })
        }
    }

    drawToasts() {
        if (this.toastMessages.length) {
            this.toastMessages.forEach((toast, idx) => {
                const toastOpacity = toast.duration > 500 ? 1 : toast.duration / 500
                const toastOffset = toast.duration > 500 ? 0 : ((500 - toast.duration) / 500) * 60
                drawText({
                    c: this.gameRef.ctx,
                    x: this.gameRef.gameWidth / 2 + toast.xOffset + 2,
                    y: this.gameRef.gameHeight / 2 + toast.yOffset + 2 - toastOffset,
                    // y: this.gameRef.gameHeight/2 + (idx * 40) + 1 - toastOffset,
                    align: 'center',
                    fontSize: 28,
                    fontFamily: 'sans-serif',
                    weight: 'bold',
                    fillColor: `rgba(0,0,0,${toastOpacity})`,
                    text: toast.text
                })
                drawText({
                    c: this.gameRef.ctx,
                    x: this.gameRef.gameWidth / 2 + toast.xOffset,
                    y: this.gameRef.gameHeight / 2 + toast.yOffset - toastOffset,
                    // y: this.gameRef.gameHeight/2 + (idx * 40) - toastOffset,
                    align: 'center',
                    fontSize: 28,
                    fontFamily: 'sans-serif',
                    weight: 'bold',
                    fillColor: `rgba(255,255,255,${toastOpacity})`,
                    text: toast.text
                })
            })
        }
    }

    handleInput() {
        let keyPressed = false
        let xMousePos = this.snakePlayer.x
        let yMousePos = this.snakePlayer.y
        if (this.lastKeyPress + 300 < this.gameRef.lastUpdate) {
            const pressedKeys = this.gameRef.pressedKeys
            if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
                xMousePos--
                keyPressed = true
            }
            if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
                xMousePos++
                keyPressed = true
            }
            if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp'])) {
                yMousePos--
                keyPressed = true
            }
            if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
                yMousePos++
                keyPressed = true
            }
            if (keyPressed) {
                this.lastKeyPress = this.gameRef.lastUpdate
            }
        }

        if (!keyPressed) {
            xMousePos = Math.floor(((this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x) / this.gameRef.cameraZoom) / this.levelGridSize)
            yMousePos = Math.floor(((this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y) / this.gameRef.cameraZoom) / this.levelGridSize)
        }


        if (this.levelGrid[this.selectedGrid]) {
            this.levelGrid[this.selectedGrid].selected = false
        }
        this.selectedGrid = `${xMousePos}-${yMousePos}`
        if (this.levelGrid[this.selectedGrid]) {
            const activeGrid = this.levelGrid[this.selectedGrid]
            activeGrid.selected = true

            // handle sprite tiler controls
            this.spriteTilerHandler()

            if (activeGrid.blocked) {
                return
            }

            if (
                (keyPressed || this.gameRef.mouseInfo.mouseDown) &&
                this.diceValue > 0 &&
                this.snakePlayer.onTarget &&
                this.snakePlayer.targets.length === 0 &&
                this.validMoves[this.selectedGrid]
            ) {
                const currPos = {
                    x: this.snakePlayer.x,
                    y: this.snakePlayer.y,
                }
                let xDir = currPos.x
                let yDir = currPos.y
                if (Math.abs(xMousePos - currPos.x) > 0) {
                    xDir += ((xMousePos - currPos.x) / Math.abs(xMousePos - currPos.x)) * this.diceValue
                }
                if (Math.abs(yMousePos - currPos.y) > 0) {
                    yDir += ((yMousePos - currPos.y) / Math.abs(yMousePos - currPos.y)) * this.diceValue
                }

                while (currPos.x !== xDir || currPos.y !== yDir) {
                    if (currPos.x !== xDir) {
                        currPos.x += currPos.x > xDir ? -1 : 1
                        this.snakePlayer.targets.push({ ...currPos })
                        continue
                    }
                    if (currPos.y !== yDir) {
                        currPos.y += currPos.y > yDir ? -1 : 1
                        this.snakePlayer.targets.push({ ...currPos })
                        continue
                    }
                }
                // while (currPos.x !== xMousePos || currPos.y !== yMousePos) {
                //     if (currPos.x !== xMousePos) {
                //         currPos.x += currPos.x > xMousePos ? -1 : 1
                //         this.snakePlayer.targets.push({ ...currPos })
                //         continue
                //     }
                //     if (currPos.y !== yMousePos) {
                //         currPos.y += currPos.y > yMousePos ? -1 : 1
                //         this.snakePlayer.targets.push({ ...currPos })
                //         continue
                //     }
                // }
                this.diceValue = 0
                // this.snakePlayer.setTarget({
                //     x: xMousePos,
                //     y: yMousePos,
                // })
            }
        }
    }

    spriteTilerHandler() {
        if (this.spriteTiler.active && this.gameRef.mouseInfo.mouseDown && this.diceValue === 0) {
            if (this.spriteTiler.drawMode === 'draw') {
                this.levelGrid[this.selectedGrid].tile = this.spriteTiler.getCurrentSprite()
            }
            if (this.spriteTiler.drawMode === 'delete') {
                delete this.levelGrid[this.selectedGrid].tile
            }
        }
    }

    handlePulses() {
        this.scoreRadius += this.scoreRadiusGrow
        if (this.scoreRadius > this.scoreMaxRadius) {
            this.scoreRadius = this.scoreMaxRadius
            this.scoreRadiusGrow = -1 * this.scoreRadiusGrow
        }
        if (this.scoreRadius < this.scoreMinRadius) {
            this.scoreRadius = this.scoreMinRadius
            this.scoreRadiusGrow = -1 * this.scoreRadiusGrow
        }

        this.moveSpotRadius += this.moveSpotRadiusGrow
        if (this.moveSpotRadius > this.moveSpotMaxRadius) {
            this.moveSpotRadius = this.moveSpotMaxRadius
            this.moveSpotRadiusGrow = -1 * this.moveSpotRadiusGrow
        }
        if (this.moveSpotRadius < this.moveSpotMinRadius) {
            this.moveSpotRadius = this.moveSpotMinRadius
            this.moveSpotRadiusGrow = -1 * this.moveSpotRadiusGrow
        }
    }

    handleSounds() {
        if (!this.gameRef.soundPlayer.enabled) { return }
        if (this.activeSound.playing == false) {
            let songToPlay = this.bgSong
            if(this.snakePlayer.body.length > 7) {
                songToPlay = this.epicBgSong
            }
            if(this.gameState === 'lose') {
                songToPlay = this.loseSong
            }
            this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(songToPlay, () => {
                this.activeSound.playing = false
            })
            this.activeSound.playing = true
        }
    }

    update(): void {
        // did we win?
        this.updateCamera()
        this.handlePulses()
        this.handleSounds()
        this.checkGameCondition()

        this.textBox.update()
        if (this.textBox.active) {
            return
        }

        // this.rollDiceBtn.update()
        this.cameraZoomButton.update()

        this.spriteTiler.update()

        this.setValidMoves()
        if (!this.cameraZoomButton.hovered) {
            this.handleInput()
        }

        this.snakePlayer.update()
        this.handleToasts()
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.snakePlayer.x * this.levelGridSize,
            y: this.snakePlayer.y * this.levelGridSize,
        })
        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    draw(): void {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#222'
        this.gameRef.ctx.fill()

        // draw the level
        const gridMulti = this.levelGridSize * this.gameRef.cameraZoom

        const playersOnScreen: string[] = []

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
                            x: Math.floor(drawX),
                            y: Math.floor(drawY),
                            width: Math.ceil(gridMulti),
                            height: Math.ceil(gridMulti),
                            fillColor: grid.color,
                        })

                        // if (grid.tile) {
                        //     drawImage({
                        //         ...this.bgTilemap,
                        //         sx: grid.tile.x * this.bgTilemap.sWidth,
                        //         sy: grid.tile.y * this.bgTilemap.sHeight,
                        //         dx: Math.floor(drawX),
                        //         dy: Math.floor(drawY),
                        //         dWidth: Math.ceil(gridMulti),
                        //         dHeight: Math.ceil(gridMulti)
                        //     })
                        // }

                        // draw valid spot marker
                        let validSpot = this.validMoves[gridKey]

                        if (validSpot && grid.selected && !grid.blocked && !this.gameRef.touchMode && this.snakePlayer.onTarget) {
                            drawBox({
                                c: this.gameRef.ctx,
                                x: drawX,
                                y: drawY,
                                width: gridMulti,
                                height: gridMulti,
                                fillColor: 'rgba(255,250,255,0.5)',
                            })
                        }

                        if (validSpot) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: this.moveSpotRadius * this.gameRef.cameraZoom,
                                fillColor: 'rgba(255,250,255,0.5)',
                                // fillColor: '#fffaff',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                            })
                        }

                        // draw the win spot
                        if (this.scoreSpots[gridKey]) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: this.scoreRadius * this.gameRef.cameraZoom,
                                fillColor: '#d8315b',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                                strokeColor: '#fffaff',
                                strokeWidth: 1 * this.gameRef.cameraZoom,
                            })
                        }

                        if (grid.occupants) {
                            // Object.keys(grid.occupants).forEach(pk => {
                            //     grid.occupants[pk].draw()
                            // })
                            playersOnScreen.push(...Object.keys(grid.occupants))
                        }
                    }
                }
            }
        }

        // draw entities
        // playersOnScreen.forEach(pk => {
        //     this.playerRef[pk].draw()
        // })
        // draw interface

        this.snakePlayer.draw()

        this.cameraZoomButton.draw()
        // this.rollDiceBtn.draw()

        this.drawToasts()

        this.spriteTiler.draw()
        // this.spriteXSlider.draw()
        // this.spriteYSlider.draw()
        // this.saveSpriteSheetBtn.draw()
        //
        // drawImage({
        //     ...this.bgTilemap,
        //     sWidth: 1028,
        //     sHeight: 1028,
        //     dx: 80,
        //     dy: 180,
        //     dWidth: 128,
        //     dHeight: 128,
        // })

        // drawBox({
        //     c: this.gameRef.ctx,
        //     x: 80 + 16 * this.spriteXSlider.value,
        //     y: 180 + 16 * Math.abs(7 - this.spriteYSlider.value),
        //     width: 16,
        //     height: 16,
        //     fillColor: 'rgba(0,0,0,0.2)',
        //     strokeWidth: 1,
        //     strokeColor: '#000',
        // })

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

        this.textBox.draw()
    }

    tearDown(): void {
        if (this.activeSound.playing && this.activeSound.soundRef) {
            this.activeSound.soundRef.stop()
        }
    }
} 