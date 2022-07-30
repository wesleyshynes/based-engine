import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class Player extends PhysBox {

    width: number = 50
    height: number = 50
    color: string = 'red'

    lastJump: number = 0
    jumpDiff: number = 100

    lastGround: any;

    groundCount: number = 0

    options = {
        tags: {
            player: true,
        }
    }

    bodyOptions = { label: 'player', inertia: Infinity }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.ground) {
                this.groundCount++
                this.lastGround = otherBody
            }
            if (otherBody.options.tags.death) {
                Physics.Body.setPosition(this.body, { x: 300, y: 300 })
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.ground) {
                this.groundCount--
                if (this.groundCount < 0) {
                    this.groundCount = 0
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
        this.color = this.groundCount > 0 ? 'blue' : 'red'
        this.drawPhysicsBody()
    }

    tearDown() { }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        const speedFactor = 10

        let moveX = 0
        // let moveY = 0

        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= speedFactor
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += speedFactor
        }
        // if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
        //   moveY += speedFactor
        // }
        if (this.lastJump + this.jumpDiff < this.gameRef.lastUpdate) {
            Physics.Body.setVelocity(this.body, {
                y: this.body.velocity.y,
                x: moveX
            })
        }

        if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp'])) {
           this.jump()
        }

    }


    jump() {
        if (
            this.groundCount > 0 &&
            this.body.velocity.y >= -0.0001 &&
            this.lastJump + this.jumpDiff < this.gameRef.lastUpdate
        ) {
            // let moveX = 0
            if (this.lastGround) {
                const lgB = this.lastGround
                if (
                    this.body.position.y < lgB.y + lgB.height/2 &&
                    this.body.position.y > lgB.y - lgB.height/2
                ) {
                    Physics.Body.setVelocity(this.body, {
                        y: 0,
                        x: this.body.position.x < lgB.x ? -15 : 15
                    })
                }
            }

            Physics.Body.applyForce(this.body, this.body.position, {
                y: -.4,
                x: 0
            })
            this.lastJump = this.gameRef.lastUpdate
            this.lastGround = null
        }
    }




}