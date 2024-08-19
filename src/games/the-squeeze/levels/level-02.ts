import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { MainPlayer } from "../entities/mainPlayer";
import { PushableBox } from "../entities/pushableBox";
import { ExitDoor } from "../entities/exitDoor";
import { LEVEL_02_BOUNDARIES, LEVEL_02_PUSH_BOXES, LEVEL_02_WALLS } from "../constants/level02Constants";
import { LevelWall } from "../entities/levelWall";

// const FILL_COLOR = '#81B622'
// const HOVER_COLOR = '#ECF87F'
// const ALT_FILL_COLOR = '#59981A'
// const TEXT_COLOR = '#FFFFFF'
// const TEXT_HOVER_COLOR = '#000000'
const BG_COLOR = 'black'

export class Level02 extends BasedLevel {

    physics: any

    levelWidth: number = 800
    levelHeight: number = 600

    buttonWidth: number = 160
    buttonHeight: number = 50
    buttonFontSize: number = 22

    // Camera related stuff
    miniMapActive: boolean = false
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    // Game related stuff
    gameState: string = 'active'

    mainPlayer: any

    levelWalls: any[] = []
    pushBoxes: any[] = []
    exitDoors: any[] = []

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
        this.followCam.cameraSpeed = 50
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
        })
        this.mainPlayer.x = 64
        this.mainPlayer.y = 535
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)

        this.setupWalls()
        this.setupPushBoxes()
        this.setupExitDoors()

        // BEGIN
        this.onResize()
        this.gameState = 'active'
    }

    handleInput() {
        const pressedKeys = this.gameRef.pressedKeys
        if (pressedKeys['KeyO']) {
            this.resetLevel()
        }
    }

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
        this.handleSounds()
        this.checkGameCondition()
        this.handleInput()

        this.pushBoxes.forEach((box: any) => {
            box.update()
        })

        this.cameraZoomButton.update()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }

    onPhysicsUpdate() {
        // do something on physics tick
        this.updateCamera()
        this.mainPlayer.update()
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
            fillColor: '#777' // '#777'
        })

        this.mainPlayer.drawShadows()


        // draw level walls
        this.levelWalls.forEach((wall: any) => {
            wall.draw()
        })

        // draw push boxes
        this.pushBoxes.forEach((box: any) => {
            box.draw()
        })

        // draw exit doors
        this.exitDoors.forEach((door: any) => {
            door.draw()
        })

        // draw the main player
        this.mainPlayer.draw()

        // draw interface
        this.cameraZoomButton.draw()

    }

    // SETUP FUNCTIONS
    setupWalls() {
        this.levelWalls = [
            ...LEVEL_02_BOUNDARIES,
            ...LEVEL_02_WALLS,
        ].map((obj: any, idx: number) => {
            const tempObj = new LevelWall({
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
    }

    setupPushBoxes() {
        this.pushBoxes = [
            ...LEVEL_02_PUSH_BOXES,
        ].map((obj: any, idx: number) => {
            const tempObj = new PushableBox({
                key: `pushBox-${idx}`,
                gameRef: this.gameRef
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.sizeToMove = obj.sizeToMove
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })
    }

    setupExitDoors() {
        this.exitDoors = [
            // ...LEVEL_01_EXIT_DOORS,
            {
                x: 730,
                y: 315,
                width: 100,
                height: 100,
                color: 'yellow',
                doorPath: 'level-03'
            }
        ].map((obj: any, idx: number) => {
            const tempObj = new ExitDoor({
                key: `exitDoor-${idx}`, gameRef: this.gameRef, options: {
                    tags: {
                        exitDoor: true,
                    }
                }
            })
            tempObj.x = obj.x
            tempObj.y = obj.y
            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = obj.color
            tempObj.doorPath = obj.doorPath
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })
    }

    tearDown(): void {
        if (this.activeSound.playing && this.activeSound.soundRef) {
            this.activeSound.soundRef.stop()
        }
    }
} 