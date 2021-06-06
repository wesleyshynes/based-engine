import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawImage } from "../../../engine/libs/drawHelpers";
import BlastyManUrl from '../../../assets/blasty-man/blasty-man-concept-pixel.png'
import { Gun } from "./Gun";


export class BlastMan extends BasedObject {
  x: number = 0
  y: number = 0

  width: number = 40
  height: number = 64

  target: { x: number, y: number } = { x: 0, y: 0 }

  sprite: any;

  speed: number = 3

  gun1: any;
  gun2: any;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BlastyManUrl,
      sx: 0,
      sy: 0,
      sWidth: this.width,
      sHeight: this.height,
      dx: this.x,
      dy: this.y,
      dWidth: this.width,
      dHeight: this.height,
      frame: 0
    })

    this.gun1 = new Gun({ key: 'gun1', gameRef: this.gameRef })
    this.gun1.x = 100
    this.gun1.y = 100
    await this.gun1.preload()

    this.gun2 = new Gun({ key: 'gun2', gameRef: this.gameRef })
    this.gun2.x = 130
    this.gun2.y = 100
    await this.gun2.preload()
  }

  initialize() { }

  update() {

    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = this.speed * this.gameRef.diffMulti

    if (pressedKeys['KeyA']) {
      this.x -= speedFactor
    }
    if (pressedKeys['KeyD']) {
      this.x += speedFactor
    }
    if (pressedKeys['KeyW']) {
      this.y -= speedFactor
    }
    if (pressedKeys['KeyS']) {
      this.y += speedFactor
    }

    this.sprite.dx = this.x
    this.sprite.dy = this.y

    const cX = this.x + this.width / 2
    const cY = this.y + this.height / 2

    this.target = {
      x: this.gameRef.mouseInfo.x,
      y: this.gameRef.mouseInfo.y,
    }

    this.gun1.moveTo({ x: cX - 15, y: cY + 5 })
    this.gun1.setTarget(this.target)
    this.gun1.update()

    this.gun2.moveTo({ x: cX + 15, y: cY + 5})
    this.gun2.setTarget(this.target)
    this.gun2.update()
  }

  draw() {
    drawImage(this.sprite)
    if (this.target.x > this.x) {
      this.gun2.draw()
      this.gun1.draw()
    } else {
      this.gun1.draw()
      this.gun2.draw()
    }

  }
}
