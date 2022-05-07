import { drawBox, drawCircle, drawEllipse, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PhysBall from "./PhysBall";

export default class BilliardBall extends PhysBall {
  ballNumber: string = '99';
  ballType: string = 'solid';

  rollOffset: XYCoordinateType = {
    x: 0,
    y: 0
  }

  updateRollOffset() {
    // this.rollOffset.x = (this.rollOffset.x + this.body.velocity.x)
    // if(Math.abs(this.rollOffset.x) >= rollMax) {
    //   this.rollOffset.x = this.rollOffset.x >= 0 ? -rollMax + (this.rollOffset.x)%rollMax : rollMax - (this.rollOffset.x)%rollMax
    //   this.rollOffset.y = -this.rollOffset.y
    // }
    // this.rollOffset.y = (this.rollOffset.y + (Math.max(this.body.velocity.y) > Math.max(this.body.velocity.x) ? this.body.velocity.y : this.body.velocity.x))
    // this.rollOffset.y = (this.rollOffset.y + (this.body.velocity.y + this.body.velocity.x)/2)

    this.rollOffset.x = (this.rollOffset.x + this.body.velocity.x)%360
    const rollMax = 15
    this.rollOffset.y = (this.rollOffset.y + this.body.velocity.y)
    if(Math.abs(this.rollOffset.y) >= rollMax) {
      this.rollOffset.y = this.rollOffset.y >= 0 ? -rollMax + (this.rollOffset.y)%rollMax : rollMax - (this.rollOffset.y)%rollMax
      // this.rollOffset.x = -this.rollOffset.x
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
        // drawEllipse({
        //   c: this.gameRef.ctx,
        //   x: 0,
        //   y: 0,
        //   radiusX: this.radius * this.gameRef.cameraZoom,
        //   radiusY: this.radius * this.gameRef.cameraZoom,
        //   startAngle: 45,
        //   endAngle: 135,
        //   fillColor: 'white'
        // })
        //
        // drawEllipse({
        //   c: this.gameRef.ctx,
        //   x: 0,
        //   y: 0,
        //   radiusX: this.radius * this.gameRef.cameraZoom,
        //   radiusY: this.radius * this.gameRef.cameraZoom,
        //   startAngle: 225,
        //   endAngle: 315,
        //   fillColor: 'white'
        // })

        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: (this.rollOffset.y - 15) * this.gameRef.cameraZoom,
          radiusX: 15 * this.gameRef.cameraZoom,
          // radiusX: (15 - Math.abs(this.rollOffset.y)/4) * this.gameRef.cameraZoom,
          radiusY: 7 * this.gameRef.cameraZoom,
          fillColor: 'white',
        })

        drawEllipse({
          c: this.gameRef.ctx,
          x: 0,
          y: (this.rollOffset.y + 15) * this.gameRef.cameraZoom,
          radiusX: 15 * this.gameRef.cameraZoom,
          // radiusX: (15 - Math.abs(this.rollOffset.y)/4) * this.gameRef.cameraZoom,
          radiusY: 7 * this.gameRef.cameraZoom,
          fillColor: 'white',
        })

        // drawBox({
        //   c: this.gameRef.ctx,
        //   x: -30 * this.gameRef.cameraZoom,
        //   y: (this.rollOffset.y - 20) * this.gameRef.cameraZoom,
        //   width: 60 * this.gameRef.cameraZoom,
        //   height: 10 * this.gameRef.cameraZoom,
        //   fillColor: 'white'
        // })

        // drawBox({
        //   c: this.gameRef.ctx,
        //   x: -30 * this.gameRef.cameraZoom,
        //   y: (this.rollOffset.y + 10) * this.gameRef.cameraZoom,
        //   width: 60 * this.gameRef.cameraZoom,
        //   height: 10 * this.gameRef.cameraZoom,
        //   fillColor: 'white'
        // })
      }

      // Ball number background
      drawCircle({
        c: this.gameRef.ctx,
        // x: this.rollOffset.x * this.gameRef.cameraZoom,
        x: 0,
        y: this.rollOffset.y * this.gameRef.cameraZoom,
        // x: this.bodyCenter.x,
        // y: this.bodyCenter.y,
        radius: 7 * this.gameRef.cameraZoom,
        fillColor: 'white',
      })

      // distance from ballspot to center
      // const dz = Math.sqrt(this.rollOffset.x**2 + this.rollOffset.y**2)
      // const nd = 30 - dz
      // const nx = -(this.rollOffset.x * (nd/dz) * relativeMultiplier(this.rollOffset.x) )
      // const ny = -(this.rollOffset.y * (nd/dz) * relativeMultiplier(this.rollOffset.y) )

      drawCircle({
        c: this.gameRef.ctx,
        // x: -this.rollOffset.x * this.gameRef.cameraZoom,
        x: 0,
        y: (this.rollOffset.y >= 0 ? this.rollOffset.y - 30 : this.rollOffset.y + 30) * this.gameRef.cameraZoom,
        radius: 7 * this.gameRef.cameraZoom,
        fillColor: 'white',
      })

      // drawEllipse({
      //   c: this.gameRef.ctx,
      //   x: this.rollOffset.x,
      //   y: this.rollOffset.y,
      //   // x: this.bodyCenter.x,
      //   // y: this.bodyCenter.y,
      //   radiusX: Math.abs(7 - Math.abs(this.rollOffset.x/10)*3) * this.gameRef.cameraZoom,
      //   radiusY: Math.abs(7 - Math.abs(this.rollOffset.y/10)*3) * this.gameRef.cameraZoom,
      //   fillColor: 'white',
      // })



      // Ball Number
      // if(Math.abs(this.rollOffset.x) < 18 && Math.abs(this.rollOffset.y) < 18 ) {
        drawText({
          c: this.gameRef.ctx,
          x: 0,
          // x: this.rollOffset.x * this.gameRef.cameraZoom,
          y: (this.rollOffset.y + 3) * this.gameRef.cameraZoom,
          // x: 0,
          // y: 3 * this.gameRef.cameraZoom,
          fillColor: 'black',
          align: 'center',
          text: this.ballNumber,
          fontFamily: 'sans-serif',
          fontSize: 10 * this.gameRef.cameraZoom,
        })

        drawText({
          c: this.gameRef.ctx,
          // x: -this.rollOffset.x * this.gameRef.cameraZoom,
          x: 0,
          y: ((this.rollOffset.y >= 0 ? this.rollOffset.y - 30 : this.rollOffset.y + 30) + 3) * this.gameRef.cameraZoom,
          // x: 0,
          // y: 3 * this.gameRef.cameraZoom,
          fillColor: 'black',
          align: 'center',
          text: this.ballNumber,
          fontFamily: 'sans-serif',
          fontSize: 10 * this.gameRef.cameraZoom,
        })
      // }
    })
    // ball shine

    drawCircle({
      c: this.gameRef.ctx,
      x: (this.body.position.x + 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: (this.body.position.y - 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      radius: 7 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.1)',
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: (this.body.position.x + 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: (this.body.position.y - 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      radius: 5 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.2)',
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: (this.body.position.x + 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
      y: (this.body.position.y - 5) * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
      radius: 2 * this.gameRef.cameraZoom,
      fillColor: 'rgba(255,255,255,0.3)',
    })
  }
}
