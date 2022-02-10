import { drawCircle, drawEllipse, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBall from "./PhysBall";

export default class BilliardBall extends PhysBall {
  ballNumber: string = '99';
  ballType: string = 'solid';

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

      drawCircle({
        c: this.gameRef.ctx,
        x: -this.bodyCenter.x,
        y: -this.bodyCenter.y,
        radius: 7 * this.gameRef.cameraZoom,
        fillColor: 'white',
        // fillColor: 'red',
      })

      if(this.ballType === 'stripe') {
        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: 0,
          radiusX: this.radius * this.gameRef.cameraZoom,
          radiusY: this.radius * this.gameRef.cameraZoom,
          startAngle: 45,
          endAngle: 135,
          fillColor: 'white'
        })

        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: 0,
          radiusX: this.radius * this.gameRef.cameraZoom,
          radiusY: this.radius * this.gameRef.cameraZoom,
          startAngle: 225,
          endAngle: 315,
          fillColor: 'white'
        })
      }

      drawText({
        c: this.gameRef.ctx,
        x: 0,
        y: 3 * this.gameRef.cameraZoom,
        fillColor: 'black',
        align: 'center',
        text: this.ballNumber,
        fontFamily: 'sans-serif',
        fontSize: 10 * this.gameRef.cameraZoom,
      })

    })
  }
}
