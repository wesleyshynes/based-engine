import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle, drawText } from "../../../engine/libs/drawHelpers";

export class CasinoPlayer extends BasedObject {
    x: number = 0
    y: number = 0
    name: string = 'Casino  Player'
    color: string = 'white'

    headSize: number = 40
    width: number = 100
    height: number = 150

    cards: any[] = []
    handValue: number = 0
    altHandValue: number = 0

    funds: number = 1000
    bet: number = 0

    async preload() {}

    initialize() {
        this.cards = []
        this.handValue = 0
        this.funds = 1000
        this.bet = 0
    }

    addCardToHand(card: any) {
        this.cards.push(card)
        this.handValue = 0
        const altValues: any[] = []
        this.cards.forEach((card: any, idx: number) => {
            this.handValue += card.value
            if(card.altValue > 0) {
                altValues.push(card)
            }
            if(this.handValue > 21 && card.altValue > 0) {
                this.handValue -= card.value
                this.handValue += card.altValue
                altValues.pop()
            }
        })
        while(this.handValue > 21 && altValues.length > 0) {
            const card = altValues.pop()
            this.handValue -= card.value
            this.handValue += card.altValue
        }
    }

    update() {}

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
            fillColor: '#ce192b'
        })

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
                y: (this.y + idx * 20) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                // y: (this.y + this.height/2 + idx * 20 + 40) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
                align: 'center',
                fontSize: 12 * this.gameRef.cameraZoom,
                fontFamily: 'sans-serif',
                fillColor: card.color,
                // fillColor: '#fff',
                text: `${card.letter} ${card.symbol}`
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
    }

    tearDown() {}
}