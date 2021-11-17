import { BasedObject } from "../../../engine/BasedObject";
import * as Physics from 'matter-js'
import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export default class PhysBox extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 40;
  height: number = 40;
  color: string = 'blue'
  bodyOptions: any = {
    label: 'asdfgh'
  }
  body: any;
  bodyCenter: XYCoordinateType = {x: 0, y: 0}
  async preload() { }
  initialize() {
    this.body = Physics.Bodies.rectangle(this.x, this.y, this.width, this.height, this.bodyOptions);
    this.setCenter()
  }
  setCenter() {
    if(this.body) {
      Physics.Body.setCentre(this.body, this.bodyCenter, true)
    }
  }
  update() { }
  draw() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x,
      y: this.body.position.y,
      a: radToDeg(this.body.angle)
    }, () => {

      drawBox({
        c: this.gameRef.ctx,
        x: -(this.width/2) - this.bodyCenter.x,
        y: -(this.height/2) - this.bodyCenter.y,
        width: this.width,
        height: this.height,
        fillColor: this.color,
        // fillColor: 'red',
      })
    })
  }
  tearDown() { }
}
