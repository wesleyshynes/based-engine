import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawCircle, drawLine } from "../../../engine/libs/drawHelpers";
import { distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";

export class Human extends BasedObject {
  x: number = 0
  y: number = 0
  target: XYCoordinateType = {x: 0, y: 0}
  targetList: XYCoordinateType[] = [
    {x: 20, y: 50},
    {x: 50, y: 150},
    {x: 200, y: 350},
    {x: 350, y: 50},
    {x: 850, y: 400},
    {x: 1250, y: 900},
    {x: 1750, y: 1500},
  ]
  radius: number = 16
  fillColor: string = 'red'

  targetRadius: number = 10

  velocity: XYCoordinateType = {x: 0, y: 0}
  speed: number = 1

  angerBar: HealthBar;
  onLastTarget: () => void = () => null

  async preload() {}
  initialize() {
    this.angerBar = new HealthBar({key: 'human-anger', gameRef: this.gameRef})
    this.angerBar.width = this.radius*2
    this.angerBar.yOffset = -this.radius - 5
  }

  update() {
    this.moveTo(this.target, () => {
      if(this.targetList.length > 0) {
        this.target = this.targetList.shift()
      } else {
        this.onLastTarget()
      }
    })
    this.angerBar.x = this.x
    this.angerBar.y = this.y
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

  drawPath(cameraOffset: {x: number, y: number} = {x: 0, y: 0}, fullPath: boolean = false) {
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.target.x,
      y: cameraOffset.y + this.target.y,
      strokeColor: 'red',
      strokeWidth: 2,
      radius: this.targetRadius
    })

    drawLine({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      toX: cameraOffset.x + this.target.x,
      toY: cameraOffset.y + this.target.y,
      strokeWidth: 1,
      strokeColor: 'white'
    })

    if(this.targetList.length > 0 && fullPath) {
      drawLine({
        c: this.gameRef.ctx,
        x: cameraOffset.x + this.target.x,
        y: cameraOffset.y + this.target.y,
        toX: this.targetList[0].x,
        toY: this.targetList[0].y,
        strokeWidth: 1,
        strokeColor: 'white'
      })
      this.targetList.forEach((t: XYCoordinateType, i: number) => {
        drawCircle({
          c: this.gameRef.ctx,
          x: cameraOffset.x + t.x,
          y: cameraOffset.y + t.y,
          strokeColor: 'yellow',
          strokeWidth: 2,
          radius: this.targetRadius
        })
        if(i < this.targetList.length -1) {
          drawLine({
            c: this.gameRef.ctx,
            x: cameraOffset.x + t.x,
            y: cameraOffset.y + t.y,
            toX: cameraOffset.x + this.targetList[i+1].x,
            toY: cameraOffset.y + this.targetList[i+1].y,
            strokeWidth: 1,
            strokeColor: 'white'
          })
        }
      })
    }
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {

    this.drawPath(cameraOffset)

    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      fillColor: this.fillColor,
      radius: this.radius,
    })

    this.angerBar.draw(cameraOffset)
  }

  tearDown() {}
}
