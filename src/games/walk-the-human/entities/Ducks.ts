import { createSprite, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { Pickup } from "./Pickup";
import DuckSprite from '../../../assets/walk-the-human/ducks-spritesheet.png'
import { distanceBetween, getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class Ducks extends Pickup {
    sprite: any
    radius: number = 16

    velocity: XYCoordinateType = {x: 0, y: 0}
    target: XYCoordinateType = {x: 0, y: 0}

    spawnX: number = 0
    spawnY: number = 0

    fleeing: boolean = false
    fleeSpeed: number = 5
    walkSpeed: number = 1
    speed: number = 1

    async preload() {
      this.sprite = await createSprite({
        c: this.gameRef.ctx,
        sprite: DuckSprite,
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
      this.active = true
      this.x = this.spawnX
      this.y = this.spawnY
      this.fleeing = false
      this.speed = this.walkSpeed
      this.randomSpawnTarget()
    }

    update() {
      this.updateSprite()
      if(this.fleeing) {
        this.moveTo(this.target, () => {
          this.active = false
        })
      } else {
        this.moveTo(this.target, () => {
          this.randomSpawnTarget()
        })
      }
    }

    flee() {
      this.fleeing = true
      this.target = {
        x: this.x + 400*(getRandomInt(2)*2-1),
        y: this.y + 400*(getRandomInt(2)*2-1)
      }
      this.speed = this.fleeSpeed
    }

    randomSpawnTarget() {
      this.target = {
        x: this.spawnX + 50*(getRandomInt(2)*2-1),
        y: this.spawnY + 50*(getRandomInt(2)*2-1)
      }
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

    draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
      rotateDraw({
        c: this.gameRef.ctx,
        x: cameraOffset.x + this.x,
        y: cameraOffset.y + this.y,
        a: 0
      }, () => {
        drawImage(this.sprite)
      })
    }
}
