import { BasedObject } from "../BasedObject";
import Physics from 'matter-js';
import { drawPolygon, rotateDraw } from "../libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../libs/mathHelpers";

export default class PhysPoly extends BasedObject {
  x: number = 0
  y: number = 0
  color: string = 'orange'
  strokeColor: string = 'black'
  strokeWidth: number = 4
  angle: number = 0

  vertices: XYCoordinateType[] = [
    { x: 0, y: 0 },
    { x: 560, y: 0 },
    { x: 560, y: 20 },
    { x: 540, y: 40 },
    { x: 20, y: 40 },
    { x: 0, y: 20 },
  ]

  bodyOptions: any = {
    label: 'physPoly',
    restitution: 0.8
  }
  body: any;
  bodyCenter: XYCoordinateType = { x: 0, y: 0 }

  collisionStartFn: (o: any) => void = (o: any) => null;
  collisionEndFn: (o: any) => void = (o: any) => null;

  async preload() { }
  initialize() {
    this.initializeBody()
    // this.setCenter()
    this.setAngle()
  }

  initializeBody() {
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
      x: (this.body.bounds.max.x - this.body.bounds.min.x) / -2,
      y: (this.body.bounds.max.y - this.body.bounds.min.y) / -2
    }
  }

  offsetSelfByOffset() {
    if (this.body) {
      // const mappedVerts = this.vertices.map((v: any) => ({ x: v.x + this.x, y: v.y + this.y }));
      // rotated mapped vertices
      const angleRad = this.angle * Math.PI / 180;  // Convert degrees to radians
      const mappedVerts = this.vertices.map((v: any) => {
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);
        return {
          x: v.x * cosA - v.y * sinA + this.x,
          y: v.x * sinA + v.y * cosA + this.y
        };
      });
      let deltaX = 0;
      let deltaY = 0;
      let smallestAbsoluteDiff = Infinity
      const firstMappedVert = mappedVerts[0];
      // find the first vertex in the body's vertices that matches the first mapped vertex use the smalles abs difference
      for (let i = 0; i < this.body.vertices.length; i++) {
        const bodyVert = this.body.vertices[i];
        const diffX = bodyVert.x - firstMappedVert.x;
        const diffY = bodyVert.y - firstMappedVert.y;
        const absDiff = Math.abs(diffX) + Math.abs(diffY);
        if (absDiff < smallestAbsoluteDiff) {
          smallestAbsoluteDiff = absDiff;
          deltaX = diffX;
          deltaY = diffY;
        }
      }
      Physics.Body.setPosition(this.body, {
        x: this.body.position.x - deltaX,
        y: this.body.position.y - deltaY,
      });
    }
  }

  setCenter() {
    if (this.body) {
      Physics.Body.setCentre(this.body, this.bodyCenter, true)
    }
  }
  setAngle() {
    if (this.angle && this.body) {
      Physics.Body.setAngle(this.body, this.angle * Math.PI / 180)
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
    this.cameraDraw(() => {
      drawPolygon({
        c: this.gameRef.ctx,
        vertices: this.vertices,
        fillColor: this.color,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        zoom: this.gameRef.cameraZoom,
      })
    })
  }

  cameraDraw(cameraDrawFn = () => { }) {
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
