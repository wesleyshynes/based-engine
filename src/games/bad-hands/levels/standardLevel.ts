import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox, drawText } from "../../../engine/libs/drawHelpers";
import TextContainer from "../../../engine/ui/TextContainer";
import Toasts from "../../../engine/ui/Toasts";
import { CasinoPlayer } from "../entities/casinoPlayer";
import { createDeck } from "../helpers/cardHelpers";

export class StandardLevel extends BasedLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    dealButton: any
    takeBetButton: any
    askPlayerButton: any
    standButton: any
    hitButton: any
    endRoundButton: any

    // Game related stuff
    deck: any[] = [];
    players: any[] = []
    dealer: any
    suspicionMeter: number = 0
    currentPlayer: number = 0

    remainingGames: number = 3 //5
    phase: string = 'betting'


    textBox: any;
    lastKeyPress = 0
    toastMessages: any;

    gameState: string = 'active'

    async preload() {
        this.gameRef.drawLoading('All the things', .1)
    }

    initialize(): void {

        this.gameState = 'loading'
        this.phase = 'betting'
        // reset variables
        this.remainingGames = 3 //5
        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = 1
        this.followCam.initialize()

        this.toastMessages = new Toasts({ gameRef: this.gameRef, key: 'toastsMessages' })

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

        this.dealButton = new BasedButton({ gameRef: this.gameRef, key: 'dealButton' })
        this.dealButton.width = 100
        this.dealButton.height = 40
        this.dealButton.x = 40
        this.dealButton.y = this.gameRef.gameHeight - this.dealButton.height - 10
        this.dealButton.clickFunction = () => {
            this.dealCard()
        }
        this.dealButton.buttonText = 'Deal'
        this.dealButton.initialize()

        this.takeBetButton = new BasedButton({ gameRef: this.gameRef, key: 'takeBetButton' })
        this.takeBetButton.width = 100
        this.takeBetButton.height = 40
        this.takeBetButton.x = 40
        this.takeBetButton.y = this.gameRef.gameHeight - this.takeBetButton.height - 60
        this.takeBetButton.clickFunction = () => {
            this.takeBet()
        }
        this.takeBetButton.buttonText = 'Take Bets'
        this.takeBetButton.initialize()

        this.askPlayerButton = new BasedButton({ gameRef: this.gameRef, key: 'askPlayerButton' })
        this.askPlayerButton.width = 100
        this.askPlayerButton.height = 40
        this.askPlayerButton.x = 40
        this.askPlayerButton.y = this.gameRef.gameHeight - this.askPlayerButton.height - 110
        this.askPlayerButton.clickFunction = () => {
            this.askPlayer()
        }
        this.askPlayerButton.buttonText = 'Ask Player'
        this.askPlayerButton.initialize()

        this.standButton = new BasedButton({ gameRef: this.gameRef, key: 'standButton' })
        this.standButton.width = 100
        this.standButton.height = 40
        this.standButton.x = 40
        this.standButton.y = this.gameRef.gameHeight - this.standButton.height - 160
        this.standButton.clickFunction = () => {
            this.stand()
        }
        this.standButton.buttonText = 'Stand'
        this.standButton.initialize()

        this.hitButton = new BasedButton({ gameRef: this.gameRef, key: 'hitButton' })
        this.hitButton.width = 100
        this.hitButton.height = 40
        this.hitButton.x = 40
        this.hitButton.y = this.gameRef.gameHeight - this.hitButton.height - 210
        this.hitButton.clickFunction = () => {
            this.hit()
        }
        this.hitButton.buttonText = 'Hit'
        this.hitButton.initialize()

        this.endRoundButton = new BasedButton({ gameRef: this.gameRef, key: 'endRoundButton' })
        this.endRoundButton.width = 100
        this.endRoundButton.height = 40
        this.endRoundButton.x = 40
        this.endRoundButton.y = this.gameRef.gameHeight - this.endRoundButton.height - 260
        this.endRoundButton.clickFunction = () => {
            this.endRound()
        }
        this.endRoundButton.buttonText = 'End Round'
        this.endRoundButton.initialize()

        // ACTUAL GAME STUFF
        this.shuffleDeck()

        this.players = [
            { name: 'John' },
            { name: 'Jane' },
            // { name: 'Joe' },
            // { name: 'Jill' },
            // { name: 'Jack' },
        ].map((p, i) => {
            const newPlayer = new CasinoPlayer({ key: `player-${i}`, gameRef: this.gameRef })
            newPlayer.name = p.name
            newPlayer.x = 100 + (i * 120)
            newPlayer.y = 190
            newPlayer.initialize()
            return newPlayer
        })
        this.currentPlayer = 0

        this.dealer = new CasinoPlayer({ key: `dealer`, gameRef: this.gameRef })
        this.dealer.name = 'Dealer'
        this.dealer.x = 100 + 5 * 120
        this.dealer.y = 190
        this.dealer.headColor = '#333333'
        this.dealer.color = '#000000'
        this.dealer.initialize()
        this.dealer.funds = 0

        this.phase = 'betting'

        // BEGIN
        this.onResize()
        this.gameState = 'active'
    }

    shuffleDeck() {
        this.deck = createDeck()
    }

    getActivePlayer() {
        return this.players[this.currentPlayer] ? this.players[this.currentPlayer] : this.dealer
    }

    dealCard() {
        if (this.phase === 'dealing') {
            if (this.currentPlayer < this.players.length) {
                const card = this.deck.pop()
                this.players[this.currentPlayer].addCardToHand(card)
                this.currentPlayer++
                return
            }
            if (this.currentPlayer >= this.players.length) {
                const card = this.deck.pop()
                this.dealer.addCardToHand(card)
                this.currentPlayer = 0
            }
            if (this.dealer.cards.length >= 2) {
                this.phase = 'playing'
            }
            return
        }
    }

    takeBet() {
        this.players.forEach(p => {
            p.placeBet()
        })
        this.phase = 'dealing'
    }

    askPlayer() {
        const activePlayer = this.getActivePlayer()
        activePlayer.makePlay()
    }

    stand() {
        const activePlayer = this.getActivePlayer()
        if (activePlayer.nextMove !== 'stand') {
            return
        }
        this.currentPlayer++
    }

    hit() {
        const activePlayer = this.getActivePlayer()
        if (activePlayer.nextMove !== 'hit') {
            return
        }
        const card = this.deck.pop()
        activePlayer.addCardToHand(card)
        if (activePlayer.handValue > 21) {
            this.currentPlayer++
        }
    }

    endRound() {
        this.shuffleDeck()
        const dealerHandValue = this.dealer.handValue
        const dealerBust = dealerHandValue > 21
        this.players.forEach(p => {
            if (p.handValue <= 21) {
                if (dealerBust || p.handValue > dealerHandValue) {
                    this.dealer.funds -= p.bet
                    p.winBet()
                } else if (p.handValue === dealerHandValue) {
                    p.returnBet()
                } else {
                    this.dealer.funds += p.bet
                    p.loseBet()
                }
            } else {
                this.dealer.funds += p.bet
                p.loseBet()
            }
            p.clearHand()
        })
        this.dealer.clearHand()
        this.currentPlayer = 0
        this.phase = 'betting'
        this.remainingGames--
    }

    checkGameCondition() {
        // this.addToast(`Scored!`, { yOffset: -60 })
        // this.gameRef.soundPlayer.playSound(this.crunchNoise)
        // this.gameRef.shakeCamera()
        if(this.remainingGames <= 0) {
            this.gameState = 'over'
            this.phase = 'over'
        }

        if(this.gameState === 'over') {
            // this.endGame()
            const netFunds = this.dealer.funds
            if(netFunds > 0) {
                this.textBox.setText(`You made the casino $${netFunds}! You did the opposite of what you were supposed to do!`)
            } else {
                this.textBox.setText(`You lost the casino $${netFunds}! You did a great service to the public!`)
            }
            this.textBox.closeFunction = () => {
                this.gameRef.loadLevel('start-screen')
            }
            this.textBox.active = true
            
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

        this.players.forEach((p, i: number) => {
            if (i === this.currentPlayer && this.phase !== 'betting') {
                p.activePlayer = true
            } else {
                p.activePlayer = false
            }
            p.update()
        })

        this.dealer.update()
        this.dealer.activePlayer = this.currentPlayer >= this.players.length

        // this.rollDiceBtn.update()
        this.cameraZoomButton.update()

        if (this.phase === 'betting') {
            this.takeBetButton.update()
        }

        if (this.phase === 'dealing') {
            this.dealButton.update()
        }

        if (this.phase === 'playing') {
            this.askPlayerButton.update()
            this.standButton.update()
            this.hitButton.update()

            if (this.dealer.activePlayer && (this.dealer.nextMove === 'stand' || this.dealer.handValue > 21)) {
                this.phase = 'endRound'
            }
        }

        if (this.phase === 'endRound') {
            this.endRoundButton.update()
        }


        if (!this.cameraZoomButton.hovered) {
            this.handleInput()
        }

        this.toastMessages.update()
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

        this.dealButton.y = this.gameRef.gameHeight - this.dealButton.height - 10
        this.takeBetButton.y = this.gameRef.gameHeight - this.takeBetButton.height - 60
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

        // remaining rounds text
        drawText({
            c: this.gameRef.ctx,
            x: 40,
            y: 60,
            text: `Rounds remaining: ${this.remainingGames}`,
            fontSize: 20,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            align: 'left',
            strokeColor: '#000',
            strokeWidth: 2,
        })

        // suspicion value
        drawText({
            c: this.gameRef.ctx,
            x: 40,
            y: 100,
            text: `Suspicion: ${this.suspicionMeter}`,
            fontSize: 20,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            align: 'left',
            strokeColor: '#000',
            strokeWidth: 2,
        })

        this.players.forEach((player) => {
            player.draw()
        })

        this.dealer.draw()

        // draw interface
        this.cameraZoomButton.draw()


        if (this.phase === 'betting') {
            this.takeBetButton.draw()
        }

        if (this.phase === 'dealing') {
            this.dealButton.draw()
        }

        if (this.phase === 'playing') {
            const activePlayer = this.getActivePlayer()
            if (activePlayer.nextMove === '') {
                this.askPlayerButton.draw()
            }
            if (activePlayer.nextMove === 'hit') {
                this.hitButton.draw()
            }
            if (activePlayer.nextMove === 'stand') {
                this.standButton.draw()
            }
        }

        if (this.phase === 'endRound') {
            this.endRoundButton.draw()
        }


        this.toastMessages.draw()

        this.textBox.draw()
    }

    tearDown(): void {
        // if (this.activeSound.playing && this.activeSound.soundRef) {
        //     this.activeSound.soundRef.stop()
        // }
    }
} 