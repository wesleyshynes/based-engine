import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class MovingPlatform extends PhysBox {
    x: number = 0
    y: number = 0

    minX: number = 0
    maxX: number = 300

    minY: number = 0
    maxY: number = 300

    width: number = 100
    height: number = 100

    color: string = 'red'
    strokeColor: string = 'darkred'
    innerGlowColor: string = 'rgba(171,195,47, 1)'
    angle: number = 0

    xSpeed: number = 3
    ySpeed: number = 3

    // set this value for 1 to make the box actually sticky
    pushMultiplier: number = .95

    xDirection: number = 0
    yDirection: number = 0

    otherBodies: any[] = []

    options = {
        tags: {
            wall: true,
            terrain: true,
            movingPlatform: true
        }
    }

    body: any;

    bodyOptions = {
        label: `movingPlatform`,
        isStatic: true,
        inertia: Infinity,
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player || otherBody.options.tags.pushBox) {
                this.otherBodies.push(otherBody)
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player || otherBody.options.tags.pushBox) {
                this.otherBodies = this.otherBodies.filter(b => b.objectKey !== otherBody.objectKey)
            }
        }
    }

    async preload() { }
    initialize() {
        this.xDirection *= this.xSpeed
        this.yDirection *= this.ySpeed

        this.color = '#222222'
        this.strokeColor = '#141414'

        this.initializeBody()
        this.setCenter()
        
        // Apply initial rotation if set
        if (this.angle && this.body) {
            Physics.Body.setAngle(this.body, this.angle * Math.PI / 180)
        }
    }
    update() {
        this.movePlatform()
    }

    movePlatform() {
        let currentX = this.body.position.x
        let mXTriggered = false
        let currentY = this.body.position.y
        let mYTriggered = false
        if (Math.abs(this.xDirection) > 0) {
            if (this.body.position.x <= this.minX) {
                this.xDirection = 1 * this.xSpeed
                currentX = this.minX
                mXTriggered = true
            }
            if (this.body.position.x >= this.maxX) {
                this.xDirection = -1 * this.xSpeed
                currentX = this.maxX
                mXTriggered = true
            }
        }

        if (Math.abs(this.yDirection) > 0) {
            if (this.body.position.y <= this.minY) {
                this.yDirection = 1 * this.ySpeed
                currentY = this.minY
                mYTriggered = true
            }
            if (this.body.position.y >= this.maxY) {
                this.yDirection = -1 * this.ySpeed
                currentY = this.maxY
                mYTriggered = true
            }
        }


        this.otherBodies.forEach((b: any) => {
            if (!b.options.tags.static) {
                Physics.Body.setPosition(b.body, {
                    x: b.body.position.x + this.xDirection * this.gameRef.diffMulti * (mXTriggered ? -1 : this.pushMultiplier),
                    y: b.body.position.y + this.yDirection * this.gameRef.diffMulti * (mYTriggered ? -1 : this.pushMultiplier)
                })
            }
        })

        Physics.Body.setPosition(this.body, {
            x: currentX + this.xDirection * this.gameRef.diffMulti,
            y: currentY + this.yDirection * this.gameRef.diffMulti
        })
    }


    draw() {
        // this.drawPhysicsBody()
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.body.angle)
        }, () => {

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 2 * this.gameRef.cameraZoom,
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2) + 10) * this.gameRef.cameraZoom,
                y: (-(this.height / 2) + 10) * this.gameRef.cameraZoom,
                width: (this.width - 20) * this.gameRef.cameraZoom,
                height: (this.height - 20) * this.gameRef.cameraZoom,
                fillColor: this.innerGlowColor,
                strokeColor: '#3b3b3b',
                strokeWidth: 2 * this.gameRef.cameraZoom,
                borderRadius: 10 * this.gameRef.cameraZoom
            })

            // const squareDim = 4
            // let squareCount = 0

            // while (squareCount * squareDim + squareCount < this.width / 2 - squareDim - 15) {
            //     drawBox({
            //         c: this.gameRef.ctx,
            //         x: ((squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //         y: (-squareDim / 2) * this.gameRef.cameraZoom,
            //         width: (squareDim) * this.gameRef.cameraZoom,
            //         height: (squareDim) * this.gameRef.cameraZoom,
            //         fillColor: '#3b3b3b',
            //     })

            //     if(squareCount > 0) {
            //         drawBox({
            //             c: this.gameRef.ctx,
            //             x: (-(squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //             y: (-squareDim / 2) * this.gameRef.cameraZoom,
            //             width: (squareDim) * this.gameRef.cameraZoom,
            //             height: (squareDim) * this.gameRef.cameraZoom,
            //             fillColor: '#3b3b3b',
            //         })
            //     }


            //     let vSquareCount = 1
            //     while (vSquareCount * squareDim + vSquareCount < this.height / 2 - squareDim - 15) {
            //         drawBox({
            //             c: this.gameRef.ctx,
            //             x: ((squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //             y: ((vSquareCount * squareDim + vSquareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //             width: (squareDim) * this.gameRef.cameraZoom,
            //             height: (squareDim) * this.gameRef.cameraZoom,
            //             fillColor: '#3b3b3b',
            //         })
            //         drawBox({
            //             c: this.gameRef.ctx,
            //             x: (-(squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //             y: (-(vSquareCount * squareDim + vSquareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //             width: (squareDim) * this.gameRef.cameraZoom,
            //             height: (squareDim) * this.gameRef.cameraZoom,
            //             fillColor: '#3b3b3b',
            //         })

            //         if(vSquareCount > 0 && squareCount > 0) {
            //             drawBox({
            //                 c: this.gameRef.ctx,
            //                 x: (-(squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //                 y: ((vSquareCount * squareDim + vSquareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //                 width: (squareDim) * this.gameRef.cameraZoom,
            //                 height: (squareDim) * this.gameRef.cameraZoom,
            //                 fillColor: '#3b3b3b',
            //             })
            //             drawBox({
            //                 c: this.gameRef.ctx,
            //                 x: ((squareCount * squareDim + squareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //                 y: (-(vSquareCount * squareDim + vSquareCount) - (squareDim / 2)) * this.gameRef.cameraZoom,
            //                 width: (squareDim) * this.gameRef.cameraZoom,
            //                 height: (squareDim) * this.gameRef.cameraZoom,
            //                 fillColor: '#3b3b3b',
            //             })
            //         }                 
            //         vSquareCount++
            //     }

            //     squareCount++
            // }



        })
    }
    tearDown() { }

}