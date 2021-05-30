import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class MainTroopa extends BasedObject {

  target: { x: number, y: number, active?: boolean } = { x: 0, y: 0 };
  radius: number = 30
  speed: number = 7
  health: number = 10
  maxHealth: number = 10
  lastHit: number = 0
  damageBuffer: number = 100
  // active: boolean = false

  hovered: boolean = false
  focused: boolean = false

  collision: boolean = false
  onCollision: (cSelf: any, cOther: any) => void = () => { }

  velocity: { x: number, y: number } = { x: 0, y: 0 }

  shootingHand: any = {
    x: 0,
    y: 0,
    radius: 10,
    fillColor: '#55dafd',
    currentAngle: 0,
    angleSpeed: 5
  }
  nearestTarget: { x: number, y: number } = { x: 0, y: 0 }

  initialize() {
    this.target = { x: this.x, y: this.y }
  }

  update() {

    this.target.active && this.moveTo(this.target, () => {
      this.target.active = false
    })

    const targetAngle = angleBetween(this, this.nearestTarget, true)
    const angleSpeed = this.shootingHand.angleSpeed * this.gameRef.diffMulti
    const rotDir = (targetAngle - this.shootingHand.currentAngle + 540)%360-180
    if(rotDir > 0) {
      this.shootingHand.currentAngle += rotDir > angleSpeed ? angleSpeed : rotDir
    } else if (rotDir < 0) {
      this.shootingHand.currentAngle -= rotDir < angleSpeed ? angleSpeed : -rotDir
    }

    this.hovered = distanceBetween(this, this.gameRef.mouseInfo) <= this.radius
  }

  moveTo(moveTarget: {x: number, y: number, active?: boolean}, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > this.radius) {
      const speedFactor = this.speed * this.gameRef.diffMulti
      this.velocity = {
        x: (speedFactor / dt) * (moveTarget.x - this.x),
        y: (speedFactor / dt) * (moveTarget.y - this.y)
      }
      this.x += this.velocity.x
      this.y += this.velocity.y
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      radius: this.radius,
      fillColor: this.lastHit + 500 > this.gameRef.lastUpdate ? 'orange' : '#55dafd',
      strokeWidth: 2,
      strokeColor: 'rgba(255,255,255,.5)'
      // fillColor: this.collision ? 'orange' : 'green'
      // fillColor: this.collision ? 'orange' : this.hovered ? 'red' : 'green'
    })

    // const targetAngle = pointOnCircle(angleBetween(this, this.nearestTarget), this.radius + this.shootingHand.radius)
    const targetAngle = pointOnCircle(degToRad(this.shootingHand.currentAngle), this.radius + this.shootingHand.radius)
    this.shootingHand.x = targetAngle.x + this.x
    this.shootingHand.y = targetAngle.y + this.y
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x + targetAngle.x,
      y: cameraOffset.y + this.y + targetAngle.y,
      radius: this.shootingHand.radius,
      fillColor: this.shootingHand.fillColor
      // fillColor: this.collision ? 'orange' : 'green'
      // fillColor: this.collision ? 'orange' : this.hovered ? 'red' : 'green'
    })



    if (this.target.active) {
      drawCircle({
        c: this.gameRef.ctx,
        x: cameraOffset.x + this.target.x,
        y: cameraOffset.y + this.target.y,
        radius: 20,
        strokeWidth: 2,
        strokeColor: 'yellow'
        // fillColor: 'green'
      })
    }
  }

  damage(amount: number) {
    if(this.lastHit + this.damageBuffer > this.gameRef.lastUpdate){
      return
    }
    this.health -= amount
    this.lastHit = this.gameRef.lastUpdate
  }

}
