import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';
import { Bullet } from "./Bullet";
import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class Player extends PhysBox {

    width: number = 50
    height: number = 50
    color: string = 'red'

    speed: number = 10

    lastJump: number = 0
    jumpDiff: number = 100

    lastGround: any;
    facing: number = 1

    groundCount: number = 0

    collisionGroup: any = Physics.Body.nextGroup(true)

    options = {
        tags: {
            player: true,
        }
    }

    bodyOptions = {
        label: 'player',
        inertia: Infinity,
        collisionFilter: { group: this.collisionGroup },
    }

    bullets: any = []
    lastShot: number = 0
    shotDelay: number = 300

    arm: any;
    armFlip: number = 1
    armLength: number = 100
    armHeight: number = 20
    armAngle: number = 0

    compositeRef: any;

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.ground) {
                this.groundCount++
                this.lastGround = otherBody
                console.log('last ground', this.lastGround)
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

        this.bullets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map((x: string) => {
            const newBullet = new Bullet({
                key: `player-bullet-${x}`,
                gameRef: this.gameRef,
            })
            newBullet.initialize()
            // this.bullets.push(newBullet)
            return newBullet
        })

        this.arm = Physics.Bodies.rectangle(this.x + 80, this.y, this.armLength, this.armHeight, {
            label: 'arm',
            isSensor: false,
            collisionFilter: { group: this.collisionGroup },
            // inertia: Infinity,
            density: 0.001,
            // density: 0.00000000001,
            plugin: {
                collisionStart: (o: any) => {
                    const otherBody = o.plugin.basedRef()
                    if (otherBody && otherBody.options && otherBody.options.tags) {
                        if (otherBody.options.tags.ground) {
                            this.armFlip *= -1                             
                        }
                    }
                },
                collisionEnd: (x: any) => { },
                basedRef: () => ({
                    options: {
                        tags: {
                            limb: true,
                            melee: true,
                        }
                    }
                })
            }
        })

        this.initializeBody()
        this.setCenter()

        this.compositeRef = Physics.Composite.create({ label: 'playerComposite' })
        Physics.Composite.add(this.compositeRef, this.body)
        Physics.Composite.add(this.compositeRef, this.arm)

        const armMount = Physics.Constraint.create({
            bodyA: this.body,
            bodyB: this.arm,
            pointA: { x: 20, y: 0 },
            pointB: { x: -50, y: 0 },
            length: 0,
            stiffness: 1,
        })

        Physics.Composite.add(this.compositeRef, armMount)

    }

    update() {
        // fixes stuck bounce pad
        if (this.groundCount > 0 && this.lastGround && this.lastGround.options.tags.bouncePad) {
            this.jump({
                keepLastGround: true
            })
        }
        this.bullets.forEach((x: any) => {
            x.update()
        })

        Physics.Body.setAngularVelocity(this.arm, 0.5 * this.facing * this.armFlip)
        // Physics.Body.setAngle(this.arm, this.armAngle)
        // this.armAngle+=.03
        // if (this.armAngle > 360) {
        //     this.armAngle = 0
        // }
    }

    draw() {
        // this.color = this.groundCount > 0 ? 'blue' : 'red'
        this.drawPhysicsBody()
        this.bullets.forEach((bullet: any) => {
            if (bullet.active) {
                bullet.draw()
            }
        })

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.arm.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.arm.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.arm.angle)
          }, () => {
      
            drawBox({
              c: this.gameRef.ctx,
              x: (-(this.armLength/2) - this.bodyCenter.x) * this.gameRef.cameraZoom,
              y: (-(this.armHeight/2) - this.bodyCenter.y) * this.gameRef.cameraZoom,
              width: this.armLength * this.gameRef.cameraZoom,
              height: this.armHeight * this.gameRef.cameraZoom,
              fillColor: 'blue',
            })
          })
    }

    tearDown() { }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        if (this.lastGround?.lastVelocity) {
            if (this.lastGround.body.position.y > this.body.position.y) {
                moveX = this.lastGround.lastVelocity.x
            }
        }
        // let moveY = 0

        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= this.speed
            this.facing = -1
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += this.speed
            this.facing = 1
        }
        // if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
        //   moveY += speedFactor
        // }

        if (pressedKeys['KeyN']) {
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
        if (this.gameRef.lastUpdate < this.lastShot + this.shotDelay) {
            return
        }
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i]
            if (!bullet.active) {
                bullet.shoot(
                    {
                        x: this.body.position.x + ((this.width / 2) + bullet.radius + 2) * this.facing,
                        y: this.body.position.y
                    },
                    {
                        x: 60 * this.facing,
                        y: 0
                    }
                )
                this.lastShot = this.gameRef.lastUpdate
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