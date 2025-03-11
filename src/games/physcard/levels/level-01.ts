import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawCameraFrame, drawCircle, drawSVG, drawText, rotateDraw } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import PhysBall from '../../../engine/physicsObjects/PhysBall';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
import { SimpleCard } from '../entities/simpleCard';
import { SimpleCardZone } from '../entities/simpleCardZone';
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
    // simpleCardZone: any;
    simpleCardZones: any = []

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

        // this.setupSimpleCardZone()
        this.setupMouseTarget()

        this.simpleCards = [
            { x: 400, y: 400, color: 'orange' },
            { x: 200, y: 200, color: 'blue' },
            { x: 600, y: 200, color: 'red' },
            { x: 600, y: 400, color: 'green' },
            { x: 200, y: 400, color: 'purple' },
            { x: 400, y: 200, color: 'yellow' },
        ].map((card, i) => {
            return this.setupSimpleCard({
                key: `simpleCard-${i}`,
                x: card.x,
                y: card.y,
                color: card.color
            })
        })

        this.simpleCardZones = [
            { x: 400, y: 600, color: 'black' },
            { x: 200, y: 600, color: '#333333' },
        ].map((card, i) => {
            return this.setupSimpleCardZone({
                key: `simpleCardZone-${i}`,
                x: card.x,
                y: card.y,
                color: card.color
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
        const newSimpleCard = new SimpleCard({
            key: newCardOptions.key || `simpleCard`,
            gameRef: this.gameRef,
        })

        newSimpleCard.x = newCardOptions.x || 400
        newSimpleCard.y = newCardOptions.y || 400
        newSimpleCard.color = newCardOptions.color || 'blue'

        newSimpleCard.initialize()
        this.gameRef.addToWorld(newSimpleCard.body)

        return newSimpleCard
    }

    setupSimpleCardZone(newCardZoneOptions: {
        key: string,
        x: number,
        y: number,
        color?: string
    }) {
        const newSimpleCardZone = new SimpleCardZone({
            key: newCardZoneOptions.key || `simpleCardZone`,
            gameRef: this.gameRef
        })

        newSimpleCardZone.x = newCardZoneOptions.x || 400
        newSimpleCardZone.y = newCardZoneOptions.y || 600
        
        newSimpleCardZone.color = newCardZoneOptions.color || 'yellow'

        newSimpleCardZone.initialize()
        this.gameRef.addToWorld(newSimpleCardZone.body)

        return newSimpleCardZone
    }

    update() {
        this.handlePhysics()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {

            if (this.movingMouseTargetKey && this.activeMouseTargetPool[this.movingMouseTargetKey]) {
                this.activeMouseTarget = this.activeMouseTargetPool[this.movingMouseTargetKey]
            } else if (Object.keys(this.activeMouseTargetPool).length > 0) {
                // use the one with the highest index in the array of cards
                let highestIndex = -1
                this.simpleCards.forEach((card: any, ixd: number) => {
                    if(this.activeMouseTargetPool[card.objectKey] && ixd > highestIndex) {
                        highestIndex = ixd
                        this.activeMouseTarget = this.activeMouseTargetPool[card.objectKey]
                    }
                })
            } else {
                this.activeMouseTarget = null
            }

            this.onPhysicsUpdate()
        }
    }
    onPhysicsUpdate() {
        // this.followCam.cameraRotationTarget += 1

        this.simpleCards.forEach((card: any) => {
            card.targeted = false
        })

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

        this.simpleCardZones.forEach((cardZone: any) => {
            cardZone.update()
            // Object.keys(cardZone.cardsInZone).forEach((cardKey: string, idx: number) => {
            //     const card = cardZone.cardsInZone[cardKey]
            //     if(card.objectKey === this.movingMouseTargetKey) {
            //         return
            //     }
            //     if (card && card.body && card.body.position) {
            //         card.targetPosition = {
            //             x: cardZone.body.position.x + (idx * 5),
            //             y: cardZone.body.position.y - (idx * 5)
            //         }
            //         card.moveTowardsTarget()
            //     }
            // })
        })


        if (this.gameRef.mouseInfo.mouseDown) {
            if (this.activeMouseTarget && this.activeMouseTarget.body && this.gameRef.lastUpdate - this.lastMouseDown < 100) {
                if (!this.mouseTargetOffset.x && !this.mouseTargetOffset.y) {
                    this.mouseTargetOffset = {
                        x: this.activeMouseTarget.body.position.x - this.mouseTarget.body.position.x,
                        y: this.activeMouseTarget.body.position.y - this.mouseTarget.body.position.y
                    }
                    // make it the last one in the array
                    this.simpleCards = this.simpleCards.filter((card: any) => card.objectKey !== this.activeMouseTarget.objectKey)
                    this.simpleCards.push(this.activeMouseTarget)
                }
                Physics.Body.setPosition(this.activeMouseTarget.body, {
                    x: this.gameRef.cameraMouseInfo.x + this.mouseTargetOffset.x,
                    y: this.gameRef.cameraMouseInfo.y + this.mouseTargetOffset.y
                })
                Physics.Body.setVelocity(this.activeMouseTarget.body, {
                    x: 0,
                    y: 0
                })
                this.movingMouseTargetKey = this.activeMouseTarget.objectKey
                // this.activeMouseTarget.targeted = true
            }
            this.lastMouseDown = this.gameRef.lastUpdate
        } else {
            this.mouseTargetOffset = { x: 0, y: 0 }
            this.movingMouseTargetKey = ''
            
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
            // this.simpleCardZone.draw()

            this.simpleCardZones.forEach((cardZone: any) => {
                cardZone.draw()
            })


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