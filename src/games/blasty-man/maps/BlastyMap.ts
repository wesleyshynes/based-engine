import { BasedObject } from "../../../engine/BasedObject";
import { drawBox } from "../../../engine/libs/drawHelpers";
import { getRandomInt } from "../../../engine/libs/mathHelpers";

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
        mapRow.push(getRandomInt(2))
      }
      newMap.push(mapRow)
    }
    this.tileMap = newMap
  }
  initialize() {}
  update() {}
  draw(cameraOffset: {x: number, y: number} = {x: 0, y: 0}) {
    // this.tileMap.map((row,i) => {
    //   row.map((col,j) => {
    //     drawBox({
    //       c: this.gameRef.ctx,
    //       width: this.tileSize,
    //       height: this.tileSize,
    //       x: this.tileSize*j + cameraOffset.x,
    //       y: this.tileSize*i + cameraOffset.y,
    //       fillColor: ['#333','#222'][col]
    //     })
    //   })
    // })
    const startY = Math.floor(-cameraOffset.y/32) > 0 ? Math.floor(-cameraOffset.y/32) : 0
    const endY = (this.tileMap.length < Math.ceil((-cameraOffset.y + this.gameRef.gameHeight)/32) ? this.tileMap.length : Math.ceil((-cameraOffset.y + this.gameRef.gameHeight)/32))
    const startX = Math.floor(-cameraOffset.x/32) > 0 ? Math.floor(-cameraOffset.x/32) : 0
    const endX = (this.tileMap[0].length < Math.ceil((-cameraOffset.x + this.gameRef.gameWidth)/32) ? this.tileMap[0].length : Math.ceil((-cameraOffset.x + this.gameRef.gameWidth)/32))
    // console.log(startY, endY, startX, endX, this.tileMap.length, this.tileMap[0].length)
    for(let i = startY; i < endY; i++) {
      for(let j = startX; j < endX; j++) {
        drawBox({
          c: this.gameRef.ctx,
          width: this.tileSize,
          height: this.tileSize,
          x: this.tileSize*j + cameraOffset.x,
          y: this.tileSize*i + cameraOffset.y,
          fillColor: ['#333','#222'][this.tileMap[i][j]]
        })
      }
    }
  }
  tearDown() {}
}
