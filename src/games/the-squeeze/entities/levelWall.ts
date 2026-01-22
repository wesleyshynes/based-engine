import { drawBox, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

const FILL_COLOR = '#222222'
const BORDER_COLOR = '#111111'

// const GREY_SHADES = [
//     '#222222',
//     '#121212',
//     '#11111',
// ]

export class LevelWall extends PhysBox {

    strokeColor: string = BORDER_COLOR
    color: string = FILL_COLOR

    options = {
        tags: {
            wall: true,
            terrain: true,
        }
    }

    bodyOptions = { label: `wall`, isStatic: true }

    initialize() {

        // this.color = GREY_SHADES[Math.floor(Math.random() * GREY_SHADES.length)]
        // const filteredShades = GREY_SHADES.filter((shade) => shade !== this.color)
        // this.strokeColor = filteredShades[Math.floor(Math.random() * filteredShades.length)]

        this.color = FILL_COLOR
        this.strokeColor = BORDER_COLOR

        this.initializeBody()
        this.setCenter()
    }

    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.body.angle)
        }, () => {

            const minDimension = Math.min(this.width, this.height)
            const boxInset = minDimension > 60 ? 25 : 15

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            if (minDimension > 60) {

                let lineMultiplier = 1
                // vertical line down middle
                drawLine({
                    c: this.gameRef.ctx,
                    x: 0,
                    y: (-this.height / 2) * this.gameRef.cameraZoom,
                    toX: 0,
                    toY: (this.height / 2) * this.gameRef.cameraZoom,
                    strokeColor: this.strokeColor,
                    strokeWidth: 2 * this.gameRef.cameraZoom
                })
                // // horizontal line across middle
                drawLine({
                    c: this.gameRef.ctx,
                    x: (-this.width / 2) * this.gameRef.cameraZoom,
                    y: 0,
                    toX: (this.width / 2) * this.gameRef.cameraZoom,
                    toY: 0,
                    strokeColor: this.strokeColor,
                    strokeWidth: 2 * this.gameRef.cameraZoom
                })

                while (boxInset * lineMultiplier <= this.width / 2 - boxInset) {
                    const lineOffsetAmount = boxInset * lineMultiplier
                    // vertical line down middle
                    drawLine({
                        c: this.gameRef.ctx,
                        x: -lineOffsetAmount * this.gameRef.cameraZoom,
                        y: (-this.height / 2) * this.gameRef.cameraZoom,
                        toX: -lineOffsetAmount * this.gameRef.cameraZoom,
                        toY: (this.height / 2) * this.gameRef.cameraZoom,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2 * this.gameRef.cameraZoom
                    })
                    drawLine({
                        c: this.gameRef.ctx,
                        x: lineOffsetAmount * this.gameRef.cameraZoom,
                        y: (-this.height / 2) * this.gameRef.cameraZoom,
                        toX: lineOffsetAmount * this.gameRef.cameraZoom,
                        toY: (this.height / 2) * this.gameRef.cameraZoom,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2 * this.gameRef.cameraZoom
                    })
                    lineMultiplier++
                }

                lineMultiplier = 1

                while (boxInset * lineMultiplier <= this.height / 2 - boxInset) {
                    const lineOffsetAmount = boxInset * lineMultiplier
                    // horizontal line across middle
                    drawLine({
                        c: this.gameRef.ctx,
                        x: (-this.width / 2) * this.gameRef.cameraZoom,
                        y: lineOffsetAmount * this.gameRef.cameraZoom,
                        toX: (this.width / 2) * this.gameRef.cameraZoom,
                        toY: lineOffsetAmount * this.gameRef.cameraZoom,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2 * this.gameRef.cameraZoom
                    })
                    drawLine({
                        c: this.gameRef.ctx,
                        x: (-this.width / 2) * this.gameRef.cameraZoom,
                        y: -lineOffsetAmount * this.gameRef.cameraZoom,
                        toX: (this.width / 2) * this.gameRef.cameraZoom,
                        toY: -lineOffsetAmount * this.gameRef.cameraZoom,
                        strokeColor: this.strokeColor,
                        strokeWidth: 2 * this.gameRef.cameraZoom
                    })
                    lineMultiplier++
                }
            }



            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2) + boxInset) * this.gameRef.cameraZoom,
                y: (-(this.height / 2) + boxInset) * this.gameRef.cameraZoom,
                width: (this.width - boxInset * 2) * this.gameRef.cameraZoom,
                height: (this.height - boxInset * 2) * this.gameRef.cameraZoom,
                // fillColor: this.color,
                // strokeColor: this.strokeColor,
                fillColor: this.strokeColor,
                strokeColor: 'black', // this.color,
                strokeWidth: 1 * this.gameRef.cameraZoom
            })



        })
    }
}
