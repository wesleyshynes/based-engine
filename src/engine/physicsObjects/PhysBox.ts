import { BasedObject } from "../BasedObject";
import Physics from 'matter-js';
import { drawBox, rotateDraw } from "../libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../libs/mathHelpers";

export default class PhysBox extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 40;
  height: number = 40;
  color: string = 'blue'
  bodyOptions: any = {
    label: 'physBox',
    restitution: 0.8
  }
  body: any;
  bodyCenter: XYCoordinateType = {x: 0, y: 0}

  collisionStartFn: (o: any) => void = (o: any) => null;
  collisionEndFn: (o: any) => void = (o: any) => null;

  async preload() { }
  initialize() {
    this.initializeBody()
    this.setCenter()
  }

  initializeBody() {
    this.body = Physics.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      ...this.bodyOptions,
      plugin: {
        collisionStart: (x: any) => this.onCollisionStart(x),
        collisionEnd: (x: any) => this.onCollisionEnd(x),
        basedRef: () => this
      }
    });
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
    this.drawPhysicsBody()
  }

  drawPhysicsBody() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      a: radToDeg(this.body.angle)
    }, () => {

      drawBox({
        c: this.gameRef.ctx,
        x: (-(this.width/2) - this.bodyCenter.x) * this.gameRef.cameraZoom,
        y: (-(this.height/2) - this.bodyCenter.y) * this.gameRef.cameraZoom,
        width: this.width * this.gameRef.cameraZoom,
        height: this.height * this.gameRef.cameraZoom,
        fillColor: this.color,
      })
    })
  }

  tearDown() { }
}
