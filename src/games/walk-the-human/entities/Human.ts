import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawBox, drawCircle, drawImage, drawLine } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";
import HumanSprite from '../../../assets/walk-the-human/human-spritesheet.png'

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

  sprite: any;

  handRadius: number = 3
  handColor: string = '#F7E09F';
  armLength: number = 11;
  handRotateSpeed: number = 5
  goHand: XYCoordinateType = {x: 0, y: 0};
  goHandAngle: number = 0
  leashHand: XYCoordinateType = {x: 0, y: 0};

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: HumanSprite,
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 32,
      dx: this.x - this.radius,
      dy: this.y - this.radius,
      dWidth: 32,
      dHeight: 32,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })
  }
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

    const angleSpeed = this.handRotateSpeed * this.gameRef.diffMulti
    const targetAngle = angleBetween(this, this.target, true)
    const rotDir = (targetAngle - this.goHandAngle + 540)%360-180
    // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
    if(rotDir > 0) {
      this.goHandAngle = this.goHandAngle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
    } else if (rotDir < 0) {
      this.goHandAngle = this.goHandAngle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
    }
    if(this.goHandAngle < 0) {
      this.goHandAngle += 360
    }

    // const goHandAngle = angleBetween(this, this.target)
    this.goHand = pointOnCircle(degToRad(this.goHandAngle), this.armLength)
    this.updateSprite()
  }

  updateSprite() {
    if(this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if(this.sprite.frame > 1) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate

      this.sprite.sx = this.sprite.frame * this.sprite.dWidth
    }
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

    // this.drawPath(cameraOffset)

    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.x,
    //   y: cameraOffset.y + this.y,
    //   fillColor: this.fillColor,
    //   radius: this.radius,
    // })

    this.sprite.dx = cameraOffset.x + this.x - this.radius
    this.sprite.dy = cameraOffset.y + this.y - this.radius
    drawImage(this.sprite)

    // go Hand
    // drawLine({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.x + 10,
    //   y: cameraOffset.y + this.y - 6,
    //   toX: cameraOffset.x + this.x + this.goHand.x,
    //   toY: cameraOffset.y + this.y + this.goHand.y,
    //   strokeWidth: 3,
    //   strokeColor: 'blue'
    // })
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x + this.goHand.x,
      y: cameraOffset.y + this.y + this.goHand.y,
      fillColor: this.handColor,
      radius: this.handRadius,
    })

    // leash Hand
    // drawLine({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.x - 10,
    //   y: cameraOffset.y + this.y - 6,
    //   toX: cameraOffset.x + this.x + this.leashHand.x,
    //   toY: cameraOffset.y + this.y + this.leashHand.y,
    //   strokeWidth: 3,
    //   strokeColor: 'blue'
    // })
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x + this.leashHand.x,
      y: cameraOffset.y + this.y + this.leashHand.y,
      fillColor: this.handColor,
      radius: this.handRadius,
    })

    this.angerBar.draw(cameraOffset)
  }

  tearDown() {}
}
