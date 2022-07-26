import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import { FollowCam } from "../../../engine/cameras/FollowCam";


export class StandardLevel extends BasedLevel {
    levelWidth: number = 1000
    levelHeight: number = 2000

    followCam: any;

    physics: Physics.Engine;
    lastPhysicsUpdate: number = 0;
    physicsRate: number = 1000 / 60

    player: any;
    floor: any;
    exitDoor: any;

    async preload() { }

    initialize() {

        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.cameraSpeed = 50


        this.physics = Physics.Engine.create()
        this.physics.world.gravity.y = 7

        this.player = new PhysBox({
            key: 'player', gameRef: this.gameRef, options: {
                tags: {
                    'player': true,
                },
                isGrounded: false,
            }
        })
        this.player.x = 300
        this.player.y = 300
        this.player.width = 50
        this.player.height = 50
        this.player.color = 'red'
        this.player.bodyOptions = { label: 'player', inertia: Infinity }
        this.player.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags) {
                if (otherBody.options.tags.ground) {
                    this.player.isGrounded = true
                }
            }
        }
        this.player.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags) {
                if (otherBody.options.tags.ground) {
                    this.player.isGrounded = false
                }
            }
        }
        this.player.initialize()
        this.addToWorld(this.player.body)

        this.floor = new PhysBox({
            key: 'floor', gameRef: this.gameRef, options: {
                tags: {
                    ground: true
                }
            }
        })
        this.floor.x = 500
        this.floor.y = 1200
        this.floor.width = 1000
        this.floor.height = 50
        this.floor.color = 'green'
        this.floor.bodyOptions = { label: 'floor', isStatic: true }
        this.floor.initialize()
        this.addToWorld(this.floor.body)

        this.exitDoor = new PhysBox({ key: 'exitDoor', gameRef: this.gameRef })
        this.exitDoor.x = 500
        this.exitDoor.y = 1100
        this.exitDoor.width = 100
        this.exitDoor.height = 200
        this.exitDoor.color = 'blue'
        this.exitDoor.bodyOptions = { label: 'exitDoor', isStatic: true, isSensor: true }
        this.exitDoor.collisionStartFn = (otherBody: any) => {
            console.log(otherBody)
            const otherBodyBased = otherBody.plugin.basedRef()
            console.log(otherBodyBased.color)
        }
        this.exitDoor.initialize()
        this.addToWorld(this.exitDoor.body)

        this.initializePhysicsColliders()

    }

    addToWorld(bodyRef: any) {
        Physics.Composite.add(this.physics.world, bodyRef)
    }

    removeFromWorld(bodyRef: any) {
        Physics.Composite.remove(this.physics.world, bodyRef)
    }

    initializePhysicsColliders() {
        Physics.Events.on(this.physics, 'collisionStart', (event: any) => {
            event.pairs.map((pair: any) => {
                const { bodyA, bodyB } = pair
                bodyA.plugin.collisionStart(bodyB)
                bodyB.plugin.collisionStart(bodyA)
            })
        })
        Physics.Events.on(this.physics, 'collisionEnd', (event: any) => {
            event.pairs.map((pair: any) => {
                const { bodyA, bodyB } = pair
                bodyA.plugin.collisionEnd(bodyB)
                bodyB.plugin.collisionEnd(bodyA)
            })
        })
    }

    handlePhysics() {
        if (this.gameRef.fps < 65) {
            const tick = (this.physicsRate / this.gameRef.updateDiff) * this.gameRef.updateDiff
            Physics.Engine.update(this.physics, tick)
            this.onPhysicsUpdate()
            this.lastPhysicsUpdate = this.gameRef.lastUpdate
        } else {
            if (this.gameRef.lastUpdate - this.lastPhysicsUpdate >= this.physicsRate) {
                Physics.Engine.update(this.physics, this.gameRef.lastUpdate - this.lastPhysicsUpdate)
                this.lastPhysicsUpdate = this.gameRef.lastUpdate
                this.onPhysicsUpdate()
            }
        }
    }

    onPhysicsUpdate() {
        // do something on physics tick
    }

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

        Physics.Body.setVelocity(this.player.body, {
            y: this.player.body.velocity.y,
            x: moveX
        })

        if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp']) && this.player.isGrounded) {
            Physics.Body.applyForce(this.player.body, this.player.body.position, {
                y: -.3,
                x: 0
            } )
        }

    }

    update() {
        this.handleKeys()
        this.handlePhysics()
        this.updateCamera()
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.player.body.position.x,
            y: this.player.body.position.y,
        })
        // this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    onResize() {
        // something on resize
    }

    drawBg() {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#fff'
        this.gameRef.ctx.fill()
    }

    draw() {
        this.drawBg()
        this.exitDoor.draw()
        this.player.draw()
        this.floor.draw()
    }

    tearDown() { }


}