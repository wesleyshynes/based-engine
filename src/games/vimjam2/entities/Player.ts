import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";
import MonkeySpriteUrl from '../../../assets/vimjam2/monkeySpriteSheet.png'

export default class Player extends BasedObject {

  x: number = 0;
  y: number = 0;

  radius: number = 28;

  speed: number = 7;
  baseSpeed: number = 7;
  pushSpeed: number = 4;

  color: string = '#ce192b'
  objectKey: string = 'player'

  target: XYCoordinateType = { x: 0, y: 0 }

  velocity: XYCoordinateType = { x: 0, y: 0 }
  tileMap: any;

  healthBar: any;
  health: number = 100;

  sprite: any;

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: MonkeySpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: 56,
      sHeight: 56,
      dx:  0,
      dy:  0,
      dWidth: 56,
      dHeight: 56,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })
  }

  initialize() {
    this.healthBar = new HealthBar({key: 'player-health', gameRef: this.gameRef})
    this.healthBar.width = this.radius * 2
    this.healthBar.yOffset = -this.radius/2 - 5
    this.healthBar.current = this.health
  }

  update() {
    this.speed = this.baseSpeed
    this.color = '#ce192b'

    // check collision
    const playerCoord = this.tileMap.getMapCoord(this)
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (this.tileMap.onMap({
          x: (playerCoord.x + i) * this.tileMap.tileSize,
          y: (playerCoord.y + j) * this.tileMap.tileSize
        })) {
          const {occupants, roomKey} = this.tileMap.getRoomFromCoord({
            x: playerCoord.x + i,
            y: playerCoord.y + j
          })
          if(i === 0 && j === 0 && !this.tileMap.visitedRooms[roomKey]) {
            this.tileMap.visitedRooms[roomKey] = true
          }
          Object.keys(occupants).map(oc => {
            if(occupants[oc].objectKey === this.objectKey) {
              return
            }
            if(occupants[oc].objectKey === 'box' && distanceBetween(this, occupants[oc]) < this.radius + occupants[oc].radius ) {
              this.speed = this.pushSpeed
              // this.color = 'blue'
              occupants[oc].moveTo({
                x: occupants[oc].x + this.velocity.x,
                y: occupants[oc].y + this.velocity.y
              })
            }

            if(occupants[oc].entityTag === 'baddie' && distanceBetween(this, occupants[oc]) < this.radius + occupants[oc].radius ) {
               this.damage(-5, occupants[oc], 16)
            }
          })
        }
      }
    }

    this.healthBar.x = this.x
    this.healthBar.y = this.y

    this.updateSprite()
  }

  damage(amount: number, dealer: XYCoordinateType, recoil: number){
    const ticked = this.healthBar.tick(amount)
    if(ticked) {
      // this.gameRef.soundPlayer.playSound(this.hitPlayerSound)
      const pushSpot = pointOnCircle(angleBetween(dealer, this), recoil)
      this.moveTo({
        x: this.x + pushSpot.x,
        y: this.y + pushSpot.y,
        // speed: recoil,
        distance: recoil
      })
    }
  }

  moveTo(moveTarget: { x: number, y: number, active?: boolean, speed?:number, distance?: number }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > 0) {
      const speedFactor = moveTarget.distance ? moveTarget.distance : (moveTarget.speed ? moveTarget.speed : this.speed) * this.gameRef.diffMulti
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
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }
  }

  setTarget(newTarget: XYCoordinateType) {
    this.target = newTarget
  }

  updateSprite() {
    if(this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if(this.sprite.frame > 2) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate

      if(Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
        this.sprite.sy = this.sprite.dHeight * 2
        this.sprite.flipX = this.velocity.x < 0
      } else if (Math.abs(this.velocity.y)) {
        this.sprite.flipX = false
        if(this.velocity.y > 0) {
          this.sprite.sy =  0
        } else {
          this.sprite.sy = this.sprite.dHeight
        }
      }

      this.sprite.sx = this.sprite.frame * this.sprite.dWidth
    }
  }

  draw() {
    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: this.x + this.gameRef.cameraPos.x,
    //   y: this.y + this.gameRef.cameraPos.y,
    //   radius: this.radius,
    //   fillColor: this.color
    // })

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.radius : -this.radius ) ,
      y: this.gameRef.cameraPos.y + this.y - this.radius,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    this.healthBar.draw()
  }
  tearDown() { }
}
