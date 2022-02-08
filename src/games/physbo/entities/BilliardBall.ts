import { drawCircle, drawEllipse, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBall from "./PhysBall";

export default class BilliardBall extends PhysBall {
  ballNumber: string = '99';
  ballType: string = 'solid';

  draw(scale = 1, offset = this.gameRef.cameraPos) {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x * scale + offset.x,
      y: this.body.position.y * scale + offset.y,
      a: radToDeg(this.body.angle)
    }, () => {

      drawCircle({
        c: this.gameRef.ctx,
        x: -this.bodyCenter.x,
        y: -this.bodyCenter.y,
        radius: this.radius * scale,
        fillColor: this.color,
        // fillColor: 'red',
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: -this.bodyCenter.x,
        y: -this.bodyCenter.y,
        radius: 7 * scale,
        fillColor: 'white',
        // fillColor: 'red',
      })

      if(this.ballType === 'stripe') {
        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: 0,
          radiusX: this.radius * scale,
          radiusY: this.radius * scale,
          startAngle: 45,
          endAngle: 135,
          fillColor: 'white'
        })

        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: 0,
          radiusX: this.radius * scale,
          radiusY: this.radius * scale,
          startAngle: 225,
          endAngle: 315,
          fillColor: 'white'
        })
      }

      drawText({
        c: this.gameRef.ctx,
        x: 0,
        y: 3 * scale,
        fillColor: 'black',
        align: 'center',
        text: this.ballNumber,
        fontFamily: 'sans-serif',
        fontSize: 10 * scale,
      })

    })
  }
}
