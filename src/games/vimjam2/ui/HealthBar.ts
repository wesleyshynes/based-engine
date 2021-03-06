import { BasedObject } from "../../../engine/BasedObject";
import { drawBox } from "../../../engine/libs/drawHelpers";

export class HealthBar extends BasedObject {
  width: number = 100
  height: number = 5
  yOffset: number = -8
  xOffset: number = 0
  x: number = 0
  y: number = 0
  current: number = 0
  max: number = 100

  lastTick: number = 0
  tickSize: number = 100

  tick(amount: number, force: boolean = false) {
    if(force || this.gameRef.lastUpdate > this.lastTick + this.tickSize) {
      this.current+=amount
      if(this.current < 0) this.current = 0
      if(this.current > this.max) this.current = this.max
      this.lastTick = this.gameRef.lastUpdate
      return true
    }
    return false
  }

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.gameRef.cameraPos.x + this.x - this.width/2 + this.xOffset,
      y: this.gameRef.cameraPos.y + this.y - this.height + this.yOffset,
      width: this.width,
      height: this.height,
      fillColor: 'white'
    })

    if(this.current > 0){
      const p = this.current/this.max
      drawBox({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + this.x - this.width/2 + this.xOffset,
        y: this.gameRef.cameraPos.y + this.y - this.height + this.yOffset,
        width: this.width * this.current/this.max,
        height: this.height,
        // fillColor: 'red'
        fillColor: p < .5 ? 'red' : p < .8 ? 'orange' : 'green'
      })
    }
  }
}
