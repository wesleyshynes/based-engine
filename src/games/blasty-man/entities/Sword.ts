import { BasedObject } from "../../../engine/BasedObject";
import BlastyManSwordUrl from '../../../assets/blasty-man/short-sword-concept.png'
import { createSprite, drawCircle, drawImage, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import SwordSlash from '../../../assets/blasty-man/sword-slash.mp3'

export class Sword extends BasedObject {
  x: number = 0
  y: number = 0

  sprite: any;

  angle: number = 0
  rotateSpeed: number = 10
  currentSpeed: number = 0

  target: XYCoordinateType = { x: 0, y: 0 }

  swordTip: XYCoordinateType = { x: 0, y: 0 }
  swordMid: XYCoordinateType = { x: 0, y: 0 }
  handPos: XYCoordinateType = {x: 0, y: 0 }

  onTarget: boolean = false
  entityTag: string = 'sword'

  slashSound: any;
  lastSound: number = 0
  soundTimeDiff: number = 150

  trails: any = []
  lastTrail: number = 0
  trailDiff: number = 10
  trailTime: number = 100
  trailLimit: number = 10

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BlastyManSwordUrl,
      sx: 0,
      sy: 0,
      sWidth: 40,
      sHeight: 16,
      dx: 0,
      dy: 0,
      dWidth: 40,
      dHeight: 16,
      frame: 0,
    })
    this.sprite.dx = 0
    this.sprite.dy = -8
    this.sprite.flipX = false
    this.sprite.flipY = false

    this.slashSound = await this.gameRef.soundPlayer.loadSound(SwordSlash)
    this.trails = []
  }

  handleSlashSound() {
    if(this.onTarget && this.lastSound + this.soundTimeDiff < this.gameRef.lastUpdate) {
      this.gameRef.soundPlayer.playSound(this.slashSound)
      this.lastSound = this.gameRef.lastUpdate
    }
  }

  handleTrails() {
    if(this.lastTrail + this.trailDiff < this.gameRef.lastUpdate) {
      this.trails.unshift({
        x: this.x,
        y: this.y,
        sx: this.swordTip.x,
        sy: this.swordTip.y,
        mx: this.swordMid.x,
        my: this.swordMid.y,
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
    const angleSpeed = this.rotateSpeed * this.gameRef.diffMulti
    const targetAngle = angleBetween(this, this.target, true)
    const rotDir = (targetAngle - this.angle + 540)%360-180
    // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
    if(rotDir > 5) {
      this.handleTrails()
      this.angle = this.angle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
      this.handleSlashSound()

    } else if (rotDir < -5) {
      this.handleTrails()
      this.angle = this.angle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
      this.handleSlashSound()
    } else {
      this.angle = targetAngle
    }
    if(this.angle < 0) {
      this.angle += 360
    }
    this.handPos = pointOnCircle(degToRad(this.angle), 26)
    this.swordTip = pointOnCircle(degToRad(this.angle), 66)
    this.swordMid = pointOnCircle(degToRad(this.angle), 35)

    this.currentSpeed = Math.abs(rotDir)

    const enemyAnglePos = pointOnCircle(angleBetween(this, this.target), 56)
    const shootingPos = pointOnCircle(degToRad(this.angle), 56)
    const shotDistance = distanceBetween(enemyAnglePos, shootingPos)
    this.onTarget = Math.abs(shotDistance) <= 1
  }

  moveTo(newLocation: {x: number, y: number}) {
    this.x = newLocation.x
    this.y = newLocation.y
    // this.sprite.flipY =  this.angle > 90 && this.angle < 270
  }

  setTarget(newTarget: {x: number, y: number}) {
    this.target = newTarget
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {

    // draw hand
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.handPos.x + this.x,
      y: cameraOffset.y + this.handPos.y + this.y,
      radius: 5,
      fillColor: 'green',
    })

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
        x: cameraOffset.x + trail.x + trail.mx,
        y: cameraOffset.y + trail.y + trail.my,
        toX: cameraOffset.x + trail.x + trail.sx,
        toY: cameraOffset.y + trail.y + trail.sy,
        strokeWidth: 10,
        strokeColor: 'rgba(255,255,255)'
      })
      this.gameRef.ctx.globalAlpha = 1
      }
    })


    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.handPos.x + this.x,
      y: cameraOffset.y + this.handPos.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)
    })

    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.swordTip.x + this.x,
    //   y: cameraOffset.y + this.swordTip.y + this.y,
    //   radius: 3,
    //   fillColor: this.onTarget ? 'orange' : 'yellow',
    // })

  }

}
