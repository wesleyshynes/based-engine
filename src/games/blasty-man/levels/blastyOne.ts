import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";

import { drawBox, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import { TouchKnob } from "../controls/TouchKnob";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spider: any;
  moveKnob: any;
  aimKnob: any;

  async preload() {
    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spider = new BlastSpider({key: 'blast-spider', gameRef: this.gameRef})
    this.spider.x = 200
    this.spider.y = 200
    await this.spider.preload()

    this.moveKnob = new TouchKnob({key: 'move-knob', gameRef: this.gameRef})
    this.moveKnob.x = 0
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob = new TouchKnob({key: 'aim-knob', gameRef: this.gameRef})
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.moveKnob.height

  }

  initialize() {
    this.bMan.initialize()
    this.spider.initialize()
    this.moveKnob.initialize()
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()

    this.bMan.update()
    this.spider.update()
    this.spider.target = this.bMan.centerCoordinates()

    this.moveKnob.update()
    if(this.moveKnob.knobActive) {
      const speedFactor = this.bMan.speed * this.gameRef.diffMulti
      this.bMan.x += (this.moveKnob.knobCoord.x/this.moveKnob.maxOffset)*speedFactor
      this.bMan.y += (this.moveKnob.knobCoord.y/this.moveKnob.maxOffset)*speedFactor
    }

    this.aimKnob.update()
    if(this.aimKnob.knobActive) {
      const{x: bx, y: by} = this.bMan.centerCoordinates()
      this.bMan.target.x = (this.aimKnob.knobCoord.x/this.aimKnob.maxOffset) * 1000 + bx
      this.bMan.target.y = (this.aimKnob.knobCoord.y/this.aimKnob.maxOffset)* 1000 + by
    }
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

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: 20,
    //   y: 300,
    //   fillColor: 'white',
    //   text: 'debug text',
    //   fontFamily: 'sans-serif',
    //   align: 'left',
    //   fontSize: 16
    // })
    if(this.gameRef.touchMode) {
      this.moveKnob.draw()
      this.aimKnob.draw()
    }
  }

  tearDown() { }
}
