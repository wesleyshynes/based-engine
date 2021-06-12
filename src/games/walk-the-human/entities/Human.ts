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
  ]
  radius: number = 16
  fillColor: string = 'red'

  targetRadius: number = 10

  velocity: XYCoordinateType = {x: 0, y: 0}
  speed: number = 1

  angerBar: HealthBar;

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

  draw() {
    drawCircle({
      c: this.gameRef.ctx,
      ...this.target,
      strokeColor: 'red',
      strokeWidth: 2,
      radius: this.targetRadius
    })

    drawLine({
      c: this.gameRef.ctx,
      x: this.x,
      y: this.y,
      toX: this.target.x,
      toY: this.target.y,
      strokeWidth: 1,
      strokeColor: 'white'
    })

    if(this.targetList.length > 0) {

      drawLine({
        c: this.gameRef.ctx,
        ...this.target,
        toX: this.targetList[0].x,
        toY: this.targetList[0].y,
        strokeWidth: 1,
        strokeColor: 'white'
      })

      this.targetList.forEach((t: XYCoordinateType, i: number) => {
        drawCircle({
          c: this.gameRef.ctx,
          ...t,
          strokeColor: 'yellow',
          strokeWidth: 2,
          radius: this.targetRadius
        })
        if(i < this.targetList.length -1) {
          drawLine({
            c: this.gameRef.ctx,
            ...t,
            toX: this.targetList[i+1].x,
            toY: this.targetList[i+1].y,
            strokeWidth: 1,
            strokeColor: 'white'
          })
        }
      })
    }

    drawCircle({
      c: this.gameRef.ctx,
      x: this.x,
      y: this.y,
      fillColor: this.fillColor,
      radius: this.radius,
    })

    this.angerBar.draw()
  }

  tearDown() {}
}
