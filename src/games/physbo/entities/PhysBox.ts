import { BasedObject } from "../../../engine/BasedObject";
import Physics from 'matter-js';
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

  collisionStartFn: (o: any) => void = (o: any) => null;
  collisionEndFn: (o: any) => void = (o: any) => null;

  async preload() { }
  initialize() {
    this.body = Physics.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      ...this.bodyOptions,
      plugin: {
        collisionStart: (x: any) => this.onCollisionStart(x),
        collisionEnd: (x: any) => this.onCollisionEnd(x)
      }
    });
    this.setCenter()
  }
  setCenter() {
    if(this.body) {
      Physics.Body.setCentre(this.body, this.bodyCenter, true)
    }
  }

  onCollisionStart(otherBody: any) {
    this.collisionStartFn(otherBody)
  }
  onCollisionEnd(otherBody: any) {
    this.collisionEndFn(otherBody)
  }

  update() { }
  draw() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x + this.gameRef.cameraPos.x,
      y: this.body.position.y + this.gameRef.cameraPos.y,
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
