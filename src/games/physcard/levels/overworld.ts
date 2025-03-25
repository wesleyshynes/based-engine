import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { drawBox, drawCameraFrame, drawLine, drawText } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import PhysBall from '../../../engine/physicsObjects/PhysBall';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
import { BasedButton } from '../../../engine/BasedButton';
import { Player } from '../entities/player';
import TextContainer from '../../../engine/ui/TextContainer';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { TouchKnob } from '../../../engine/controls/TouchKnob';
export class Overworld extends BasedLevel {

    physics: any

    tileSize: number = 64
    tileMap: any = []

    levelWidth: number = 800
    levelHeight: number = 1000

    nextLevel: string = 'credits-screen'

    moveKnob: any

    mainPlayer: any
    playerStartPosition: any = {
        x: this.levelWidth / 2,
        y: this.levelHeight / 2,
        // x: 0,
        // y: 0,
    }

    otherPlayer: any
    otherPlayerStartPosition: any = {
        x: this.levelWidth / 4,
        y: this.levelHeight / 4,
    }
    otherPlayerColor: string = 'red'
    otherPlayerStrokeColor: string = 'black'

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    viewFullMap: boolean = true
    followCam: any;

    mouseTarget: any;
    lastMouseDown: number = 0
    lastMouseMove: number = 0
    lastMousePos: XYCoordinateType = { x: 0, y: 0 }

    viewButton: any;

    levelText: any;
    levelMode: string = 'text'

    levelExit: any;

    async preload() { }

    initialize() {

        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = this.gameRef.touchMode ? 0.7 : 1.0
        this.followCam.cameraZoomSpeed = .03
        this.followCam.cameraSpeed = 50

        this.followCam.defaultBound = false
        this.followCam.fullScreenBound = false

        // this.followCam.cameraRotationTarget = 45

        this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
        this.moveKnob.height = 160
        this.moveKnob.width = 160
        this.positionKnobs()

        this.mainPlayer = this.setupPlayer({
            playerKey: 'mainPlayer',
            x: this.playerStartPosition.x,
            y: this.playerStartPosition.y,
        })
        this.mainPlayer.controlType = 'manual'
        this.mainPlayer.setMoveKnob(this.moveKnob)

        this.otherPlayer = this.setupPlayer({
            playerKey: 'otherPlayer',
            x: this.otherPlayerStartPosition.x,
            y: this.otherPlayerStartPosition.y,
            color: this.otherPlayerColor,
            strokeColor: this.otherPlayerStrokeColor
        })

        this.otherPlayer.hasSpoken = false
        this.otherPlayer.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags) {
                if (otherBody.options.tags.player) {
                    // this.otherPlayer.hasSpoken = true
                    this.levelText.setText('Please pass through the exit to continue.')
                    this.levelText.active = true
                    this.levelMode = 'text'
                    this.levelText.closeFunction = () => {
                        this.levelMode = 'game'
                        this.otherPlayer.hasSpoken = true
                    }
                }

            }
        }

        this.setupMouseTarget()
        this.setupLevelExit()

        this.setupViewButton()
        this.setupLevelText()
        this.levelMode = 'text'

        this.followCam.initialize()
    }

    setupPlayer(options: {
        playerKey: string,
        x: number,
        y: number,
        color?: string,
        strokeColor?: string,
        radius?: number,
        sensorRadius?: number,
        baseSpeed?: number,
    }) {
        const {
            playerKey,
            x,
            y,
            color = 'white',
            strokeColor = 'black',
            radius = 10,
            sensorRadius = 100,
            baseSpeed = 8
        } = options
        const newPlayer = new Player({
            key: playerKey,
            gameRef: this.gameRef
        })
        newPlayer.x = x
        newPlayer.y = y
        newPlayer.color = color
        newPlayer.strokeColor = strokeColor
        newPlayer.radius = radius
        newPlayer.sensorRadius = sensorRadius
        newPlayer.baseSpeed = baseSpeed
        newPlayer.targetPosition = {
            x,
            y
        }
        newPlayer.initialize()
        this.gameRef.addToWorld(newPlayer.compositeRef)
        return newPlayer
    }

    setupMouseTarget() {
        this.mouseTarget = new PhysBall({
            key: `mouseTarget`,
            gameRef: this.gameRef,
            options: {
                tags: {
                    mouseTarget: true
                }
            }
        })

        this.mouseTarget.x = 0
        this.mouseTarget.y = 0
        this.mouseTarget.radius = 10

        this.mouseTarget.bodyOptions = {
            label: 'mouseTarget',
            // isStatic: true,
            isSensor: true
        }

        this.mouseTarget.color = LIGHT_COLOR // 'white'
        this.mouseTarget.strokeColor = DARK_COLOR // 'black'

        this.mouseTarget.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.someThing) {
                this.mouseTarget.color = PRIMARY_COLOR // 'red'
                this.mouseTarget.strokeColor = SECONDARY_COLOR // 'blue'
            }
        }

        this.mouseTarget.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.someThing) {
                this.mouseTarget.color = LIGHT_COLOR // 'white'
                this.mouseTarget.strokeColor = DARK_COLOR // 'black
            }
        }

        this.mouseTarget.initialize()
        this.gameRef.addToWorld(this.mouseTarget.body)
    }

    setupLevelExit() {
        this.levelExit = new PhysBox({
            key: `levelExit`,
            gameRef: this.gameRef,
            options: {
                tags: {
                    levelExit: true
                }
            }
        })
        this.levelExit.x = this.levelWidth - 100
        this.levelExit.y = this.levelHeight - 100
        this.levelExit.width = 200
        this.levelExit.height = 200
        this.levelExit.bodyOptions = {
            label: 'levelExit',
            isStatic: true,
            isSensor: true
        }

        this.levelExit.color = 'green'
        this.levelExit.strokeColor = 'black'

        this.levelExit.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (this.otherPlayer.hasSpoken && otherBody && otherBody.options && otherBody.options.tags.player) {
                this.gameRef.loadLevel('level-01')
            }
        }

        this.levelExit.initialize()
        this.gameRef.addToWorld(this.levelExit.body)

    }

    setupViewButton() {
        this.viewButton = new BasedButton({
            key: 'viewButton',
            gameRef: this.gameRef,
        })

        this.viewButton.x = 20
        this.viewButton.y = 120
        this.viewButton.width = 120
        this.viewButton.buttonText = 'View Full Map'

        this.viewButton.clickFunction = () => {
            this.viewFullMap = !this.viewFullMap
            this.viewButton.buttonText = this.viewFullMap ? 'View Level' : 'View Player'
        }
    }

    setupLevelText() {
        this.levelText = new TextContainer({
            key: 'levelText',
            gameRef: this.gameRef
        })

        this.levelText.x = 20
        this.levelText.y = 140
        const levelTextString = generateBigLoremIpsum(10)
        this.levelText.initialize()
        this.levelText.containerFillColor = 'white'
        this.levelText.setText(levelTextString)
        this.levelText.closeFunction = () => {
            this.levelMode = 'game'
        }
    }

    checkWinCondition() { }

    update() {
        this.updateCamera()
        if (this.levelMode === 'game') {
            this.handlePhysics()
            this.checkWinCondition()
        }
        if (this.levelMode === 'text') {
            this.levelText.update()
        }
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
        this.moveKnob.update()
    }

    onPhysicsUpdate() {
        // this.followCam.cameraRotationTarget += 1

        // do something on physics tick

        const hasMouseMoved = this.lastMousePos.x !== this.gameRef.cameraMouseInfo.x || this.lastMousePos.y !== this.gameRef.cameraMouseInfo.y

        if (hasMouseMoved) {
            this.lastMouseMove = this.gameRef.lastUpdate
        }

        this.lastMousePos = {
            x: this.gameRef.cameraMouseInfo.x,
            y: this.gameRef.cameraMouseInfo.y
        }

        if (!hasMouseMoved &&
            this.gameRef.lastUpdate - this.lastMouseDown > 500 &&
            this.gameRef.lastUpdate - this.lastMouseMove > 500) {
            Physics.Body.setPosition(this.mouseTarget.body, {
                x: 2000,
                y: 2000
            })
        } else {
            Physics.Body.setPosition(this.mouseTarget.body, {
                x: this.gameRef.cameraMouseInfo.x,
                y: this.gameRef.cameraMouseInfo.y
            })
        }

        if (this.gameRef.mouseInfo.mouseDown) {
            this.lastMouseDown = this.gameRef.lastUpdate
        }

        this.viewButton.update()

        if (!this.viewButton.hovered) {
            if (this.gameRef.mouseInfo.mouseDown) {
                let mouseTargetInLevel = true
                if (this.gameRef.cameraMouseInfo.x < 0 || this.gameRef.cameraMouseInfo.x > this.levelWidth) {
                    mouseTargetInLevel = false
                }
                if (this.gameRef.cameraMouseInfo.y < 0 || this.gameRef.cameraMouseInfo.y > this.levelHeight) {
                    mouseTargetInLevel = false
                }
                // if (mouseTargetInLevel) {
                //     // set main player target to the mouse
                //     this.mainPlayer.setTargetPosition({
                //         x: this.gameRef.cameraMouseInfo.x,
                //         y: this.gameRef.cameraMouseInfo.y
                //     })
                // }
            }
        }
        this.mainPlayer.update()
        this.otherPlayer.update()
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

        this.followCam.setFullScreen(this.viewFullMap)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }

    draw(): void {
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = DARK_COLOR;
        this.gameRef.ctx.fill();


        drawCameraFrame(this.gameRef, () => {

            // draw the level
            // level bg
            drawBox({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                width: this.levelWidth,
                height: this.levelHeight,
                fillColor: LIGHT_COLOR,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })

            if (this.otherPlayer.hasSpoken) {
                this.levelExit.draw()
            }


            // draw the mouse position
            // this.mouseTarget.draw()
            drawLine({
                c: this.gameRef.ctx,
                x: this.mouseTarget.body.position.x - 10,
                y: this.mouseTarget.body.position.y - 10,
                toX: this.mouseTarget.body.position.x + 10,
                toY: this.mouseTarget.body.position.y + 10,
                strokeColor: SECONDARY_COLOR,
                strokeWidth: 10,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })
            drawLine({
                c: this.gameRef.ctx,
                x: this.mouseTarget.body.position.x + 10,
                y: this.mouseTarget.body.position.y - 10,
                toX: this.mouseTarget.body.position.x - 10,
                toY: this.mouseTarget.body.position.y + 10,
                strokeColor: SECONDARY_COLOR,
                strokeWidth: 10,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })
            drawLine({
                c: this.gameRef.ctx,
                x: this.mouseTarget.body.position.x - 10,
                y: this.mouseTarget.body.position.y - 10,
                toX: this.mouseTarget.body.position.x + 10,
                toY: this.mouseTarget.body.position.y + 10,
                strokeColor: PRIMARY_COLOR,
                strokeWidth: 4,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })
            drawLine({
                c: this.gameRef.ctx,
                x: this.mouseTarget.body.position.x + 10,
                y: this.mouseTarget.body.position.y - 10,
                toX: this.mouseTarget.body.position.x - 10,
                toY: this.mouseTarget.body.position.y + 10,
                strokeColor: PRIMARY_COLOR,
                strokeWidth: 4,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })

            if (this.otherPlayer.playerInRadius && !this.otherPlayer.hasSpoken) {
                // draw some text just above the player
                drawText({
                    c: this.gameRef.ctx,
                    x: this.otherPlayer.body.position.x,
                    y: this.otherPlayer.body.position.y - 40,
                    text: 'Bump me!',
                    fontSize: 20,
                    fillColor: 'black',
                    align: 'center',
                    fontFamily: 'Arial',
                    cameraPos: this.gameRef.cameraPos,
                    zoom: this.gameRef.cameraZoom
                })
            }

        })

        // drawText({
        //     c: this.gameRef.ctx,
        //     x: 20,
        //     y: 20,
        //     text: `Cam Mouse: ${this.gameRef.cameraMouseInfo.x.toFixed(2)}, ${this.gameRef.cameraMouseInfo.y.toFixed(2)}`,
        //     fontSize: 20,
        //     fillColor: 'white',
        //     align: 'left',
        //     fontFamily: 'Arial'
        // })

        // drawText({
        //     c: this.gameRef.ctx,
        //     x: 20,
        //     y: 50,
        //     // text: `Real Mouse: ${this.gameRef.mouseInfo.x.toFixed(2)}, ${this.gameRef.mouseInfo.y.toFixed(2)}`,
        //     text: `${this.levelText.scrollBar.x.toFixed(2)}, ${this.levelText.scrollBar.y.toFixed(2)}`,
        //     fontSize: 20,
        //     fillColor: 'white',
        //     align: 'left',
        //     fontFamily: 'Arial'
        // })


        this.viewButton.draw()

        this.moveKnob.draw()

        // draw the player
        this.mainPlayer.draw()

        this.otherPlayer.draw()

        this.levelText.draw()

        // Add any additional drawing logic here
    }

    positionKnobs() {
        this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
        this.moveKnob.x = 0 // this.gameRef.gameWidth - this.moveKnob.width
        this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height
    }

    onResize() {
        this.levelText.onResize()
        this.positionKnobs()
    }
    tearDown() { }
}

const generateBigLoremIpsum = (times: number = 10) => {
    let ipsum = ''
    for (let i = 0; i < times; i++) {
          ipsum += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec magna nec sapien tincidunt ultricies. Nullam auctor, nunc vel aliquam fermentum, justo purus varius odio, nec tristique orci nunc eget massa. Sed nec scelerisque libero. Suspendisse potent. '   
        // ipsum += `Welcome to Simple Card\n\n I have no idea what to put here\n\n at some point i am sure this game will be interesting.\n\n Enjoy this in the meantime.`
    }
    // ipsum += ''
    return ipsum
}