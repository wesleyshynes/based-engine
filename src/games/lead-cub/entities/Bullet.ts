import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js';

export class Bullet extends PhysBall {
    x = 0
    y = 0

    lastShot = 0
    shotTime = 1000

    radius: number = 10
    color: string = 'blue'

    bodyOptions = {
        label: 'bullet',
        inertia: Infinity,
        ignoreGravity: true,
        density: 0.0000000001,
    }

    options = {
        tags: {
            bullet: true,
        }
    }

    active = false

    async preload() { }
    initialize() {
        this.initializeBody()
        this.setCenter()

        Physics.Events.on(this.gameRef.physics, 'beforeUpdate', () => {
            const gravity = this.gameRef.physics.world.gravity
            if (this.active) {
                Physics.Body.applyForce(this.body, this.body.position, {
                    x: 0,
                    y: -gravity.y * gravity.scale * this.body.mass
                });
            }
        })
    }
    update() { }
    draw() {
        this.drawPhysicsBody()
    }
    tearDown() { }

} 