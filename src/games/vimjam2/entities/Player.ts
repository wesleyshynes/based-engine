import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export default class Player extends BasedObject {

  x: number = 0;
  y: number = 0;

  radius: number = 16;
  speed: number = 10;

  color: string = '#ce192b'

  target: XYCoordinateType = { x: 0, y: 0 }

  velocity: XYCoordinateType = { x: 0, y: 0 }
  tileMap: any;

  async preload() { }
  initialize() { }
  update() { }

  moveTo(moveTarget: { x: number, y: number, active?: boolean }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > this.radius / 2) {
      const speedFactor = this.speed * this.gameRef.diffMulti
      this.velocity = {
        x: (speedFactor / dt) * (moveTarget.x - this.x),
        y: (speedFactor / dt) * (moveTarget.y - this.y)
      }
      this.x += this.velocity.x
      if (this.tileMap && (!this.tileMap.onMap(this) || !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this)).walkable)) {
        this.x -= this.velocity.x
      }
      this.y += this.velocity.y
      if (this.tileMap && (!this.tileMap.onMap(this) || !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this)).walkable)) {
        this.y -= this.velocity.y
      }
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  setTarget(newTarget: XYCoordinateType) {
    this.target = newTarget
  }

  draw() {
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + this.gameRef.cameraPos.x,
      y: this.y + this.gameRef.cameraPos.y,
      radius: this.radius,
      fillColor: this.color
    })
  }
  tearDown() { }
}
