import { distanceBetween, normalizeVector, radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js'

export class MainPlayer extends PhysBall {
    x: number = 100
    y: number = 100

    color: string = 'pink'

    radius: number = 50

    baseSpeed: number = 8

    options = {
        tags: {
            player: true,
        }
    }

    collisionGroup: any = Physics.Body.nextGroup(true)

    bodyOptions = {
        label: 'player',
        inertia: Infinity,
        collisionFilter: { group: this.collisionGroup },
        // friction: 0,
    }

    targetPosition: XYCoordinateType = {
        x: 0,
        y: 0
    }
    targetThreshold: number = 5

    // mouseSprite: any

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            // console.log('collision start', otherBody)
            if (otherBody.options.tags.wall) {
                console.log('wall collision')
            }
            // this.gameRef.shakeCamera(5 * (this.radius / this.originalRadius))

        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.wall) {
                console.log('wall collision end')
            }
        }
    }

    async preload() { }

    initialize() {
        this.initializeBody()
        this.setCenter()
    }

    update() {
        // this.handleKeys()
        // this.validatePosition()
        this.moveTowardsTarget()
    }

    setTargetPosition(target: XYCoordinateType) {
        this.targetPosition = target
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
            }, activeSpeed))
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }
    }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        let moveY = 0

        const activeSpeed = this.baseSpeed

        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= activeSpeed
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += activeSpeed
        }
        if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
            moveY -= activeSpeed
        }
        if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
            moveY += activeSpeed
        }


        if (moveX !== 0 || moveY !== 0) {
            Physics.Body.setVelocity(this.body, normalizeVector({
                y: moveY,
                x: moveX
            }, activeSpeed))
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }
    }

    draw() {
        this.drawShadows()
        this.drawPhysicsBody()
    }
}