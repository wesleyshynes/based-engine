import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";

import { drawBox, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spider: any;

  async preload() {
    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spider = new BlastSpider({key: 'blast-spider', gameRef: this.gameRef})
    this.spider.x = 200
    this.spider.y = 200
    await this.spider.preload()
  }

  initialize() {
    this.bMan.initialize()
    this.spider.initialize()
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()

    this.bMan.update()
    this.spider.update()
    this.spider.target = this.bMan.centerCoordinates()
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
    this.spider.draw()

    drawText({
      c: this.gameRef.ctx,
      x: 20,
      y: 300,
      fillColor: 'white',
      text: 'debug text',
      fontFamily: 'sans-serif',
      align: 'left',
      fontSize: 16
    })
  }

  tearDown() { }
}
