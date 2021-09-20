import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawBox, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import { getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PF from 'pathfinding'
import FloorSprite from '../../../assets/blasty-man/floors-test.png'
import WallSprite from '../../../assets/blasty-man/walls-test.png'
import GrassSprite from '../../../assets/vimjam2/grass-together.png'
import { boxCollision } from "../../../engine/libs/collisionHelpers";


export class MapOne extends BasedObject {

  x: number = 0;
  y: number = 0;
  width: number = 3200
  height: number = 3200
  tileSize: number = 64
  tileMap: any[][] = []

  pfGrid: any;
  roomList: any[];

  occupantRef: any = {}

  floorSprite: any;
  wallSprite: any;
  grassSprite: any;

  visitedRooms: any = {}

  generateRoomCount: number = 6

  async preload() {

    this.floorSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: FloorSprite,
      sx: 0,
      sy: 0,
      sWidth: this.tileSize,
      sHeight: this.tileSize,
      dx:  0,
      dy:  0,
      dWidth: this.tileSize,
      dHeight: this.tileSize,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })

    this.wallSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: WallSprite,
      sx: 0,
      sy: 0,
      sWidth: this.tileSize,
      sHeight: this.tileSize,
      dx:  0,
      dy:  0,
      dWidth: this.tileSize,
      dHeight: this.tileSize,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })

    this.grassSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: GrassSprite,
      sx: 0,
      sy: 0,
      sWidth: this.tileSize,
      sHeight: this.tileSize,
      dx:  0,
      dy:  0,
      dWidth: this.tileSize,
      dHeight: this.tileSize,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000/60 * 10
    })

    this.occupantRef = {}
    this.visitedRooms = {}
    this.generateMap()
  }

  initialize() {}
  update() {}

  draw() {
    const startY = Math.floor(-this.gameRef.cameraPos.y/this.tileSize) > 0 ? Math.floor(-this.gameRef.cameraPos.y/this.tileSize) : 0
    const endY = (this.tileMap.length < Math.ceil((-this.gameRef.cameraPos.y + this.gameRef.gameHeight)/this.tileSize) ? this.tileMap.length : Math.ceil((-this.gameRef.cameraPos.y + this.gameRef.gameHeight)/this.tileSize))
    const startX = Math.floor(-this.gameRef.cameraPos.x/this.tileSize) > 0 ? Math.floor(-this.gameRef.cameraPos.x/this.tileSize) : 0
    const endX = (this.tileMap[0].length < Math.ceil((-this.gameRef.cameraPos.x + this.gameRef.gameWidth)/this.tileSize) ? this.tileMap[0].length : Math.ceil((-this.gameRef.cameraPos.x + this.gameRef.gameWidth)/this.tileSize))
    // console.log(startY, endY, startX, endX, this.tileMap.length, this.tileMap[0].length)
    for(let i = startY; i < endY; i++) {
      for(let j = startX; j < endX; j++) {
        // drawBox({
        //   c: this.gameRef.ctx,
        //   width: this.tileSize,
        //   height: this.tileSize,
        //   x: this.tileSize*j + this.gameRef.cameraPos.x,
        //   y: this.tileSize*i + this.gameRef.cameraPos.y,
        //   // fillColor: Object.keys(this.tileMap[i][j].occupants).length > 0 ? 'blue' : ['#333','#222'][this.tileMap[i][j].color],
        //   // strokeColor: Object.keys(this.tileMap[i][j].occupants).length > 0 ? 'blue' : ['#333','#222'][this.tileMap[i][j].color],
        //   // fillColor: this.tileMap[i][j].occupants['sword']? 'blue' : ['#333','#222'][this.tileMap[i][j].color],
        //   fillColor: ['#333','#222'][this.tileMap[i][j].color],
        //   strokeColor: ['#333','#222'][this.tileMap[i][j].color],
        //   strokeWidth: 1
        // })

        rotateDraw({
          c: this.gameRef.ctx,
          x: Math.round(this.tileSize*j + this.gameRef.cameraPos.x),
          y: Math.round(this.tileSize*i + this.gameRef.cameraPos.y),
          a: 0
        }, () => {

          // this.sprite.flipX = this.velocity.x < 0
          // drawImage(this.tileMap[i][j].walkable ? this.floorSprite : this.wallSprite)

          // no rotate
          // this.grassSprite.dx = Math.round(this.tileSize*j + this.gameRef.cameraPos.x)
          // this.grassSprite.dy = Math.round(this.tileSize*i + this.gameRef.cameraPos.y)

          this.grassSprite.sx = this.tileMap[i][j].sx * this.tileSize
          this.grassSprite.sy = this.tileMap[i][j].sy * this.tileSize
          drawImage(this.grassSprite)
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
     return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  removeOccupant(occupant: {x: number, y: number, objectKey: string}){
    if(!this.onMap(occupant)) return
    const {x,y} = this.getMapCoord(occupant)
    if(this.occupantRef[occupant.objectKey]) {
      const {x:bx,y:by} = this.getMapCoord(this.occupantRef[occupant.objectKey])
      delete this.tileMap[by][bx].occupants[occupant.objectKey]
    }
    delete this.tileMap[y][x].occupants[occupant.objectKey]
    if(Object.keys(this.tileMap[y][x].occupants) && this.tileMap[y][x].color == 1) {
      this.pfGrid.setWalkableAt(x, y, true)
    }
  }

  addOccupant(occupant: {x: number, y: number, objectKey: string}, options: any = {}){
    if(!this.onMap(occupant)) return
    const {x,y} = this.getMapCoord(occupant)
    this.occupantRef[occupant.objectKey] = occupant
    this.tileMap[y][x].occupants[occupant.objectKey] = occupant
    if(this.tileMap[y][x].color == 1 && options.blockSpot) {
      this.pfGrid.setWalkableAt(x, y, false)
    }
  }

  generateMap() {
    // generate rooms
    const rooms: any = [
      {x: 0, y: 0, w: 8, h: 8, key: 'room-1'}
    ]

    let attempts = 0
    let left = 0
    let right = 8
    let top = 0
    let bottom = 8

    while(rooms.length < this.generateRoomCount && attempts < 100) {
      attempts++
      const newRoom = {
        x: rooms[rooms.length-1].x,
        y: rooms[rooms.length-1].y,
        w: 8 + getRandomInt(5),
        h: 8 + getRandomInt(5),
        key: `room-${rooms.length + 1}`
      }

      const direction = getRandomInt(2) > 0 ? 'x' : 'y'
      const offset = getRandomInt(2) > 0 ? 1 : -1

      while(
        rooms.find((room: any) => {
          return boxCollision(
            newRoom,
            {
              x: room.x - 1,
              y: room.y - 1,
              w: room.w + 1,
              h: room.h + 1,
            }
          )
        })
      ) {
        newRoom[direction] += offset
      }

      top = newRoom.y < top ? newRoom.y : top
      left = newRoom.x < left ? newRoom.x : left
      right = newRoom.x + newRoom.w > right ? newRoom.x + newRoom.w : right
      bottom = newRoom.y + newRoom.h > bottom ? newRoom.y + newRoom.h : bottom

      rooms.push(newRoom)
    }

    // console.log('top', top)
    // console.log('bottom', bottom)
    // console.log('left', left)
    // console.log('right', right)


    this.roomList = rooms.map((room: any) => {
      return {
        ...room,
        x: room.x - left + 3,
        y: room.y - top + 3,
      }
    })

    this.width = this.tileSize * (Math.abs(left) + right + 6)
    this.height = this.tileSize * (Math.abs(top) + bottom + 6)

    const x = (this.width / this.tileSize)
    const y = (this.height / this.tileSize)
    const newMap = []
    const treePool = [
      [1,3],
      [2,3],
      [0,4],
      [1,4],
      [2,4],
      [0,5],
      [1,5],
      [2,5],
    ]
    for(let i = 0; i < y; i++) {
      const mapRow = []
      for(let j = 0; j < x; j++) {
        const [sX,sY] = treePool[getRandomInt(8)]
        mapRow.push({
          color: 0,
          walkable: false,
          occupants: {},
          roomKey: '',
          sx: sX,
          sy: sY,
        })
      }
      newMap.push(mapRow)
    }
    this.tileMap = newMap

    // console.log(this.roomList)
    // console.log(this.width, this.height)
    // console.log(this.width/this.tileSize, this.height/this.tileSize)

    this.roomList.map((room, idx) => {
      // console.log('mapping', idx, room)
      let yPos = 0
      const maxX = room.w - 1
      const maxY = room.h - 1
      for(let i = room.y; i < room.y + room.h; i++) {
        let xPos = 0
        for(let j = room.x; j < room.x + room.w; j++) {
          this.tileMap[i][j].color = 1
          this.tileMap[i][j].walkable = true
          this.tileMap[i][j].roomKey = room.key
          this.tileMap[i][j].sx = 0
          this.tileMap[i][j].sy = 3

          if(xPos === 0 && yPos === 0) {
            this.tileMap[i][j].sx = 0
            this.tileMap[i][j].sy = 0
          } else if(yPos === 0 && xPos !== maxX) {
            this.tileMap[i][j].sx = 1
            this.tileMap[i][j].sy = 0
          } else if(yPos === 0 && xPos === maxX) {
            this.tileMap[i][j].sx = 2
            this.tileMap[i][j].sy = 0
          } else if (xPos === 0 && yPos !== maxY ) {
            this.tileMap[i][j].sx = 0
            this.tileMap[i][j].sy = 1
          } else if (xPos === maxX && yPos !== maxY) {
            this.tileMap[i][j].sx = 2
            this.tileMap[i][j].sy = 1
          } else if (xPos === 0 && yPos === maxY) {
            this.tileMap[i][j].sx = 0
            this.tileMap[i][j].sy = 2
          } else if (xPos !== maxX && yPos === maxY) {
            this.tileMap[i][j].sx = 1
            this.tileMap[i][j].sy = 2
          } else if (xPos === maxX && yPos === maxY) {
            this.tileMap[i][j].sx = 2
            this.tileMap[i][j].sy = 2
          } else {
            if (getRandomInt(80) > 75) {
              this.tileMap[i][j].sx = 1
              this.tileMap[i][j].sy = 1
            } else if (getRandomInt(80) > 75) {
              this.tileMap[i][j].sx = getRandomInt(3)
              this.tileMap[i][j].sy = 6
              this.tileMap[i][j].walkable = false
            }
          }

          xPos++
        }
        yPos++
      }
      if(idx > 0) {
        // console.log('generating map')
        const prevRoom = this.roomList[idx-1]
        const roomCenter = {
          x: Math.floor((room.x * 2 + room.w)/2),
          y: Math.floor((room.y * 2 + room.h)/2),
        }
        // console.log(roomCenter)

        const prevRoomCenter = {
          x: Math.floor((prevRoom.x * 2 + prevRoom.w)/2),
          y: Math.floor((prevRoom.y * 2 + prevRoom.h)/2),
        }
        while(roomCenter.x !== prevRoomCenter.x || roomCenter.y !== prevRoomCenter.y) {
          const moveX = prevRoomCenter.x - roomCenter.x != 0 ? (prevRoomCenter.x - roomCenter.x)/Math.abs(prevRoomCenter.x - roomCenter.x) : 0
          const moveY = prevRoomCenter.y - roomCenter.y != 0 ? (prevRoomCenter.y - roomCenter.y)/Math.abs(prevRoomCenter.y - roomCenter.y) : 0
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
          this.tileMap[roomCenter.y][roomCenter.x].walkable = true
          this.tileMap[roomCenter.y][roomCenter.x].sx = 0
          this.tileMap[roomCenter.y][roomCenter.x].sy = 3

        }
      }
    })

    this.pfGrid = new PF.Grid(Math.ceil(x),Math.ceil(y))
    this.tileMap.forEach((row, k) => {
      row.forEach((col, l) => {
          this.pfGrid.setWalkableAt(l, k, col.walkable)
      })
    })
  }



}
