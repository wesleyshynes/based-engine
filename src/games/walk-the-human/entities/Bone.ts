import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { Pickup } from "./Pickup";
import BoneSprite from '../../../assets/walk-the-human/bone.png'

export class Bone extends Pickup {
  sprite: any
  angleSpeed: number = 2
  angleLow: number = -90
  angleHigh: number = 90
  angleDir: number = 1
  angle: number = 0
  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BoneSprite,
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 32,
      dx: -this.radius,
      dy: -this.radius,
      dWidth: 32,
      dHeight: 32,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })
  }

  update() {
    const angleDiff = this.angleSpeed * this.gameRef.diffMulti
    if(this.angle < this.angleLow || this.angle > this.angleHigh) {
      this.angleDir *= -1
    }
    this.angle += angleDiff * this.angleDir
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.x,
    //   y: cameraOffset.y + this.y,
    //   radius: this.radius,
    //   fillColor: this.fillColor
    // })

    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      a: this.angle
    }, () => {
      drawImage(this.sprite)
    })
  }
}
