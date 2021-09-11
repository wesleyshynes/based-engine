import { BasedLevel } from "../../../engine/BasedLevel";
import { TouchKnob } from "../../../engine/controls/TouchKnob";
import Player from "../entities/Player";
import { MapOne } from "../maps/MapOne";

export class LevelOne extends BasedLevel {

  player: any;

  moveKnob: any;
  aimKnob: any;

  levelWidth: number = 3200
  levelHeight: number = 3200

  tileMap: any;

  async preload() {
    this.tileMap = new MapOne({key: 'map-1', gameRef: this.gameRef})
    this.tileMap.tileSize = 64
    await this.tileMap.preload()
    this.levelWidth = this.tileMap.width
    this.levelHeight = this.tileMap.height

    this.player = new Player({ key: 'player' , gameRef: this.gameRef})
    this.player.x = (this.tileMap.roomList[0].x + 2) * this.tileMap.tileSize
    this.player.y = (this.tileMap.roomList[0].y + 2) * this.tileMap.tileSize
    this.player.tileMap = this.tileMap

    this.moveKnob = new TouchKnob({key: 'move-knob', gameRef: this.gameRef})
    this.aimKnob = new TouchKnob({key: 'aim-knob', gameRef: this.gameRef})
    this.positionKnobs()
  }

  initialize() {
    this.player.initialize()
    this.moveKnob.initialize()
    this.aimKnob.initialize()
  }

  update() {
    this.movePlayer()
    this.player.update()

    this.updateCamera()

  }

  movePlayer() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = 100//this.player.speed * this.gameRef.diffMulti

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
    if (pressedKeys['KeyX']) { }

    this.moveKnob.update()
    if(this.moveKnob.knobActive) {
      const speedFactor = 10//this.player.speed * this.gameRef.diffMulti
      moveX += (this.moveKnob.knobCoord.x/this.moveKnob.maxOffset)*speedFactor
      moveY += (this.moveKnob.knobCoord.y/this.moveKnob.maxOffset)*speedFactor
    }

    this.player.moveTo({
      x: this.player.x + moveX,
      y: this.player.y + moveY
    })

    this.aimKnob.update()
    if(this.aimKnob.knobActive) {
      const{x: bx, y: by} = this.player
      this.player.setTarget({
        x: (this.aimKnob.knobCoord.x/this.aimKnob.maxOffset) * 1000 + bx,
        y: (this.aimKnob.knobCoord.y/this.aimKnob.maxOffset) * 1000 + by,
      })
      // this.bMan.attacking = true
    } else if(!this.gameRef.touchMode) {
      // this.player.attacking = this.gameRef.mouseInfo.mouseDown
      this.player.setTarget({
        x: this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y,
      })
    } else {
      // this.bMan.attacking = false
    }


  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.tileMap.draw()

    this.player.draw()

    this.moveKnob.draw()
    this.aimKnob.draw()
  }

  updateCamera() {
    const cameraTarget = this.player
    this.gameRef.cameraPos = {
      x: -(cameraTarget.x - this.gameRef.gameWidth / 2),
      y: -(cameraTarget.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.gameRef.cameraPos.x > 0) this.gameRef.cameraPos.x = 0
      if (this.gameRef.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.gameRef.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.gameRef.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.gameRef.cameraPos.y > 0) this.gameRef.cameraPos.y = 0
      if (this.gameRef.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.gameRef.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.gameRef.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  positionKnobs() {
    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.moveKnob.width
    this.moveKnob.x = 0
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob.width = this.aimKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.aimKnob.width
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.moveKnob.height
  }

  onResize() {
    this.positionKnobs()
  }

  tearDown() {}

}
