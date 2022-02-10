import { BasedObject } from "../../../engine/BasedObject";
import Physics from 'matter-js';
import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export default class PhysBall extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 15;
  color: string = 'blue'
  bodyOptions: any = {
    label: 'ball',
    restitution: 0.8
  }
  active: boolean = false
  body: any;
  bodyCenter: XYCoordinateType = {x: 0, y: 0}
  collisionStartFn: (o: any) => void = (o: any) => null;
  collisionEndFn: (o: any) => void = (o: any) => null;

  async preload() { }
  initialize() {
    this.body = Physics.Bodies.circle(this.x, this.y, this.radius, {
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
      x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      a: radToDeg(this.body.angle)
    }, () => {

      drawCircle({
        c: this.gameRef.ctx,
        x: -this.bodyCenter.x,
        y: -this.bodyCenter.y,
        radius: this.radius * this.gameRef.cameraZoom,
        fillColor: this.color,
        // fillColor: 'red',
      })
    })
  }
  tearDown() { }
}
