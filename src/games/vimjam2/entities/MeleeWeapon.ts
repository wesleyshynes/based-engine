import { BasedObject } from "../../../engine/BasedObject";
import StickMelee from '../../../assets/vimjam2/Stick_melee.png'
import { createSprite, drawCircle, drawImage, drawLine, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import SwordSlash from '../../../assets/blasty-man/sword-slash.mp3'

export class MeleeWeapon extends BasedObject {

  x: number = 0
  y: number = 0
  yOffset: number = 0
  xOffset: number = 0

  sprite: any;

  radius: number = 26
  weaponLength: number = 30

  angle: number = 0
  rotateSpeed: number = 10
  currentSpeed: number = 0

  target: XYCoordinateType = { x: 0, y: 0 }

  hitBox: XYCoordinateType = { x: 0, y: 0 }
  hitBoxRadius: number = 10
  handPos: XYCoordinateType = { x: 0, y: 0 }

  handColor: string = '#d89b6d';

  onTarget: boolean = false
  entityTag: string = 'meleeWeapon'

  swingSound: any;
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
      sprite: StickMelee,
      sx: 0,
      sy: 0,
      sWidth: 40,
      sHeight: 20,
      dx: 0,
      dy: 0,
      dWidth: 40,
      dHeight: 20,
      frame: 0,
    })
    this.sprite.dx = 0
    this.sprite.dy = -10
    this.sprite.flipX = false
    this.sprite.flipY = false

    this.swingSound = await this.gameRef.soundPlayer.loadSound(SwordSlash)
    this.trails = []
  }

  handleSlashSound() {
    if (this.onTarget && this.lastSound + this.soundTimeDiff < this.gameRef.lastUpdate) {
      this.gameRef.soundPlayer.playSound(this.swingSound)
      this.lastSound = this.gameRef.lastUpdate
    }
  }

  handleTrails() {
    if (this.lastTrail + this.trailDiff < this.gameRef.lastUpdate) {
      this.trails.unshift({
        x: this.x,
        y: this.y,
        mx: this.hitBox.x,
        my: this.hitBox.y,
        hx: this.handPos.x,
        hy: this.handPos.y,
        angle: this.angle,
        time: this.gameRef.lastUpdate + this.trailTime
      })
      this.lastTrail = this.gameRef.lastUpdate
    }
    if (this.trails.length > this.trailLimit) {
      this.trails = this.trails.slice(0, this.trailLimit - 1)
    }
  }

  update() {
    const angleSpeed = this.rotateSpeed * this.gameRef.diffMulti
    const targetAngle = angleBetween(this, this.target, true)
    const rotDir = (targetAngle - this.angle + 540) % 360 - 180
    // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
    if (Math.abs(rotDir) > 5) {
      this.handleTrails()
      this.angle = rotDir > 0 ?
        this.angle % 360 + (rotDir > angleSpeed ? angleSpeed : rotDir) :
        this.angle % 360 - (rotDir < angleSpeed ? angleSpeed : -rotDir)
      this.handleSlashSound()
    } else {
      this.angle = targetAngle
    }
    if (this.angle < 0) {
      this.angle += 360
    }
    this.handPos = pointOnCircle(degToRad(this.angle), this.radius)
    this.hitBox = pointOnCircle(degToRad(this.angle), this.radius + this.weaponLength)

    this.currentSpeed = Math.abs(rotDir)

    const enemyAnglePos = pointOnCircle(angleBetween(this, this.target), this.weaponLength)
    const shootingPos = pointOnCircle(degToRad(this.angle), this.weaponLength)
    const shotDistance = distanceBetween(enemyAnglePos, shootingPos)
    this.onTarget = Math.abs(shotDistance) <= 1
  }

  moveTo(newLocation: { x: number, y: number }) {
    this.x = newLocation.x + this.xOffset
    this.y = newLocation.y + this.yOffset
    // this.sprite.flipY =  this.angle > 90 && this.angle < 270
  }

  setTarget(newTarget: { x: number, y: number }) {
    this.target = newTarget
  }

  draw() {

    // draw hand
    drawCircle({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.handPos.x + this.x,
      y: this.gameRef.cameraPos.y + this.handPos.y + this.y,
      radius: 5,
      fillColor: this.handColor,
    })

    this.trails.forEach((trail: any) => {
      if (trail.time > this.gameRef.lastUpdate) {
        this.gameRef.ctx.globalAlpha = (trail.time - this.gameRef.lastUpdate) / (this.trailTime * 2)
        drawLine({
          c: this.gameRef.ctx,
          x: this.gameRef.cameraPos.x + trail.x + trail.mx,
          y: this.gameRef.cameraPos.y + trail.y + trail.my,
          toX: this.gameRef.cameraPos.x + trail.x + trail.hx,
          toY: this.gameRef.cameraPos.y + trail.y + trail.hy,
          strokeWidth: 10,
          strokeColor: 'rgba(255,255,255)'
        })
        this.gameRef.ctx.globalAlpha = 1
      }
    })

    // drawLine({
    //   c: this.gameRef.ctx,
    //   x: this.gameRef.cameraPos.x + this.x + this.handPos.x,
    //   y: this.gameRef.cameraPos.y + this.y + this.handPos.y,
    //   toX: this.gameRef.cameraPos.x + this.x + this.hitBox.x,
    //   toY: this.gameRef.cameraPos.y + this.y + this.hitBox.y,
    //   strokeWidth: 6,
    //   strokeColor: 'brown'
    // })

    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: this.gameRef.cameraPos.x + this.hitBox.x + this.x,
    //   y: this.gameRef.cameraPos.y + this.hitBox.y + this.y,
    //   radius: this.hitBoxRadius,
    //   fillColor: 'red',
    //   // fillColor: this.onTarget ? 'orange' : 'yellow',
    // })

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.handPos.x + this.x,
      y: this.gameRef.cameraPos.y + this.handPos.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)
    })

  }

}
