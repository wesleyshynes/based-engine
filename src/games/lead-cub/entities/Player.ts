import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class Player extends PhysBox {

    width: number = 50
    height: number = 50
    color: string = 'red'

    speed: number = 10

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
        // this.color = this.groundCount > 0 ? 'blue' : 'red'
        this.drawPhysicsBody()
    }

    tearDown() { }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        // let moveY = 0

        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= this.speed
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += this.speed
        }
        // if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
        //   moveY += speedFactor
        // }

        if (pressedKeys['KeyX']) {
            moveX *= 1.5
         }


        if (this.lastJump + this.jumpDiff < this.gameRef.lastUpdate) {
            Physics.Body.setVelocity(this.body, {
                y: this.body.velocity.y,
                x: moveX
            })
        }

        if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp']) ) {
           this.jump({})
        } else if ( (this.groundCount > 0 && this.lastGround && this.lastGround.options.tags.bouncePad)) {
            this.jump({
                keepLastGround: true
            })
        } else if (this.body.velocity.y < -2 && !(this.lastGround && this.lastGround.options.tags.bouncePad)) {
            Physics.Body.setVelocity(this.body, {
                y: this.body.velocity.y/2,
                x: moveX
            })
        }

    }


    jump(jumpOptions: any) {
        if (
            this.groundCount > 0 &&
            this.body.velocity.y >= -0.0001 &&
            this.lastJump + this.jumpDiff < this.gameRef.lastUpdate
        ) {
            // let moveX = 0
            if (this.lastGround && this.lastGround.options.tags.terrain) {
                const lg = this.lastGround
                if (
                    this.body.position.y < lg.y + lg.height/2 &&
                    this.body.position.y > lg.y - lg.height/2
                ) {
                    Physics.Body.setVelocity(this.body, {
                        y: this.body.velocity.y,
                        x: this.body.position.x < lg.x ? -15 : 15
                    })
                }
            }

            Physics.Body.setVelocity(this.body, {
                y: -40,
                x: this.body.velocity.x
            })
            this.lastJump = this.gameRef.lastUpdate
            if(!jumpOptions.keepLastGround) {
                this.lastGround = null
            }
        }
    }




}