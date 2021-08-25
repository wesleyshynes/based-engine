import { BasedObject } from "../../../engine/BasedObject";
import BlastySpiderUrl from '../../../assets/blasty-man/blasty-spider-spritesheet.png'
import BlastySpiderCakeUrl from '../../../assets/blasty-man/blasty-spider-spritesheet-cake.png'
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { HealthBar } from "../ui/HealthBar";
import PF from 'pathfinding';

export class BlastSpider extends BasedObject {
    x: number = 0
    y: number = 0

    width: number = 48
    height: number = 32

    radius: number = 16
    speed: number = 1
    velocity: XYCoordinateType = {x: 0, y: 0}

    sprite: any;

    target: XYCoordinateType = {x: 0, y: 0}
    activeTarget: XYCoordinateType = {x: 0, y: 0}

    angle: number = 0

    healthBar: any;
    health: number = 100;

    tileMap: any;
    pathList: [number,number][] = []
    finder: any;

    chasing: boolean = false

    entityTag: string = 'spider'

    async preload() {
      const spiderType = getRandomInt(2)
      if(spiderType > 0) {
        this.speed = 1.2
      }
      this.sprite = await createSprite({
        c: this.gameRef.ctx,
        sprite: spiderType > 0 ? BlastySpiderCakeUrl : BlastySpiderUrl,
        sx: 0,
        sy: 0,
        sWidth: this.width,
        sHeight: this.height,
        dx: -this.width/2,
        dy: -this.height/2,
        dWidth: this.width,
        dHeight: this.height,
        frame: 0,
        lastUpdate: 0,
        updateDiff: 1000/60 * 10
      })
    }

    initialize() {
      this.healthBar = new HealthBar({key: 'spider-health', gameRef: this.gameRef})
      this.healthBar.width = this.radius * 2
      this.healthBar.yOffset = -this.radius - 5
      this.healthBar.current = 100

      this.finder = new PF.AStarFinder()
    }

    cleanDistanceToTarget() {
      return (this.tileMap.getRoomFromCoord(
          this.tileMap.getMapCoord(
            { x:(this.x + this.target.x)/2 ,
              y: (this.y + this.target.y)/2
            })).color == 1)
    }

    update() {
      const distanceToTarget = distanceBetween(this, this.target)
      const cleanDistance = this.cleanDistanceToTarget()
      if((this.pathList.length <= 0 && !this.chasing) || ((distanceToTarget > 300 || !cleanDistance) && this.chasing === true)) {
        this.chasing = false
        const mapClone = this.tileMap.pfGrid.clone()
        const {x,y} = this.tileMap.getMapCoord(this)
        const {x:x1,y:y1} = this.tileMap.getMapCoord(this.target)
        // console.log(x,y,x1,y1)
        this.pathList = this.finder.findPath(x,y,x1,y1,mapClone)
        // console.log(this.pathList)
        // console.log('Chasing False')
        this.getNextActiveTarget()
      } else if (distanceToTarget <= 300 && cleanDistance) {
        this.activeTarget = this.target
        if(this.chasing === false) {
          // console.log('Chasing True')
          this.chasing = true
          this.pathList = []
        }
      }
      this.checkRoom()

      const angleSpeed = 5 * this.gameRef.diffMulti
      const targetAngle = angleBetween(this, this.activeTarget, true) + 90
      const rotDir = (targetAngle - this.angle + 540)%360-180
      // const rotDir = (targetAngle - this.gunRotate + 540)%360-180
      if(rotDir > 0) {
        this.angle = this.angle % 360  + (rotDir > angleSpeed ? angleSpeed : rotDir)
      } else if (rotDir < 0) {
        this.angle = this.angle % 360  - (rotDir < angleSpeed ? angleSpeed : -rotDir)
      }
      if(this.angle < 0) {
        this.angle += 360
      }

      this.healthBar.x = this.x
      this.healthBar.y = this.y

      this.moveTo(this.activeTarget, () => {
        if(!this.chasing) {
          this.getNextActiveTarget()
        }
      })

      this.updateSprite()
    }

    updateSprite() {
      if(this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
        this.sprite.frame++
        if(this.sprite.frame > 2) {
          this.sprite.frame = 0
        }
        this.sprite.lastUpdate = this.gameRef.lastUpdate

        this.sprite.sx = this.sprite.frame * this.sprite.dWidth
      }
    }

    getNextActiveTarget() {
      if(this.pathList && this.pathList.length > 0) {
        const [px,py] = this.pathList.shift()
        this.activeTarget = {
          x: (px * this.tileMap.tileSize) + Math.floor(this.tileMap.tileSize/2),
          y: (py * this.tileMap.tileSize) + Math.floor(this.tileMap.tileSize/2)
        }
      }
    }

    checkRoom() {
      const room = this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this))
      if(Object.keys(room.occupants).find(o => {
        return room.occupants[o].entityTag === this.entityTag &&
        room.occupants[o].objectKey !== this.objectKey &&
        room.occupants[o].activeTarget.x === this.activeTarget.x &&
        room.occupants[o].activeTarget.y === this.activeTarget.y
      })) {
        // console.log('new route', room.occupants)
        this.chasing = false
        const mapClone = this.tileMap.pfGrid.clone()
        const nt = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.activeTarget))
        mapClone.setWalkableAt(nt.x, nt.y, false)
        const {x,y} = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this))
        const {x:x1,y:y1} = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.target))
        // console.log(x,y,x1,y1)
        this.pathList = this.finder.findPath(x,y,x1,y1,mapClone)
        // console.log(this.pathList)
        // console.log('Chasing False')
        this.getNextActiveTarget()
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
        if(this.tileMap && (!this.tileMap.onMap(this) || this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this)).color == 0)) {
          this.x -= this.velocity.x
        }
        this.y += this.velocity.y
        if(this.tileMap && (!this.tileMap.onMap(this) || this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(this)).color == 0)) {
          this.y -= this.velocity.y
        }


      } else {
        this.velocity = { x: 0, y: 0 }
        arriveFn()
      }
    }



    draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
      // drawCircle({
      //   c: this.gameRef.ctx,
      //   x: this.x,
      //   y: this.y,
      //   radius: 23,
      //   fillColor: 'green'
      // })

      rotateDraw({
        c: this.gameRef.ctx,
        x: cameraOffset.x + this.x,
        y: cameraOffset.y + this.y,
        a: this.angle
      }, () => {
        drawImage(this.sprite)
      })

      this.healthBar.draw(cameraOffset)
    }

  }
