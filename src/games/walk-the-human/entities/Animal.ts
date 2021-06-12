import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class Animal extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 16
  velocity: XYCoordinateType = {x: 0, y: 0}
  speed: number = 2
  target: XYCoordinateType = {x: 200, y: 300}
  fillColor: string = 'orange'
  activeTarget: boolean = false

  bonked: boolean = false
  lastBonk: number = 0
  bonkLength: number = 500

  maxSpeed: number = 2
  bonkSpeed: number = 0
  bonkCallback: () => void = () => null

  async preload(){}
  initialize() {
    this.bonked = false
    this.lastBonk = 0
  }
  update() {
    if(this.activeTarget) {
      this.moveTo(this.target, () => {
        this.activeTarget = false
      })
    } else if (this.bonked && this.lastBonk + this.bonkLength < this.gameRef.lastUpdate){
      this.bonked = false
    }
  }

  bonk() {
    if(!this.bonked) {
      this.bonked = true
      this.lastBonk = this.gameRef.lastUpdate
      this.velocity = {x: 0,y: 0}
      this.bonkCallback()
    }
  }

  setTarget(t: XYCoordinateType){
    this.target = t
    this.activeTarget = true
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

    if(this.activeTarget){
      drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.target.x,
      y: cameraOffset.y + this.target.y,
      radius: 10,
      strokeColor: 'orange',
      strokeWidth: 2
    })
  }

    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      radius: this.radius,
      fillColor: this.fillColor
    })
  }
  tearDown() {}

}
