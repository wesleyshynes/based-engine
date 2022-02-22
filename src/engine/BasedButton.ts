import { BasedObject } from "./BasedObject"
import { drawBox, drawText } from "./libs/drawHelpers"

export class BasedButton extends BasedObject {

  x: number = 0
  y: number = 0
  width: number = 100
  height: number = 50
  fillColor: string = '#777'
  hoverColor: string = '#333'
  focusColor: string = '#000'
  strokeWidth: number = 0
  strokeColor: string = ''

  hovered: boolean = false
  focused: boolean = false

  textColor: string = '#fff'
  buttonText: string = 'Click Me'
  style: string = ''
  weight: string = 'bold'
  fontSize: number = 16
  fontFamily: string = 'sans-serif'

  clickFunction: () => void = () => null
  holdFunction: () => void = null// () => null

  lastSwitch: number = 0
  switchDelay: number = 300

  touchId: string = ''

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
    const {x,y} = this.gameRef.mouseInfo
    this.hovered = x > x1 && x < x2 && y > y1 && y < y2

    if(this.hovered && this.gameRef.mouseInfo.mouseDown) {
      this.focused = true
      this.holdFunction && this.holdFunction()
    } else if (this.hovered && this.focused && !this.gameRef.mouseInfo.mouseDown) {
      this.clickFunction()
      this.focused = false
    } else {
      this.focused = false
    }
  }

  checkTouch() {
    // if(!this.hovered){
      if (this.gameRef.touchInfo.length > 0) {
        // let touchFound: any = {}
        let touchFound = false
        this.gameRef.touchInfo.forEach(t => {
          const x1 = this.x
          const y1 = this.y
          const x2 = this.x + this.width
          const y2 = this.y + this.height
          const { x, y } = t
          const hovered = x > x1 && x < x2 && y > y1 && y < y2
          if(hovered) {
            if(this.holdFunction) {
              touchFound = true
              this.hovered = true
              this.touchId = t.id
              this.holdFunction()
            } else if (this.lastSwitch + this.switchDelay < this.gameRef.lastUpdate) {
              this.clickFunction()
              this.lastSwitch = this.gameRef.lastUpdate
            }
          }
        })
        if(!touchFound && this.hovered) {
          this.hovered = false
          this.touchId = ''
          this.clickFunction()
        }
      } else if (this.hovered) {
        this.clickFunction()
        this.hovered = false
        this.touchId = ''
      }
    // }
    // else {
    //   const touchIndex = this.gameRef.touchInfo.filter(x => x.id === this.touchId)
    //   if (touchIndex.length > 0) {
    //     this.focused = true
    //     this.holdFunction()
    //   } else if(this.hovered) {
    //     this.clickFunction()
    //   } else {
    //     this.focused = false
    //     this.hovered = false
    //     this.touchId = ''
    //   }
    // }
  }

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: this.hovered && this.focused ? this.focusColor : this.hovered ? this.hoverColor : this.fillColor
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.x + this.x + this.width)/2,
      y: (this.y + this.y + this.height)/2 + this.fontSize/3,
      align:'center',
      fillColor: this.textColor,
      style: this.style,
      weight: this.weight,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      text: this.buttonText
    })

  }
}
