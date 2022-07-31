import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class BouncePad extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 20

    color: string = 'green'

    options = {
        tags: {
            bouncePad: true,
            // ground: true
        }
    }

    bodyOptions = { 
        label: 'bouncePad', 
        inertia: Infinity,
        isStatic: true, 
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // launch up
                this.launch(otherBody)
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // dunno
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
            y: this.body.position.y - this.height/2 - otherBody.height/2 - 3
        }
        Physics.Body.setPosition(otherBody.body, newPos)
        Physics.Body.setVelocity(otherBody.body, {
            x: otherBody.body.velocity.x,
            y: -50,
        })
    }


}