import { BasedButton } from "../BasedButton";
import { BasedObject } from "../BasedObject";
import { drawBox } from "../libs/drawHelpers";

export class SliderControl extends BasedObject {
  x: number = 0
  y: number = 0
  width: number = 200
  height: number = 40

  hovered: boolean = false

  value: number = 50

  minValue: number = 0
  maxValue: number = 100

  increaseBtn: BasedButton;
  decreaseBtn: BasedButton;

  tickAmount: number = 5;

  async preload() { }

  initialize() {
    this.increaseBtn = new BasedButton({key: `${this.objectKey}-increase-btn`, gameRef: this.gameRef})
    this.increaseBtn.x = this.x + this.width/2 + 20
    this.increaseBtn.y = this.y - this.height/2
    this.increaseBtn.width = 40
    this.increaseBtn.height = 40
    this.increaseBtn.buttonText = '+'
    this.increaseBtn.clickFunction = () => {
      this.value += this.tickAmount
    }


    this.decreaseBtn = new BasedButton({key: `${this.objectKey}-increase-btn`, gameRef: this.gameRef})
    this.decreaseBtn.x = this.x - this.width/2 - 60
    this.decreaseBtn.y = this.y - this.height/2
    this.decreaseBtn.width = 40
    this.decreaseBtn.height = 40
    this.decreaseBtn.buttonText = '-'
    this.decreaseBtn.clickFunction = () => {
      this.value -= this.tickAmount
    }
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

  draw() {
    drawBox({
      c: this.gameRef.ctx,
      x: this.x - this.width/2,
      y: this.y - this.height/2,
      width: this.width,
      height: this.height,
      fillColor: 'white'
    })

    // knobby thing
    drawBox({
      c: this.gameRef.ctx,
      x: this.x + (this.value/this.maxValue * this.width) - 5 - this.width/2,
      y: this.y - 2 - this.height/2,
      width: 10,
      height: 44,
      fillColor: '#ccc'
    })

    this.increaseBtn.draw()
    this.decreaseBtn.draw()

  }
}
