import { drawCircle, drawEllipse, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";

export default class BilliardBall extends PhysBall {
  ballNumber: string = '99';
  ballType: string = 'solid';

  rollOffset: XYCoordinateType = {
    x: 0,
    y: 0
  }

  updateRollOffset() {
    this.rollOffset.x = (this.rollOffset.x + this.body.velocity.x)%360
    const rollMax = 15
    this.rollOffset.y = (this.rollOffset.y + this.body.velocity.y)
    if(Math.abs(this.rollOffset.y) >= rollMax) {
      this.rollOffset.y = this.rollOffset.y >= 0 ? -rollMax + (this.rollOffset.y)%rollMax : rollMax - (this.rollOffset.y)%rollMax
    }
  }

  draw() {
    rotateDraw({
      c: this.gameRef.ctx,
      x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      a: radToDeg(this.body.angle - this.rollOffset.x/20)
    }, () => {

      this.gameRef.ctx.beginPath()
      this.gameRef.ctx.arc(0, 0, 15 * this.gameRef.cameraZoom, 0, Math.PI * 2);
      this.gameRef.ctx.clip()


      // Ball background
      drawCircle({
        c: this.gameRef.ctx,
        x: this.bodyCenter.x,
        y: this.bodyCenter.y,
        radius: this.radius * this.gameRef.cameraZoom,
        fillColor: this.color,
      })

      // Ball Stripes
      if(this.ballType === 'stripe') {
        const radiusX = 15 * this.gameRef.cameraZoom
        const radiusY = 7 * this.gameRef.cameraZoom
        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: (this.rollOffset.y - 15) * this.gameRef.cameraZoom,
          radiusX: radiusX,
          radiusY: radiusY,
          fillColor: 'white',
        })
        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: (this.rollOffset.y + 15) * this.gameRef.cameraZoom,
          radiusX: radiusX,
          radiusY: radiusY,
          fillColor: 'white',
        })
      }

      // Ball number background
      drawCircle({
        c: this.gameRef.ctx,
        x: 0,
        y: this.rollOffset.y * this.gameRef.cameraZoom,
        radius: 7 * this.gameRef.cameraZoom,
        fillColor: 'white',
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: 0,
        y: (this.rollOffset.y >= 0 ? this.rollOffset.y - 30 : this.rollOffset.y + 30) * this.gameRef.cameraZoom,
        radius: 7 * this.gameRef.cameraZoom,
        fillColor: 'white',
      })

      // Ball Number
        const ballFontSize = 10 * this.gameRef.cameraZoom
        drawText({
          c: this.gameRef.ctx,
          x: 0,
          y: (this.rollOffset.y + 3) * this.gameRef.cameraZoom,
          fillColor: 'black',
          align: 'center',
          text: this.ballNumber,
          fontFamily: 'sans-serif',
          fontSize: ballFontSize,
        })

        drawText({
          c: this.gameRef.ctx,
          x: 0,
          y: ((this.rollOffset.y >= 0 ? this.rollOffset.y - 30 : this.rollOffset.y + 30) + 3) * this.gameRef.cameraZoom,
          fillColor: 'black',
          align: 'center',
          text: this.ballNumber,
          fontFamily: 'sans-serif',
          fontSize: ballFontSize,
        })
    })

    // ball shine
    const shineX = (this.body.position.x + 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x
    const shineY =  (this.body.position.y - 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y

    drawCircle({
      c: this.gameRef.ctx,
      x: shineX,
      y: shineY,
      radius: 7 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.1)',
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: shineX,
      y: shineY,
      radius: 5 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.2)',
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: shineX,
      y: shineY,
      radius: 2 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.3)',
    })
  }
}
