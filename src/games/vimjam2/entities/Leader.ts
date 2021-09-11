import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle, drawText } from "../../../engine/libs/drawHelpers";

export default class Leader extends BasedObject {

  x: number = 0
  y: number = 0

  radius: number = 24

  color: string = 'yellow'

  message: string = 'Bring Bananas!'

  async preload(){}

  initialize(){}

  update(){}

  draw(){
    drawCircle({
      c: this.gameRef.ctx,
      x: this.x + this.gameRef.cameraPos.x,
      y: this.y + this.gameRef.cameraPos.y,
      radius: this.radius,
      fillColor: this.color
    })

    if(this.message) {
      drawText({
        c: this.gameRef.ctx,
        x: this.x + this.gameRef.cameraPos.x,
        y: this.y + this.gameRef.cameraPos.y - this.radius - 16,
        align:'center',
        fillColor: '#000',
        strokeColor: '#fff',
        strokeWidth: 3,
        style: '',
        weight: '900',
        fontFamily: 'sans-serif',
        fontSize: 16,
        text: this.message
      })
    }
  }

  tearDown(){}
}
