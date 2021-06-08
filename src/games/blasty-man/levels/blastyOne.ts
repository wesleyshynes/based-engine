import { BasedLevel } from "../../../engine/BasedLevel";
import { createSprite, drawCircle, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";

import BlastyManGun from '../../../assets/blasty-man/blasty-man-gun-concept.png'
import { angleBetween } from "../../../engine/libs/mathHelpers";
import { BlastMan } from "../entities/BlastMan";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  bGun: any;

  gunRotate: number = 0
  gunRotate2: number = 0

  target: {x: number, y: number} = {x: 0, y: 0}

  async preload() {
    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20,
    this.bMan.y = 100 - 32,
    await this.bMan.preload()
  }

  initialize() {
    this.bMan.initialize()
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()

    this.bMan.update()
  }

  updateBg() { }

  drawBg() { }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.bMan.draw()
    // console.log(this.gunRotate)
  }

  tearDown() { }
}
