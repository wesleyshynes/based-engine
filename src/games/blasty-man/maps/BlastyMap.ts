import { BasedObject } from "../../../engine/BasedObject";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PF from 'pathfinding'

export class BlastyMap extends BasedObject {

  x: number = 0;
  y: number = 0;
  width: number = 100
  height: number = 100
  tileSize: number = 10
  tileMap: any[][] = []

  pfGrid: any;

  async preload() {
    const x = this.width / this.tileSize
    const y = this.height / this.tileSize
    const newMap = []
    for(let i = 0; i < y; i++) {
      const mapRow = []
      for(let j = 0; j < x; j++) {
        mapRow.push({
          color: 0,
          // color: getRandomInt(2),
          occupants: {}
        })
      }
      newMap.push(mapRow)
    }
    this.tileMap = newMap

    this.generateMap()

    // Setup PathFinder
    this.pfGrid = new PF.Grid(Math.ceil(x),Math.ceil(y))
    this.tileMap.forEach((row, k) => {
      row.forEach((col, l) => {
        if(col.color === 0) {
          this.pfGrid.setWalkableAt(l, k, false)
        }
      })
    })
  }

  initialize() {}
  update() {}

  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    const startY = Math.floor(-cameraOffset.y/this.tileSize) > 0 ? Math.floor(-cameraOffset.y/this.tileSize) : 0
    const endY = (this.tileMap.length < Math.ceil((-cameraOffset.y + this.gameRef.gameHeight)/this.tileSize) ? this.tileMap.length : Math.ceil((-cameraOffset.y + this.gameRef.gameHeight)/this.tileSize))
    const startX = Math.floor(-cameraOffset.x/this.tileSize) > 0 ? Math.floor(-cameraOffset.x/this.tileSize) : 0
    const endX = (this.tileMap[0].length < Math.ceil((-cameraOffset.x + this.gameRef.gameWidth)/this.tileSize) ? this.tileMap[0].length : Math.ceil((-cameraOffset.x + this.gameRef.gameWidth)/this.tileSize))
    // console.log(startY, endY, startX, endX, this.tileMap.length, this.tileMap[0].length)
    for(let i = startY; i < endY; i++) {
      for(let j = startX; j < endX; j++) {
        drawBox({
          c: this.gameRef.ctx,
          width: this.tileSize,
          height: this.tileSize,
          x: this.tileSize*j + cameraOffset.x,
          y: this.tileSize*i + cameraOffset.y,
          fillColor: Object.keys(this.tileMap[i][j].occupants).length > 0 ? 'blue' : ['#333','#222'][this.tileMap[i][j].color],
          strokeColor: Object.keys(this.tileMap[i][j].occupants).length > 0 ? 'blue' : ['#333','#222'][this.tileMap[i][j].color],
          strokeWidth: 1
        })
      }
    }
  }
  tearDown() {}

  // custom functions
  getMapCoord(coordinates: XYCoordinateType) {
    return {
      x: Math.floor(coordinates.x/this.tileSize),
      y: Math.floor(coordinates.y/this.tileSize),
    }
  }

  getRoomFromCoord(coordinates: XYCoordinateType){
    return this.tileMap[coordinates.y][coordinates.x]
  }

  onMap(coordinates: XYCoordinateType){
    const {x,y} = coordinates
     return x >= 0 && x <= this.width && y >= 0 && y <= this.height
  }

  removeOccupant(occupant: {x: number, y: number, key: string}){
    if(!this.onMap(occupant)) return
    const {x,y} = this.getMapCoord(occupant)
    delete this.tileMap[y][x].occupants[occupant.key]
  }

  addOccupant(occupant: {x: number, y: number, key: string}){
    if(!this.onMap(occupant)) return
    const {x,y} = this.getMapCoord(occupant)
    this.tileMap[y][x].occupants[occupant.key] = occupant
  }

  generateMap() {
    // clear the map
    for(let i = 0; i < this.tileMap.length; i++) {
      for(let j = 0; j < this.tileMap[i].length; j++) {
        this.tileMap[i][j].color = 0
      }
    }

    // generate rooms
    const rooms = [
      {x: 1, y: 1, w: 5, h: 7},
      {x: 19, y: 6, w: 8, h: 5},
      {x: 2, y: 25, w: 8, h: 6},
      {x: this.tileMap[0].length - 7, y: this.tileMap.length - 6, w: 3, h: 3},
    ]

    rooms.map((room, idx) => {
      for(let i = room.y; i < room.y + room.h; i++) {
        for(let j = room.x; j < room.x + room.w; j++) {
          this.tileMap[i][j].color = 1
        }
      }
      if(idx > 0) {
        // console.log('generating map')
        const prevRoom = rooms[idx-1]
        const roomCenter = {
          x: Math.floor((room.x * 2 + room.w)/2),
          y: Math.floor((room.y * 2 + room.h)/2),
        }
        // console.log(roomCenter)

        const prevRoomCenter = {
          x: Math.floor((prevRoom.x * 2 + prevRoom.w)/2),
          y: Math.floor((prevRoom.y * 2 + prevRoom.h)/2),
        }
        // console.log(prevRoomCenter)
        // console.log(prevRoomCenter.x - roomCenter.x)
        // console.log(prevRoomCenter.y - roomCenter.y)
        while(roomCenter.x !== prevRoomCenter.x || roomCenter.y !== prevRoomCenter.y) {
          // console.log(roomCenter)
          const moveX = prevRoomCenter.x - roomCenter.x != 0 ? (prevRoomCenter.x - roomCenter.x)/Math.abs(prevRoomCenter.x - roomCenter.x) : 0
          const moveY = prevRoomCenter.y - roomCenter.y != 0 ? (prevRoomCenter.y - roomCenter.y)/Math.abs(prevRoomCenter.y - roomCenter.y) : 0
          // console.log(moveX, moveY)
          if(moveX !== 0 && moveY !== 0) {
            if(getRandomInt(2) > 0) {
              roomCenter.x += moveX
            } else {
              roomCenter.y += moveY
            }
          } else {
            roomCenter.x += moveX
            roomCenter.y += moveY
          }
          this.tileMap[roomCenter.y][roomCenter.x].color = 1
        }
      }
    })

  }



}
