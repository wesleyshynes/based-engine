import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { distanceBetween, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import DogSprite from '../../../assets/walk-the-human/dog-spritesheet.png'

export class Animal extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 16
  velocity: XYCoordinateType = {x: 0, y: 0}
  speed: number = 2
  target: XYCoordinateType = {x: 200, y: 300}
  fillColor: string = 'orange'
  activeTarget: boolean = false

  bonked: boolean = false
  lastBonk: number = 0
  bonkLength: number = 500

  maxSpeed: number = 2
  bonkSpeed: number = 0
  bonkCallback: () => void = () => null

  sprite: any;

  async preload(){
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: DogSprite,
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 32,
      dx: -this.radius,
      dy: -this.radius,
      dWidth: 32,
      dHeight: 32,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })
  }
  initialize() {
    this.bonked = false
    this.lastBonk = 0
  }
  update() {
    if(this.activeTarget) {
      this.moveTo(this.target, () => {
        this.activeTarget = false
      })
    } else if (this.bonked && this.lastBonk + this.bonkLength < this.gameRef.lastUpdate){
      this.bonked = false
    }
    this.updateSprite()
  }

  updateSprite() {
    if(this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if(this.sprite.frame > 1) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate

      this.sprite.sx = this.sprite.frame * this.sprite.dWidth
    }
  }

  bonk() {
    if(!this.bonked) {
      this.bonked = true
      this.lastBonk = this.gameRef.lastUpdate
      this.velocity = {x: 0,y: 0}
      this.bonkCallback()
    }
  }

  setTarget(t: XYCoordinateType){
    this.target = t
    this.activeTarget = true
  }

  moveTo(moveTarget: {x: number, y: number, active?: boolean}, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > this.radius) {
      const speedFactor = this.speed * this.gameRef.diffMulti
      this.velocity = {
        x: (speedFactor / dt) * (moveTarget.x - this.x),
        y: (speedFactor / dt) * (moveTarget.y - this.y)
      }
      this.x += this.velocity.x
      this.y += this.velocity.y
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {

    if(this.activeTarget){
      drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.target.x,
      y: cameraOffset.y + this.target.y,
      radius: 10,
      strokeColor: 'orange',
      strokeWidth: 2
    })
  }

    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: cameraOffset.x + this.x,
    //   y: cameraOffset.y + this.y,
    //   radius: this.radius,
    //   fillColor: this.fillColor
    // })
    rotateDraw({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      a: 0
    }, () => {
      this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })


  }
  tearDown() {}

}
