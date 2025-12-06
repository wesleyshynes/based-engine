import { drawText } from "../../../engine/libs/drawHelpers";
import { SimpleCardZone } from "./simpleCardZone";

export class BlackJackPlayerZone extends SimpleCardZone {
    zoneText: string = 'Player Zone'

    cardTotal: number = 0

    cardOffset = { x: 5, y: -30 }
    cardOffsetStack = { x: 0, y: -30 }
    cardOffsetSplit = { x: 40, y: 0 }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
            // console.log('collisionStartFn', otherBody.objectKey)
            this.cardsInZone[otherBody.objectKey] = otherBody
            otherBody.faceUp = true
        }

        // if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
        //     this.strokeWidth = 3
        //     this.cardOffset = this.cardOffsetSplit
        //     this.cardPositionOffset = { 
        //         x: (Object.keys(this.cardsInZone).length - 1) * -20, 
        //         y: 0 
        //     }
        // }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
            // console.log('collisionEndFn', otherBody.objectKey)
            delete this.cardsInZone[otherBody.objectKey]
        }


        // if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
        //     this.strokeWidth = 0
        //     this.cardOffset = this.cardOffsetStack
        //     this.cardPositionOffset = { x: 0, y: 0 }
        // }
    }

    update() {
        this.handleCardAlignment()
        this.calculateCardTotal()
    }

    calculateCardTotal() {
        let total = 0
        let aceCount = 0

        Object.keys(this.cardsInZone).forEach((cardKey: string) => {
            const card = this.cardsInZone[cardKey]
            if (card.value === 'A') {
                aceCount += 1
                total += 11
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                total += 10
            } else {
                total += parseInt(card.value)
            }
        })

        // Adjust for aces if total is over 21
        while (total > 21 && aceCount > 0) {
            total -= 10
            aceCount -= 1
        }

        this.cardTotal = total
    }

    draw() {
        this.drawPhysicsBody()

        this.cameraDraw(() => {
            if (this.zoneText) {
                drawText({
                    c: this.gameRef.ctx,
                    x: 0,
                    y: -this.height / 2 - 5,
                    // y: this.height / 2 - 20,
                    text: this.zoneText + ` (Total: ${this.cardTotal})`,
                    fontSize: 20,
                    fillColor: this.textColor,
                    align: 'center',
                    fontFamily: 'Arial',
                    zoom: this.gameRef.cameraZoom
                })
            }

            // drawText({
            //     c: this.gameRef.ctx,
            //     x: 0,
            //     y: this.height / 2 + 20,
            //     // text: Object.keys(this.cardsInZone).length.toString(),
            //     text: `Total: ${this.cardTotal}`,
            //     fontSize: 20,
            //     fillColor: this.textColor,
            //     align: 'center',
            //     fontFamily: 'Arial',
            //     zoom: this.gameRef.cameraZoom
            // })
        })
    }

}