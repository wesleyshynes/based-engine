import { BasedObject } from "../BasedObject";
import Physics from 'matter-js';
import { drawCircle, drawEllipse, rotateDraw } from "../libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../libs/mathHelpers";

export default class PhysBall extends BasedObject {
  x: number = 0
  y: number = 0

  lastX: number = 0
  lastY: number = 0

  radius: number = 15;
  color: string = 'blue'
  strokeColor: string = 'black'
  strokeWidth: number = 4
  bodyOptions: any = {
    label: 'physBall',
    restitution: 0.8,
  }

  shadowColor: string = 'black'
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
    this.body = Physics.Bodies.circle(this.x, this.y, this.radius, {
      ...this.bodyOptions,
      plugin: {
        collisionStart: (x: any) => this.onCollisionStart(x),
        collisionEnd: (x: any) => this.onCollisionEnd(x),
        basedRef: () => this,
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
      this.lastY = this.body.position
    } else {
      this.gameRef.removeFromWorld(this.body)
      this.x = this.lastX
      this.y = this.lastY
      this.initializeBody()
      this.gameRef.addToWorld(this.body)
    }
  }

  update() { }
  draw() {
    this.drawPhysicsBody()
  }

  drawPhysicsBody() {
    this.cameraDraw( () => {
      drawCircle({
        c: this.gameRef.ctx,
        x: this.bodyCenter.x,
        y: this.bodyCenter.y,
        radius: this.radius,
        fillColor: this.color,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        // fillColor: 'red',
        // cameraPos: this.gameRef.cameraPos,
        zoom: this.gameRef.cameraZoom
      })
    })
  }

  drawShadows() {
    this.gameRef.ctx.globalAlpha = .3

    this.cameraDraw(() => {
      drawEllipse({
        c: this.gameRef.ctx,
        x: this.bodyCenter.x,
        y: this.bodyCenter.y,
        radiusX: this.radius * 1.1,
        radiusY: this.radius * .75,
        fillColor: this.shadowColor,
        // cameraPos: this.gameRef.cameraPos,
        zoom: this.gameRef.cameraZoom
      })
    })

    this.gameRef.ctx.globalAlpha = 1
  }

  cameraDraw(cameraDrawFn = () => {}) {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x,
      y: this.body.position.y,
      a: radToDeg(this.body.angle),
      cameraPos: this.gameRef.cameraPos,
      zoom: this.gameRef.cameraZoom
    }, () => {
      cameraDrawFn()
    })
  }


  tearDown() { }
}
