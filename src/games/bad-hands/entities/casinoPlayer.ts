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
    height: number = 175

    cards: any[] = []
    handValue: number = 0
    altHandValue: number = 0

    funds: number = 1000
    bet: number = 0
    betMultiplier: number = 1

    hitTolerance: number = 0

    nextMove: string = ''

    activePlayer: boolean = false

    async preload() {}

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

    update() {}

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
        this.betMultiplier = 1 + getRandomInt(10)/10
    }

    loseBet() {
        this.bet = 0
        this.betMultiplier = getRandomInt(10)/10
    }

    returnBet() {
        this.funds += this.bet
        this.bet = 0
    }

    makePlay() {
        if(this.dealer) {
            if (this.handValue < 17) {
                this.nextMove = 'hit'
            } else {
                this.nextMove = 'stand'
            }
            return
        }

        if (this.handValue  < this.hitTolerance + 11) {
            this.nextMove = 'hit'
        } else {
            this.nextMove = 'stand'
        }
    }

    draw() {

        // draw body
        drawBox({
            c: this.gameRef.ctx,
            x: (this.x - this.width/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y - this.height/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            width: this.width * this.gameRef.cameraZoom,
            height: this.height * this.gameRef.cameraZoom,
            fillColor: this.color,
            borderRadius: [30 * this.gameRef.cameraZoom, 30 * this.gameRef.cameraZoom, 0, 0]
        }) 

        // draw head
        drawCircle({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y - this.height/2 - this.headSize/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            radius: this.headSize * this.gameRef.cameraZoom,
            fillColor: this.activePlayer ? '#D18539'  : this.headColor
        })

        // draw hand value
        if(this.handValue > 0 ) {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.y - this.height/2 - this.headSize/2 + 8) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
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
         this.cards.forEach((card, idx: number) => {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.y - this.height/4 + idx * 24 - 4) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                // y: (this.y + this.height/2 + idx * 20 + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 16 * this.gameRef.cameraZoom,
                fontFamily: 'Arial',
                fillColor: card.color,
                // fillColor: '#fff',
                text: `${card.letter} ${card.symbol}`,
                strokeWidth: 3 * this.gameRef.cameraZoom,
                strokeColor: '#fff'
            })
        })

        // draw name
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
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
                y: (this.y + this.height/2 + 50) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 24 * this.gameRef.cameraZoom,
                fontFamily: 'Arial',
                fillColor: '#fff',
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

    tearDown() {}
}