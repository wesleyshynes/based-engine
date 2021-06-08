import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween } from "../../../engine/libs/mathHelpers";

export class Bullet extends BasedObject {
  active: boolean = false
  target: { x: number, y: number } = { x: 0, y: 0 }
  speed: number = 15
  radius: number = 3
  velocity: { x: number, y: number } = { x: 0, y: 0 }
  maxDistance: number = 400
  traveled: number = 0
  lastShot: number = 0
  shotDelay: number = 200

  initialize() {}

  update() {
    if (this.active && this.traveled < this.maxDistance) {
      this.x += this.velocity.x
      this.y += this.velocity.y
      this.traveled += Math.abs(this.velocity.x) + Math.abs(this.velocity.y)
    } else {
      this.velocity = { x: 0, y: 0 }
      this.active = false
      this.traveled = 0
    }
  }

  setVelocityToTarget() {
    const diffMulti = this.gameRef.diffMulti
    const dt = distanceBetween(this, this.target)
    const speedFactor = this.speed * diffMulti
    this.velocity = {
      x: (speedFactor / dt) * (this.target.x - this.x),
      y: (speedFactor / dt) * (this.target.y - this.y)
    }
  }

  fire(start: {x: number, y: number}, end: {x: number, y: number}) {
    if(!this.active && this.gameRef.lastUpdate - this.lastShot >= this.shotDelay) {
      this.x = start.x
      this.y = start.y
      this.target = end
      this.setVelocityToTarget()
      this.active = true
      this.traveled = 0
      this.lastShot = this.gameRef.lastUpdate
      // this.gameRef.soundPlayer.playNote(-150, .3, 'square')
    }
  }


  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    if (this.active) {
      drawCircle({
        c: this.gameRef.ctx,
        x: cameraOffset.x + this.x,
        y: cameraOffset.y + this.y,
        fillColor: 'gold',
        radius: this.radius,
        // strokeColor: 'rgba(255,255,255,.5)',
        // strokeWidth: 2
      })
    }

  }
}
