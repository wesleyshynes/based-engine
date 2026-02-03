import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js';

const LIGHT_BLUE = '#88bbff'
const MID_BLUE = '#4488ff'
const HEAVY_BLUE = '#2266dd'
const BLUE_BORDER = '#1144aa'

export class BounceBall extends PhysBall {
    x: number = 0
    y: number = 0

    radius: number = 45

    color: string = MID_BLUE
    strokeColor: string = BLUE_BORDER

    options = {
        tags: {
            bounceBall: true,
            pushBox: true, // Keep this for compatibility with moving platforms
            wall: true,
            terrain: true,
            static: false,
        }
    }

    body: any;

    sizeToMove: number = 50

    movingBody: any = false

    bodyOptions = {
        label: `bounceBall`,
        // inertia: Infinity,
        density: 5,
        friction: 0.9,
        restitution: 0.6  // More bouncy than regular push boxes
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (!this.movingBody && otherBody.options.tags.player) {
                if (otherBody.radius < this.sizeToMove) {
                    this.enableStatic()
                } else {
                    this.disableStatic()
                    // Physics.Body.setVelocity(this.body, {
                    //     x: 0,
                    //     y: 0
                    // })
                    // get a bounce effect when the player hits the ball
                    const velocity = otherBody.body.velocity
                    Physics.Body.setVelocity(this.body, {
                        x: velocity.x * 1.05,
                        y: velocity.y * 1.05
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
                // Physics.Body.setVelocity(this.body, {
                //     x: 0,
                //     y: 0
                // })
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
        super.initialize()
        this.color = this.sizeToMove < 41 ? LIGHT_BLUE : this.sizeToMove < 61 ? MID_BLUE : HEAVY_BLUE
    }
    
    update() {
        this.validatePosition()
    }
    
    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: radToDeg(this.body.angle),
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {
            // Main ball
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: this.radius,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 3,
                zoom: this.gameRef.cameraZoom,
            })

            // Inner highlight circle
            drawCircle({
                c: this.gameRef.ctx,
                x: -this.radius * 0.25,
                y: -this.radius * 0.25,
                radius: this.radius * 0.35,
                fillColor: 'rgba(255, 255, 255, 0.3)',
                zoom: this.gameRef.cameraZoom,
            })

            // Inner shadow
            drawCircle({
                c: this.gameRef.ctx,
                x: this.radius * 0.15,
                y: this.radius * 0.15,
                radius: this.radius * 0.5,
                fillColor: 'rgba(0, 0, 0, 0.15)',
                zoom: this.gameRef.cameraZoom,
            })

            // Center decorative ring
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: this.radius * 0.6,
                strokeColor: this.strokeColor,
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })
        })
    }

    tearDown() { }
}
