import { BasedObject } from "../../../engine/BasedObject";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export class BlastyMap extends BasedObject {

  x: number = 0;
  y: number = 0;
  width: number = 100
  height: number = 100
  tileSize: number = 10
  tileMap: any[][] = []

  async preload() {
    const x = this.width / this.tileSize
    const y = this.height / this.tileSize
    const newMap = []
    for(let i = 0; i < y; i++) {
      const mapRow = []
      for(let j = 0; j < x; j++) {
        mapRow.push({
          color: getRandomInt(2),
          occupants: {}
        })
      }
      newMap.push(mapRow)
    }
    this.tileMap = newMap
  }
  initialize() {}
  update() {}

  getMapCoord(coordinates: XYCoordinateType) {
    return {
      x: Math.floor(coordinates.x/this.tileSize),
      y: Math.floor(coordinates.y/this.tileSize),
    }
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
}
