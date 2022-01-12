import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class ShotTarget extends BasedObject {
  x: number = 0
  y: number = 0
  active: boolean = false

  radius: number = 8
  color: string = 'red'

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

  draw() {
    if(this.active) {
      drawCircle({
        c: this.gameRef.ctx,
        x: this.x + this.gameRef.cameraPos.x,
        y: this.y + this.gameRef.cameraPos.y,
        radius: this.radius,
        fillColor: this.color
      })
    }

  }
  tearDown() {}

}
