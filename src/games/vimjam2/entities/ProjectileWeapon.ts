import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PoopSprite from '../../../assets/vimjam2/poop-sprite.png'
import { Projectile } from "./Projectile";

export class ProjectileWeapon extends BasedObject {
  x: number = 0
  y: number = 0
  yOffset: number = 0
  xOffset: number = 0

  sprite: any;

  angle: number = 0
  rotateSpeed: number = 5

  radius: number = 20
  weaponLength: number = 30

  handColor: string = '#d89b6d';
  handPos: XYCoordinateType = { x: 0, y: 0 }

  target: { x: number, y: number } = { x: 0, y: 0 }

  gunTip: {x: number, y: number} = { x: 0, y: 0 }
  // gunHilt: {x: number, y: number} = { x: 0, y: 0 }

  onTarget: boolean = false

  trails: any = []
  lastTrail: number = 0
  trailDiff: number = 10
  trailTime: number = 100
  trailLimit: number = 10

  projectile: any;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: PoopSprite,
      sx: 0,
      sy: 0,
      sWidth: 12,
      sHeight: 12,
      dx: 0,
      dy: -6,
      dWidth: 12,
      dHeight: 12,
      frame: 0,
    })
    // this.sprite.dx = 0
    // this.sprite.dy = 0
    // this.sprite.flipX = false
    // this.sprite.flipY = false

    this.projectile = new Projectile({ key: 'projectile', gameRef: this.gameRef })
    await this.projectile.preload()
  }

  initialize() {}

  handleTrails() {
    if(this.lastTrail + this.trailDiff < this.gameRef.lastUpdate) {
      this.trails.unshift({
        x: this.x,
        y: this.y,
        sx: this.gunTip.x,
        sy: this.gunTip.y,
        hx: this.handPos.x,
        hy: this.handPos.y,
        angle: this.angle,
        time: this.gameRef.lastUpdate + this.trailTime
      })
      this.lastTrail = this.gameRef.lastUpdate
    }
    if(this.trails.length > this.trailLimit) {
      this.trails = this.trails.slice(0,this.trailLimit-1)
    }
  }

  update() {
    const angleSpeed = 5 * this.gameRef.diffMulti
    const targetAngle = angleBetween(this, this.target, true)
    const rotDir = (targetAngle - this.angle + 540)%360-180
    // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
    if (rotDir !== 0) {
      Math.abs(rotDir) > 5 && this.handleTrails()
      this.angle = rotDir > 0 ?
        this.angle % 360 + (rotDir > angleSpeed ? angleSpeed : rotDir) :
        this.angle % 360 - (rotDir < angleSpeed ? angleSpeed : -rotDir)
    }
    if(this.angle < 0) {
      this.angle += 360
    }
    this.gunTip = pointOnCircle(degToRad(this.angle), this.weaponLength)
    this.handPos = pointOnCircle(degToRad(this.angle), this.radius)

    const enemyAnglePos = pointOnCircle(angleBetween(this, this.target), this.weaponLength)
    const shootingPos = pointOnCircle(degToRad(this.angle), this.weaponLength)
    const shotDistance = distanceBetween(enemyAnglePos, shootingPos)
    this.onTarget = Math.abs(shotDistance) <= 1

    this.projectile.update()
  }

  fire() {
    return this.projectile.fire({
      x: this.x + this.gunTip.x,
      y: this.y + this.gunTip.y,
    }, this.target)
  }

  moveTo(newLocation: {x: number, y: number}) {
    this.x = newLocation.x + this.xOffset
    this.y = newLocation.y + this.yOffset
    // this.sprite.flipY =  this.angle > 90 && this.angle < 270
  }

  setTarget(newTarget: {x: number, y: number}) {
    this.target = newTarget
  }

  draw() {

    this.trails.forEach((trail: any) => {
      if(trail.time > this.gameRef.lastUpdate) {
      this.gameRef.ctx.globalAlpha = (trail.time - this.gameRef.lastUpdate)/(this.trailTime * 2)
      // rotateDraw({
      //   c: this.gameRef.ctx,
      //   x: cameraOffset.x + trail.x + trail.hx,
      //   y: cameraOffset.y + trail.y + trail.hy,
      //   a: trail.angle
      // }, () => {
      //   drawImage(this.sprite)
      // })
      drawLine({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + trail.x + trail.hx,
        y: this.gameRef.cameraPos.y + trail.y + trail.hy,
        toX: this.gameRef.cameraPos.x + trail.x + trail.sx,
        toY: this.gameRef.cameraPos.y + trail.y + trail.sy,
        strokeWidth: 2,
        strokeColor: 'rgba(255,255,255)'
      })
      this.gameRef.ctx.globalAlpha = 1
      }
    })

    drawCircle({
      c: this.gameRef.ctx,
      // x: -6,
      // y: 8,
      x: this.gameRef.cameraPos.x + this.x + this.handPos.x,
      y: this.gameRef.cameraPos.y + this.y + this.handPos.y,
      radius: 5,
      fillColor: this.handColor,
    })

    this.projectile.draw()

    this.projectile.canFire() && rotateDraw({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.handPos.x + this.x,
      y: this.gameRef.cameraPos.y + this.handPos.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)
    })

    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: this.gunTip.x + this.x,
    //   y: this.gunTip.y + this.y,
    //   radius: 3,
    //   fillColor: this.onTarget ? 'orange' : 'yellow',
    // })

  }
}
