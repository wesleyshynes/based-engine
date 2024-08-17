import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox } from "../../../engine/libs/drawHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import { MainPlayer } from "../entities/mainPlayer";
import Physics from 'matter-js'

// const FILL_COLOR = '#81B622'
// const HOVER_COLOR = '#ECF87F'
// const ALT_FILL_COLOR = '#59981A'
// const TEXT_COLOR = '#FFFFFF'
// const TEXT_HOVER_COLOR = '#000000'
const BG_COLOR = '#3D550C'

export class StandardLevel extends BasedLevel {

    physics: any

    levelWidth: number = 3000
    levelHeight: number = 2000

    buttonWidth: number = 160
    buttonHeight: number = 50
    buttonFontSize: number = 22

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    // Game related stuff
    gameState: string = 'active'
    lastKeyPress: number = 0

    mainPlayer: any

    levelWalls: any[] = []

    pushBoxes: any[] = []

    movingPlatform: any
    movingPlatformDirection: number = 1

    // SOUNDS

    // MUSIC
    activeSound: any = {
        playing: false,
        soundRef: null,
    }
    bgSong: any;

    async preload() { }

    initialize(): void {

        this.gameState = 'loading'

        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = 1
        this.followCam.cameraZoomSpeed = .03
        this.followCam.initialize()

        // setup interface
        this.cameraZoomButton = new BasedButton({ gameRef: this.gameRef, key: 'cameraZoomButton' })
        this.cameraZoomButton.width = 60
        this.cameraZoomButton.height = 40
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10
        this.cameraZoomButton.clickFunction = () => {
            this.miniMapActive = !this.miniMapActive
            this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'
        }
        this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'

        this.mainPlayer = new MainPlayer({
            key: 'mainPlayer',
            gameRef: this.gameRef,
            // x: this.levelWidth / 2,
            // y: this.levelHeight / 2,
            // width: 50,
            // height: 50,
            // color: 'white',
        })
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)

        this.levelWalls = [
            {
                x: 300,
                y: 500,
                width: 500,
                height: 100,
                color: 'blue'
            },
            {
                x: 900,
                y: 500,
                width: 500,
                height: 100,
                color: 'blue'
            },
            {
                x: 300,
                y: 1200,
                width: 500,
                height: 100,
                color: 'blue'
            },
            {
                x: 850,
                y: 1200,
                width: 500,
                height: 100,
                color: 'blue'
            }
        ].map((obj: any, idx: number) => {
            const tempObj = new PhysBox({
                key: `wall-${idx}`, gameRef: this.gameRef, options: {
                    tags: {
                        wall: true,
                        terrain: true,
                    }
                }
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = obj.color
            tempObj.bodyOptions = { label: `wall`, isStatic: true }
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })

        this.pushBoxes = [
            {
                x: 1500,
                y: 200,
                width: 90,
                height: 90,
                color: 'red'
            },
            {
                x: 1200,
                y: 1200,
                width: 90,
                height: 90,
                color: 'red'
            },
        ].map((obj: any, idx: number) => {
            const tempObj = new PhysBox({
                key: `pushBox-${idx}`, gameRef: this.gameRef, options: {
                    tags: {
                        pushBox: true,
                        wall: true,
                        terrain: true,
                    }
                }
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = 'red'
            tempObj.bodyOptions = {
                label: `pushBox`,
                inertia: Infinity,
                density: 5,
                friction: 0.9
            }
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })

        this.movingPlatform = new PhysBox({
            key: `movingPlatform`, gameRef: this.gameRef, options: {
                tags: {
                    wall: true,
                    terrain: true,
                    movingPlatform: true,
                    xDirection: 1,
                }
            }
        })
        this.movingPlatform.x = 1000
        this.movingPlatform.y = 1900
        this.movingPlatform.width = 500
        this.movingPlatform.height = 50
        this.movingPlatform.color = 'purple'
        this.movingPlatform.bodyOptions = {
            label: `movingPlatform`,
            isStatic: true,
            inertia: Infinity,
        }
        this.movingPlatform.initialize()
        this.gameRef.addToWorld(this.movingPlatform.body)


        // BEGIN
        this.onResize()
        this.gameState = 'active'
    }

    handleInput() { }

    checkGameCondition() { }

    handleSounds() {
        if (!this.gameRef.soundPlayer.enabled) { return }
        if (this.activeSound.playing == false) {
            let songToPlay = this.bgSong
            // if (this.snakePlayer.body.length > 7) {
            //     songToPlay = this.epicBgSong
            // }
            // if (this.gameState === 'lose') {
            //     songToPlay = this.loseSong
            // }
            this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(songToPlay, () => {
                this.activeSound.playing = false
            })
            this.activeSound.playing = true
        }
    }

    update(): void {
        // did we win?
        this.handlePhysics()
        this.updateCamera()
        this.handleSounds()
        this.checkGameCondition()
        this.handleInput()
        this.movePlatform()

        this.mainPlayer.update()

        this.cameraZoomButton.update()
    }

    movePlatform() {
        let minX = 150
        let maxX = 1850
        if (this.movingPlatform.body.position.x < minX) {
            this.movingPlatformDirection = 1
        }
        if (this.movingPlatform.body.position.x > maxX) {
            this.movingPlatformDirection = -1
        }
        Physics.Body.setPosition(this.movingPlatform.body, {
            x: this.movingPlatform.body.position.x + this.movingPlatformDirection,
            y: this.movingPlatform.body.position.y
        })
        this.movingPlatform.options.tags.xDirection = this.movingPlatformDirection
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }

    onPhysicsUpdate() {
        // do something on physics tick
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        const activeTarget: any = this.mainPlayer.body.position
        if (activeTarget) {
            this.followCam.setTarget(activeTarget)
        }

        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    onResize() {
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10
    }

    draw(): void {

        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = BG_COLOR
        this.gameRef.ctx.fill()

        // draw the level
        // level bg
        drawBox({
            c: this.gameRef.ctx,
            x: 0 + this.gameRef.cameraPos.x,
            y: 0 + this.gameRef.cameraPos.y,
            width: this.levelWidth * this.gameRef.cameraZoom,
            height: this.levelHeight * this.gameRef.cameraZoom,
            fillColor: '#0c6640' // '#777'
        })

        drawBox({
            c: this.gameRef.ctx,
            x: 200 * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: 400 * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            width: 800 * this.gameRef.cameraZoom,
            height: 800 * this.gameRef.cameraZoom,
            fillColor: 'orange' // '#777'
        })

        // draw the main player
        this.mainPlayer.draw()

        // draw level walls
        this.levelWalls.forEach((wall: any) => {
            wall.draw()
        })

        // draw push boxes
        this.pushBoxes.forEach((box: any) => {
            box.draw()
        })

        // draw moving platform
        this.movingPlatform.draw()


        // draw interface
        this.cameraZoomButton.draw()

    }

    tearDown(): void {
        if (this.activeSound.playing && this.activeSound.soundRef) {
            this.activeSound.soundRef.stop()
        }
    }
} 