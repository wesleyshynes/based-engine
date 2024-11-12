import { distanceBetween, normalizeVector, radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js'
import MouseBody from '../../../assets/cheese-racer/mouse-body-full.svg'
import { createSprite, drawSVG, rotateDraw } from "../../../engine/libs/drawHelpers";


export class MainPlayer extends PhysBall {
    x: number = 100
    y: number = 100

    color: string = 'white'

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

    mouseSprite: any

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

    async preload() {
        this.mouseSprite = await createSprite({
            c: this.gameRef.ctx,
            sprite: MouseBody,
            sx: 0,
            sy: 0,
            sWidth: 100,
            sHeight: 78,
            // dx: 0,
            // dy: 0,
            // dWidth: 100,
            // dHeight: 78,
            // frame: 0,
            // lastUpdate: 0,
            // updateDiff: 1000 / 60 * 10
        })
    }

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
        // this.drawShadows()
        // this.drawPhysicsBody()
        
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            // a: -this.gameRef.cameraRotation,
            a: radToDeg(this.body.angle),
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
          }, () => {

            rotateDraw({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                a: -this.gameRef.cameraRotation,
                zoom: this.gameRef.cameraZoom
            }, () => {
                rotateDraw({
                    c: this.gameRef.ctx,
                    x: -this.mouseSprite.sWidth / 2 - 12,
                    y: -this.mouseSprite.sHeight / 2 - 20,
                    a: 0,
                    zoom: this.gameRef.cameraZoom
                }, () => {
                    drawSVG(this.mouseSprite, { zoom: this.gameRef.cameraZoom })
                })
            })
    
          })
    }
}