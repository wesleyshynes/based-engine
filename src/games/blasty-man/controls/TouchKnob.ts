import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class TouchKnob extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 200
  height: number = 200
  radius: number = 40

  knobActive: boolean = false
  knobCoord: XYCoordinateType = { x: 0, y: 0 }
  knobCenter: XYCoordinateType = { x: 0, y: 0 }
  knobRadius: number = 30

  maxOffset: number = 30

  async preload() { }
  initialize() { }

  update() {
    const x1 = this.x
    const y1 = this.y
    const x2 = this.x + this.width
    const y2 = this.y + this.height
    const { x, y } = this.gameRef.mouseInfo
    const hovered = x > x1 && x < x2 && y > y1 && y < y2

    if (!this.knobActive) {
      if (this.gameRef.mouseInfo.mouseDown && hovered) {
        this.knobActive = true
        this.knobCoord = {
          x: 0,
          y: 0
        }
        this.knobCenter = {
          x: this.gameRef.mouseInfo.x,
          y: this.gameRef.mouseInfo.y
        }
      }
    } else {
      if (this.gameRef.mouseInfo.mouseDown) {
        const dist = distanceBetween(this.knobCenter, this.gameRef.mouseInfo)
        const angle = angleBetween(this.knobCenter, this.gameRef.mouseInfo)
        this.knobCoord = pointOnCircle(angle, dist <= this.maxOffset ? dist : this.maxOffset)
      } else {
        this.knobActive = false
      }
    }
  }

  centerCoordinates() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }
  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: 'rgba(255,0,0,.2)'
    })

    if (this.knobActive) {
      drawCircle({
        c: this.gameRef.ctx,
        ...this.knobCenter,
        radius: this.radius,
        fillColor: 'rgba(255,255,255,.5)'
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: this.knobCoord.x + this.knobCenter.x,
        y: this.knobCoord.y + this.knobCenter.y,
        radius: this.knobRadius,
        fillColor: 'rgba(0,0,0,.5)'
      })
    }
  }
}
