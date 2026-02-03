import { drawBox, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

const FILL_COLOR = '#222222'
const BORDER_COLOR = '#111111'

export class LevelWall extends PhysBox {

    strokeColor: string = BORDER_COLOR
    color: string = FILL_COLOR
    angle: number = 0

    options = {
        tags: {
            wall: true,
            terrain: true,
        }
    }

    bodyOptions = { label: `wall`, isStatic: true }

    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: radToDeg(this.body.angle),
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {

            const minDimension = Math.min(this.width, this.height)
            const boxInset = minDimension > 60 ? 25 : 15

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)),
                y: (-(this.height / 2)),
                width: this.width,
                height: this.height,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })

            if (minDimension > 60) {

                let lineMultiplier = 1
                // vertical line down middle
                drawLine({
                    c: this.gameRef.ctx,
                    x: 0,
                    y: (-this.height / 2),
                    toX: 0,
                    toY: (this.height / 2),
                    strokeColor: this.strokeColor,
                    strokeWidth: 2,
                    zoom: this.gameRef.cameraZoom
                })
                // // horizontal line across middle
                drawLine({
                    c: this.gameRef.ctx,
                    x: (-this.width / 2),
                    y: 0,
                    toX: (this.width / 2),
                    toY: 0,
                    strokeColor: this.strokeColor,
                    strokeWidth: 2,
                    zoom: this.gameRef.cameraZoom
                })

                while (boxInset * lineMultiplier <= this.width / 2 - boxInset) {
                    const lineOffsetAmount = boxInset * lineMultiplier
                    // vertical line down middle
                    drawLine({
                        c: this.gameRef.ctx,
                        x: -lineOffsetAmount,
                        y: (-this.height / 2),
                        toX: -lineOffsetAmount,
                        toY: (this.height / 2),
                        strokeColor: this.strokeColor,
                        strokeWidth: 2,
                        zoom: this.gameRef.cameraZoom
                    })
                    drawLine({
                        c: this.gameRef.ctx,
                        x: lineOffsetAmount,
                        y: (-this.height / 2),
                        toX: lineOffsetAmount,
                        toY: (this.height / 2),
                        strokeColor: this.strokeColor,
                        strokeWidth: 2,
                        zoom: this.gameRef.cameraZoom
                    })
                    lineMultiplier++
                }

                lineMultiplier = 1

                while (boxInset * lineMultiplier <= this.height / 2 - boxInset) {
                    const lineOffsetAmount = boxInset * lineMultiplier
                    // horizontal line across middle
                    drawLine({
                        c: this.gameRef.ctx,
                        x: (-this.width / 2),
                        y: lineOffsetAmount,
                        toX: (this.width / 2),
                        toY: lineOffsetAmount,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2,
                        zoom: this.gameRef.cameraZoom
                    })
                    drawLine({
                        c: this.gameRef.ctx,
                        x: (-this.width / 2),
                        y: -lineOffsetAmount,
                        toX: (this.width / 2),
                        toY: -lineOffsetAmount,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2,
                        zoom: this.gameRef.cameraZoom
                    })
                    lineMultiplier++
                }
            }



            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2) + boxInset),
                y: (-(this.height / 2) + boxInset),
                width: (this.width - boxInset * 2),
                height: (this.height - boxInset * 2),
                // fillColor: this.color,
                // strokeColor: this.strokeColor,
                fillColor: this.strokeColor,
                strokeColor: 'black', // this.color,
                strokeWidth: 1,
                zoom: this.gameRef.cameraZoom
            })



        })
    }
}
