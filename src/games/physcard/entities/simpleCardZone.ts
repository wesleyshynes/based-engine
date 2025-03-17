import { drawText } from "../../../engine/libs/drawHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class SimpleCardZone extends PhysBox {

    cardsInZone: any = {}

    width = 120
    height = 170

    color = 'yellow'
    strokeColor = 'red'
    textColor = 'red'
    strokeWidth: number = 0

    options = {
        tags: {
            simpleCardZone: true
        }
    }

    bodyOptions = {
        label: 'simpleCardZone',
        isStatic: true,
        isSensor: true
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
            console.log('collisionStartFn', otherBody.objectKey)
            this.strokeWidth = 5
            this.cardsInZone[otherBody.objectKey] = otherBody
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
            console.log('collisionEndFn', otherBody.objectKey)
            delete this.cardsInZone[otherBody.objectKey]
        }

        if (Object.keys(this.cardsInZone).length === 0) {
            this.strokeWidth = 0
        }
    }

    update() {
        Object.keys(this.cardsInZone).forEach((cardKey: string, idx: number) => {
            const card = this.cardsInZone[cardKey]
            // if(card.targeted) {
            //     return
            // }
            if (card && card.body && card.body.position) {
                card.targetPosition = {
                    x: this.body.position.x + (idx * 5),
                    y: this.body.position.y - (idx * 5)
                }
                card.moveTowardsTarget()
            }
        })
    }

    draw() {
        this.drawPhysicsBody()

        this.cameraDraw(() => {
            drawText({
                c: this.gameRef.ctx,
                x: 0,
                y: this.height / 2 + 20,
                text: Object.keys(this.cardsInZone).length.toString(),
                fontSize: 20,
                fillColor: this.textColor,
                align: 'center',
                fontFamily: 'Arial',
                zoom: this.gameRef.cameraZoom
            })
        })
    }
}