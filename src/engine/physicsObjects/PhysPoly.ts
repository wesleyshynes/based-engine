import { BasedObject } from "../BasedObject";
import Physics from 'matter-js';
import { rotateDraw } from "../libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../libs/mathHelpers";

export default class PhysPoly extends BasedObject {
  x: number = 0
  y: number = 0
  color: string = 'orange'
  angle: number = 0

  vertices: XYCoordinateType[] = [
    {x: 0, y: 0},
    {x: 560, y: 0},
    {x: 560, y: 20},
    {x: 540, y: 40},
    {x: 20, y: 40},
    {x: 0, y: 20},
  ]

  bodyOptions: any = {
    label: 'asdfgh',
    restitution: 0.8
  }
  body: any;
  bodyCenter: XYCoordinateType = {x: 0, y: 0}

  collisionStartFn: (o: any) => void = (o: any) => null;
  collisionEndFn: (o: any) => void = (o: any) => null;

  async preload() {}
  initialize() {
    const vertString = Physics.Vertices.fromPath(this.vertices.map(p => `${p.x} ${p.y}`).join(' '), this.bodyOptions)
    this.body = Physics.Bodies.fromVertices(this.x, this.y, [vertString], {
      ...this.bodyOptions,
      plugin: {
        collisionStart: (x: any) => this.onCollisionStart(x),
        collisionEnd: (x: any) => this.onCollisionEnd(x),
        basedRef: () => this,
      }
    });
    this.bodyCenter = {
      x: (this.body.bounds.max.x - this.body.bounds.min.x)/-2,
      y: (this.body.bounds.max.y - this.body.bounds.min.y)/-2
    }
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
  update() {}
  draw() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      // x: this.body.position.x + this.gameRef.cameraPos.x,
      // y: this.body.position.y + this.gameRef.cameraPos.y,
      // x: this.x + this.gameRef.cameraPos.x,
      // y: this.y + this.gameRef.cameraPos.y,
      a: radToDeg(this.body.angle)
      // a: 0//radToDeg(this.body.angle)
    }, () => {

      const {ctx} = this.gameRef
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // start line
      ctx.moveTo(this.vertices[0].x * this.gameRef.cameraZoom, this.vertices[0].y * this.gameRef.cameraZoom);

      for (let i = 1; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x * this.gameRef.cameraZoom, this.vertices[i].y * this.gameRef.cameraZoom);
      }

      // go to start
      ctx.lineTo(this.vertices[0].x * this.gameRef.cameraZoom, this.vertices[0].y * this.gameRef.cameraZoom);

      ctx.closePath();
      ctx.fill();

    })
  }
  tearDown() {}

}
