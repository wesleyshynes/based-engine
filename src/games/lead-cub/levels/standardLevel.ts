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


    async preload() { }

    initialize() {

        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.cameraSpeed = 50


        this.physics = Physics.Engine.create()
        // this.physics.world.gravity.y = 0

        this.player = new PhysBox({ key: 'player', gameRef: this.gameRef })
        this.player.x = 300
        this.player.y = 300
        this.player.width = 50
        this.player.height = 50
        this.player.color = 'red'
        this.player.initialize()
        this.addToWorld(this.player.body)

        this.floor = new PhysBox({ key: 'floor', gameRef: this.gameRef })
        this.floor.x = 500
        this.floor.y = 1200
        this.floor.width = 1000
        this.floor.height = 50
        this.floor.color = 'green'
        this.floor.bodyOptions = { label: 'wallBottom', isStatic: true }
        this.floor.initialize()
        this.addToWorld(this.floor.body)

    }

    addToWorld(bodyRef: any) {
        Physics.Composite.add(this.physics.world, bodyRef)
    }

    removeFromWorld(bodyRef: any) {
        Physics.Composite.remove(this.physics.world, bodyRef)
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

    update() {
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
        this.player.draw()
        this.floor.draw()
    }

    tearDown() { }


}