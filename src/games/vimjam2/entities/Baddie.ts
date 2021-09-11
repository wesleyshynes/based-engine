import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PF from 'pathfinding';

export default class Baddie extends BasedObject {
  x: number = 0
  y: number = 0
  speed: number = 3
  radius: number = 16
  color: string = 'pink'

  chasing: boolean = false

  entityTag: string = 'baddie'

  tileMap: any;
  pathList: [number, number][] = []
  finder: any;
  lastRoomCheck: number = 0
  lastRoomCheckAmount: number = 500

  target: XYCoordinateType = { x: 0, y: 0 }
  activeTarget: XYCoordinateType = { x: 0, y: 0 }

  velocity: XYCoordinateType = { x: 0, y: 0 };

  async preload() { }

  initialize() {
    this.finder = new PF.AStarFinder({
      // allowDiagonal: true,
      // dontCrossCorners: true
    })
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
      if(this.pathList.length === 0) {
        this.pathList = [[x1,y1]]
      }
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

    this.moveTo(this.activeTarget, () => {
      if (!this.chasing) {
        this.getNextActiveTarget()
      }
    })
  }

  cleanDistanceToTarget() {
    return (this.tileMap.getRoomFromCoord(
      this.tileMap.getMapCoord({
        x: (this.x + this.target.x) / 2,
        y: (this.y + this.target.y) / 2
      })).walkable)
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
        // console.log('new route', room.occupants)
        this.chasing = false
        const mapClone = this.tileMap.pfGrid.clone()
        const nt = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.activeTarget))
        mapClone.setWalkableAt(nt.x, nt.y, false)
        const { x, y } = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this))
        const { x: x1, y: y1 } = this.tileMap.getMapCoord(this.tileMap.getMapCoord(this.target))
        // console.log(x,y,x1,y1)
        this.pathList = this.finder.findPath(x, y, x1, y1, mapClone)
        // console.log(this.pathList)
        // console.log('Chasing False')
        this.getNextActiveTarget()
      }
      this.lastRoomCheck = this.gameRef.lastUpdate
    }
  }

  moveTo(moveTarget: { x: number, y: number, active?: boolean }, arriveFn: () => void = () => undefined) {
    const dt = distanceBetween(this, moveTarget)
    if (dt > this.radius/2) {
      const speedFactor = this.speed * this.gameRef.diffMulti
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

  draw() {
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + this.gameRef.cameraPos.x,
      y: this.y + this.gameRef.cameraPos.y,
      radius: this.radius,
      fillColor: this.color
    })
  }


  tearDown() { }
}
