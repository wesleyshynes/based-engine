import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js';
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";

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
        density: 1,
    }

    options = {
        tags: {
            bullet: true,
        }
    }

    active = false

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags && !otherBody.options.tags.sensor) {
            // this.cleanup()
            delete this.gameRef.ignoreGravity[this.objectKey]
        }
    }

    async preload() { }
    initialize() {
        this.initializeBody()
        this.setCenter()
    }
    update() {
        if (this.gameRef.lastUpdate > this.lastShot + this.shotTime) {
            this.cleanup()
        }
    }
    draw() {
        this.drawPhysicsBody()
    }

    cleanup() {
        this.active = false
        Physics.Body.setVelocity(this.body, { x: 0, y: 0 })
        this.gameRef.removeFromWorld(this.body)
        delete this.gameRef.ignoreGravity[this.objectKey]
    }

    shoot(pos: XYCoordinateType, v: XYCoordinateType) {
        this.active = true
        this.gameRef.ignoreGravity[this.objectKey] = this.body
        Physics.Body.setPosition(this.body, pos)
        Physics.Body.setVelocity(this.body, v)
        this.gameRef.addToWorld(this.body)
        this.lastShot = this.gameRef.lastUpdate
    }

    tearDown() { }

} 