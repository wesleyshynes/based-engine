import { BasedObject } from "../../../engine/BasedObject";
import { drawText } from "../../../engine/libs/drawHelpers";

export default class TextContainer extends BasedObject {

  textToDisplay: string = 'DEMO TEXT';
  paginatedText: string[] = [];

  fontSize: number = 16;
  lineHeight: number = 20;
  fontFamily: string = 'sans-serif';
  fillColor: string = 'black';
  strokeColor: string = 'white';
  strokeWidth: number = 2;
  align: 'center' |  'left' | 'right' = 'left'

  containerWidth: number = 200;
  containerHeight: number = 200;

  x: number = 0;
  y: number = 0;

  async preload() {}
  initialize() {}
  update() {}

  setText(textToSet: string) {
    this.gameRef.ctx.textAlign = this.align
    this.gameRef.ctx.font = `${this.fontSize}px ${this.fontFamily}`
    const textSize = Math.ceil(this.gameRef.ctx.measureText('M').width)
    this.paginatedText = []
    let currentLine = ''
    const maxLineLength = Math.floor(this.containerWidth/textSize)
    this.textToDisplay = textToSet
    this.textToDisplay.split('').map(x => {
      if(currentLine.length <= maxLineLength) {
        currentLine += x
      } else {
        this.paginatedText.push(currentLine.trim())
        currentLine = x
      }
    })
    if(currentLine.length > 0) {
      this.paginatedText.push(currentLine.trim())
    }
  }

  draw() {
    this.paginatedText.map((x, idx) => {
      drawText({
        c: this.gameRef.ctx,
        x: this.x,
        y: this.y + idx*this.lineHeight,
        fillColor: this.fillColor,
        align: this.align,
        text: x,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize
      })
    })
  }

  tearDown() {}

}
