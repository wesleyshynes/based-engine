import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { drawBox, drawCameraFrame, drawLine, drawText } from '../../../engine/libs/drawHelpers';
import { XYCoordinateType } from '../../../engine/libs/mathHelpers';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import Physics from 'matter-js';
import { SimpleCard } from '../entities/simpleCard';
import { SimpleCardZone } from '../entities/simpleCardZone';
import { MouseTarget } from "../entities/mouseTarget";
import { BlackJackPlayerZone } from "../entities/blackJackPlayerZone";
import { has } from "lodash";

export class BlackJack extends BasedLevel {

    physics: any

    levelWidth: number = 800
    levelHeight: number = 1000

    // Camera related stuff
    viewFullMap: boolean = true
    followCam: any;

    mouseTarget: any;
    activeMouseTargetPool: any = {}
    activeMouseTarget: any;
    movingMouseTargetKey: string = ''
    mouseTargetOffset: XYCoordinateType = { x: 0, y: 0 }
    lastMouseDown: number = 0
    lastMouseMove: number = 0
    lastMousePos: XYCoordinateType = { x: 0, y: 0 }

    // Card system
    deck: any[] = []
    deckZone: any;
    playZones: any[] = []

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

        this.setupMouseTarget()
        this.setupDeck()
        this.setupPlayZones()

        this.followCam.initialize()
    }

    setupMouseTarget() {
        this.mouseTarget = new MouseTarget({
            key: `mouseTarget`,
            gameRef: this.gameRef,
        })

        this.mouseTarget.color = LIGHT_COLOR
        this.mouseTarget.strokeColor = DARK_COLOR

        this.mouseTarget.collisionStartFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                this.activeMouseTargetPool[otherBody.objectKey] = otherBody
                this.mouseTarget.color = PRIMARY_COLOR
                this.mouseTarget.strokeColor = SECONDARY_COLOR
            }
        }

        this.mouseTarget.collisionEndFn = (o: any) => {
            const otherBody = o.plugin.basedRef()
            if (otherBody && otherBody.options && otherBody.options.tags.simpleCard) {
                delete this.activeMouseTargetPool[otherBody.objectKey]
            }
            if (Object.keys(this.activeMouseTargetPool).length === 0) {
                this.mouseTarget.color = LIGHT_COLOR
                this.mouseTarget.strokeColor = DARK_COLOR
            }
        }
        this.mouseTarget.initialize()
        this.gameRef.addToWorld(this.mouseTarget.body)
    }

    setupDeck() {
        // Create deck zone
        this.deckZone = new SimpleCardZone({
            key: `deckZone`,
            gameRef: this.gameRef
        })
        this.deckZone.x = 100
        this.deckZone.y = 200
        this.deckZone.color = SECONDARY_COLOR
        this.deckZone.textColor = DARK_COLOR
        this.deckZone.strokeColor = DARK_COLOR
        this.deckZone.zoneText = 'Deck'
        this.deckZone.cardOffset = { x: .1, y: .1 }
        this.deckZone.initialize()
        this.gameRef.addToWorld(this.deckZone.body)

        // Create 52 cards and add them to the deck
        const suits = ['♠', '♥', '♦', '♣']
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

        suits.forEach((suit, suitIdx) => {
            values.forEach((value, valueIdx) => {
                const card = new SimpleCard({
                    key: `card-${suit}-${value}`,
                    gameRef: this.gameRef,
                })

                card.x = this.deckZone.x
                card.y = this.deckZone.y
                card.color = PRIMARY_COLOR
                card.faceColor = (suit === '♥' || suit === '♦') ? '#bc4749' : '#2b2d42'
                card.strokeColor = DARK_COLOR
                card.faceUp = false

                // Store card data
                card.suit = suit
                card.value = value
                card.cardText = `${value}${suit}`

                card.initialize()
                this.gameRef.addToWorld(card.body)

                this.deck.push(card)
                this.deckZone.cardsInZone[card.objectKey] = card
            })
        })

        // Shuffle the deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }

    }

    setupPlayZones() {
        // Create 3 play zones where cards can be dealt
        const zonePositions = [
            { x: 300, y: 400 },
            { x: 500, y: 400 },
            { x: 700, y: 400 }
        ]

        zonePositions.forEach((pos, idx) => {
            const zone = new BlackJackPlayerZone({
                key: `playZone-${idx}`,
                gameRef: this.gameRef
            })
            zone.x = pos.x
            zone.y = pos.y
            zone.color = SECONDARY_COLOR
            zone.textColor = DARK_COLOR
            zone.strokeColor = DARK_COLOR
            zone.zoneText = `Play ${idx + 1}`

            zone.initialize()
            this.gameRef.addToWorld(zone.body)
            this.playZones.push(zone)
        })
    }

    update() {
        this.handlePhysics()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {

            if (this.movingMouseTargetKey && this.activeMouseTargetPool[this.movingMouseTargetKey]) {
                this.activeMouseTarget = this.activeMouseTargetPool[this.movingMouseTargetKey]
            } else if (Object.keys(this.activeMouseTargetPool).length > 0) {
                // Use the topmost card (highest index)
                let highestIndex = -1
                this.deck.forEach((card: any, idx: number) => {
                    if (this.activeMouseTargetPool[card.objectKey] && idx > highestIndex) {
                        highestIndex = idx
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
        this.deck.forEach((card: any) => {
            card.targeted = false
        })

        this.updateCamera()

        const hasMouseMoved = this.lastMousePos.x !== this.gameRef.cameraMouseInfo.x || this.lastMousePos.y !== this.gameRef.cameraMouseInfo.y

        if (hasMouseMoved) {
            this.lastMouseMove = this.gameRef.lastUpdate
        }

        this.lastMousePos = {
            x: this.gameRef.cameraMouseInfo.x,
            y: this.gameRef.cameraMouseInfo.y
        }

        // Hide mouse target when idle
        // if (!hasMouseMoved && this.gameRef.lastUpdate - this.lastMouseDown > 500 && this.gameRef.lastUpdate - this.lastMouseMove > 500) {
        //     Physics.Body.setPosition(this.mouseTarget.body, {
        //         x: 2000,
        //         y: 2000
        //     })
        // } else {
        //     Physics.Body.setPosition(this.mouseTarget.body, {
        //         x: this.gameRef.cameraMouseInfo.x,
        //         y: this.gameRef.cameraMouseInfo.y
        //     })
        // }

        if (hasMouseMoved) {
            Physics.Body.setPosition(this.mouseTarget.body, {
                x: this.gameRef.cameraMouseInfo.x,
                y: this.gameRef.cameraMouseInfo.y
            })
        }

        // Handle card dragging
        if (this.gameRef.mouseInfo.mouseDown) {
            if (this.activeMouseTarget && this.activeMouseTarget.body && this.gameRef.lastUpdate - this.lastMouseDown < 100) {
                if (!this.mouseTargetOffset.x && !this.mouseTargetOffset.y) {
                    this.mouseTargetOffset = {
                        x: this.activeMouseTarget.body.position.x - this.mouseTarget.body.position.x,
                        y: this.activeMouseTarget.body.position.y - this.mouseTarget.body.position.y
                    }
                    // Move card to end of array (render on top)
                    this.deck = this.deck.filter((card: any) => card.objectKey !== this.activeMouseTarget.objectKey)
                    this.deck.push(this.activeMouseTarget)

                    // Remove from deck zone when dragging
                    delete this.deckZone.cardsInZone[this.activeMouseTarget.objectKey]
                }
                if (this.activeMouseTarget.setTargetedPosition) {
                    this.activeMouseTarget.setTargetedPosition(
                        this.gameRef.cameraMouseInfo.x + this.mouseTargetOffset.x,
                        this.gameRef.cameraMouseInfo.y + this.mouseTargetOffset.y
                    )
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
            }

            this.lastMouseDown = this.gameRef.lastUpdate
        } else {
            this.mouseTargetOffset = { x: 0, y: 0 }
            this.movingMouseTargetKey = ''
        }

        // Update zones
        this.deckZone.update()
        this.playZones.forEach((zone: any) => {
            zone.update()
        })
        this.deck.forEach((card: any) => {
            card.update()
        })
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

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
            // Level background
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

            // Draw deck zone
            this.deckZone.draw()


            const drawnCards: { [key: string]: boolean } = {}
            // Draw play zones
            this.playZones.forEach((zone: any) => {
                zone.draw()

                Object.keys(zone.cardsInZone).forEach((cardKey: string) => {
                    if (this.activeMouseTarget && this.activeMouseTarget.objectKey === cardKey) {
                        return
                    }
                    const card = zone.cardsInZone[cardKey]
                    card.draw()
                    drawnCards[card.objectKey] = true
                })
            })

            // Draw cards
            this.deck.forEach((card: any) => {
                // card.draw()
                if (!drawnCards[card.objectKey] && !(this.activeMouseTarget && this.activeMouseTarget.objectKey === card.objectKey)) {
                    card.draw()
                    drawnCards[card.objectKey] = true
                }
            })

            this.activeMouseTarget?.draw()

            // Draw mouse crosshair
            this.mouseTarget.draw()
        })

        drawText({
            c: this.gameRef.ctx,
            x: 21,
            y: 21,
            text: `BlackJack - Click and drag cards from deck to play zones`,
            fontSize: 20,
            fillColor: 'black',
            align: 'left',
            fontFamily: 'Arial'
        })

        drawText({
            c: this.gameRef.ctx,
            x: 20,
            y: 20,
            text: `BlackJack - Click and drag cards from deck to play zones`,
            fontSize: 20,
            fillColor: 'white',
            align: 'left',
            fontFamily: 'Arial'
        })
    }

    onResize() { }
    tearDown() { }
}