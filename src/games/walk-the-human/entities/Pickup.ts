import { BasedObject } from "../../../engine/BasedObject"
import { drawCircle } from "../../../engine/libs/drawHelpers"

export class Pickup extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 10
  fillColor: string = 'yellow'
  active: boolean = true
  onPickup: () => void = () => null
  async preload() {}
  initialize() {
    this.active = true
  }
  update() {}
  tearDown() {}
  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      radius: this.radius,
      fillColor: this.fillColor
    })
  }
}
