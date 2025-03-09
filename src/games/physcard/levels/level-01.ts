import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawCameraFrame, drawCircle, drawSVG, rotateDraw } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import PhysBall from '../../../engine/physicsObjects/PhysBall';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
export class Level01 extends BasedLevel {

    physics: any

    tileSize: number = 64
    tileMap: any = []

    levelWidth: number = 800
    levelHeight: number = 800

    nextLevel: string = 'credits-screen'

    playerStartPosition: any = {
        x: this.levelWidth / 2,
        y: this.levelHeight / 2,
        // x: 0,
        // y: 0,
    }

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    miniMapActive: boolean = false
    followCam: any;

    mouseTarget: any;
    activeMouseTargetPool: any = {}
    activeMouseTarget: any;
    movingMouseTargetKey: string = ''
    mouseTargetOffset: XYCoordinateType = { x: 0, y: 0 }
    lastMouseDown: number = 0
    lastMouseMove: number = 0
    lastMousePos: XYCoordinateType = { x: 0, y: 0 }

    // simpleCard: any;
    simpleCards: any = []
    simpleCardZone: any;

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

        this.setupSimpleCardZone()
        this.setupMouseTarget()

        this.simpleCards = [
            { x: 400, y: 400, color: 'orange' },
            { x: 200, y: 200, color: 'blue' },
        ].map((card, i) => {
            return this.setupSimpleCard({
                key: `simpleCard-${i}`,
                x: card.x,
                y: card.y
            })
        })

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

        this.mouseTarget.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                this.activeMouseTargetPool[otherBody.objectKey] = otherBody
                // this.activeMouseTarget = otherBody
                this.mouseTarget.color = 'red'
            }
        }

        this.mouseTarget.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                delete this.activeMouseTargetPool[otherBody.objectKey]
                // this.activeMouseTarget = null
                // this.mouseTarget.color = 'white'
            }
            if (Object.keys(this.activeMouseTargetPool).length === 0) {
                this.mouseTarget.color = 'white'
            }
        }

        this.mouseTarget.initialize()
        this.gameRef.addToWorld(this.mouseTarget.body)
    }

    setupSimpleCard(newCardOptions: {
        key: string,
        x: number,
        y: number,
        color?: string
    }) {
        const newSimpleCard = new PhysBox({
            key: newCardOptions.key || `simpleCard`,
            gameRef: this.gameRef,
            options: {
                tags: {
                    simpleCard: true
                }
            }
        })

        newSimpleCard.x = newCardOptions.x || 400
        newSimpleCard.y = newCardOptions.y || 400
        newSimpleCard.width = 100
        newSimpleCard.height = 150

        newSimpleCard.color = newCardOptions.color || 'blue'

        newSimpleCard.bodyOptions = {
            label: 'simpleCard',
            // isStatic: true,
            isSensor: true
        }

        newSimpleCard.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
                newSimpleCard.strokeWidth = 5
            }
        }

        newSimpleCard.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.mouseTarget) {
                newSimpleCard.strokeWidth = 0
            }
        }

        newSimpleCard.initialize()
        this.gameRef.addToWorld(newSimpleCard.body)

        return newSimpleCard
    }

    setupSimpleCardZone() {
        this.simpleCardZone = new PhysBox({
            key: `simpleCardZone`,
            gameRef: this.gameRef,
            options: {
                tags: {
                    simpleCardZone: true
                }
            }
        })

        this.simpleCardZone.x = 400
        this.simpleCardZone.y = 600
        this.simpleCardZone.width = 100 + 10
        this.simpleCardZone.height = 150 + 10

        this.simpleCardZone.strokeWidth = 0
        this.simpleCardZone.strokeColor = 'red'
        this.simpleCardZone.color = 'yellow'

        this.simpleCardZone.bodyOptions = {
            label: 'simpleCardZone',
            isStatic: true,
            isSensor: true
        }

        this.simpleCardZone.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                this.simpleCardZone.strokeWidth = 5
            }
        }

        this.simpleCardZone.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                this.simpleCardZone.strokeWidth = 0
            }
        }

        this.simpleCardZone.initialize()
        this.gameRef.addToWorld(this.simpleCardZone.body)
    }

    update() {
        this.handlePhysics()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {

            if (this.movingMouseTargetKey && this.activeMouseTargetPool[this.movingMouseTargetKey]) {
                this.activeMouseTarget = this.activeMouseTargetPool[this.movingMouseTargetKey]
            } else if (Object.keys(this.activeMouseTargetPool).length > 0) {
                this.activeMouseTarget = this.activeMouseTargetPool[Object.keys(this.activeMouseTargetPool)[0]]
            } else {
                this.activeMouseTarget = null
            }

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

        if (!hasMouseMoved && this.gameRef.lastUpdate - this.lastMouseDown > 500 && this.gameRef.lastUpdate - this.lastMouseMove > 500) {
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
            if (this.activeMouseTarget && this.activeMouseTarget.body && this.gameRef.lastUpdate - this.lastMouseDown < 100) {
                if (!this.mouseTargetOffset.x && !this.mouseTargetOffset.y) {
                    this.mouseTargetOffset = {
                        x: this.activeMouseTarget.body.position.x - this.mouseTarget.body.position.x,
                        y: this.activeMouseTarget.body.position.y - this.mouseTarget.body.position.y
                    }
                }
                Physics.Body.setPosition(this.activeMouseTarget.body, {
                    x: this.gameRef.cameraMouseInfo.x + this.mouseTargetOffset.x,
                    y: this.gameRef.cameraMouseInfo.y + this.mouseTargetOffset.y
                })
                this.movingMouseTargetKey = this.activeMouseTarget.objectKey
            }
            this.lastMouseDown = this.gameRef.lastUpdate
        } else {
            this.mouseTargetOffset = { x: 0, y: 0 }
        }


    }


    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        const activeTarget: any = this.playerStartPosition
        if (activeTarget) {
            this.followCam.setTarget(activeTarget)
        }

        this.followCam.setFullScreen(this.miniMapActive)
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

            // draw the simple card zone
            this.simpleCardZone.draw()


            // draw the simple card
            // this.simpleCard.draw()

            this.simpleCards.forEach((card: any) => {
                card.draw()
            })



            // draw the mouse position
            // drawCircle({
            //     c: this.gameRef.ctx,
            //     x: this.gameRef.cameraMouseInfo.x,
            //     y: this.gameRef.cameraMouseInfo.y,
            //     radius: 10,
            //     fillColor: 'red',
            //     cameraPos: this.gameRef.cameraPos,
            //     zoom: this.gameRef.cameraZoom,
            // })
            this.mouseTarget.draw()

        })



        // Add any additional drawing logic here
    }
    onResize() { }
    tearDown() { }
}