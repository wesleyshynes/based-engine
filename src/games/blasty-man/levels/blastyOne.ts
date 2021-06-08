import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";

import BlastySpiderUrl from '../../../assets/blasty-man/blasty-spider-concept.png'
import { createSprite, drawImage } from "../../../engine/libs/drawHelpers";


export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  bGun: any;

  gunRotate: number = 0
  gunRotate2: number = 0

  target: {x: number, y: number} = {x: 0, y: 0}

  spider: any;

  async preload() {
    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20,
    this.bMan.y = 100 - 32,
    await this.bMan.preload()

    this.spider = await createSprite({
      c: this.gameRef.ctx,
      sprite: BlastySpiderUrl,
      sx: 0,
      sy: 0,
      sWidth: 48,
      sHeight: 32,
      dx: 200,
      dy: 200,
      dWidth: 48,
      dHeight: 32,
      frame: 0
    })


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

    drawImage(this.spider)
  }

  tearDown() { }
}
