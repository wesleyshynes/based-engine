import { drawCircle, drawEllipse, rotateDraw } from "../../../engine/libs/drawHelpers";
import { normalizeVector } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js'

export class MainPlayer extends PhysBall {
    x: number = 100
    y: number = 100

    color: string = 'white'

    currentColor = {
        r: 255,
        g: 116,
        b: 0,
    }

    maxColor = {
        r: 255,
        g: 77,
        b: 0,
    }

    minColor = {
        r: 255,
        g: 193,
        b: 0,
    }

    moveKnob: any
    shrinkButton: any
    growButton: any

    originalRadius: number = 50
    activeMaxRadius: number = 100
    maxRadius: number = 100
    radius: number = 50
    minRadius: number = 25
    sizeSpeed: number = .05

    baseSpeed: number = 8

    wallCount: number = 0

    // sound fx
    lastThud: number = 0
    wallThuds: any[] = []

    lastStep: number = 0
    walkingSounds: any[] = []

    lastBoxThud: number = 0
    boxThuds: any[] = []


    options = {
        tags: {
            player: true,
        }
    }

    collisionGroup: any = Physics.Body.nextGroup(true)

    bodyOptions = {
        label: 'player',
        inertia: Infinity,
        collisionFilter: { group: this.collisionGroup },
        // friction: 0,
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            // console.log('collision start', otherBody)
            if (otherBody.options.tags.wall) {
                this.wallCount++
                if (this.wallCount > 1) {
                    this.maxRadius = this.radius
                } else {
                    this.maxRadius = this.activeMaxRadius
                }
                if (otherBody.options.tags.pushBox) {
                    if (this.boxThuds.length > 0 && this.gameRef.lastUpdate - this.lastBoxThud > 300) {
                        const randomThud = this.boxThuds[Math.floor(Math.random() * this.boxThuds.length)]
                        this.gameRef.soundPlayer.playSound(randomThud)
                        this.lastBoxThud = this.gameRef.lastUpdate
                    }
                } else {
                    if (this.wallThuds.length > 0 && this.gameRef.lastUpdate - this.lastThud > 600) {
                        // this.gameRef.soundPlayer.playSound(this.wallThud)
                        const randomThud = this.wallThuds[Math.floor(Math.random() * this.wallThuds.length)]
                        this.gameRef.soundPlayer.playSound(randomThud)
                        this.lastThud = this.gameRef.lastUpdate
                    }
                }
            }

            this.gameRef.shakeCamera(5 * (this.radius / this.originalRadius))

        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.wall) {
                this.wallCount--
                if (this.wallCount < 0) {
                    this.wallCount = 0
                }
                if (this.wallCount === 0) {
                    this.maxRadius = this.activeMaxRadius
                }
            }
        }
    }

    async preload() { }

    initialize() {
        this.initializeBody()
        this.setCenter()
    }

    setMoveKnob(knob: any) {
        this.moveKnob = knob
    }
    setShrinkButton(button: any) {
        this.shrinkButton = button
    }
    setGrowButton(button: any) {
        this.growButton = button
    }

    setWallThuds(thuds: any[]) {
        this.wallThuds = thuds
    }
    setWalkingSounds(sounds: any[]) {
        this.walkingSounds = sounds
    }
    setBoxThuds(thuds: any[]) {
        this.boxThuds = thuds
    }

    update() {
        this.handleKeys()
        // this.validatePosition()
    }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        let moveY = 0

        let scale = 1

        const activeSpeed = this.baseSpeed


        // keyboard stuff
        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= activeSpeed
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += activeSpeed
        }
        if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
            moveY -= activeSpeed
        }
        if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
            moveY += activeSpeed
        }

        if ((pressedKeys['KeyX'] || pressedKeys['KeyM']) && this.wallCount < 2) {
            scale += this.sizeSpeed
        }

        if ((pressedKeys['KeyZ'] || pressedKeys['KeyN']) || (this.shrinkButton && this.shrinkButton.focused)) {
            scale -= this.sizeSpeed
        }
        // end keyboard stuff



        // touch stuff
        if (this.moveKnob && this.moveKnob.knobActive) {
            const speedFactor = activeSpeed * this.gameRef.diffMulti
            moveX += (this.moveKnob.knobCoord.x / this.moveKnob.maxOffset) * speedFactor
            moveY += (this.moveKnob.knobCoord.y / this.moveKnob.maxOffset) * speedFactor
        }

        if (this.gameRef.touchMode) {
            if (this.shrinkButton && this.shrinkButton.hovered) {
                scale -= this.sizeSpeed
            }
            if (this.growButton && this.growButton.hovered) {
                scale += this.sizeSpeed
            }
        }
        // end touch stuff


        if (moveX !== 0 || moveY !== 0) {
            Physics.Body.setVelocity(this.body, normalizeVector({
                y: moveY,
                x: moveX
            }, activeSpeed))
            if (this.gameRef.lastUpdate - this.lastStep > 100) {
                const randomStep = this.walkingSounds[Math.floor(Math.random() * this.walkingSounds.length)]
                this.gameRef.soundPlayer.playSound(randomStep)
                this.lastStep = this.gameRef.lastUpdate
            }
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }

        if (scale > 1) {
            if (this.radius < this.maxRadius - 1) {
                if (this.radius * scale < this.maxRadius) {
                    Physics.Body.scale(this.body, scale, scale)
                    this.radius *= scale
                } else if (this.radius != this.maxRadius) {
                    Physics.Body.scale(this.body, this.maxRadius / this.radius, this.maxRadius / this.radius)
                    this.radius = this.maxRadius
                }
            }
        } else if (scale < 1) {
            if (this.radius * scale > this.minRadius) {
                Physics.Body.scale(this.body, scale, scale)
                this.radius *= scale
            } else if (this.radius != this.minRadius) {
                Physics.Body.scale(this.body, this.minRadius / this.radius, this.minRadius / this.radius)
                this.radius = this.minRadius
            }
        } else if (this.radius != this.originalRadius) {
            scale = this.radius > this.originalRadius ? 1 - this.sizeSpeed : this.wallCount < 2 ? 1 + this.sizeSpeed : 1
            const radiusScale = Math.abs((this.radius - this.originalRadius) / this.originalRadius)
            if (radiusScale > this.sizeSpeed * 1.2) {
                // if (this.radius != this.originalRadius) {
                Physics.Body.scale(this.body, scale, scale)
                this.radius *= scale
            } else {
                Physics.Body.scale(this.body, this.originalRadius / this.radius, this.originalRadius / this.radius)
                this.radius = this.originalRadius
            }
        }

        // this.scaled = false
    }

    drawShadows() {
        this.gameRef.ctx.globalAlpha = .3

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: (this.body.position.y + this.radius * .75) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: 0
        }, () => {

            drawEllipse({
                c: this.gameRef.ctx,
                x: this.bodyCenter.x,
                y: this.bodyCenter.y,
                radiusX: this.radius * this.gameRef.cameraZoom * 1.1,
                radiusY: (this.radius * this.gameRef.cameraZoom) * .6,
                fillColor: 'black'
            })
        })

        this.gameRef.ctx.globalAlpha = 1
    }

    draw() {

        // this.drawPhysicsBody()

        const radiusOffset = this.originalRadius - this.radius

        const nV = {
            x: (this.body.velocity.x / this.baseSpeed) * this.radius / 8,
            y: (this.body.velocity.y / this.baseSpeed) * this.radius / 8,
        }

        const yOffset = ((this.gameRef.lastUpdate % 200) / 200) * nV.y
        const xOffset = ((this.gameRef.lastUpdate % 200) / 200) * nV.x

        const offSetMultiplier = this.gameRef.lastUpdate % 400 > 200 ? 1 : -1

        const maxOffset = Math.max(Math.abs(yOffset), Math.abs(xOffset)) + offSetMultiplier

        this.currentColor = {
            r: this.maxColor.r - (this.maxColor.r - this.minColor.r) * radiusOffset / this.originalRadius,
            g: this.maxColor.g - (this.maxColor.g - this.minColor.g) * radiusOffset / this.originalRadius,
            b: this.maxColor.b - (this.maxColor.b - this.minColor.b) * radiusOffset / this.originalRadius,
        }

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: 0 // radToDeg(this.body.angle)
        }, () => {

            // draw 2 feet at 1/4 radius bottom of body

            // left foot
            drawCircle({
                c: this.gameRef.ctx,
                x: -(this.radius / 2 - (nV.x)) * this.gameRef.cameraZoom,
                y: (this.radius * .7 + (nV.y + maxOffset)) * this.gameRef.cameraZoom,
                radius: (this.radius / 3) * this.gameRef.cameraZoom,
                fillColor: 'black',
            })

            // right foot
            drawCircle({
                c: this.gameRef.ctx,
                x: (this.radius / 2 + (nV.x)) * this.gameRef.cameraZoom,
                y: (this.radius * .7 + (nV.y - maxOffset)) * this.gameRef.cameraZoom,
                radius: (this.radius / 3) * this.gameRef.cameraZoom,
                fillColor: 'black',
            })

            if (this.body.velocity.x < 0) {
                // left arm
                drawCircle({
                    c: this.gameRef.ctx,
                    x: (-this.radius + nV.x) * this.gameRef.cameraZoom,
                    y: (this.radius * .2 - nV.y * 2) * this.gameRef.cameraZoom,
                    radius: (this.radius / 4) * this.gameRef.cameraZoom,
                    fillColor: 'black',
                })
            }

            if (this.body.velocity.x > 0) {
                // right arm
                drawCircle({
                    c: this.gameRef.ctx,
                    x: (this.radius + nV.x) * this.gameRef.cameraZoom,
                    y: (this.radius * .2 - nV.y * 2) * this.gameRef.cameraZoom,
                    radius: (this.radius / 4) * this.gameRef.cameraZoom,
                    fillColor: 'black',
                })
            }

            // draw body
            drawCircle({
                c: this.gameRef.ctx,
                x: this.bodyCenter.x,
                y: this.bodyCenter.y,
                radius: this.radius * this.gameRef.cameraZoom,
                fillColor: `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`,
                // fillColor: 'red',
            })


            // draw arms

            if (this.body.velocity.x >= 0) {
                // left arm
                drawCircle({
                    c: this.gameRef.ctx,
                    x: (-this.radius + nV.x * 2) * this.gameRef.cameraZoom,
                    y: (this.radius * .2 - nV.y * 2) * this.gameRef.cameraZoom,
                    radius: (this.radius / 4) * this.gameRef.cameraZoom,
                    fillColor: 'black',
                })
            }

            if (this.body.velocity.x <= 0) {
                // right arm
                drawCircle({
                    c: this.gameRef.ctx,
                    x: (this.radius + nV.x * 2) * this.gameRef.cameraZoom,
                    y: (this.radius * .2 - nV.y * 2) * this.gameRef.cameraZoom,
                    radius: (this.radius / 4) * this.gameRef.cameraZoom,
                    fillColor: 'black',
                })
            }

            // draw head white head at 1/4 radius top of body
            drawCircle({
                c: this.gameRef.ctx,
                x: nV.x * this.gameRef.cameraZoom,
                y: -((this.radius / 2) - nV.y) * this.gameRef.cameraZoom,
                radius: (this.radius / 2) * this.gameRef.cameraZoom,
                fillColor: 'white',
            })
            // draw small black eyes
            drawCircle({
                c: this.gameRef.ctx,
                x: (-this.radius / 5 + nV.x * 2) * this.gameRef.cameraZoom,
                y: -((this.radius / 1.5) - nV.y * 2 - this.radius / 5) * this.gameRef.cameraZoom,
                radius: (this.radius / 10) * this.gameRef.cameraZoom,
                fillColor: 'black',
            })

            drawCircle({
                c: this.gameRef.ctx,
                x: (this.radius / 5 + nV.x * 2) * this.gameRef.cameraZoom,
                y: -((this.radius / 1.5) - nV.y * 2 - this.radius / 5) * this.gameRef.cameraZoom,
                radius: (this.radius / 10) * this.gameRef.cameraZoom,
                fillColor: 'black',
            })

        })
    }
}