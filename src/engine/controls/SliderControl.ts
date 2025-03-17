import { BasedButton } from "../BasedButton";
import { BasedObject } from "../BasedObject";
import { drawBox } from "../libs/drawHelpers";

export class SliderControl extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 200
  height: number = 40

  hovered: boolean = false

  value: number = 1

  minValue: number = 0.25
  maxValue: number = 2

  increaseBtn: BasedButton;
  decreaseBtn: BasedButton;

  btnOffset: number = 10
  btnWidth: number = 40
  btnHeight: number = 40

  knobThickness: number = 10
  knobOffSet: number = 2

  tickAmount: number = 0.25;
  tickFunction: () => void = () => null

  btnTextColor: string = '#fff'
  bgColor: string = 'rgba(255,255,255,0.5)'
  btnColor: string = 'rgba(0,0,0,0.5)'
  knobColor: string = 'rgba(0,0,0,0.5)'

  direction: 'horizontal' | 'vertical' = 'horizontal'

  async preload() { }

  initialize() {
    this.increaseBtn = new BasedButton({key: `${this.objectKey}-increase-btn`, gameRef: this.gameRef})
    this.increaseBtn.width = this.btnWidth
    this.increaseBtn.height = this.btnHeight
    this.increaseBtn.buttonText = '+'
    this.increaseBtn.fillColor = this.btnColor
    this.increaseBtn.textColor = this.btnTextColor
    this.increaseBtn.clickFunction = () => {
      this.tick(this.tickAmount)
    }

    this.decreaseBtn = new BasedButton({key: `${this.objectKey}-decrease-btn`, gameRef: this.gameRef})
    this.decreaseBtn.width = this.btnWidth
    this.decreaseBtn.height = this.btnHeight
    this.decreaseBtn.buttonText = '-'
    this.decreaseBtn.fillColor = this.btnColor
    this.decreaseBtn.textColor = this.btnTextColor
    this.decreaseBtn.clickFunction = () => {
      this.tick(-this.tickAmount)
    }

    this.positionButtons()
  }

  update() {
    this.increaseBtn.update()
    this.decreaseBtn.update()

    if(this.increaseBtn.hovered || this.decreaseBtn.hovered) {
      this.hovered = true
    } else {
      this.hovered = false
    }
  }

  tick(amount: number) {
    this.tickFunction()
    this.value += amount
    if(this.value < this.minValue) this.value = this.minValue
    if(this.value > this.maxValue) this.value = this.maxValue
  }

  onResize() {
    this.positionButtons()
  }

  verticalOffsetAmount() {
    return this.btnHeight + this.btnOffset
  }

  positionButtons() {
    if(this.direction === 'horizontal') {
      this.increaseBtn.x = this.x + this.width/2 + this.btnOffset
      this.increaseBtn.y = this.y - (this.btnHeight/2)

      this.decreaseBtn.x = this.x - this.width/2 - this.btnHeight - this.btnOffset
      this.decreaseBtn.y = this.y - (this.btnHeight/2)
    } else {
      this.increaseBtn.x = this.x - (this.btnWidth/2)
      this.increaseBtn.y = this.y - this.height/2 - this.btnHeight - this.btnOffset

      this.decreaseBtn.x = this.x - (this.btnWidth/2)
      this.decreaseBtn.y = this.y + this.height/2 + this.btnOffset
    }
  }

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x - this.width/2,
      y: this.y - this.height/2,
      width: this.width,
      height: this.height,
      fillColor: this.bgColor
    })

    // knobby thing
    if(this.direction === 'horizontal') {
      drawBox({
        c: this.gameRef.ctx,
        x: this.x + ((this.value - this.minValue)/(this.maxValue - this.minValue) * this.width) - (this.knobThickness/2) - this.width/2,
        y: this.y - (this.knobOffSet/2) - this.height/2,
        width: this.knobThickness,
        height: this.height + this.knobOffSet,
        fillColor: this.knobColor
      })
    } else {
      drawBox({
        c: this.gameRef.ctx,
        x: this.x - (this.knobOffSet/2) - this.width/2,
        y: this.y - ((this.value - this.minValue)/(this.maxValue - this.minValue) * this.height) - (this.knobThickness/2) + this.height/2,
        width: this.width + this.knobOffSet,
        height: this.knobThickness,
        fillColor: this.knobColor
      })
    }

    this.increaseBtn.draw()
    this.decreaseBtn.draw()

  }
}
