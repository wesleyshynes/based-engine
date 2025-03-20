import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { drawBox, drawCameraFrame, drawLine, drawText } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import PhysBall from '../../../engine/physicsObjects/PhysBall';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
import { BasedButton } from '../../../engine/BasedButton';
import { MainPlayer } from '../entities/mainPlayer';
import TextContainer from '../../../engine/ui/TextContainer';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
export class Overworld extends BasedLevel {

    physics: any

    tileSize: number = 64
    tileMap: any = []

    levelWidth: number = 800
    levelHeight: number = 1000

    nextLevel: string = 'credits-screen'

    mainPlayer: any
    playerStartPosition: any = {
        x: this.levelWidth / 2,
        y: this.levelHeight / 2,
        // x: 0,
        // y: 0,
    }

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

        this.mainPlayer = new MainPlayer({
            key: `mainPlayer`,
            gameRef: this.gameRef
        })
        this.mainPlayer.x = this.playerStartPosition.x
        this.mainPlayer.y = this.playerStartPosition.y
        this.mainPlayer.color = LIGHT_COLOR // 'white'
        this.mainPlayer.strokeColor = DARK_COLOR // 'black'
        this.mainPlayer.radius = 10
        this.mainPlayer.baseSpeed = 8
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)

        this.setupMouseTarget()
        this.setupLevelExit()

        this.setupViewButton()
        this.setupLevelText()
        this.followCam.initialize()
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
            if (otherBody && otherBody.options && otherBody.options.tags.player) {
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
        const levelTextString = generateBigLoremIpsum(1)
        this.levelText.initialize()
        this.levelText.containerFillColor = 'white'
        this.levelText.setText(levelTextString)
    }

    checkWinCondition() { }

    update() {
        this.handlePhysics()
        this.checkWinCondition()
        this.levelText.update()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }

    onPhysicsUpdate() {
        // this.followCam.cameraRotationTarget += 1

        // do something on physics tick
        this.updateCamera()

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
                if (mouseTargetInLevel) {
                    // set main player target to the mouse
                    this.mainPlayer.setTargetPosition({
                        x: this.gameRef.cameraMouseInfo.x,
                        y: this.gameRef.cameraMouseInfo.y
                    })
                }
            }
            this.mainPlayer.update()
        }
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

            this.levelExit.draw()


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

        })

        drawText({
            c: this.gameRef.ctx,
            x: 20,
            y: 20,
            text: `Cam Mouse: ${this.gameRef.cameraMouseInfo.x.toFixed(2)}, ${this.gameRef.cameraMouseInfo.y.toFixed(2)}`,
            fontSize: 20,
            fillColor: 'white',
            align: 'left',
            fontFamily: 'Arial'
        })

        drawText({
            c: this.gameRef.ctx,
            x: 20,
            y: 50,
            // text: `Real Mouse: ${this.gameRef.mouseInfo.x.toFixed(2)}, ${this.gameRef.mouseInfo.y.toFixed(2)}`,
            text: `${this.levelText.scrollBar.x.toFixed(2)}, ${this.levelText.scrollBar.y.toFixed(2)}`,
            fontSize: 20,
            fillColor: 'white',
            align: 'left',
            fontFamily: 'Arial'
        })


        this.viewButton.draw()

        // draw the player
        this.mainPlayer.draw()

        this.levelText.draw()

        // Add any additional drawing logic here
    }

    onResize() {
        this.levelText.onResize()
    }
    tearDown() { }
}

const generateBigLoremIpsum = (times: number = 10) => {
    let ipsum = ''
    for (let i = 0; i < times; i++) {
        //   ipsum += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec magna nec sapien tincidunt ultricies. Nullam auctor, nunc vel aliquam fermentum, justo purus varius odio, nec tristique orci nunc eget massa. Sed nec scelerisque libero. Suspendisse potent. '   
        ipsum += `Welcome to Simple Card\n\n I have no idea what to put here\n\n at some point i am sure this game will be interesting.\n\n Enjoy this in the meantime.`
    }
    // ipsum += ''
    return ipsum
}