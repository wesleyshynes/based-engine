import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox, drawText } from "../../../engine/libs/drawHelpers";
import TextContainer from "../../../engine/ui/TextContainer";
import { CasinoPlayer } from "../entities/casinoPlayer";

export class StandardLevel extends BasedLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    deck: any[] = [];

    players: any[] = []

    suspicionMeter: number = 0

    textBox: any;

    lastKeyPress = 0

    toastMessages: { text: string, duration: number, yOffset: number, xOffset: number }[] = []

    gameState: string = 'active'

    async preload() {
        this.gameRef.drawLoading('All the things', .1)
    }

    initialize(): void {

        this.gameState = 'loading'
        // reset variables
        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = 1
        this.followCam.initialize()

        this.toastMessages = []

        // setup interface
        this.cameraZoomButton = new BasedButton({ gameRef: this.gameRef, key: 'cameraZoomButton' })
        this.cameraZoomButton.width = 60
        this.cameraZoomButton.height = 40
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10
        this.cameraZoomButton.clickFunction = () => {
            this.miniMapActive = !this.miniMapActive
            this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'
        }
        this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'

        this.textBox = new TextContainer({ key: 'text-container', gameRef: this.gameRef })
        this.textBox.setText(`You hate the casino, make them lose!`)
        this.textBox.x = 80
        this.textBox.y = 80
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

        this.onResize()
        this.gameState = 'active'

        // ACTUAL GAME STUFF
        this.shuffleDeck()

        this.players = [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Joe' },
            { name: 'Jill' },
            { name: 'Jack' },
        ].map((p, i) => {
            const newPlayer = new CasinoPlayer({ key: `player-${i}`, gameRef: this.gameRef })
            newPlayer.name = p.name
            newPlayer.x = 100 + (i * 120)
            newPlayer.y = 190
            newPlayer.initialize()
            return newPlayer
        })
    }

    shuffleDeck() {
        this.deck = []
        const suits = ['hearts', 'diamonds', 'clubs', 'spades']
        const values = [
            { name: 'ace', value: 1 },
            { name: 'two', value: 2 },
            { name: 'three', value: 3 },
            { name: 'four', value: 4 },
            { name: 'five', value: 5 },
            { name: 'six', value: 6 },
            { name: 'seven', value: 7 },
            { name: 'eight', value: 8 },
            { name: 'nine', value: 9 },
            { name: 'ten', value: 10 },
            { name: 'jack', value: 10 },
            { name: 'queen', value: 10 },
            { name: 'king', value: 10 },
        ]
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.deck.push({
                    suit: suits[i],
                    value: values[j].value,
                    name: `${values[j].name} of ${suits[i]}`,
                })
            }
        }

        for (let i = 0; i < this.deck.length; i++) {
            const randomIndex = Math.floor(Math.random() * this.deck.length)
            const temp = this.deck[i]
            this.deck[i] = this.deck[randomIndex]
            this.deck[randomIndex] = temp
        }
    }


    checkGameCondition() {
        // this.addToast(`Scored!`, { yOffset: -60 })
        // this.gameRef.soundPlayer.playSound(this.crunchNoise)
        // this.gameRef.shakeCamera()
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
        let xMousePos = 0
        let yMousePos = 0
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

    }

    handleSounds() {
        if (!this.gameRef.soundPlayer.enabled) { return }
        // if (this.activeSound.playing == false) {
        //     let songToPlay = this.bgSong
        //     if (this.snakePlayer.body.length > 7) {
        //         songToPlay = this.epicBgSong
        //     }
        //     if (this.gameState === 'lose') {
        //         songToPlay = this.loseSong
        //     }
        //     this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(songToPlay, () => {
        //         this.activeSound.playing = false
        //     })
        //     this.activeSound.playing = true
        // }
    }

    update(): void {
        // did we win?
        this.updateCamera()
        this.handleSounds()
        this.checkGameCondition()

        this.textBox.update()
        if (this.textBox.active) {
            return
        }

        // this.rollDiceBtn.update()
        this.cameraZoomButton.update()

        if (!this.cameraZoomButton.hovered) {
            this.handleInput()
        }

        this.handleToasts()
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })
        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    onResize() {
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10
    }

    draw(): void {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#222'
        this.gameRef.ctx.fill()

        // draw the level
        // level bg
        drawBox({
            c: this.gameRef.ctx,
            x: 0 + this.gameRef.cameraPos.x,
            y: 0 + this.gameRef.cameraPos.y,
            width: this.levelWidth * this.gameRef.cameraZoom,
            height: this.levelHeight * this.gameRef.cameraZoom,
            fillColor: '#0c6640' // '#777'
        })

        // random box
        // drawBox({
        //     c: this.gameRef.ctx,
        //     x: (this.levelWidth - 80) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        //     y: 100 * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //     width: 20 * this.gameRef.cameraZoom,
        //     height: 20 * this.gameRef.cameraZoom,
        //     fillColor: '#ce192b' // '#777'
        // })

        // draw entities
        // this.deck.forEach((card, idx: number) => {
        //     drawText({
        //         c: this.gameRef.ctx,
        //         x: (idx < 26 ? 40 : 300) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        //         y: ((idx % 26 * 20) + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //         align: 'left',
        //         fontSize: 12 * this.gameRef.cameraZoom,
        //         fontFamily: 'sans-serif',
        //         fillColor: '#fff',
        //         text: card.name
        //     })
        // })

        this.players.forEach((player) => {
            player.draw()
        })

        // draw interface

        this.cameraZoomButton.draw()

        this.drawToasts()

        this.textBox.draw()
    }

    tearDown(): void {
        // if (this.activeSound.playing && this.activeSound.soundRef) {
        //     this.activeSound.soundRef.stop()
        // }
    }
} 