import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawCameraFrame, drawCircle, drawLine, drawSVG, drawText, rotateDraw } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import PhysBall from '../../../engine/physicsObjects/PhysBall';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
import { SimpleCard } from '../entities/simpleCard';
import { SimpleCardZone } from '../entities/simpleCardZone';
import { BasedButton } from '../../../engine/BasedButton';
import { MainPlayer } from '../entities/mainPlayer';
import TextContainer from '../../../engine/ui/TextContainer';
export class Level01 extends BasedLevel {

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
    activeMouseTargetPool: any = {}
    activeMouseTarget: any;
    // movingMouseTarget: boolean = false
    movingMouseTargetKey: string = ''
    mouseTargetOffset: XYCoordinateType = { x: 0, y: 0 }
    lastMouseDown: number = 0
    lastMouseMove: number = 0
    lastMousePos: XYCoordinateType = { x: 0, y: 0 }

    // simpleCard: any;
    simpleCards: any = []
    // simpleCardZone: any;
    simpleCardZones: any = []

    deckZone: any;
    discardZone: any;

    simpleButton: any;
    viewButton: any;

    winConditionMet: boolean = false

    levelText: any;

    async preload() { }

    initialize() {

        this.winConditionMet = false

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
                // x: 300 + (i * 50),
                // y: 100 + (i * 10),
                color: card.color
            })
        })

        this.simpleCardZones = [
            { x: 400, y: 600, color: '#000000' },
            { x: 200, y: 600, color: '#333333' },
            { x: 600, y: 600, color: '#666666' },
            { x: 600, y: 850, color: '#999999' },
            { x: 200, y: 850, color: '#CCCCCC' },
            { x: 400, y: 850, color: '#FFFFFF' },
        ].map((card, i) => {
            return this.setupSimpleCardZone({
                key: `simpleCardZone-${i}`,
                x: card.x,
                y: card.y,
                color: card.color
            })
        })

        this.deckZone = this.setupSimpleCardZone({
            key: `deckZone`,
            x: 200,
            y: 200,
            color: '#000000'
        })
        this.deckZone.zoneText = 'Deck'
        this.simpleCards.forEach((card: any) => {
            this.deckZone.cardsInZone[card.objectKey] = card
        })
        this.deckZone.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                console.log('collisionStartFn', otherBody.objectKey)
                this.deckZone.strokeWidth = 5
                this.deckZone.cardsInZone[otherBody.objectKey] = otherBody
                otherBody.faceUp = false
            }
        }

        this.discardZone = this.setupSimpleCardZone({
            key: `discardZone`,
            x: 600,
            y: 200,
            color: '#000000'
        })
        this.discardZone.zoneText = 'Discard'
        this.discardZone.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                console.log('collisionStartFn', otherBody.objectKey)
                this.discardZone.strokeWidth = 5
                this.discardZone.cardsInZone[otherBody.objectKey] = otherBody
                otherBody.faceUp = true
            }
        }
        // this.simpleCards.forEach((card: any) => {
        //     this.discardZone.cardsInZone[card.objectKey] = card
        // })

        this.setupSimpleButton()
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
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                this.activeMouseTargetPool[otherBody.objectKey] = otherBody
                // this.activeMouseTarget = otherBody
                this.mouseTarget.color = PRIMARY_COLOR // 'red'
                this.mouseTarget.strokeColor = SECONDARY_COLOR // 'blue'
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
                this.mouseTarget.color = LIGHT_COLOR // 'white'
                this.mouseTarget.strokeColor = DARK_COLOR // 'black'
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
        newSimpleCard.color = PRIMARY_COLOR // newCardOptions.color || 'blue'
        newSimpleCard.strokeColor = DARK_COLOR // 'black'

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

        newSimpleCardZone.color = SECONDARY_COLOR // newCardZoneOptions.color || 'yellow'
        newSimpleCardZone.textColor = DARK_COLOR
        newSimpleCardZone.strokeColor = DARK_COLOR

        newSimpleCardZone.initialize()
        this.gameRef.addToWorld(newSimpleCardZone.body)

        return newSimpleCardZone
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

    setupSimpleButton() {
        this.simpleButton = new BasedButton({
            key: 'simpleButton',
            gameRef: this.gameRef,
        })

        this.simpleButton.x = 20
        this.simpleButton.y = 60
        this.simpleButton.width = 120

        this.simpleButton.clickFunction = () => {
            // make all the simpleCardZones black
            this.simpleCardZones.forEach((cardZone: any) => {
                cardZone.color = DARK_COLOR // 'black'
                cardZone.strokeColor = SECONDARY_COLOR
                if (this.winConditionMet) {
                    this.gameRef.loadLevel('start-screen')
                }
            })
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

    checkWinCondition() {
        let cardsInZones = 0
        this.simpleCardZones.forEach((cardZone: any) => {
            cardsInZones += Object.keys(cardZone.cardsInZone).length
        })

        if (cardsInZones >= this.simpleCards.length) {
            this.winConditionMet = true
            this.simpleButton.buttonText = 'You Win!'
            return
        }

        this.winConditionMet = false
        this.simpleButton.buttonText = 'Color Zones'
    }

    update() {
        this.handlePhysics()
        this.checkWinCondition()
        this.levelText.update()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {

            if (this.movingMouseTargetKey && this.activeMouseTargetPool[this.movingMouseTargetKey]) {
                this.activeMouseTarget = this.activeMouseTargetPool[this.movingMouseTargetKey]
            } else if (Object.keys(this.activeMouseTargetPool).length > 0) {
                // use the one with the highest index in the array of cards
                let highestIndex = -1
                this.simpleCards.forEach((card: any, ixd: number) => {
                    if (this.activeMouseTargetPool[card.objectKey] && ixd > highestIndex) {
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

        this.simpleCardZones.forEach((cardZone: any) => {
            cardZone.update()
        })

        this.discardZone.update()
        this.deckZone.update()


        if (!this.movingMouseTargetKey) {
            this.simpleButton.update()
            this.viewButton.update()
        }

        if (!this.simpleButton.hovered && !this.viewButton.hovered) {
            if (!this.activeMouseTarget && this.gameRef.mouseInfo.mouseDown) {
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

            // draw the simple card zones
            this.simpleCardZones.forEach((cardZone: any) => {
                cardZone.draw()
            })

            this.discardZone.draw()
            this.deckZone.draw()

            // draw the simple cards
            this.simpleCards.forEach((card: any) => {
                card.draw()
            })


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

        if (!this.movingMouseTargetKey) {
            this.simpleButton.draw()
            this.viewButton.draw()
        }

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