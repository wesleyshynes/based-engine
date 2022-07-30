import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { firstLevelKillFloor, firstLevelLayout } from "../constants/standardLevelConstants";


export class StandardLevel extends BasedLevel {
    levelWidth: number = 15000
    levelHeight: number = 2000

    followCam: any;

    physics: Physics.Engine;
    lastPhysicsUpdate: number = 0;
    physicsRate: number = 1000 / 60

    player: any;
    playerLastJump: number = 0
    playerJumpDiff: number = 100

    floors: any[] = []
    killFloors: any[] = []

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
                    this.player.options.isGrounded = true
                }
                if(otherBody.options.tags.death) {
                    Physics.Body.setPosition(this.player.body, { x: 300, y: 300 })
                }
            }
        }
        this.player.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags) {
                if (otherBody.options.tags.ground) {
                    this.player.options.isGrounded = false
                }
            }
        }
        this.player.initialize()
        this.addToWorld(this.player.body)


        this.floors = firstLevelLayout.map((obj: any, idx: number) => {
            const tempObj = new PhysBox({
                key: `floor-${idx}`, gameRef: this.gameRef, options: {
                    tags: {
                        ground: true,
                    }
                }
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = obj.color
            tempObj.bodyOptions = { label: `floor`, isStatic: true }
            tempObj.initialize()
            this.addToWorld(tempObj.body)
            return tempObj
        })


        this.killFloors = firstLevelKillFloor.map((obj: any, idx: number) => {
            const tempObj = new PhysBox({
                key: `killFloor-${idx}`, gameRef: this.gameRef, options: {
                    tags: {
                        death: true,
                    }
                }
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = 'red'
            tempObj.bodyOptions = { label: 'killFloor', isStatic: true }
            tempObj.initialize()
            this.addToWorld(tempObj.body)
            return tempObj
        })

        this.exitDoor = new PhysBox({ key: 'exitDoor', gameRef: this.gameRef })
        this.exitDoor.x = 3510
        this.exitDoor.y = 820
        this.exitDoor.width = 100
        this.exitDoor.height = 200
        this.exitDoor.color = 'pink'
        this.exitDoor.bodyOptions = { label: 'exitDoor', isStatic: true, isSensor: true }
        this.exitDoor.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody.options && otherBody.options.tags && otherBody.options.tags.player) {
                this.gameRef.loadLevel('start-screen')
            }
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

        if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp']) && this.player.options.isGrounded) {
            if(this.player.body.velocity.y >= -0.0001 && 
                this.playerLastJump + this.playerJumpDiff < this.gameRef.lastUpdate) {
                Physics.Body.applyForce(this.player.body, this.player.body.position, {
                    y: -.4,
                    x: 0
                })
                this.playerLastJump = this.gameRef.lastUpdate
            }
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
        this.killFloors.forEach(f => {
            f.draw()
        })
        this.exitDoor.draw()
        this.player.color = this.player.options.isGrounded ? 'blue' : 'red'
        this.player.draw()
        this.floors.forEach(f => {
            f.draw()
        })
    }

    tearDown() { }


}