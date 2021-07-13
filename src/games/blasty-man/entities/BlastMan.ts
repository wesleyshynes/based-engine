import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import BlastyManUrl from '../../../assets/blasty-man/blasty-man-concept-pixel.png'
import { Gun } from "./Gun";
import { Bullet } from "./Bullet";
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";


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

  gun1Bullet: any;
  gun2Bullet: any;

  healthBar: any;
  health: number = 100;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BlastyManUrl,
      sx: 0,
      sy: 0,
      sWidth: this.width,
      sHeight: this.height,
      dx:  0,
      dy:  0,
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

  initialize() {
    this.healthBar = new HealthBar({key: 'blasty-health', gameRef: this.gameRef})
    this.healthBar.width = this.width
    this.healthBar.yOffset = -this.height/2 - 5
    this.healthBar.current = 100

    this.gun1Bullet = new Bullet({key: 'gun1Bullet', gameRef: this.gameRef})
    this.gun2Bullet = new Bullet({key: 'gun2Bullet', gameRef: this.gameRef})
  }

  update(cameraPos: XYCoordinateType = {x: 0,y: 0}) {
    // this.sprite.dx = this.x
    // this.sprite.dy = this.y

    this.healthBar.x = this.centerCoordinates().x
    this.healthBar.y = this.centerCoordinates().y

    const cX = this.x + this.width / 2
    const cY = this.y + this.height / 2

    this.target =  !this.gameRef.touchMode ? {
      x: this.gameRef.mouseInfo.x - cameraPos.x,
      y: this.gameRef.mouseInfo.y - cameraPos.y,
    } : this.target

    this.gun1.moveTo({ x: cX - 15, y: cY + 5 })
    this.gun1.setTarget(this.target)
    this.gun1.update()

    if(!this.gun1Bullet.active && this.gun1.onTarget) {
      this.gun1Bullet.fire({
        x: this.gun1.gunTip.x + this.gun1.x,
        y: this.gun1.gunTip.y + this.gun1.y
      }, this.target)
    }
    this.gun1Bullet.update()

    this.gun2.moveTo({ x: cX + 15, y: cY + 5})
    this.gun2.setTarget(this.target)
    this.gun2.update()

    if(!this.gun2Bullet.active && this.gun2.onTarget) {
      this.gun2Bullet.fire({
        x: this.gun2.gunTip.x + this.gun2.x,
        y: this.gun2.gunTip.y + this.gun2.y
      }, this.target)
    }
    this.gun2Bullet.update()
  }

  centerCoordinates() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {

    this.healthBar.draw(cameraOffset)

    // drawImage(this.sprite)
    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    if (this.target.x > this.x) {
      this.gun2.draw(cameraOffset)
      this.gun1.draw(cameraOffset)
    } else {
      this.gun1.draw(cameraOffset)
      this.gun2.draw(cameraOffset)
    }

    this.gun1Bullet.draw(cameraOffset)
    this.gun2Bullet.draw(cameraOffset)

  }
}
