import { BasedObject } from "../BasedObject";
import Physics from 'matter-js';
import { drawBox, rotateDraw } from "../libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../libs/mathHelpers";

export default class PhysBox extends BasedObject {
  x: number = 0
  y: number = 0

  lastX: number = 0
  lastY: number  = 0

  width: number = 40;
  height: number = 40;
  color: string = 'blue'
  strokeColor: string = 'black'
  strokeWidth: number = 4
  bodyOptions: any = {
    label: 'physBox',
    restitution: 0.8
  }
  active: boolean = false
  body: any;
  bodyCenter: XYCoordinateType = { x: 0, y: 0 }

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
    if (this.body) {
      Physics.Body.setCentre(this.body, this.bodyCenter, true)
    }
  }

  onCollisionStart(otherBody: any) {
    this.collisionStartFn(otherBody)
  }
  onCollisionEnd(otherBody: any) {
    this.collisionEndFn(otherBody)
  }

  validatePosition() {
    if (!Number.isNaN(this.body.position.x)) {
      this.lastX = this.body.position.x
      this.lastY = this.body.position.y
    } else {
      this.gameRef.removeFromWorld(this.body)
      this.x = this.lastX
      this.y = this.lastY
      this.initializeBody()
      this.gameRef.addToWorld(this.body)
    }
  }

  update() {}

  draw() {
    this.drawPhysicsBody()
  }

  drawPhysicsBody() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x,
      y: this.body.position.y,
      a: radToDeg(this.body.angle),
      cameraPos: this.gameRef.cameraPos,
      zoom: this.gameRef.cameraZoom
    }, () => {

      drawBox({
        c: this.gameRef.ctx,
        x: (-(this.width / 2) - this.bodyCenter.x),
        y: (-(this.height / 2) - this.bodyCenter.y),
        width: this.width,
        height: this.height,
        fillColor: this.color,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
      })
    })
  }

  tearDown() { }
}
