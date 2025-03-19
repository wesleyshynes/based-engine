import { drawBox } from '../../../engine/libs/drawHelpers';
import { distanceBetween, normalizeVector } from '../../../engine/libs/mathHelpers';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import Physics from 'matter-js'

export class SimpleCard extends PhysBox {

    width = 100
    height = 150

    color = 'blue'
    faceColor = 'red'
    strokeWidth: number = 1

    bodyOptions = {
        label: 'simpleCard',
        // isStatic: true,
        isSensor: true
    }

    faceUp: boolean = false

    options = {
        tags: {
            simpleCard: true
        }
    }

    targetPosition = {
        x: 0,
        y: 0
    }
    targetThreshold = 5
    baseSpeed = 40

    targeted: boolean = false

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
            this.strokeWidth = 2
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
            this.strokeWidth = 1
        }
    }

    moveTowardsTarget() {
        const distanceToTarget = distanceBetween(this.body.position, this.targetPosition)
        if (distanceToTarget < this.targetThreshold) {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
            return
        }
        const moveX = this.targetPosition.x - this.body.position.x
        const moveY = this.targetPosition.y - this.body.position.y
        const activeSpeed = this.baseSpeed

        if (moveX !== 0 || moveY !== 0) {
            Physics.Body.setVelocity(this.body, normalizeVector({
                y: moveY,
                x: moveX
            },
                // activeSpeed
                distanceToTarget <= activeSpeed ? distanceToTarget : activeSpeed
            ))
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }
    }

    draw() {
        this.cameraDraw(() => {
            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2) - this.bodyCenter.x),
                y: (-(this.height / 2) - this.bodyCenter.y),
                width: this.width,
                height: this.height,
                fillColor: this.faceUp ? this.faceColor : this.color,
                strokeColor: this.strokeColor,
                strokeWidth: this.strokeWidth,
                zoom: this.gameRef.cameraZoom
            })
        })
    }

}