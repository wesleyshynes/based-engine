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
  draw() {
    this.tileMap.map((row,i) => {
      row.map((col,j) => {
        drawBox({
          c: this.gameRef.ctx,
          width: this.tileSize,
          height: this.tileSize,
          x: this.tileSize*j,
          y: this.tileSize*i,
          fillColor: ['#333','#222'][col]
        })
      })
    })
  }
  tearDown() {}
}
