import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle, drawText } from "../../../engine/libs/drawHelpers";
import { calculateHandValue } from "../helpers/cardHelpers";

export class CasinoPlayer extends BasedObject {
    x: number = 0
    y: number = 0
    name: string = 'Casino Player'
    color: string = 'white'
    headColor = '#ce192b'

    headSize: number = 40
    width: number = 100
    height: number = 150

    cards: any[] = []
    handValue: number = 0
    altHandValue: number = 0

    funds: number = 1000
    bet: number = 0

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
    }

    update() {}

    placeBet() {
        this.bet = this.funds > 100 ? 100 : this.funds
        this.funds -= this.bet
    }

    makePlay() {
        if (this.handValue < 17) {
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
            fillColor: this.activePlayer ? 'blue'  : this.headColor
        })

        // draw next move
        if(this.nextMove !== '') {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.y - this.height/2 - this.headSize/2) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 20 * this.gameRef.cameraZoom,
                fontFamily: 'sans-serif',
                fillColor: '#fff',
                text: this.nextMove
            })
        }

        // draw name
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            text: this.name,
            fontSize: 20 * this.gameRef.cameraZoom,
            fillColor: 'white',
            align: 'center',
            fontFamily: 'sans-serif'
        })

        // draw cards 
         this.cards.forEach((card, idx: number) => {
            drawText({
                c: this.gameRef.ctx,
                x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
                y: (this.y - this.height/4 + idx * 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                // y: (this.y + this.height/2 + idx * 20 + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 12 * this.gameRef.cameraZoom,
                fontFamily: 'sans-serif',
                fillColor: card.color,
                // fillColor: '#fff',
                text: `${card.letter} ${card.symbol}`,
                strokeWidth: 3 * this.gameRef.cameraZoom,
                strokeColor: '#fff'
            })
        })

        // draw hand value
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            align: 'center',
            fontSize: 12 * this.gameRef.cameraZoom,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            text: `Val: ${this.handValue > 21 ? 'BUST' : this.handValue}`
        })

        // draw bet
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 60) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            align: 'center',
            fontSize: 12 * this.gameRef.cameraZoom,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            text: `Bet: $${this.bet}`
        })

        // draw funds
        drawText({
            c: this.gameRef.ctx,
            x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.y + this.height/2 + 80) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            align: 'center',
            fontSize: 12 * this.gameRef.cameraZoom,
            fontFamily: 'sans-serif',
            fillColor: '#fff',
            text: `Funds: $${this.funds}`
        })

    }

    tearDown() {}
}