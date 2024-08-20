import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { MainPlayer } from "../entities/mainPlayer";
import { PushableBox } from "../entities/pushableBox";
import { ExitDoor } from "../entities/exitDoor";
import { LevelWall } from "../entities/levelWall";
import { TouchKnob } from "../../../engine/controls/TouchKnob";
import { MovingPlatform } from "../entities/movingPlatform";

import WallThud1 from '../../../assets/the-squeeze/387478__cosmicembers__dart-thud-1.mp3'
import WallThud2 from '../../../assets/the-squeeze/387480__cosmicembers__dart-thud-2.mp3'
import WallThud3 from '../../../assets/the-squeeze/387479__cosmicembers__dart-thud-3.mp3'

import Walking1 from '../../../assets/the-squeeze/walking_1.mp3'
import Walking2 from '../../../assets/the-squeeze/walking_2.mp3'
import Walking3 from '../../../assets/the-squeeze/walking_3.mp3'
import Walking4 from '../../../assets/the-squeeze/walking_4.mp3'
import Walking5 from '../../../assets/the-squeeze/walking_5.mp3'
import Walking6 from '../../../assets/the-squeeze/walking_6.mp3'
import Walking7 from '../../../assets/the-squeeze/walking_7.mp3'
import Walking8 from '../../../assets/the-squeeze/walking_8.mp3'

import BoxThud1 from '../../../assets/the-squeeze/box_thud1.mp3'
import BoxThud2 from '../../../assets/the-squeeze/box_thud2.mp3'
import BoxThud3 from '../../../assets/the-squeeze/box_thud3.mp3'

import RunningStairs from '../../../assets/the-squeeze/running_stairs.mp3'

import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'

// const FILL_COLOR = '#81B622'
// const HOVER_COLOR = '#ECF87F'
// const ALT_FILL_COLOR = '#59981A'
// const TEXT_COLOR = '#FFFFFF'
// const TEXT_HOVER_COLOR = '#000000'
const BG_COLOR = 'black'

export class SqueezeBaseLevel extends BasedLevel {

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
    moveKnob: any;
    shrinkButton: any;
    growButton: any;
    nextLevelButton: any;
    resetButton: any;

    // Game related stuff
    gameState: string = 'active'

    mainPlayer: any
    
    nextLevel: string = 'standard-level'
    
    playerStartPosition: any = { x: 100, y: 100 }
    levelWalls: any[] = []
    _levelBoundaries: any[] = []
    _levelWalls: any[] = []
    pushBoxes: any[] = []
    _pushBoxes: any[] = []
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = []
    exitDoors: any[] = []
    _exitDoors: any[] = []

    // SOUNDS
    wallThud1: any;
    wallThud2: any;
    wallThud3: any;

    walking1: any;
    walking2: any;
    walking3: any;
    walking4: any;
    walking5: any;
    walking6: any;
    walking7: any;
    walking8: any;

    boxThud1: any;
    boxThud2: any;
    boxThud3: any;

    runningStairs: any;

    // MUSIC
    activeSound: any = {
        playing: false,
        soundRef: null,
    }
    bgSong: any;
    bgMusicTrack: any = BGMusic

    async preload() {
        this.gameRef.drawLoading('Wall Thudding', .1)
        this.wallThud1 = await this.gameRef.soundPlayer.loadSound(WallThud1)
        this.wallThud2 = await this.gameRef.soundPlayer.loadSound(WallThud2)
        this.wallThud3 = await this.gameRef.soundPlayer.loadSound(WallThud3)

        this.gameRef.drawLoading('Walking Sounds', .2)
        this.walking1 = await this.gameRef.soundPlayer.loadSound(Walking1)
        this.walking2 = await this.gameRef.soundPlayer.loadSound(Walking2)
        this.walking3 = await this.gameRef.soundPlayer.loadSound(Walking3)
        this.walking4 = await this.gameRef.soundPlayer.loadSound(Walking4)
        this.gameRef.drawLoading('More Walking Sounds', .3)
        this.walking5 = await this.gameRef.soundPlayer.loadSound(Walking5)
        this.walking6 = await this.gameRef.soundPlayer.loadSound(Walking6)
        this.walking7 = await this.gameRef.soundPlayer.loadSound(Walking7)
        this.walking8 = await this.gameRef.soundPlayer.loadSound(Walking8)

        this.gameRef.drawLoading('Box Thudding', .4)
        this.boxThud1 = await this.gameRef.soundPlayer.loadSound(BoxThud1)
        this.boxThud2 = await this.gameRef.soundPlayer.loadSound(BoxThud2)
        this.boxThud3 = await this.gameRef.soundPlayer.loadSound(BoxThud3)

        this.gameRef.drawLoading('Music', .5)
        this.bgSong = await this.gameRef.soundPlayer.loadSound(this.bgMusicTrack)

        this.gameRef.drawLoading('Running Stairs', .6)
        this.runningStairs = await this.gameRef.soundPlayer.loadSound(RunningStairs)

    }

    initialize(): void {

        this.gameState = 'loading'

        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = this.gameRef.touchMode ? 0.7 : 1.0
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


        this.nextLevelButton = new BasedButton({ gameRef: this.gameRef, key: 'nextLevelButton' })
        this.nextLevelButton.width = 65
        this.nextLevelButton.height = 40
        this.nextLevelButton.x = this.gameRef.gameWidth - this.nextLevelButton.width - 10
        this.nextLevelButton.y = this.gameRef.gameHeight - this.nextLevelButton.height - 10
        this.nextLevelButton.buttonText = 'Next'
        this.nextLevelButton.fillColor = 'rgba(0,0,0,0.7)'
        this.nextLevelButton.clickFunction = () => {
            this.gameRef.loadLevel(this.nextLevel)
        }

        this.resetButton = new BasedButton({ gameRef: this.gameRef, key: 'resetButton' })
        this.resetButton.width = 65
        this.resetButton.height = 40
        this.resetButton.x = this.gameRef.gameWidth - this.resetButton.width - 10
        this.resetButton.y = this.gameRef.gameHeight - this.resetButton.height - 10
        this.resetButton.buttonText = 'Reset'
        this.resetButton.fillColor = 'rgba(0,0,0,0.7)'
        this.resetButton.clickFunction = () => {
            this.resetLevel()
        }


        this.shrinkButton = new BasedButton({ gameRef: this.gameRef, key: 'shrinkButton' })
        this.shrinkButton.width = 60
        this.shrinkButton.height = 60
        this.shrinkButton.x = this.gameRef.gameWidth - this.shrinkButton.width - 10
        this.shrinkButton.y = this.gameRef.gameHeight - this.shrinkButton.height - 10
        this.shrinkButton.buttonText = '→ ←'
        this.shrinkButton.fillColor = 'rgba(255,165,0,0.7)'
        this.shrinkButton.roundButton = true
        this.shrinkButton.holdFunction = (_: any) => {}

        this.growButton = new BasedButton({ gameRef: this.gameRef, key: 'growButton' })
        this.growButton.width = 60
        this.growButton.height = 60
        this.growButton.x = this.gameRef.gameWidth - this.growButton.width - 10
        this.growButton.y = this.gameRef.gameHeight - this.growButton.height - 10
        this.growButton.buttonText = '← →'
        this.growButton.fillColor = 'rgba(255,0,0,0.7)'
        this.growButton.roundButton = true
        this.growButton.holdFunction = (_: any) => {}


        this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
        this.moveKnob.height = 160
        this.moveKnob.width = 160
        this.positionKnobs()

        // setup level and players
        this.mainPlayer = new MainPlayer({
            key: 'mainPlayer',
            gameRef: this.gameRef,
        })
        this.mainPlayer.x = this.playerStartPosition.x
        this.mainPlayer.y = this.playerStartPosition.y
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)
        this.mainPlayer.setMoveKnob(this.moveKnob)
        this.mainPlayer.setShrinkButton(this.shrinkButton)
        this.mainPlayer.setGrowButton(this.growButton)
        this.mainPlayer.setWallThuds([
            this.wallThud1,
            this.wallThud2,
            this.wallThud3,
        ])
        this.mainPlayer.setWalkingSounds([
            this.walking1,
            this.walking2,
            this.walking3,
            this.walking4,
            this.walking5,
            this.walking6,
            this.walking7,
            this.walking8,
        ])
        this.mainPlayer.setBoxThuds([
            this.boxThud1,
            this.boxThud2,
            this.boxThud3,
        ])

        this.setupWalls()
        this.setupPushBoxes()
        this.setupMovingPlatforms()
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
        this.shrinkButton.update()
        this.growButton.update()
        this.moveKnob.update()
        this.nextLevelButton.update()
        this.resetButton.update()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }

    onPhysicsUpdate() {
        // do something on physics tick
        this.updateCamera()
        this.movingPlatforms.forEach((plat: any) => {
            plat.update()
        })
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

    positionKnobs() {
        this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
        this.moveKnob.x = 0 // this.gameRef.gameWidth - this.moveKnob.width
        this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height
    }

    onResize() {
        this.cameraZoomButton.x = this.gameRef.gameWidth - this.cameraZoomButton.width - 10
        this.cameraZoomButton.y = this.gameRef.gameHeight - this.cameraZoomButton.height - 10

        this.shrinkButton.x = this.gameRef.gameWidth - this.shrinkButton.width - 30
        this.shrinkButton.y = this.gameRef.gameHeight - this.shrinkButton.height - this.cameraZoomButton.height - 50

        this.growButton.x = this.gameRef.gameWidth - this.growButton.width - this.shrinkButton.width - 50
        this.growButton.y = this.gameRef.gameHeight - this.growButton.height - 30

        this.nextLevelButton.x = this.gameRef.gameWidth - this.nextLevelButton.width - 10
        this.nextLevelButton.y = 10

        this.resetButton.x = this.gameRef.gameWidth - this.resetButton.width - this.nextLevelButton.width - 20
        this.resetButton.y = 10

        this.positionKnobs()
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

        // draw shadows
        this.mainPlayer.drawShadows()


        // draw level walls
        this.levelWalls.forEach((wall: any) => {
            wall.draw()
        })

        // draw push boxes
        this.pushBoxes.forEach((box: any) => {
            box.draw()
        })

        // draw moving platforms
        this.movingPlatforms.forEach((plat: any) => {
            plat.draw()
        })

        // draw exit doors
        this.exitDoors.forEach((door: any) => {
            door.draw()
        })

        // draw the main player
        this.mainPlayer.draw()

        // draw interface
        this.cameraZoomButton.draw()
        this.nextLevelButton.draw()
        this.resetButton.draw()
        if(this.gameRef.touchMode){
            this.moveKnob.draw()
            this.shrinkButton.draw()
            this.growButton.draw()
        }

    }

    // SETUP FUNCTIONS
    setupWalls() {
        this.levelWalls = [
            ...this._levelBoundaries,
            ...this._levelWalls,
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
            ...this._pushBoxes,
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

    setupMovingPlatforms() {

        this.movingPlatforms = [
            ...this._movingPlatforms,
        ].map((obj: any, idx: number) => {
            const tempObj = new MovingPlatform({
                key: `movingPlatform-${idx}`,
                gameRef: this.gameRef
            })
            tempObj.x = obj.x
            tempObj.xDirection = obj.xDirection
            tempObj.minX = obj.minX
            tempObj.maxX = obj.maxX

            tempObj.yDirection = obj.yDirection
            tempObj.y = obj.y
            tempObj.minY = obj.minY
            tempObj.maxY = obj.maxY

            tempObj.width = obj.width
            tempObj.height = obj.height
            tempObj.color = obj.color
            tempObj.initialize()
            this.gameRef.addToWorld(tempObj.body)
            return tempObj
        })
    }

    setupExitDoors() {
        this.exitDoors = [
            ...this._exitDoors,
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
            tempObj.setupStairsNoise(this.runningStairs)
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