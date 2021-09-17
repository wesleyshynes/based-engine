import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween } from "../../../engine/libs/mathHelpers";
import PoopSprite from '../../../assets/vimjam2/poop-sprite.png'
import FireNoise from '../../../assets/blasty-man/fireball.mp3'
import ContactNoise from '../../../assets/blasty-man/splat.mp3'

export class Projectile extends BasedObject {
  active: boolean = false
  target: { x: number, y: number } = { x: 0, y: 0 }
  speed: number = 15
  radius: number = 6
  velocity: { x: number, y: number } = { x: 0, y: 0 }
  maxDistance: number = 400
  traveled: number = 0
  lastShot: number = 0
  shotDelay: number = 200
  entityTag: string = 'bullet'

  angle: number = 0

  trails: any = []
  lastTrail: number = 0
  trailDiff: number = 10
  trailTime: number = 200
  trailLimit: number = 10

  sprite: any;

  fireNoise: any;
  contactNoise: any;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: PoopSprite,
      sx: 12,
      sy: 0,
      sWidth: 12,
      sHeight: 12,
      dx: -this.radius,
      dy: -this.radius,
      dWidth: 12,
      dHeight: 12,
      frame: 0,
    })

    this.fireNoise = await this.gameRef.soundPlayer.loadSound(FireNoise)
    this.contactNoise = await this.gameRef.soundPlayer.loadSound(ContactNoise)
  }

  initialize() {}

  hit(){
    this.active = false
    this.gameRef.soundPlayer.playSound(this.contactNoise)
  }

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
    if(this.canFire()) {
      this.x = start.x
      this.y = start.y
      this.target = end
      this.setVelocityToTarget()
      this.angle = angleBetween(start, end, true)
      this.active = true
      this.traveled = 0
      this.lastShot = this.gameRef.lastUpdate
      // this.gameRef.soundPlayer.playNote(-150, .3, 'square')
      this.gameRef.soundPlayer.playSound(this.fireNoise)
      return true
    }
    return false
  }

  canFire() {
    return !this.active && this.gameRef.lastUpdate - this.lastShot >= this.shotDelay
  }

  draw() {
    this.trails.forEach((trail: any) => {
      if(trail.time > this.gameRef.lastUpdate) {
      this.gameRef.ctx.globalAlpha = (trail.time - this.gameRef.lastUpdate)/(this.trailTime * 2)
      drawCircle({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + trail.x,
        y: this.gameRef.cameraPos.y + trail.y,
        fillColor: 'black',
        radius: (this.radius * (trail.time - this.gameRef.lastUpdate)/(this.trailTime))/2
      })
      this.gameRef.ctx.globalAlpha = 1
      }
    })
    if (this.active) {
      // drawCircle({
      //   c: this.gameRef.ctx,
      //   x: this.gameRef.cameraPos.x + this.x,
      //   y: this.gameRef.cameraPos.y + this.y,
      //   fillColor: 'gold',
      //   radius: this.radius,
      //   // strokeColor: 'rgba(255,255,255,.5)',
      //   // strokeWidth: 2
      // })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + this.x,
        y: this.gameRef.cameraPos.y + this.y,
        a: this.angle
      }, () => {
        drawImage(this.sprite)
      })

    }

  }
}
