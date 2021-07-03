import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";
import { TouchKnob } from "../controls/TouchKnob";
import { BlastyMap } from "../maps/BlastyMap";
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spider: any;
  moveKnob: any;
  aimKnob: any;

  tileMap: any;

  cameraPos: XYCoordinateType = {x: 0, y: 0}
  levelWidth: number = 2000
  levelHeight: number = 2000

  async preload() {
    this.tileMap = new BlastyMap({key: 'blast-map-1', gameRef: this.gameRef})
    this.tileMap.width = this.levelWidth
    this.tileMap.height = this.levelHeight
    this.tileMap.tileSize = 32
    await this.tileMap.preload()

    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spider = new BlastSpider({key: 'blast-spider', gameRef: this.gameRef})
    this.spider.x = 200
    this.spider.y = 200
    await this.spider.preload()

    this.moveKnob = new TouchKnob({key: 'move-knob', gameRef: this.gameRef})
    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.moveKnob.width
    this.moveKnob.x = 0
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob = new TouchKnob({key: 'aim-knob', gameRef: this.gameRef})
    this.aimKnob.width = this.aimKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.aimKnob.width
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.moveKnob.height

  }

  initialize() {
    this.bMan.initialize()
    this.spider.initialize()
    this.moveKnob.initialize()
    this.aimKnob.initialize()
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()

    this.bMan.update(this.cameraPos)
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

    this.updateCamera()
  }

  updateCamera() {
    const bManCenter = this.bMan.centerCoordinates()
    this.cameraPos = {
      x: -(bManCenter.x - this.gameRef.gameWidth / 2),
      y: -(bManCenter.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.cameraPos.x > 0) this.cameraPos.x = 0
      if (this.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.cameraPos.y > 0) this.cameraPos.y = 0
      if (this.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  updateBg() { }

  drawBg() { }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.tileMap.draw(this.cameraPos)

    this.drawBg()

    this.bMan.draw(this.cameraPos)
    this.spider.draw(this.cameraPos)

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
