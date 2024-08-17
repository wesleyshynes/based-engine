import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class MovingPlatform extends PhysBox {
    x: number = 0
    y: number = 0

    minX: number = 0
    maxX: number = 300

    width: number = 100
    height: number = 100

    color: string = 'red'

    xSpeed: number = 3

    xDirection: number = 1
    yDirection: number = 0

    otherBodies: any[] = []

    options = {
        tags: {
            wall: true,
            terrain: true,
            movingPlatform: true
        }
    }

    body: any;

    bodyOptions = {
        label: `movingPlatform`,
        isStatic: true,
        inertia: Infinity,
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player || otherBody.options.tags.pushBox) {
                this.otherBodies.push(otherBody)
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player || otherBody.options.tags.pushBox) {
                this.otherBodies = this.otherBodies.filter(b => b.objectKey !== otherBody.objectKey)
            }
        }
    }

    async preload() { }
    initialize() {
        this.xDirection *= this.xSpeed
        this.yDirection *= this.xSpeed
        this.initializeBody()
        this.setCenter()
    }
    update() {
        this.movePlatform()
        this.otherBodies.forEach((b: any) => {
            if(!b.options.tags.static) {
                Physics.Body.setPosition(b.body, {
                    x: b.body.position.x + this.xDirection * this.gameRef.diffMulti,
                    y: b.body.position.y + this.yDirection * this.gameRef.diffMulti
                })
            }
        })
    }

    movePlatform() {
        if (this.body.position.x < this.minX) {
            this.xDirection = 1 * this.xSpeed
        }
        if (this.body.position.x > this.maxX) {
            this.xDirection = -1 * this.xSpeed
        }
        Physics.Body.setPosition(this.body, {
            x: this.body.position.x + this.xDirection * this.gameRef.diffMulti,
            y: this.body.position.y
        })
    }


    draw() {
        this.drawPhysicsBody()
    }
    tearDown() { }

}