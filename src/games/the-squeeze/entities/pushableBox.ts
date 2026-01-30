import { drawBox, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

const LIGHT_BROWN = '#d4c9b2'
const MID_BROWN = '#d4bc89'
const HEAVY_BROWN = '#c3aa83'
const BROWN_BORDER = '#a08f73'

export class PushableBox extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 100

    color: string = 'red'
    angle: number = 0

    options = {
        tags: {
            pushBox: true,
            wall: true,
            terrain: true,
            static: false,
        }
    }

    body: any;

    sizeToMove: number = 50

    movingBody: any = false

    bodyOptions = {
        label: `pushBox`,
        inertia: Infinity,
        density: 5,
        friction: 0.9
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (!this.movingBody && otherBody.options.tags.player) {
                // console.log('pushing box')
                if (otherBody.radius < this.sizeToMove) {
                    this.enableStatic()
                } else {
                    this.disableStatic()
                    Physics.Body.setVelocity(this.body, {
                        x: 0,
                        y: 0
                    })
                }
            }

            if (otherBody.options.tags.movingPlatform) {
                this.disableStatic()
                this.movingBody = true
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                this.disableStatic()
                Physics.Body.setVelocity(this.body, {
                    x: 0,
                    y: 0
                })
            }
            if (otherBody.options.tags.movingPlatform) {
                this.movingBody = false
            }
        }
    }

    enableStatic() {
        Physics.Body.setStatic(this.body, true)
        this.options.tags.static = true
    }

    disableStatic() {
        if (this.options.tags.static) {
            Physics.Body.setStatic(this.body, false)
            Physics.Body.setMass(this.body, 50)
            this.options.tags.static = false
        }
    }

    async preload() { }
    initialize() {
        this.color = this.sizeToMove < 41 ? LIGHT_BROWN : this.sizeToMove < 61 ? MID_BROWN : HEAVY_BROWN
        this.initializeBody()
        this.setCenter()
        
        // Apply initial rotation if set
        if (this.angle && this.body) {
            Physics.Body.setAngle(this.body, this.angle * Math.PI / 180)
        }
    }
    update() {
        this.validatePosition()
    }
    draw() {
        // this.drawPhysicsBody()

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.body.angle)
        }, () => {

            const plankWidth = 20

            // base box
            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: BROWN_BORDER,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            // diagonal planks

            let plankCount = 0
            const maxPlankDimension = Math.min(this.width, this.height)
            while (plankWidth * plankCount < maxPlankDimension) {
                drawLine({
                    c: this.gameRef.ctx,
                    x: (-(this.width / 2) + plankWidth * plankCount) * this.gameRef.cameraZoom,
                    y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                    toX: (this.width / 2) * this.gameRef.cameraZoom,
                    toY: ((this.height / 2) - plankWidth * plankCount) * this.gameRef.cameraZoom,
                    strokeColor: BROWN_BORDER,
                    strokeWidth: 2 * this.gameRef.cameraZoom
                })

                drawLine({
                    c: this.gameRef.ctx,
                    x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                    y: (-(this.height / 2) + plankWidth * plankCount) * this.gameRef.cameraZoom,
                    toX: ((this.width / 2) - plankWidth * plankCount) * this.gameRef.cameraZoom,
                    toY: ((this.height / 2)) * this.gameRef.cameraZoom,
                    strokeColor: BROWN_BORDER,
                    strokeWidth: 2 * this.gameRef.cameraZoom
                })

                plankCount++

            }            

            // border planks
            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: plankWidth * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: BROWN_BORDER,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2) + this.height - plankWidth) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: plankWidth * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: BROWN_BORDER,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: plankWidth * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: BROWN_BORDER,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2) + this.width - plankWidth) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: plankWidth * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: BROWN_BORDER,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })
        })
    }

    tearDown() { }

    launch(otherBody: any) {

        const newPos = {
            x: otherBody.body.position.x,
            y: this.body.position.y - this.height / 2 - otherBody.height / 2 - 20
        }
        Physics.Body.setPosition(otherBody.body, newPos)

        Physics.Body.setVelocity(otherBody.body, {
            x: otherBody.body.velocity.x,
            y: -50,
        })
    }


}