import { BasedLevel } from "../../../engine/BasedLevel";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { firstLevelBouncePads, firstLevelKillFloor, firstLevelLayout } from "../constants/standardLevelConstants";
import { Player } from "../entities/Player";
import { BouncePad } from "../entities/BouncePad";


export class StandardLevel extends BasedLevel {
    levelWidth: number = 15000
    levelHeight: number = 2000

    followCam: any;

    player: any;
    playerLastJump: number = 0
    playerJumpDiff: number = 100

    floors: any[] = []
    bouncePads: any[] = []
    killFloors: any[] = []

    exitDoor: any;

    async preload() { }

    initialize() {

        this.gameRef.cameraZoom = 1

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.cameraSpeed = 50
        this.followCam.zoomSetting = 0.5

        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 7

        this.player = new Player({ key: 'player', gameRef: this.gameRef })
        this.player.x = 300
        this.player.y = 300
        this.player.color = 'red'
        this.player.initialize()
        this.gameRef.addToWorld(this.player.body)


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
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })

        this.bouncePads = firstLevelBouncePads.map((obj: any, idx: number) => {
            const tempObj = new BouncePad({ key: `bouncePad-${idx}`, gameRef: this.gameRef })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = obj.color
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
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
            this.gameRef.addToWorld(tempObj.body)
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
            console.log('door collision')
            const otherBody = o.plugin.basedRef()
            if (otherBody.options && otherBody.options.tags && otherBody.options.tags.player) {
                this.gameRef.loadLevel('start-screen')
            }
        }
        this.exitDoor.initialize()
        this.gameRef.addToWorld(this.exitDoor.body)
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }

    onPhysicsUpdate() {
        // do something on physics tick
    }

    handleKeys() {
        this.player.handleKeys()
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
        this.player.draw()
        this.floors.forEach(f => {
            f.draw()
        })
        this.bouncePads.forEach(f => {
            f.draw()
        })
    }

    tearDown() { }


}