import { BasedObject } from "../../../engine/BasedObject";
import BlastySpiderUrl from '../../../assets/blasty-man/blasty-spider-concept.png'
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class BlastSpider extends BasedObject {
    x: number = 0
    y: number = 0

    width: number = 48
    height: number = 32

    radius: number = 16
    speed: number = 1
    velocity: XYCoordinateType = {x: 0, y: 0}

    sprite: any;

    target: XYCoordinateType = {x: 0, y: 0}

    angle: number = 0

    async preload() {
      this.sprite = await createSprite({
        c: this.gameRef.ctx,
        sprite: BlastySpiderUrl,
        sx: 0,
        sy: 0,
        sWidth: this.width,
        sHeight: this.height,
        dx:  -this.width/2,
        dy: -this.height/2,
        dWidth: this.width,
        dHeight: this.height,
        frame: 0
      })
    }
    initialize() {}


    update() {
      const angleSpeed = 5 * this.gameRef.diffMulti
      const targetAngle = angleBetween(this, this.target, true) + 90
      const rotDir = (targetAngle - this.angle + 540)%360-180
      // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
      if(rotDir > 0) {
        this.angle = this.angle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
      } else if (rotDir < 0) {
        this.angle = this.angle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
      }
      if(this.angle < 0) {
        this.angle += 360
      }

      this.moveTo(this.target)
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
      // drawCircle({
      //   c: this.gameRef.ctx,
      //   x: this.x,
      //   y: this.y,
      //   radius: 23,
      //   fillColor: 'green'
      // })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.x,
        y: this.y,
        a: this.angle
      }, () => {
        drawImage(this.sprite)
      })
    }

  }
