import { BasedObject } from "../../../engine/BasedObject";
import BlastyManSwordUrl from '../../../assets/blasty-man/short-sword-concept.png'
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";


export class Sword extends BasedObject {
  x: number = 0
  y: number = 0

  sprite: any;

  angle: number = 0
  rotateSpeed: number = 10

  target: XYCoordinateType = { x: 0, y: 0 }

  swordTip: XYCoordinateType = { x: 0, y: 0 }
  handPos: XYCoordinateType = {x: 0, y: 0 }

  onTarget: boolean = false

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
  }

  update() {
    const angleSpeed = this.rotateSpeed * this.gameRef.diffMulti
    const targetAngle = angleBetween(this, this.target, true)
    const rotDir = (targetAngle - this.angle + 540)%360-180
    // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
    if(rotDir > 5) {
      this.angle = this.angle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
    } else if (rotDir < -5) {
      this.angle = this.angle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
    } else {
      this.angle = targetAngle
    }
    if(this.angle < 0) {
      this.angle += 360
    }
    this.handPos = pointOnCircle(degToRad(this.angle), 16)
    this.swordTip = pointOnCircle(degToRad(this.angle), 56)

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

    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.handPos.x + this.x,
      y: cameraOffset.y + this.handPos.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.swordTip.x + this.x,
      y: cameraOffset.y + this.swordTip.y + this.y,
      radius: 3,
      fillColor: this.onTarget ? 'orange' : 'yellow',
    })

  }

}
