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
  entityTag: string = 'bullet'

  trails: any = []
  lastTrail: number = 0
  trailDiff: number = 10
  trailTime: number = 200
  trailLimit: number = 10

  initialize() {}

  update() {
    if (this.active && this.traveled < this.maxDistance) {
      this.handleTrails()
      this.x += this.velocity.x
      this.y += this.velocity.y
      this.trails.forEach((trail:any) => {
        trail.x += this.velocity.x/5
        trail.y += this.velocity.y/5
      })
      this.traveled += Math.abs(this.velocity.x) + Math.abs(this.velocity.y)
    } else {
      this.velocity = { x: 0, y: 0 }
      this.active = false
      this.traveled = 0
    }
  }

  handleTrails() {
    if(this.lastTrail + this.trailDiff < this.gameRef.lastUpdate) {
      this.trails.unshift({
        x: this.x,
        y: this.y,
        time: this.gameRef.lastUpdate + this.trailTime
      })
      this.lastTrail = this.gameRef.lastUpdate
    }
    if(this.trails.length > this.trailLimit) {
      this.trails = this.trails.slice(0,this.trailLimit-1)
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
      return true
    }
    return false
  }


  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    this.trails.forEach((trail: any) => {
      if(trail.time > this.gameRef.lastUpdate) {
      this.gameRef.ctx.globalAlpha = (trail.time - this.gameRef.lastUpdate)/(this.trailTime * 2)
      drawCircle({
        c: this.gameRef.ctx,
        x: cameraOffset.x + trail.x,
        y: cameraOffset.y + trail.y,
        fillColor: 'black',
        radius: this.radius * (trail.time - this.gameRef.lastUpdate)/(this.trailTime)
      })
      this.gameRef.ctx.globalAlpha = 1
      }
    })
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
