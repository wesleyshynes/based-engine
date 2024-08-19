import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class MovingPlatform extends PhysBox {
    x: number = 0
    y: number = 0

    minX: number = 0
    maxX: number = 300

    minY: number = 0
    maxY: number = 300

    width: number = 100
    height: number = 100

    color: string = 'red'

    xSpeed: number = 5
    ySpeed: number = 5

    // set this value for 1 to make the box actually sticky
    pushMultiplier: number = .95

    xDirection: number = 0
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
    }

    movePlatform() {
        let currentX = this.body.position.x
        let mXTriggered = false
        let currentY = this.body.position.y
        let mYTriggered = false
        if (Math.abs(this.xDirection) > 0) {
            if (this.body.position.x <= this.minX) {
                this.xDirection = 1 * this.xSpeed
                currentX = this.minX
                mXTriggered = true
            }
            if (this.body.position.x >= this.maxX) {
                this.xDirection = -1 * this.xSpeed
                currentX = this.maxX
                mXTriggered = true
            }
        }

        if (Math.abs(this.yDirection) > 0) {
            if (this.body.position.y <= this.minY) {
                this.yDirection = 1 * this.ySpeed
                currentY = this.minY
                mYTriggered = true
            }
            if (this.body.position.y >= this.maxY) {
                this.yDirection = -1 * this.ySpeed
                currentY = this.maxY
                mYTriggered = true
            }
        }


        this.otherBodies.forEach((b: any) => {
            if (!b.options.tags.static) {
                Physics.Body.setPosition(b.body, {
                    x: b.body.position.x + this.xDirection * this.gameRef.diffMulti * (mXTriggered ? -1 : this.pushMultiplier),
                    y: b.body.position.y + this.yDirection * this.gameRef.diffMulti * (mYTriggered ? -1 : this.pushMultiplier)
                })
            }
        })

        Physics.Body.setPosition(this.body, {
            x: currentX + this.xDirection * this.gameRef.diffMulti,
            y: currentY + this.yDirection * this.gameRef.diffMulti
        })
    }


    draw() {
        this.drawPhysicsBody()
    }
    tearDown() { }

}