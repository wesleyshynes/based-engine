import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';
import { Bullet } from "./Bullet";

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

    bullets: any = []

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

        this.bullets = []
        const newBullet = new Bullet({
            key: 'bullet1',
            gameRef: this.gameRef,
        }) 
        newBullet.initialize()
        newBullet.body.ignoreGravity = true
        this.bullets.push(newBullet)
    }

    update() {
        // fixes stuck bounce pad
        if (this.groundCount > 0 && this.lastGround && this.lastGround.options.tags.bouncePad) {
            this.jump({
                keepLastGround: true
            })
        }
    }

    draw() {
        // this.color = this.groundCount > 0 ? 'blue' : 'red'
        this.drawPhysicsBody()
        this.bullets.forEach((bullet: any) => {
            if(bullet.active){
                bullet.draw()
            }
        })
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

        if(pressedKeys['KeyN']) {
            this.shootBullet()
        }

        if (pressedKeys['KeyX']) {
            moveX *= 1.5
        }


        if (this.lastJump + this.jumpDiff < this.gameRef.lastUpdate) {
            Physics.Body.setVelocity(this.body, {
                y: this.body.velocity.y,
                x: moveX
            })
        }

        if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp'])) {
            this.jump({})
        } else if (this.body.velocity.y < -2 && !(this.lastGround && this.lastGround.options.tags.bouncePad)) {
            Physics.Body.setVelocity(this.body, {
                y: this.body.velocity.y / 2,
                x: moveX
            })
        }

    }

    shootBullet() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i]
            if (!bullet.active) {
                bullet.active = true
                Physics.Body.setPosition(bullet.body, {
                    x: this.body.position.x + (this.width/2) + 10,
                    y: this.body.position.y - this.height/2
                })
                Physics.Body.setVelocity(bullet.body, {
                    x: 60,
                    y: 0
                })
                this.gameRef.addToWorld(bullet.body)
                break
            }
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
                    this.body.position.y < lg.y + lg.height / 2 &&
                    this.body.position.y > lg.y - lg.height / 2
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
            if (!jumpOptions.keepLastGround) {
                this.lastGround = null
            }
        }
    }




}