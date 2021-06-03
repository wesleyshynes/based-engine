import { BasedObject } from "../../engine/BasedObject";
import { drawCircle } from "../../engine/libs/drawHelpers";
import { degToRad, distanceBetween, pointOnCircle, radToDeg, XYCoordinateType } from "../../engine/libs/mathHelpers";

export class FeeshObject extends BasedObject {
  radius: number = 10
  x: number = 200
  y: number = 400
  fillColor: string = '#ce192b'
  speed: number = 1
  facing: number = 0
  startAngle: number = 45
  endAngle: number = 270

  facingDot: XYCoordinateType = { x: 0, y: 0 }
  leftEye: XYCoordinateType = { x: 0, y: 0 }
  leftEyePupil: XYCoordinateType = { x: 0, y: 0 }
  rightEye: XYCoordinateType = { x: 0, y: 0 }
  rightEyePupil: XYCoordinateType = { x: 0, y: 0 }
  eyeColor: string = 'blue'

  offSetAngle: number = 0
  tailSpeed: number = 5
  tailSpeedDirection: number = 1

  tailEnd: XYCoordinateType = { x: 0, y: 0 }
  tailLeft: XYCoordinateType = { x: 0, y: 0 }
  tailCurveLeft: XYCoordinateType = { x: 0, y: 0 }
  tailRight: XYCoordinateType = { x: 0, y: 0 }
  tailCurveRight: XYCoordinateType = { x: 0, y: 0 }
  tailLength: number = 50
  tailWhip: number = this.radius * 2

  initialize() { }
  update() {
    const diffMulti = this.gameRef.diffMulti
    const pressedKeys = this.gameRef.pressedKeys

    const moveTarget = pointOnCircle(degToRad(this.facing), this.speed + this.radius)
    moveTarget.x += this.x
    moveTarget.y += this.y

    const turnFactor = 5 * diffMulti

    if (pressedKeys['KeyA']) {
      this.facing -= turnFactor
      this.tailSpeedDirection = this.offSetAngle > 10 ? -1 : this.tailSpeedDirection
    }
    if (pressedKeys['KeyD']) {
      this.facing += turnFactor
      this.tailSpeedDirection = this.offSetAngle < -10 ? 1 : this.tailSpeedDirection
    }
    if (pressedKeys['KeyW']) {
      this.speed += this.speed < 5 ? 1 : 0
    }
    if (pressedKeys['KeyS']) {
      this.speed -= this.speed > 2 ? 1 : 0
    }
    const dt = distanceBetween(this, moveTarget)
    if (dt > 0) {
      const speedFactor = this.speed * diffMulti
      const mx = (speedFactor / dt) * (moveTarget.x - this.x)
      const my = (speedFactor / dt) * (moveTarget.y - this.y)
      this.x += mx
      this.y += my
    }

    this.startAngle = this.facing - 90
    this.endAngle = this.facing + 90
    // console.log(player.x, player.y)

    if (this.x < this.radius) {
      this.x = this.radius
    }
    if (this.x > this.gameRef.gameWidth - this.radius) {
      this.x = this.gameRef.gameWidth - this.radius
    }
    if (this.y < this.radius) {
      this.y = this.radius
    }
    if (this.y > this.gameRef.gameHeight - this.radius) {
      this.y = this.gameRef.gameHeight - this.radius
    }

    // begin tail movement calculations
    const tailSpeedTick = this.speed * diffMulti * this.tailSpeedDirection
    // const tailSpeedTick = this.tailSpeed * diffMulti * this.tailSpeedDirection
    this.offSetAngle += tailSpeedTick

    if (this.offSetAngle >= 45) {
      this.tailSpeedDirection = -1
    } else if (this.offSetAngle <= -45) {
      this.tailSpeedDirection = 1
    }

    const angle = degToRad(this.facing)
    // const angle = angleBetween(tail, player.facing)
    this.facingDot = pointOnCircle(angle, this.radius)

    const pupilAngle = (pressedKeys[65] || pressedKeys[68]) && !(pressedKeys[65] && pressedKeys[68]) ? degToRad(this.facing + (pressedKeys[65] ? -1 : 1) * 30) : angle
    this.leftEye = pointOnCircle(degToRad(this.facing + 30), this.radius)
    this.leftEyePupil = pointOnCircle(pupilAngle, 4)
    this.rightEye = pointOnCircle(degToRad(this.facing - 30), this.radius)
    this.rightEyePupil = pointOnCircle(pupilAngle, 4)

    const tailAngle = degToRad(radToDeg(angle) + 180)
    this.tailEnd = pointOnCircle(tailAngle, this.tailLength)
    this.tailLeft = pointOnCircle(degToRad(radToDeg(tailAngle) - 90), this.radius)
    this.tailCurveLeft = pointOnCircle(degToRad(radToDeg(tailAngle) + this.offSetAngle), this.tailWhip)
    this.tailRight = pointOnCircle(degToRad(radToDeg(tailAngle) + 90), this.radius)
    this.tailCurveRight = pointOnCircle(degToRad(radToDeg(tailAngle) + this.offSetAngle), this.tailWhip)


  }
  draw() {

    // draw player main body
    // this.gameRef.ctx.beginPath()
    // this.gameRef.ctx.arc(this.x,this.y,this.radius, this.startAngle ? degToRad(this.startAngle) : 0, this.endAngle ? degToRad(this.endAngle) : 2*Math.PI)
    // this.gameRef.ctx.fillStyle = this.fillColor
    // this.gameRef.ctx.fill()
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x,
      y: this.y,
      radius: this.radius,
      fillColor: this.fillColor,
      startAngle: this.startAngle,
      endAngle: this.endAngle
    })

    // draw body on facing head
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + this.facingDot.x,
      y: this.y + this.facingDot.y,
      radius: 10,
      fillColor: this.fillColor
    })
    // Draw Eyes
    this.drawEye(this.leftEye, this.leftEyePupil)
    this.drawEye(this.rightEye, this.rightEyePupil)

    this.drawTail(this.gameRef.ctx)
  }

  drawEye(eye: XYCoordinateType, pupil: XYCoordinateType) {
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + eye.x,
      y: this.y + eye.y,
      radius: 5,
      fillColor: '#fff'
    })
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + eye.x + pupil.x,
      y: this.y + eye.y + pupil.y,
      radius: 2,
      fillColor: this.eyeColor
    })
  }

  drawTail(c: CanvasRenderingContext2D) {
    c.beginPath()
    c.moveTo(this.x, this.y)

    // left tail point
    c.lineTo(this.x + this.tailLeft.x, this.y + this.tailLeft.y)
    c.quadraticCurveTo(
      this.x + this.tailLeft.x + this.tailCurveLeft.x, this.y + this.tailLeft.y + this.tailCurveLeft.y,
      this.x + this.tailEnd.x, this.y + this.tailEnd.y)
    c.quadraticCurveTo(
      this.x + this.tailRight.x + this.tailCurveRight.x, this.y + this.tailRight.y + this.tailCurveRight.y,
      this.x + this.tailRight.x, this.y + this.tailRight.y)
    // right rail point
    c.lineTo(this.x + this.tailRight.x, this.y + this.tailRight.y)
    c.closePath()
    c.fillStyle = this.fillColor
    c.fill()
  }
}
