import { BasedObject } from "../BasedObject"
import { drawBox, drawCircle } from "../libs/drawHelpers"
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../libs/mathHelpers"


export class TouchKnob extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 200
  height: number = 200
  radius: number = 40

  knobActive: boolean = false
  knobCoord: XYCoordinateType = { x: 0, y: 0 }
  knobCenter: XYCoordinateType = { x: 0, y: 0 }
  knobRadius: number = 30

  maxOffset: number = 30
  touchId: string = ''

  touchColor: string = 'rgba(255,0,0,.2)'

  async preload() { }
  initialize() { }

  update() {
    if(this.gameRef.touchMode) {
      this.checkTouch()
    } else {
      this.checkMouse()
    }

  }

  checkMouse() {
    const x1 = this.x
    const y1 = this.y
    const x2 = this.x + this.width
    const y2 = this.y + this.height
    const { x, y } = this.gameRef.mouseInfo
    const hovered = x > x1 && x < x2 && y > y1 && y < y2
    if (!this.knobActive) {
      if (this.gameRef.mouseInfo.mouseDown && hovered) {
        this.knobActive = true
        this.knobCoord = {
          x: 0,
          y: 0
        }
        this.knobCenter = {
          x: this.gameRef.mouseInfo.x,
          y: this.gameRef.mouseInfo.y
        }
      }
    } else {
      if (this.gameRef.mouseInfo.mouseDown) {
        const dist = distanceBetween(this.knobCenter, this.gameRef.mouseInfo)
        const angle = angleBetween(this.knobCenter, this.gameRef.mouseInfo)
        this.knobCoord = pointOnCircle(angle, dist <= this.maxOffset ? dist : this.maxOffset)
      } else {
        this.knobActive = false
        this.touchId = ''
      }
    }
  }

  checkTouch() {
    if (!this.knobActive) {
      if (this.gameRef.touchInfo.length > 0) {
        this.findTouch()
      }
    } else {
      const touchIndex = this.gameRef.touchInfo.filter(x => x.id === this.touchId)
      if (touchIndex.length > 0) {
        const dist = distanceBetween(this.knobCenter, touchIndex[0])
        const angle = angleBetween(this.knobCenter, touchIndex[0])
        this.knobCoord = pointOnCircle(angle, dist <= this.maxOffset ? dist : this.maxOffset)
      } else {
        this.knobActive = false
        this.touchId = ''
        this.findTouch()
      }
    }
  }

  findTouch() {
    let touchFound: any = {}
    this.gameRef.touchInfo.forEach(t => {
      const x1 = this.x
      const y1 = this.y
      const x2 = this.x + this.width
      const y2 = this.y + this.height
      const { x, y } = t
      const hovered = x > x1 && x < x2 && y > y1 && y < y2
      if(hovered) {
        touchFound = {...t}
        this.knobActive = true
        this.touchId = t.id
      }
    })

    if(this.knobActive && touchFound.x && touchFound.y) {
      this.knobCoord = {
        x: 0,
        y: 0
      }
      this.knobCenter = touchFound
    }
  }

  centerCoordinates() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }
  draw() {
    // drawBox({
    //   c: this.gameRef.ctx,
    //   x: this.x,
    //   y: this.y,
    //   width: this.width,
    //   height: this.height,
    //   fillColor: this.touchColor
    // })

    if (this.knobActive) {
      drawCircle({
        c: this.gameRef.ctx,
        ...this.knobCenter,
        radius: this.radius,
        fillColor: 'rgba(255,255,255,.5)'
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: this.knobCoord.x + this.knobCenter.x,
        y: this.knobCoord.y + this.knobCenter.y,
        radius: this.knobRadius,
        fillColor: 'rgba(0,0,0,.5)'
      })
    } else {
      drawCircle({
        c: this.gameRef.ctx,
          x: this.x + this.width/2,
          y: this.y + this.height/2,
        radius: this.radius,
        fillColor: 'rgba(255,255,255,.5)'
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        radius: this.knobRadius,
        fillColor: 'rgba(0,0,0,.5)'
      })
    }
  }
}
