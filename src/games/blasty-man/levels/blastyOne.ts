import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { createSprite, drawCircle, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";

import BlastyManUrl from '../../../assets/blasty-man/blasty-man-concept-pixel.png'
import BlastyManGun from '../../../assets/blasty-man/blasty-man-gun-concept.png'

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  bGun: any;

  gunRotate: number = 0

  async preload() {
    this.bMan = {
        c: this.gameRef.ctx,
        sprite: BlastyManUrl,
        sx: 0,
        sy: 0,
        sWidth: 40,
        sHeight: 64,
        dx: 0,
        dy: 0,
        dWidth: 40,
        dHeight: 64,
        frame: 0
    }
    this.bMan = await createSprite(this.bMan)

    this.bGun = {
        c: this.gameRef.ctx,
        sprite: BlastyManGun,
        sx: 0,
        sy: 0,
        sWidth: 32,
        sHeight: 16,
        dx: 100,
        dy: 100,
        dWidth: 32,
        dHeight: 16,
        frame: 0
    }
    this.bGun = await createSprite(this.bGun)
  }

  initialize() { }

  handleSounds() {}

  update() {
    this.updateBg()
    this.handleSounds()
    const speedFactor = 2 * this.gameRef.diffMulti
    this.gunRotate = this.gunRotate%360 + speedFactor
  }

  updateBg() {}

  drawBg() {}

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.drawBg()

    drawCircle({
      c: this.gameRef.ctx,
      x: 100,
      y: 100,
      radius: 10,
      fillColor: 'red',
    })

    drawImage(this.bMan)

    rotateDraw({
      c: this.gameRef.ctx,
      x: 100,
      y: 100,
      a: this.gunRotate
    }, () => {drawImage({
      ...this.bGun,
      dx: -36,
      dy: -8,
      flipX: true,
      flipY: this.gunRotate > 90 && this.gunRotate < 270,
    })})
    // console.log(this.gunRotate)
  }

  tearDown() {}
}
