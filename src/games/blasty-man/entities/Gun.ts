import { BasedObject } from "../../../engine/BasedObject";
import BlastyManGun from '../../../assets/blasty-man/blasty-man-gun-concept.png'
import { createSprite, drawCircle, drawImage, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle } from "../../../engine/libs/mathHelpers";


export class Gun extends BasedObject {
  x: number = 0
  y: number = 0

  sprite: any;

  angle: number = 0
  rotateSpeed: number = 5

  target: { x: number, y: number } = { x: 0, y: 0 }

  gunTip: {x: number, y: number} = { x: 0, y: 0 }
  gunHilt: {x: number, y: number} = { x: 0, y: 0 }

  onTarget: boolean = false

  trails: any = []
  lastTrail: number = 0
  trailDiff: number = 10
  trailTime: number = 100
  trailLimit: number = 10

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BlastyManGun,
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 16,
      dx: -32,
      dy: -8,
      dWidth: 32,
      dHeight: 16,
      frame: 0,
    })
    this.sprite.dx = -32
    this.sprite.dy = -4
    this.sprite.flipX = true
    this.sprite.flipY = false
  }

  handleTrails() {
    if(this.lastTrail + this.trailDiff < this.gameRef.lastUpdate) {
      this.trails.unshift({
        x: this.x,
        y: this.y,
        sx: this.gunTip.x,
        sy: this.gunTip.y,
        hx: this.gunHilt.x,
        hy: this.gunHilt.y,
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
    if(rotDir > 0) {
      rotDir > 5 && this.handleTrails()
      this.angle = this.angle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
    } else if (rotDir < 0) {
      rotDir < -5 && this.handleTrails()
      this.angle = this.angle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
    }
    if(this.angle < 0) {
      this.angle += 360
    }
    this.gunTip = pointOnCircle(degToRad(this.angle), 32)
    this.gunHilt = pointOnCircle(degToRad(this.angle), 8)

    const enemyAnglePos = pointOnCircle(angleBetween(this, this.target), 32)
    const shootingPos = pointOnCircle(degToRad(this.angle), 32)
    const shotDistance = distanceBetween(enemyAnglePos, shootingPos)
    this.onTarget = Math.abs(shotDistance) <= 1
  }

  moveTo(newLocation: {x: number, y: number}) {
    this.x = newLocation.x
    this.y = newLocation.y
    this.sprite.flipY =  this.angle > 90 && this.angle < 270
  }

  setTarget(newTarget: {x: number, y: number}) {
    this.target = newTarget
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {

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
        x: cameraOffset.x + trail.x + trail.hx,
        y: cameraOffset.y + trail.y + trail.hy,
        toX: cameraOffset.x + trail.x + trail.sx,
        toY: cameraOffset.y + trail.y + trail.sy,
        strokeWidth: 2,
        strokeColor: 'rgba(255,255,255)'
      })
      this.gameRef.ctx.globalAlpha = 1
      }
    })

    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)

      // draw hand
      drawCircle({
        c: this.gameRef.ctx,
        x: -6,
        y: 8,
        radius: 5,
        fillColor: 'green',
      })
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
