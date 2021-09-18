import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, getRandomInt, pointOnCircle, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";
import MonkeySpriteUrl from '../../../assets/vimjam2/monkeySpriteSheet.png'
import { MeleeWeapon } from "./MeleeWeapon";
import { ProjectileWeapon } from "./ProjectileWeapon";
import Chimp1 from '../../../assets/vimjam2/chimp-1.mp3'
import Chimp2 from '../../../assets/vimjam2/chimp-2.mp3'
import Chimp3 from '../../../assets/vimjam2/chimp-3.mp3'
import Chimp4 from '../../../assets/vimjam2/chimp-4.mp3'

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
  poopHealthBar: any;
  health: number = 100;


  sprite: any;

  // mode: string = 'melee';
  // prevMode: string = 'melee'

  mode: string = 'shoot'
  prevMode: string = 'shoot'
  lastSwitch: number = 0
  switchDelay: number = 300

  direction: string = 'up'

  meleeWeapon: any;
  projectileWeapon: any;

  attacking: boolean = false;

  noises: any[] = []
  lastSound: number = 0
  soundDelay: number = 300

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: MonkeySpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: 56,
      sHeight: 56,
      dx: 0,
      dy: 0,
      dWidth: 56,
      dHeight: 56,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })

    this.meleeWeapon = new MeleeWeapon({ key: 'melee-weapon', gameRef: this.gameRef })
    await this.meleeWeapon.preload()


    this.projectileWeapon = new ProjectileWeapon({ key: 'projectile-weapon', gameRef: this.gameRef })
    await this.projectileWeapon.preload()

    this.noises = []
    const loadNoises = [Chimp1, Chimp2, Chimp3, Chimp4]
    for(let i = 0; i < 4; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(loadNoises[i])
      this.noises.push(loadNoise)
    }
  }

  initialize() {
    this.healthBar = new HealthBar({ key: 'player-health', gameRef: this.gameRef })
    this.healthBar.width = this.radius * 2
    this.healthBar.yOffset = -this.radius / 2 - 20
    this.healthBar.current = this.health

    this.poopHealthBar = new HealthBar({ key: 'poop-health', gameRef: this.gameRef })
    this.poopHealthBar.width = this.radius * 2
    this.poopHealthBar.yOffset = this.radius / 2 + 30
    this.poopHealthBar.current = this.health

    this.meleeWeapon.initialize()
    this.meleeWeapon.yOffset = 10

    this.projectileWeapon.initialize()
    this.projectileWeapon.yOffset = 10
  }

  switchMode(mode: string) {
    if(this.lastSwitch + this.switchDelay < this.gameRef.lastUpdate){
      this.mode = mode
      this.prevMode = mode
      this.projectileWeapon.projectile.lastShot = this.gameRef.lastUpdate
      this.projectileWeapon.projectile.active = false
      this.lastSwitch = this.gameRef.lastUpdate
    }
  }

  update() {

    this.mode = this.speed === this.pushSpeed ? 'push' : this.prevMode

    this.speed = this.baseSpeed
    this.color = '#ce192b'

    this.meleeWeapon.target = this.target
    this.mode === 'melee' && this.meleeWeapon.update()

    this.projectileWeapon.target = this.target
    if (this.mode === 'shoot') {
      this.projectileWeapon.update()
      if (this.poopHealthBar.current > 0) {
        this.attacking && this.projectileWeapon.onTarget && this.projectileWeapon.fire() && this.poopHealthBar.tick(-5)
      } else {
        this.switchMode('melee')
      }
    }

    // check collision
    const playerCoord = this.tileMap.getMapCoord(this)
    const projectileCoord = this.tileMap.getMapCoord(this.projectileWeapon.projectile)

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {

        if(this.mode === 'shoot' && this.projectileWeapon.projectile.active) {
          if (this.tileMap.onMap({
            x: (projectileCoord.x + i) * this.tileMap.tileSize,
            y: (projectileCoord.y + j) * this.tileMap.tileSize
          })) {
            // try {
              const { occupants } = this.tileMap.getRoomFromCoord({
                x: projectileCoord.x + i,
                y: projectileCoord.y + j
              })
              Object.keys(occupants).map(oc => {
                if (occupants[oc].entityTag === 'baddie' && occupants[oc].healthBar.current > 0) {
                  if (distanceBetween(this.projectileWeapon.projectile, occupants[oc]) < this.projectileWeapon.projectile.radius + occupants[oc].radius) {
                    occupants[oc].damage(-10, this.projectileWeapon.projectile, 16)
                    this.projectileWeapon.projectile.hit()
                  }
                }
              })
            // } catch(err) {
            //   console.log(err)
            //   console.log(projectileCoord, i, j)
            // }
          }
        }

        if (this.tileMap.onMap({
          x: (playerCoord.x + i) * this.tileMap.tileSize,
          y: (playerCoord.y + j) * this.tileMap.tileSize
        })) {
          const { occupants, roomKey } = this.tileMap.getRoomFromCoord({
            x: playerCoord.x + i,
            y: playerCoord.y + j
          })
          if (i === 0 && j === 0 && !this.tileMap.visitedRooms[roomKey]) {
            this.tileMap.visitedRooms[roomKey] = true
          }
          Object.keys(occupants).map(oc => {
            if (occupants[oc].objectKey === this.objectKey) {
              return
            }
            if (occupants[oc].objectKey === 'box' && distanceBetween(this, occupants[oc]) < this.radius + occupants[oc].radius) {
              this.speed = this.pushSpeed
              // this.color = 'blue'
              occupants[oc].moveTo({
                x: occupants[oc].x + this.velocity.x,
                y: occupants[oc].y + this.velocity.y
              })
            }

            if (occupants[oc].entityTag === 'pickup' && occupants[oc].active && distanceBetween(this, occupants[oc]) < this.radius + occupants[oc].radius) {
              occupants[oc].onPickup()
            }

            if (occupants[oc].entityTag === 'baddie' && occupants[oc].healthBar.current > 0) {
              if (distanceBetween(this, occupants[oc]) < this.radius + occupants[oc].radius) {
                this.damage(-5, occupants[oc], 16)
              }
              const meleeHitBox = {
                x: this.meleeWeapon.x + this.meleeWeapon.hitBox.x,
                y: this.meleeWeapon.y + this.meleeWeapon.hitBox.y,
              }
              if (this.mode === 'melee' && distanceBetween(meleeHitBox, occupants[oc]) < this.meleeWeapon.hitBoxRadius + occupants[oc].radius) {
                occupants[oc].damage(this.meleeWeapon.currentSpeed > 5 ? -30 : -5, meleeHitBox, 16) && this.meleeWeapon.playImpactNoise()
              }
            }
          })
        }
      }
    }

    this.healthBar.x = this.x
    this.healthBar.y = this.y

    this.poopHealthBar.x = this.x
    this.poopHealthBar.y = this.y

    this.updateSprite()
  }

  damage(amount: number, dealer: XYCoordinateType, recoil: number) {
    const ticked = this.healthBar.tick(amount)
    if (ticked) {
      // this.gameRef.soundPlayer.playSound(this.hitPlayerSound)
      const pushSpot = pointOnCircle(angleBetween(dealer, this), recoil)
      this.moveTo({
        x: this.x + pushSpot.x,
        y: this.y + pushSpot.y,
        // speed: recoil,
        distance: recoil
      })
      if(this.lastSound + this.soundDelay < this.gameRef.lastUpdate){
        this.gameRef.soundPlayer.playSound(this.noises[getRandomInt(4)])
        this.lastSound = this.gameRef.lastUpdate
      }
    }
  }

  moveTo(moveTarget: { x: number, y: number, active?: boolean, speed?: number, distance?: number }, arriveFn: () => void = () => undefined) {
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
        (!this.tileMap.onMap({ x: this.x + relX, y: this.y }) ||
          !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({ x: this.x + relX, y: this.y })).walkable)
      ) {
        this.x -= this.velocity.x
      }
      this.y += this.velocity.y
      const relY = relativeMultiplier(this.velocity.y) * this.radius
      if (
        this.tileMap &&
        (!this.tileMap.onMap({ x: this.x, y: this.y + relY }) ||
          !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({ x: this.x, y: this.y + relY })).walkable)
      ) {
        this.y -= this.velocity.y
      }
    } else {
      this.velocity = { x: 0, y: 0 }
      arriveFn()
    }

    this.meleeWeapon.moveTo(this)
    this.projectileWeapon.moveTo(this)

  }

  setTarget(newTarget: XYCoordinateType) {
    this.target = newTarget
  }

  updateSprite() {
    if (this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if (this.sprite.frame > 2) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate

      if (this.mode === 'melee') {
        const relVel = {
          // x: this.target.x - this.x,
          // y: this.target.y - this.y,
          x: this.meleeWeapon.x + this.meleeWeapon.hitBox.x - this.x,
          y: this.meleeWeapon.y + this.meleeWeapon.hitBox.y - this.y,
        }
        if (Math.abs(relVel.x) > Math.abs(relVel.y)) {
          this.sprite.sy = this.sprite.dHeight * 2
          this.sprite.flipX = relVel.x < 0
          this.direction = relVel.x < 0 ? 'left' : 'right'
        } else if (Math.abs(relVel.y)) {
          this.sprite.flipX = false
          if (relVel.y > 0) {
            this.sprite.sy = 0
            this.direction = 'down'
          } else {
            this.sprite.sy = this.sprite.dHeight
            this.direction = 'up'
          }
        }
      } else {
        if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
          this.sprite.sy = this.sprite.dHeight * 2
          this.sprite.flipX = this.velocity.x < 0
          this.direction = this.velocity.x < 0 ? 'left' : 'right'
        } else if (Math.abs(this.velocity.y)) {
          this.sprite.flipX = false
          if (this.velocity.y > 0) {
            this.sprite.sy = 0
            this.direction = 'down'
          } else {
            this.sprite.sy = this.sprite.dHeight
            this.direction = 'up'
          }
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

    this.direction === 'up' && this.mode === 'melee' && this.meleeWeapon.draw()
    this.direction === 'up' && this.mode === 'shoot' && this.projectileWeapon.draw()

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.radius : -this.radius),
      y: this.gameRef.cameraPos.y + this.y - this.radius,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    this.direction !== 'up' && this.mode === 'melee' && this.meleeWeapon.draw()
    this.direction !== 'up' && this.mode === 'shoot' && this.projectileWeapon.draw()


    // this.healthBar.current < this.healthBar.max && this.healthBar.draw()
    // this.mode === 'shoot' && this.poopHealthBar.draw()

  }
  tearDown() { }
}
