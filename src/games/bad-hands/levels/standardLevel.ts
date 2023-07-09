import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox, drawText } from "../../../engine/libs/drawHelpers";
import { getRandomInt } from "../../../engine/libs/mathHelpers";
import TextContainer from "../../../engine/ui/TextContainer";
import Toasts from "../../../engine/ui/Toasts";
import { CasinoPlayer } from "../entities/casinoPlayer";
import { createDeck } from "../helpers/cardHelpers";

import ShuffleNoise from '../../../assets/black-jack/445031__ailett__riffle-shuffle.mp3'
import BetNoise from '../../../assets/black-jack/75235__creek23__cha-ching.mp3'

import DealNoise from '../../../assets/black-jack/571576__el_boss__playing-card-deal-variation-2.mp3'
import SneakDealNoise from '../../../assets/black-jack/536784__egomassive__deal.mp3'

import HitNoise from '../../../assets/black-jack/240777__f4ngy__dealing-card.mp3'
import SneakHitNoise from '../../../assets/black-jack/240776__f4ngy__card-flip.mp3'

import StandNoise from '../../../assets/black-jack/585256__lesaucisson__swoosh-2.mp3'
import BustNoise from '../../../assets/black-jack/344268__inspectorj__glass-smash-bottle-a.mp3'

import DingNoise from '../../../assets/black-jack/679016__leonelale71__typerwriter_ding.mp3'

import BeatNoise from '../../../assets/black-jack/85558__maj061785__punching-metal-door.mp3'
import LoseNoise from '../../../assets/black-jack/270334__littlerobotsoundfactory__jingle_lose_01.mp3'
import WinNoise from '../../../assets/black-jack/165492__chripei__victory-cry-reverb-1.mp3'

import BgMusic from '../../../assets/black-jack/AcidJazz.mp3'

const FILL_COLOR = '#81B622'
const HOVER_COLOR = '#ECF87F'
const ALT_FILL_COLOR = '#59981A'
const TEXT_COLOR = '#FFFFFF'
const TEXT_HOVER_COLOR = '#000000'
const BG_COLOR = '#3D550C'

export class StandardLevel extends BasedLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    buttonWidth: number = 160
    buttonHeight: number = 50
    buttonFontSize: number = 22

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    dealButton: any
    sneakDealButton: any
    takeBetButton: any
    // askPlayerButton: any
    standButton: any
    hitButton: any
    sneakHitButton: any
    endRoundButton: any

    // Game related stuff
    deck: any[] = [];
    players: any[] = []
    dealer: any
    suspicionMeter: number = 0
    maxSuspicion: number = 10
    caught: boolean = false
    currentPlayer: number = 0

    remainingGames: number = 5
    phase: string = 'betting'


    textBox: any;
    lastKeyPress = 0
    toastMessages: any;

    gameState: string = 'active'

    // SOUNDS
    shuffleNoise: any
    betNoise: any
    dealNoise: any
    sneakDealNoise: any
    hitNoise: any
    sneakHitNoise: any
    standNoise: any
    bustNoise: any
    dingNoise: any
    beatNoise: any
    loseNoise: any
    winNoise: any

    // MUSIC
    activeSound: any = {
        playing: false,
        soundRef: null,
    }

    bgSong: any;

    async preload() {
        this.gameRef.drawLoading('All the things', .1)
        this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)

        this.gameRef.drawLoading('Gathering Cards', .4)
        this.shuffleNoise = await this.gameRef.soundPlayer.loadSound(ShuffleNoise)
        this.standNoise = await this.gameRef.soundPlayer.loadSound(StandNoise)
        this.beatNoise = await this.gameRef.soundPlayer.loadSound(BeatNoise)
        this.loseNoise = await this.gameRef.soundPlayer.loadSound(LoseNoise)
        this.winNoise = await this.gameRef.soundPlayer.loadSound(WinNoise)

        this.gameRef.drawLoading('Getting Chips', .6)
        this.betNoise = await this.gameRef.soundPlayer.loadSound(BetNoise)
        this.bustNoise = await this.gameRef.soundPlayer.loadSound(BustNoise)
        this.dingNoise = await this.gameRef.soundPlayer.loadSound(DingNoise)

        this.gameRef.drawLoading('Dealing Cards', .8)
        this.dealNoise = await this.gameRef.soundPlayer.loadSound(DealNoise)
        this.hitNoise = await this.gameRef.soundPlayer.loadSound(HitNoise)

        this.gameRef.drawLoading('Sneaking Cards', .9)
        this.sneakDealNoise = await this.gameRef.soundPlayer.loadSound(SneakDealNoise)
        this.sneakHitNoise = await this.gameRef.soundPlayer.loadSound(SneakHitNoise)
    }

    initialize(): void {

        this.gameState = 'loading'
        this.phase = 'betting'
        // reset variables
        this.remainingGames = 5
        this.suspicionMeter = 0
        this.caught = false
        this.gameRef.cameraZoom = 1
        this.lastKeyPress = 0

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
        this.textBox.setText(`You are a BlackJack dealer and you hate the house. Use your sneak hits and deals to make sure the house loses. Make sure the other players win and the house loses. Don't get caught or you'll be fired and beated.`)
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
        this.textBox.closeButtonFillColor = FILL_COLOR
        this.textBox.closeButtonFocusColor = HOVER_COLOR
        this.textBox.closeButtonHoverColor = HOVER_COLOR
        this.textBox.closeButtonTextColor = 'white'
        this.textBox.closeButtonTextHoverColor = 'black'
        this.textBox.closeButtonWidth = 80
        this.textBox.closeButtonHeight = 40
        this.textBox.initialize()

        this.dealButton = new BasedButton({ gameRef: this.gameRef, key: 'dealButton' })
        this.dealButton.fillColor = FILL_COLOR
        this.dealButton.hoverColor = HOVER_COLOR
        this.dealButton.focusColor = HOVER_COLOR
        this.dealButton.textColor = TEXT_COLOR
        this.dealButton.textHoverColor = TEXT_HOVER_COLOR
        this.dealButton.width = this.buttonWidth
        this.dealButton.height = this.buttonHeight
        this.dealButton.fontSize = this.buttonFontSize
        this.dealButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.dealButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight * 2
        this.dealButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.dealCard()
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.dealButton.buttonText = 'DEAL'
        this.dealButton.initialize()

        this.sneakDealButton = new BasedButton({ gameRef: this.gameRef, key: 'sneakDealButton' })
        this.sneakDealButton.fillColor = FILL_COLOR
        this.sneakDealButton.hoverColor = HOVER_COLOR
        this.sneakDealButton.focusColor = HOVER_COLOR
        this.sneakDealButton.textColor = TEXT_COLOR
        this.sneakDealButton.textHoverColor = TEXT_HOVER_COLOR
        this.sneakDealButton.width = this.buttonWidth
        this.sneakDealButton.height = this.buttonHeight
        this.sneakDealButton.fontSize = this.buttonFontSize
        this.sneakDealButton.x = this.gameRef.gameWidth / 2 - this.sneakDealButton.width / 2
        this.sneakDealButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2
        this.sneakDealButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.dealCard(true)
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.sneakDealButton.buttonText = 'SNEAK DEAL'
        this.sneakDealButton.initialize()

        this.takeBetButton = new BasedButton({ gameRef: this.gameRef, key: 'takeBetButton' })
        this.takeBetButton.fillColor = FILL_COLOR
        this.takeBetButton.hoverColor = HOVER_COLOR
        this.takeBetButton.focusColor = HOVER_COLOR
        this.takeBetButton.textColor = TEXT_COLOR
        this.takeBetButton.textHoverColor = TEXT_HOVER_COLOR
        this.takeBetButton.width = this.buttonWidth
        this.takeBetButton.height = this.buttonHeight
        this.takeBetButton.fontSize = this.buttonFontSize
        this.takeBetButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.takeBetButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2
        this.takeBetButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.takeBet()
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.takeBetButton.buttonText = 'TAKE BETS'
        this.takeBetButton.initialize()

        this.standButton = new BasedButton({ gameRef: this.gameRef, key: 'standButton' })
        this.standButton.fillColor = FILL_COLOR
        this.standButton.hoverColor = HOVER_COLOR
        this.standButton.focusColor = HOVER_COLOR
        this.standButton.textColor = TEXT_COLOR
        this.standButton.textHoverColor = TEXT_HOVER_COLOR
        this.standButton.width = this.buttonWidth
        this.standButton.height = this.buttonHeight
        this.standButton.fontSize = this.buttonFontSize
        this.standButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.standButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2
        this.standButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.stand()
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.standButton.buttonText = 'STAND'
        this.standButton.initialize()

        this.hitButton = new BasedButton({ gameRef: this.gameRef, key: 'hitButton' })
        this.hitButton.fillColor = FILL_COLOR
        this.hitButton.hoverColor = HOVER_COLOR
        this.hitButton.focusColor = HOVER_COLOR
        this.hitButton.textColor = TEXT_COLOR
        this.hitButton.textHoverColor = TEXT_HOVER_COLOR
        this.hitButton.width = this.buttonWidth
        this.hitButton.height = this.buttonHeight
        this.hitButton.fontSize = this.buttonFontSize
        this.hitButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.hitButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight * 2
        this.hitButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.hit()
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.hitButton.buttonText = 'HIT'
        this.hitButton.initialize()

        this.sneakHitButton = new BasedButton({ gameRef: this.gameRef, key: 'sneakHitButton' })
        this.sneakHitButton.fillColor = FILL_COLOR
        this.sneakHitButton.hoverColor = HOVER_COLOR
        this.sneakHitButton.focusColor = HOVER_COLOR
        this.sneakHitButton.textColor = TEXT_COLOR
        this.sneakHitButton.textHoverColor = TEXT_HOVER_COLOR
        this.sneakHitButton.width = this.buttonWidth
        this.sneakHitButton.height = this.buttonHeight
        this.sneakHitButton.fontSize = this.buttonFontSize
        this.sneakHitButton.x = this.gameRef.gameWidth / 2 - this.sneakHitButton.width / 2
        this.sneakHitButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2
        this.sneakHitButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.hit(true)
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.sneakHitButton.buttonText = 'SNEAK HIT'
        this.sneakHitButton.initialize()

        this.endRoundButton = new BasedButton({ gameRef: this.gameRef, key: 'endRoundButton' })
        this.endRoundButton.fillColor = FILL_COLOR
        this.endRoundButton.hoverColor = HOVER_COLOR
        this.endRoundButton.focusColor = HOVER_COLOR
        this.endRoundButton.textColor = TEXT_COLOR
        this.endRoundButton.textHoverColor = TEXT_HOVER_COLOR
        this.endRoundButton.width = this.buttonWidth
        this.endRoundButton.height = this.buttonHeight
        this.endRoundButton.fontSize = this.buttonFontSize
        this.endRoundButton.x = this.gameRef.gameWidth / 2 - this.endRoundButton.width / 2
        this.endRoundButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2
        this.endRoundButton.clickFunction = () => {
            if (this.gameRef.lastUpdate - this.lastKeyPress < 300) { return }
            this.endRound()
            this.lastKeyPress = this.gameRef.lastUpdate
        }
        this.endRoundButton.buttonText = 'END ROUND'
        this.endRoundButton.initialize()

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
            newPlayer.y = 250
            newPlayer.initialize()
            return newPlayer
        })
        this.currentPlayer = 0

        this.dealer = new CasinoPlayer({ key: `dealer`, gameRef: this.gameRef })
        this.dealer.name = 'Dealer'
        this.dealer.x = 100 + 5 * 120
        this.dealer.y = 250
        this.dealer.headColor = '#333333'
        this.dealer.color = '#000000'
        this.dealer.dealer = true
        this.dealer.initialize()
        this.dealer.funds = 0

        this.phase = 'betting'

        // BEGIN
        this.onResize()
        this.gameState = 'active'
    }

    shuffleDeck() {
        this.deck = createDeck()
        this.gameRef.soundPlayer.playSound(this.shuffleNoise)

    }

    getActivePlayer() {
        return this.players[this.currentPlayer] ? this.players[this.currentPlayer] : this.dealer
    }

    dealCard(sneak = false) {
        if (this.phase === 'dealing' && this.deck.length > 0) {
            this.gameRef.shakeCamera()
            const card = sneak ? this.deck.shift() : this.deck.pop()
            if (sneak) {
                this.increaseSuspicions()
                this.gameRef.soundPlayer.playSound(this.sneakDealNoise)
            } else {
                this.gameRef.soundPlayer.playSound(this.dealNoise)
            }

            const activePlayer = this.getActivePlayer()

            if (this.currentPlayer < this.players.length) {
                this.players[this.currentPlayer].addCardToHand(card)
                if (activePlayer.handValue === 21) {
                    this.gameRef.soundPlayer.playSound(this.dingNoise)
                }
                this.currentPlayer++
                return
            }
            if (this.currentPlayer >= this.players.length) {
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
        this.gameRef.soundPlayer.playSound(this.betNoise)
    }

    // dead code
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
        this.gameRef.soundPlayer.playSound(this.standNoise)
    }

    hit(sneak = false) {
        this.gameRef.shakeCamera()
        const activePlayer = this.getActivePlayer()
        if (activePlayer.nextMove !== 'hit') {
            return
        }
        const card = sneak ? this.deck.shift() : this.deck.pop()
        if (sneak) {
            this.increaseSuspicions()
            this.gameRef.soundPlayer.playSound(this.sneakHitNoise)
        } else {
            this.gameRef.soundPlayer.playSound(this.hitNoise)
        }
        activePlayer.addCardToHand(card)
        if (activePlayer.handValue > 21) {
            this.currentPlayer++
            this.gameRef.soundPlayer.playSound(this.bustNoise)
        }
        if (activePlayer.handValue === 21) {
            this.currentPlayer++
            this.gameRef.soundPlayer.playSound(this.dingNoise)
        }

    }

    increaseSuspicions() {
        this.suspicionMeter += 1
        if (this.suspicionMeter >= 3) {
            const saveSus = getRandomInt(this.maxSuspicion) + 3
            const susRoll = getRandomInt(this.suspicionMeter)
            if (susRoll > saveSus) {
                this.caught = true
            }
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

        const lastGameState = this.gameState
        if (this.remainingGames <= 0 || this.caught) {
            this.gameState = 'over'
            this.phase = 'over'
        }

        if (this.gameState === 'over') {
            // this.endGame()
            const netFunds = this.dealer.funds
            const playNoise = lastGameState !== this.gameState
            if (this.caught) {
                this.textBox.setText(`GAME OVER! You got caught! Security took you out back to beat you!`)
                playNoise && this.gameRef.soundPlayer.playSound(this.beatNoise)
            } else if (netFunds > 0) {
                this.textBox.setText(`You made the casino $${netFunds}! You did the opposite of what you were supposed to do!`)
                playNoise && this.gameRef.soundPlayer.playSound(this.loseNoise)
            } else {
                this.textBox.setText(`You lost the casino $${netFunds}! You did a great service to the public!`)
                playNoise && this.gameRef.soundPlayer.playSound(this.winNoise)
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
        if (this.activeSound.playing == false) {
            let songToPlay = this.bgSong
            // if (this.snakePlayer.body.length > 7) {
            //     songToPlay = this.epicBgSong
            // }
            // if (this.gameState === 'lose') {
            //     songToPlay = this.loseSong
            // }
            this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(songToPlay, () => {
                this.activeSound.playing = false
            })
            this.activeSound.playing = true
        }
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
                if (this.phase === 'playing') {
                    p.makePlay()
                }
            } else {
                p.activePlayer = false
            }
            p.update()
        })

        this.dealer.update()
        this.dealer.activePlayer = this.currentPlayer >= this.players.length
        if (this.dealer.activePlayer && this.phase === 'playing') {
            this.dealer.makePlay()
        }

        this.cameraZoomButton.update()

        if (this.phase === 'betting') {
            this.takeBetButton.update()
        }

        if (this.phase === 'dealing') {
            this.dealButton.update()
            this.sneakDealButton.update()
        } else {
            this.dealButton.hovered = false
            this.sneakDealButton.hovered = false
        }

        if (this.phase === 'playing') {
            // this.askPlayerButton.update()
            const currentPlayer = this.getActivePlayer()
            if (currentPlayer.nextMove === 'hit') {
                this.hitButton.update()
                this.sneakHitButton.update()
            } else {
                this.hitButton.hovered = false
                this.sneakHitButton.hovered = false
            }
            if (currentPlayer.nextMove === 'stand') {
                this.standButton.update()
            }
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

        const activePlayer = this.getActivePlayer()
        if (activePlayer) {
            this.followCam.setTarget(activePlayer)
        }

        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    onResize() {
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10

        this.dealButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.dealButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight * 2

        this.sneakDealButton.x = this.gameRef.gameWidth / 2 - this.sneakDealButton.width / 2
        this.sneakDealButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2

        this.takeBetButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.takeBetButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2

        this.standButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.standButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2

        this.hitButton.x = this.gameRef.gameWidth / 2 - this.buttonWidth / 2
        this.hitButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight * 2

        this.sneakHitButton.x = this.gameRef.gameWidth / 2 - this.sneakHitButton.width / 2
        this.sneakHitButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2

        this.endRoundButton.x = this.gameRef.gameWidth / 2 - this.endRoundButton.width / 2
        this.endRoundButton.y = this.gameRef.gameHeight - 120 - this.buttonHeight / 2

    }

    draw(): void {
        const activePlayer = this.getActivePlayer()

        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = BG_COLOR
        this.gameRef.ctx.fill()

        // draw the level
        // level bg
        // drawBox({
        //     c: this.gameRef.ctx,
        //     x: 0 + this.gameRef.cameraPos.x,
        //     y: 0 + this.gameRef.cameraPos.y,
        //     width: this.levelWidth * this.gameRef.cameraZoom,
        //     height: this.levelHeight * this.gameRef.cameraZoom,
        //     fillColor: '#0c6640' // '#777'
        // })

        if (!this.textBox.active) {
            // HOUSE FUNDS
            drawText({
                c: this.gameRef.ctx,
                x: this.gameRef.gameWidth / 2,
                y: 40,
                text: `House Funds:`,
                fontSize: 20,
                fontFamily: 'Arial',
                fillColor: '#fff',
                align: 'center',
                // strokeColor: '#000',
                // strokeWidth: 2,
            })
            drawText({
                c: this.gameRef.ctx,
                x: this.gameRef.gameWidth / 2,
                y: 80,
                text: `${this.dealer.funds < 0 ? '-' : ''}$${Math.abs(this.dealer.funds)}`,
                fontSize: 32,
                fontFamily: 'Arial',
                fillColor: '#fff',
                align: 'center',
                // strokeColor: '#000',
                // strokeWidth: 2,
            })
        }

        // sneak card
        const lastCard = this.deck[0]
        if (lastCard && this.phase !== 'betting' && activePlayer?.nextMove !== 'stand') {
            // drawText({
            //     c: this.gameRef.ctx,
            //     x: 40,
            //     y: 120,
            //     text: `Sneak Card: `,
            //     fontSize: 20,
            //     fontFamily: 'Arial',
            //     fillColor: '#fff',
            //     align: 'left',
            //     strokeColor: '#000',
            //     strokeWidth: 2,
            // })
            // drawText({
            //     c: this.gameRef.ctx,
            //     x: this.gameRef.gameWidth / 2,
            //     y: this.gameRef.gameHeight - 50,
            //     align: 'center',
            //     fontSize: 30,
            //     fontFamily: 'Arial',
            //     fillColor: lastCard.color,
            //     // fillColor: '#fff',
            //     text: `${lastCard.letter} ${lastCard.symbol}`,
            //     strokeWidth: 2 * this.gameRef.cameraZoom,
            //     strokeColor: '#fff'
            // })
            this.drawSneakCard(lastCard)

            // suspicion value
            this.drawSuspicionMeter()
        } else {
            // remaining rounds text
            drawText({
                c: this.gameRef.ctx,
                x: 10,
                y: this.gameRef.gameHeight - 40,
                fontSize: 20,
                fontFamily: 'Arial',
                fillColor: '#fff',
                align: 'left',
                text: `ROUNDS: ${this.remainingGames}`,
            })
        }

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
            this.sneakDealButton.draw()
        }

        if (this.phase === 'playing') {
            // if (activePlayer.nextMove === '') {
            // this.askPlayerButton.draw()
            // }
            if (activePlayer.nextMove === 'hit') {
                this.hitButton.draw()
                this.sneakHitButton.draw()
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

    drawSneakCard(card: any) {

        const cardX = this.gameRef.gameWidth / 2 + 100
        const cardY = this.gameRef.gameHeight - 220

        // BACK OF CARDS
        drawBox({
            c: this.gameRef.ctx,
            x: this.gameRef.gameWidth / 2 - 175,
            y: cardY,
            width: 75,
            height: 100,
            fillColor: 'blue',
            borderRadius: 5,
            strokeColor: this.dealButton.hovered || this.hitButton.hovered ? 'orange' : '#fff',
            strokeWidth: 5,
        })

        drawText({
            c: this.gameRef.ctx,
            x: cardX + 37,
            y: cardY + 120,
            align: 'center',
            fontSize: 16,
            fontFamily: 'Arial',
            fillColor: '#fff',
            text: `SNEAK`,
        })

        drawBox({
            c: this.gameRef.ctx,
            x: cardX,
            y: cardY,
            width: 75,
            height: 100,
            fillColor: '#fff',
            borderRadius: 5,
            strokeColor: this.sneakHitButton.hovered || this.sneakDealButton.hovered ? 'orange' : '#fff',
            strokeWidth: 5,
        })

        drawText({
            c: this.gameRef.ctx,
            x: cardX + 10,
            y: cardY + 35,
            align: 'left',
            fontSize: 36,
            fontFamily: 'Arial',
            fillColor: card.color,
            text: `${card.letter}`,
        })

        drawText({
            c: this.gameRef.ctx,
            x: cardX + 65,
            y: cardY + 85,
            align: 'right',
            fontSize: 45,
            fontFamily: 'Arial',
            fillColor: card.color,
            text: `${card.symbol}`,
        })
    }

    drawSuspicionMeter() {
        drawText({
            c: this.gameRef.ctx,
            x: 10,
            y: this.gameRef.gameHeight - 40,
            text: `SNEAK RISK:`,
            fontSize: 20,
            fontFamily: 'Arial',
            fillColor: '#fff',
            align: 'left',
        })
        drawBox({
            c: this.gameRef.ctx,
            x: 10,
            y: this.gameRef.gameHeight - 30,
            width: 150,
            height: 20,
            fillColor: '#000'
        })
        drawBox({
            c: this.gameRef.ctx,
            x: 10,
            y: this.gameRef.gameHeight - 30,
            width: 150 * (this.suspicionMeter <= this.maxSuspicion ? this.suspicionMeter / this.maxSuspicion : 1),
            height: 20,
            fillColor: '#f00'
        })
    }

    tearDown(): void {
        if (this.activeSound.playing && this.activeSound.soundRef) {
            this.activeSound.soundRef.stop()
        }
    }
} 