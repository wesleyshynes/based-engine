import { BasedObject } from "../../../engine/BasedObject"

export class MovingBox extends BasedObject {

  x: number = 0
  y: number = 0
  width: number = 10
  height: number = 10
  fillColor: string = '#ce192b'
  speed: number = 1

  initialize() { }
  update() {
    const speedFactor = this.speed * this.gameRef.diffMulti
    this.x += speedFactor
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(this.x, this.y, this.width, this.height)
    this.gameRef.ctx.fillStyle = this.fillColor
    this.gameRef.ctx.fill()
  }
}
