import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle, drawText } from "../../../engine/libs/drawHelpers";
import { getRandomInt } from "../../../engine/libs/mathHelpers";
import { calculateHandValue } from "../helpers/cardHelpers";

export class CasinoPlayer extends BasedObject {
    x: number = 0
    y: number = 0
    name: string = 'Casino Player'
    color: string = 'white'
    headColor = '#ce192b'

    dealer: boolean = false

    headSize: number = 40
    width: number = 100
    height: number = 170

    cards: any[] = []
    handValue: number = 0
    altHandValue: number = 0

    funds: number = 1000
    bet: number = 0
    betMultiplier: number = 1

    hitTolerance: number = 0

    nextMove: string = ''

    activePlayer: boolean = false


    headRadius: number = 3
    headMaxRadius: number = 6
    headMinRadius: number = 1
    headRadiusGrow: number = .2

    async preload() { }

    initialize() {
        this.cards = []
        this.handValue = 0
        this.funds = 1000
        this.bet = 0
        this.nextMove = ''
        this.activePlayer = false
    }

    addCardToHand(card: any) {
        this.cards.push(card)
        this.handValue = calculateHandValue(this.cards)
        this.nextMove = ''
        this.hitTolerance = getRandomInt(10)
    }

    handlePulses() {
        this.headRadius += this.headRadiusGrow * this.gameRef.diffMulti
        if (this.headRadius > this.headMaxRadius) {
            this.headRadius = this.headMaxRadius
            this.headRadiusGrow = -1 * this.headRadiusGrow
        }
        if (this.headRadius < this.headMinRadius) {
            this.headRadius = this.headMinRadius
            this.headRadiusGrow = -1 * this.headRadiusGrow
        }
    }

    update() {
        if (this.activePlayer) {
            this.handlePulses()
        }
    }

    placeBet() {
        // this.bet = this.funds > 100 ? 100 : this.funds
        this.bet = Math.ceil((getRandomInt(100) + 5) * this.betMultiplier)
        if (this.bet <= 5) {
            this.bet = 5
        }
        this.funds -= this.bet
    }

    clearHand() {
        this.cards = []
        this.handValue = 0
        this.nextMove = ''
    }

    winBet() {
        this.funds += this.bet * 2
        this.bet = 0
        this.betMultiplier = 1 + getRandomInt(10) / 10
    }

    loseBet() {
        this.bet = 0
        this.betMultiplier = getRandomInt(10) / 10
    }

    returnBet() {
        this.funds += this.bet
        this.bet = 0
    }

    makePlay() {
        if (this.dealer) {
            if (this.handValue < 17) {
                this.nextMove = 'hit'
            } else {
                this.nextMove = 'stand'
            }
            return
        }

        if (this.handValue < this.hitTolerance + 11) {
            this.nextMove = 'hit'
        } else {
            this.nextMove = 'stand'
        }
    }

    draw() {

        // draw body
        drawBox({
            c: this.gameRef.ctx,
            x: (this.x - this.width / 2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y - this.height / 2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            width: this.width * this.gameRef.cameraZoom,
            height: this.height * this.gameRef.cameraZoom,
            fillColor: this.color,
            borderRadius: [30 * this.gameRef.cameraZoom, 30 * this.gameRef.cameraZoom, 0, 0]
        })
        
        const headCenter = this.y - this.height / 2 - this.headSize / 2 - 10
        // draw head
        drawCircle({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (headCenter) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.headSize * this.gameRef.cameraZoom,
            fillColor: this.activePlayer ? '#D18539' : this.headColor,
            strokeColor: this.activePlayer ? '#D18539' : this.headColor,
            strokeWidth: (this.activePlayer ? this.headRadius : 0) * this.gameRef.cameraZoom
        })

        // draw hand value
        if (this.handValue > 0) {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (headCenter+ 8 ) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 24 * this.gameRef.cameraZoom,
                fontFamily: 'Arial',
                fillColor: '#fff',
                text: `${this.handValue > 21 ? 'BUST' : this.handValue}`
            })
        }


        // draw next move
        // if(this.nextMove !== '') {
        //     drawText({
        //         c: this.gameRef.ctx,
        //         x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        //         y: (this.y - this.height/2 - this.headSize/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //         align: 'center',
        //         fontSize: 20 * this.gameRef.cameraZoom,
        //         fontFamily: 'Arial',
        //         fillColor: '#fff',
        //         text: this.nextMove
        //     })
        // }


        // draw cards 
        this.drawCards()
        // this.cards.forEach((card, idx: number) => {
        //     drawText({
        //         c: this.gameRef.ctx,
        //         x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        //         y: (this.y - this.height / 4 + idx * 24 - 4) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //         // y: (this.y + this.height/2 + idx * 20 + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //         align: 'center',
        //         fontSize: 16 * this.gameRef.cameraZoom,
        //         fontFamily: 'Arial',
        //         fillColor: card.color,
        //         // fillColor: '#fff',
        //         text: `${card.letter} ${card.symbol}`,
        //         strokeWidth: 3 * this.gameRef.cameraZoom,
        //         strokeColor: '#fff'
        //     })
        // })

        // draw name
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height / 2 + 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            text: this.name,
            fontSize: 16 * this.gameRef.cameraZoom,
            fillColor: 'white',
            align: 'center',
            fontFamily: 'Arial'
        })

        // draw bet
        if (!this.dealer && this.bet > 0) {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.y + this.height / 2 - 10) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 24 * this.gameRef.cameraZoom,
                fontFamily: 'Arial',
                fillColor: '#000',
                text: `$${this.bet}`
            })
        }

        // draw info
        // drawText({
        //     c: this.gameRef.ctx,
        //     x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        //     y: (this.y + this.height/2 + 80) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        //     align: 'center',
        //     fontSize: 12 * this.gameRef.cameraZoom,
        //     fontFamily: 'Arial',
        //     fillColor: '#fff',
        //     text: `T: $${this.hitTolerance}`
        // })

    }

    drawCards() {
        const cardWidth = 40
        const cardHeight = 35
        const cardTop = this.y - this.height / 4 - 3
        this.cards.forEach((card, idx: number) => {

            drawBox({
                c: this.gameRef.ctx,
                x: (this.x - cardWidth / 2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (cardTop + idx * 24 - 5 - cardHeight / 2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                width: cardWidth * this.gameRef.cameraZoom,
                height: cardHeight * this.gameRef.cameraZoom,
                fillColor: '#fff',
                strokeColor: '#ccc',
                strokeWidth: 1 * this.gameRef.cameraZoom,
                borderRadius: 5 * this.gameRef.cameraZoom
            })

            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (cardTop + idx * 24 - 4) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 20 * this.gameRef.cameraZoom,
                fontFamily: 'Arial',
                fillColor: card.color,
                // fillColor: '#fff',
                text: `${card.letter} ${card.symbol}`,
                strokeWidth: 3 * this.gameRef.cameraZoom,
                strokeColor: '#fff'
            })
        })
    }

    tearDown() { }
}