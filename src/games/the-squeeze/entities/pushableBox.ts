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

    bodyOptions = {
        label: `pushBox`,
        inertia: Infinity,
        density: 5,
        friction: 0.9
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // console.log('pushing box')
                if (otherBody.radius < 40) {
                    Physics.Body.setStatic(this.body, true)
                    this.options.tags.static = true
                } else if (this.options.tags.static) {
                    Physics.Body.setMass(this.body, 50)
                    Physics.Body.setStatic(this.body, false)
                    this.options.tags.static = false
                }
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // console.log('pushing box')
                if (otherBody.radius < 40) {
                    Physics.Body.setStatic(this.body, true)
                    this.options.tags.static = true
                } else if (this.options.tags.static) {
                    Physics.Body.setMass(this.body, 50)
                    Physics.Body.setStatic(this.body, false)
                    this.options.tags.static = false
                }
            }
        }
    }

    async preload() { }
    initialize() {
        this.initializeBody()
        this.setCenter()
    }
    update() { }
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