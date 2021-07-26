import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";
import { TouchKnob } from "../controls/TouchKnob";
import { BlastyMap } from "../maps/BlastyMap";
import { distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spider: any;
  spider2: any;
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
    this.tileMap.tileSize = 64
    await this.tileMap.preload()

    this.bMan = new BlastMan({key: 'blastMan', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spider = new BlastSpider({key: 'blastSpider', gameRef: this.gameRef})
    this.spider.x = 200
    this.spider.y = 200
    await this.spider.preload()

    this.spider2 = new BlastSpider({key: 'blastSpider2', gameRef: this.gameRef})
    this.spider2.x = 1300
    this.spider2.y = 500
    await this.spider2.preload()

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
    this.spider.tileMap = this.tileMap
    this.spider.target = this.bMan.centerCoordinates()

    this.spider2.initialize()
    this.spider2.tileMap = this.tileMap
    this.spider2.target = this.bMan.centerCoordinates()

    this.moveKnob.initialize()
    this.aimKnob.initialize()
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()


    this.tileMap.removeOccupant({...this.bMan.centerCoordinates(), key: this.bMan.key})
    this.tileMap.removeOccupant(this.bMan.gun1Bullet)
    this.tileMap.removeOccupant(this.bMan.gun2Bullet)
    this.tileMap.removeOccupant(this.spider)
    this.tileMap.removeOccupant(this.spider2)

    this.bMan.update(this.cameraPos)

    this.spider.update()
    this.spider.target = this.bMan.centerCoordinates()
    this.tileMap.addOccupant(this.spider)

    this.spider2.update()
    this.spider2.target = this.bMan.centerCoordinates()
    this.tileMap.addOccupant(this.spider2)

    this.moveCharacter()

    this.tileMap.addOccupant({...this.bMan.centerCoordinates(), objectKey: this.bMan.objectKey})
    this.tileMap.addOccupant(this.bMan.gun1Bullet)
    this.tileMap.addOccupant(this.bMan.gun2Bullet)

    // collision checks
    if(distanceBetween(this.bMan.centerCoordinates(), this.spider) <= 16){
      this.bMan.healthBar.tick(-5)
    }

    if(distanceBetween(this.bMan.gun1Bullet, this.spider) <= 16){
      this.bMan.gun1Bullet.active = false
      this.spider.healthBar.tick(-1)
    }

    if(distanceBetween(this.bMan.gun2Bullet, this.spider) <= 16){
      this.bMan.gun2Bullet.active = false
      this.spider.healthBar.tick(-1)
    }

    this.updateCamera()
  }

  moveCharacter() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = this.bMan.speed * this.gameRef.diffMulti

    let moveX = 0
    let moveY = 0

    if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
      moveX -= speedFactor
    }
    if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
      moveX += speedFactor
    }
    if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
      moveY -= speedFactor
    }
    if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
      moveY += speedFactor
    }

    this.moveKnob.update()
    if(this.moveKnob.knobActive) {
      const speedFactor = this.bMan.speed * this.gameRef.diffMulti
      moveX += (this.moveKnob.knobCoord.x/this.moveKnob.maxOffset)*speedFactor
      moveY += (this.moveKnob.knobCoord.y/this.moveKnob.maxOffset)*speedFactor
    }

    this.aimKnob.update()
    if(this.aimKnob.knobActive) {
      const{x: bx, y: by} = this.bMan.centerCoordinates()
      this.bMan.target.x = (this.aimKnob.knobCoord.x/this.aimKnob.maxOffset) * 1000 + bx
      this.bMan.target.y = (this.aimKnob.knobCoord.y/this.aimKnob.maxOffset)* 1000 + by
    }

    this.bMan.x += moveX
    if(!this.tileMap.onMap(this.bMan.centerCoordinates()) || this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this.bMan.centerCoordinates())).color == 0) {
      this.bMan.x -= moveX
    }

    this.bMan.y += moveY
    if(!this.tileMap.onMap(this.bMan.centerCoordinates()) || this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this.bMan.centerCoordinates())).color == 0) {
      this.bMan.y -= moveY
    }

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
    this.spider2.draw(this.cameraPos)

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
