import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, getRandomInt, pointOnCircle, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PF from 'pathfinding';
import { HealthBar } from "../ui/HealthBar";
import BadMonkeySprite from '../../../assets/vimjam2/monkeyEnemySprite.png'
import BadMonkeySprite1 from '../../../assets/vimjam2/monkeyEnemySprites_1.png'
import BadMonkeySprite2 from '../../../assets/vimjam2/monkeyEnemySprites_2.png'
import BadMonkeySprite3 from '../../../assets/vimjam2/monkeyEnemySprites_3.png'
import BadMonkeySprite4 from '../../../assets/vimjam2/monkeyEnemySprites_4.png'
import BadMonkeySprite5 from '../../../assets/vimjam2/monkeyEnemySprites_5.png'
// import BadMonkeySprite from '../../../assets/vimjam2/Monkey_Enemey.png'
import BadPigSprite from '../../../assets/vimjam2/pigEnemySprite.png'
// import BadPigSprite from '../../../assets/vimjam2/Pig_Enemey_2.png'
import Hurt1 from '../../../assets/vimjam2/monkey-1.mp3'
import Hurt2 from '../../../assets/vimjam2/monkey-2.mp3'
import Hurt3 from '../../../assets/vimjam2/monkey-3.mp3'

export default class Baddie extends BasedObject {
  x: number = 0
  y: number = 0
  speed: number = 2
  radius: number = 16
  color: string = 'pink'

  chasing: boolean = false

  entityTag: string = 'baddie'
  spawnRoom: string = ''

  tileMap: any;
  pathList: [number, number][] = []
  finder: any;
  lastRoomCheck: number = 0
  lastRoomCheckAmount: number = 500

  target: XYCoordinateType = { x: 0, y: 0 }
  activeTarget: XYCoordinateType = { x: 0, y: 0 }

  velocity: XYCoordinateType = { x: 0, y: 0 };

  healthBar: any;
  health: number = 100;

  sprite: any;
  spritePool: any[] = [
    BadPigSprite,
    BadPigSprite,
    BadPigSprite,
    BadMonkeySprite,
    BadMonkeySprite,
    BadMonkeySprite,
    BadMonkeySprite1,
    BadMonkeySprite2,
    BadMonkeySprite3,
    BadMonkeySprite4,
    BadMonkeySprite5,
  ];
  noises: any[] = [];
  noisePool: any[] = [Hurt1, Hurt2, Hurt3]

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      // sprite: BadMonkeySprite,
      sprite: this.spritePool[getRandomInt(this.spritePool.length)],
      sx: 0,
      sy: 0,
      sWidth: 32,
      sHeight: 32,
      dx: 0,
      dy: 0,
      dWidth: 32,
      dHeight: 32,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })

    this.noises = []
    for(let i = 0; i < 3; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(this.noisePool[i])
      this.noises.push(loadNoise)
    }
  }

  initialize() {
    this.baddieDefaultInitialize()
  }

  baddieDefaultInitialize() {
    this.healthBar = new HealthBar({ key: `baddie-health-${this.objectKey}`, gameRef: this.gameRef })
    this.healthBar.width = this.radius * 2
    this.healthBar.yOffset = -this.radius / 2 - 20
    this.healthBar.current = this.health
    this.healthBar.max = this.health
    this.healthBar.x = this.x
    this.healthBar.y = this.y

    this.finder = new PF.AStarFinder({/* allowDiagonal: true,dontCrossCorners: true' */ })
  }

  update() {
    this.updateSprite()
    if (!this.tileMap.visitedRooms[this.spawnRoom] && this.healthBar.current === this.healthBar.max) {
      return
    }
    this.chaseTarget()

    this.healthBar.x = this.x
    this.healthBar.y = this.y
  }

  chaseTarget() {
    const distanceToTarget = distanceBetween(this, this.target)
    const cleanDistance = this.cleanDistanceToTarget()
    if((this.pathList.length <= 0 && !this.chasing) || ((distanceToTarget > 300 || !cleanDistance) && this.chasing === true)) {
      this.chasing = false
      const mapClone = this.tileMap.pfGrid.clone()
      const { x, y } = this.tileMap.getMapCoord(this)
      const { x: x1, y: y1 } = this.tileMap.getMapCoord(this.target)
      this.pathList = this.finder.findPath(x, y, x1, y1, mapClone)
      if (this.pathList.length === 0) {
        this.pathList = [[x1, y1]]
      }
      this.getNextActiveTarget()
    } else if (distanceToTarget <= 300 && cleanDistance) {
      this.activeTarget = this.target
      if(this.chasing === false){
        this.chasing = true
        this.pathList = []
      }
    }

    this.checkRoom()

    this.moveTo({
      x: this.activeTarget.x,
      y: this.activeTarget.y,
    }, () => {this.onTargetCallBack()})
  }

  cleanDistanceToTarget() {
    const p = pointOnCircle(angleBetween(this, this.target), this.radius + 5)
    // return (this.tileMap.getRoomFromCoord(
    //     this.tileMap.getMapCoord({
    //       x: (this.x + p.x),
    //       y: (this.y + p.y)
    //     })).walkable)

    return (this.tileMap.getRoomFromCoord(
      this.tileMap.getMapCoord({
        x: (this.x + this.target.x) / 2,
        y: (this.y + this.target.y) / 2
      })).walkable) &&
      (this.tileMap.getRoomFromCoord(
        this.tileMap.getMapCoord({
          x: (this.x + p.x),
          y: (this.y + p.y)
        })).walkable)
    // return true
  }

  checkRoom() {
    if (this.lastRoomCheck < this.gameRef.lastUpdate + this.lastRoomCheckAmount) {
      const room = this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this))
      if (Object.keys(room.occupants).find(o => {
        return room.occupants[o].entityTag === this.entityTag &&
          room.occupants[o].objectKey !== this.objectKey &&
          room.occupants[o].activeTarget.x === this.activeTarget.x &&
          room.occupants[o].activeTarget.y === this.activeTarget.y
      })) {
        this.chasing = false
        const mapClone = this.tileMap.pfGrid.clone()
        const nt = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.activeTarget))
        mapClone.setWalkableAt(nt.x, nt.y, false)
        const { x, y } = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this))
        const { x: x1, y: y1 } = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.target))
        this.pathList = this.finder.findPath(x, y, x1, y1, mapClone)
        this.getNextActiveTarget()
      }
      this.lastRoomCheck = this.gameRef.lastUpdate + getRandomInt(300)
    }
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
      }, () => this.onTargetCallBack())
      this.gameRef.soundPlayer.playSound(this.noises[getRandomInt(3)])
      return true
    }
    return false
  }

  onTargetCallBack() {
    // if (!this.chasing) {
      this.getNextActiveTarget()
    // }
  }

  moveTo(moveTarget: { x: number, y: number, active?: boolean, speed?: number, distance?: number }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > this.radius / 2) {
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
  }

  getNextActiveTarget() {
    if (this.pathList && this.pathList.length > 0) {
      const [px, py] = this.pathList.shift()
      this.activeTarget = {
        x: (px * this.tileMap.tileSize) + Math.floor(this.tileMap.tileSize / 2),
        y: (py * this.tileMap.tileSize) + Math.floor(this.tileMap.tileSize / 2)
      }
    }
  }

  updateSprite() {
    if (this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if (this.sprite.frame > 3) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate


      if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
        this.sprite.sy = this.sprite.dHeight * 2
        this.sprite.flipX = this.velocity.x < 0
      } else if (Math.abs(this.velocity.y)) {
        this.sprite.flipX = false
        if (this.velocity.y > 0) {
          this.sprite.sy = 0
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
      x: this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.radius : -this.radius),
      y: this.gameRef.cameraPos.y + this.y - this.radius,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    this.healthBar.current < this.health && this.healthBar.draw()
  }


  tearDown() { }
}
