import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawLine } from "../../../engine/libs/drawHelpers";
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class ShotTarget extends BasedObject {
  x: number = 0
  y: number = 0
  active: boolean = false

  aimBase: XYCoordinateType = {
    x: 0,
    y: 0
  }

  radius: number = 8
  maxRadius: number = 10
  minRadius: number = 5
  radiusGrow: number = .2
  color: string = 'white'

  async preload() {}
  initialize() {}
  update() {}

  setTarget(coord: XYCoordinateType) {
    this.x = coord.x
    this.y = coord.y
    this.active = true
  }

  getTarget() {
    return {
      x: this.x,
      y: this.y
    }
  }

  clearTarget() {
    this.active = false
  }

  adjustRadius() {
    this.radius += this.radiusGrow
    if(this.radius > this.maxRadius) {
      this.radius = this.maxRadius
      this.radiusGrow = -1 * this.radiusGrow
    }
    if(this.radius < this.minRadius) {
      this.radius = this.minRadius
      this.radiusGrow = -1 * this.radiusGrow
    }
  }

  draw() {
    if(this.active) {
      
      drawLine({
        c: this.gameRef.ctx,
        x: this.aimBase.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.aimBase.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        toX: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        toY: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        strokeColor: 'rgba(255,255,255,0.5)',
        strokeWidth: 5 * this.gameRef.cameraZoom
      })

      this.adjustRadius()

      drawCircle({
        c: this.gameRef.ctx,
        x: this.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        radius: this.radius * this.gameRef.cameraZoom,
        fillColor: this.color
      })

    }

  }
  tearDown() {}

}
