import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawBox, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { distanceBetween, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import BananaCrateSpriteUrl from '../../../assets/vimjam2/bananaCrate.png'
import DragSound from '../../../assets/vimjam2/drag-2.mp3'

export default class PushBox extends BasedObject {

  x: number = 0
  y: number = 0

  radius: number = 32

  speed: number = 3

  width: number = 64
  height: number = 64

  objectKey: string = 'box'

  color: string = 'orange'
  tileMap: any;

  velocity: XYCoordinateType = { x: 0, y: 0 }

  dragSound: any;
  lastSound: number = 0
  soundTimeDiff: number = 500

  sprite: any;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BananaCrateSpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: this.width,
      sHeight: this.height,
      dx:  0,
      dy:  0,
      dWidth: this.width,
      dHeight: this.height,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })

    this.dragSound = await this.gameRef.soundPlayer.loadSound(DragSound)

  }
  initialize() { }
  update() { }

  handleDragNoise() {
    if (this.lastSound + this.soundTimeDiff < this.gameRef.lastUpdate) {
      this.gameRef.soundPlayer.playSound(this.dragSound)
      this.lastSound = this.gameRef.lastUpdate
    }
  }

  moveTo(moveTarget: { x: number, y: number, active?: boolean }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > 0) {
      const speedFactor = this.speed * this.gameRef.diffMulti
      this.velocity = {
        x: (speedFactor / dt) * (moveTarget.x - this.x),
        y: (speedFactor / dt) * (moveTarget.y - this.y)
      }
      this.x += this.velocity.x
      const relX = relativeMultiplier(this.velocity.x) * this.radius
      if (
        this.tileMap &&
        (!this.tileMap.onMap({x: this.x + relX, y: this.y}) ||
        !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: this.x + relX, y: this.y})).walkable)
      ) {
        this.x -= this.velocity.x
      }
      this.y += this.velocity.y
      const relY = relativeMultiplier(this.velocity.y) * this.radius
      if (
        this.tileMap &&
        (!this.tileMap.onMap({x: this.x, y: this.y + relY}) ||
        !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: this.x, y: this.y + relY})).walkable)
      ) {
        this.y -= this.velocity.y
      }
      this.handleDragNoise()
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x - this.width / 2 + this.gameRef.cameraPos.x,
      y: this.y - this.height / 2 + this.gameRef.cameraPos.y,
      width: this.width,
      height: this.height,
      fillColor: this.color
    })

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.x - this.width / 2 + this.gameRef.cameraPos.x,
      y: this.y - this.height / 2 + this.gameRef.cameraPos.y,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

  }
  tearDown() { }
}
