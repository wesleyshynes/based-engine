import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class SimpleCardZone extends PhysBox {

    cardsInZone: any = {}

    width = 120
    height = 170

    color = 'yellow'
    strokeColor = 'red'
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
            this.strokeWidth = 5
            this.cardsInZone[otherBody.objectKey] = otherBody
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
            delete this.cardsInZone[otherBody.objectKey]
        }

        if(Object.keys(this.cardsInZone).length === 0) {
            this.strokeWidth = 0
        }
    }
}