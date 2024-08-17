import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class PushableBox extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 100

    color: string = 'red'

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
            if(otherBody.options.tags.movingPlatform) {
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
        this.initializeBody()
        this.setCenter()
    }
    update() {
        this.validatePosition()
    }
    draw() {
        this.drawPhysicsBody()
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