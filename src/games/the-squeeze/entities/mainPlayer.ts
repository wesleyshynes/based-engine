import { normalizeVector } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js'

export class MainPlayer extends PhysBall {
    x: number = 100
    y: number = 100

    color: string = 'white'

    originalRadius: number = 50
    activeMaxRadius: number = 100
    maxRadius: number = 100
    radius: number = 50
    minRadius: number = 25
    sizeSpeed: number = .05

    baseSpeed: number = 12

    wallCount: number = 0

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

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            // console.log('collision start', otherBody)
            if (otherBody.options.tags.wall) {
                this.wallCount++
                if (this.wallCount > 1) {
                    this.maxRadius = this.radius
                } else {
                    this.maxRadius = this.activeMaxRadius
                }
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.wall) {
                this.wallCount--
                if (this.wallCount < 0) {
                    this.wallCount = 0
                }
                if (this.wallCount === 0) {
                    this.maxRadius = this.activeMaxRadius
                }
            }
        }
    }

    async preload() { }

    initialize() {
        this.initializeBody()
        this.setCenter()
    }

    update() {
        this.handleKeys()
    }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        let moveY = 0

        let scale = 1

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

        if (pressedKeys['KeyX'] && this.wallCount < 2) {
            scale += this.sizeSpeed
        }

        if (pressedKeys['KeyZ']) {
            scale -= this.sizeSpeed
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

        if (scale > 1) {
            if (this.radius < this.maxRadius - 1) {
                if (this.radius * scale < this.maxRadius) {
                    Physics.Body.scale(this.body, scale, scale)
                    this.radius *= scale
                } else if (this.radius != this.maxRadius) {
                    Physics.Body.scale(this.body, this.maxRadius / this.radius, this.maxRadius / this.radius)
                    this.radius = this.maxRadius
                }
            }
        } else if (scale < 1) {
            if (this.radius * scale > this.minRadius) {
                Physics.Body.scale(this.body, scale, scale)
                this.radius *= scale
            } else if (this.radius != this.minRadius) {
                Physics.Body.scale(this.body, this.minRadius / this.radius, this.minRadius / this.radius)
                this.radius = this.minRadius
            }
        } else if (this.radius != this.originalRadius) {
            scale = this.radius > this.originalRadius ? 1 - this.sizeSpeed : this.wallCount < 2 ? 1 + this.sizeSpeed : 1
            const radiusScale = Math.abs((this.radius - this.originalRadius) / this.originalRadius)
            if (radiusScale > this.sizeSpeed * 1.2) {
                // if (this.radius != this.originalRadius) {
                Physics.Body.scale(this.body, scale, scale)
                this.radius *= scale
            } else {
                Physics.Body.scale(this.body, this.originalRadius / this.radius, this.originalRadius / this.radius)
                this.radius = this.originalRadius
            }
        }

        // this.scaled = false
    }

    draw() {

        this.drawPhysicsBody()

        // draw body
        // drawCircle({
        //     c: this.gameRef.ctx,
        //     x: this.x * this.gameRef.cameraZoom,
        //     y: this.y * this.gameRef.cameraZoom,
        //     radius: this.radius * this.gameRef.cameraZoom,
        //     fillColor: this.color,
        //     // strokeStyle: 'black',
        //     // lineWidth: 2,
        // })
    }
}