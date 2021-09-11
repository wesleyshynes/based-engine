import { BasedObject } from "../../../engine/BasedObject";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { distanceBetween, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export default class PushBox extends BasedObject {

  x: number = 0
  y: number = 0

  radius: number = 20

  speed: number = 3

  width: number = 40
  height: number = 40

  objectKey: string = 'box'

  color: string = 'orange'
  tileMap: any;

  velocity: XYCoordinateType = { x: 0, y: 0 }

  async preload() { }
  initialize() { }
  update() { }

  moveTo(moveTarget: { x: number, y: number, active?: boolean }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > 0) {
      const speedFactor = this.speed * this.gameRef.diffMulti
      this.velocity = {
        x: (speedFactor / dt) * (moveTarget.x - this.x),
        y: (speedFactor / dt) * (moveTarget.y - this.y)
      }
      this.x += this.velocity.x
      const relX = relativeMultiplier(this.velocity.x) * this.radius
      if (
        this.tileMap &&
        (!this.tileMap.onMap({x: this.x + relX, y: this.y}) ||
        !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: this.x + relX, y: this.y})).walkable)
      ) {
        this.x -= this.velocity.x
      }
      this.y += this.velocity.y
      const relY = relativeMultiplier(this.velocity.y) * this.radius
      if (
        this.tileMap &&
        (!this.tileMap.onMap({x: this.x, y: this.y + relY}) ||
        !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: this.x, y: this.y + relY})).walkable)
      ) {
        this.y -= this.velocity.y
      }
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x - this.width / 2 + this.gameRef.cameraPos.x,
      y: this.y - this.height / 2 + this.gameRef.cameraPos.y,
      width: this.width,
      height: this.height,
      fillColor: this.color
    })
  }
  tearDown() { }
}
