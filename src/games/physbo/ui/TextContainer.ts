import { BasedButton } from "../../../engine/BasedButton";
import { BasedObject } from "../../../engine/BasedObject";
import { drawBox, drawText } from "../../../engine/libs/drawHelpers";

export default class TextContainer extends BasedObject {

  textToDisplay: string = 'DEMO TEXT';
  paginatedText: string[] = [];

  fontSize: number = 18;
  lineHeight: number = 24;
  fontFamily: string = 'sans-serif';
  fontWeight: string | number = 700;
  fontStyle: string;
  fontFillColor: string = 'black';
  fontStrokeColor: string = 'white';
  strokeWidth: number = 0;
  align: 'center' | 'left' | 'right' = 'left'

  containerFillColor: 'white'
  containerBorderColor: 'white'
  containerWidth: number = 400;
  containerHeight: number = 200;

  width: number = 400;
  height: number = 200;

  x: number = 0;
  y: number = 0;

  active: boolean = true;

  closeFunction: any = () => {}

  closeButton: any;
  closeButtonWidth: number = 100
  closeButtonHeight: number = 50
  closeButtonFillColor: string = '#ccc'
  closeButtonHoverColor: string = '#000'
  closeButtonFocusColor: string = '#000'
  closeButtonTextColor: string = '#fff'

  async preload() { }
  initialize() {
    this.closeButton = new BasedButton({key: 'close-button', gameRef: this.gameRef})
    this.closeButton.width = this.closeButtonWidth
    this.closeButton.height = this.closeButtonHeight
    this.closeButton.fillColor = this.closeButtonFillColor
    this.closeButton.textColor = this.closeButtonTextColor
    this.closeButton.hoverColor = this.closeButtonHoverColor
    this.closeButton.focusColor = this.closeButtonFocusColor
    this.closeButton.buttonText = 'Close'
    this.closeButton.clickFunction = () => {
      this.handleCloseFunction()
    }
    this.closeButton.x = this.x + this.containerWidth - 20 - this.closeButton.width
    this.closeButton.y = this.y + this.containerHeight - 20 - this.closeButton.height

    this.onResize()
  }

  update() {
    if(this.active) {
      this.closeButton.update()
    }
  }

  handleCloseFunction() {
    this.active = false
    this.closeFunction()
  }

  onResize() {
    if(this.width > this.gameRef.gameWidth - 60) {
      this.containerWidth = this.gameRef.gameWidth - 60
    } else {
      this.containerWidth = this.width
    }

    this.x = this.gameRef.gameWidth/2 - this.containerWidth/2

    this.setText(this.textToDisplay)
    // this.setCloseButtonPosition()
  }

  setCloseButtonPosition() {
    if(this.closeButton) {
      this.closeButton.x = this.x + this.containerWidth - 20 - this.closeButton.width
      this.closeButton.y = this.y + this.containerHeight - 20 - this.closeButton.height
    }
  }

  setText(textToSet: string) {
    this.gameRef.ctx.textAlign = this.align
    this.gameRef.ctx.font = `${this.fontStyle ? this.fontStyle + ' ' : ''}${this.fontWeight ? this.fontWeight + ' ' : ''}${this.fontSize}px ${this.fontFamily}`
    // const textSize = Math.ceil(this.gameRef.ctx.measureText('M').width)
    const safeSize = Math.ceil(this.gameRef.ctx.measureText('M').width)
    const textLength = (t: string) => Math.ceil(this.gameRef.ctx.measureText(t).width)
    let currentLine = ''
    this.paginatedText = []
    // const maxLineLength = Math.floor(this.containerWidth/textSize)

    this.textToDisplay = textToSet
    this.textToDisplay.split(' ').map(word => {
      // const availableLineLength = maxLineLength - currentLine.length
      const currentLineLength = textLength(currentLine)
      const wordLength = textLength(' ' + word)
      if (currentLineLength + wordLength < this.containerWidth) {
        currentLine += ' ' + word
      } else if (wordLength > this.containerWidth) {
        if (this.containerWidth - currentLineLength < 6 * safeSize) {
          this.paginatedText.push(currentLine.trim())
          currentLine = ''
        } else {
          currentLine += ' '
        }
        word.split('').map(letter => {
          const activeLineLength = textLength(currentLine)
          const availableLineSpace = this.containerWidth - activeLineLength
          if (availableLineSpace <= safeSize) {
            this.paginatedText.push(currentLine.trim())
            currentLine = letter
          } else if (availableLineSpace > safeSize && availableLineSpace <= safeSize * 2) {
            currentLine += '-'
            this.paginatedText.push(currentLine.trim())
            currentLine = letter
          } else {
            currentLine += letter
          }
        })
        if (currentLine.length > 0) {
          currentLine += ' '
        }
      } else {
        this.paginatedText.push(currentLine.trim())
        currentLine = word
      }
    })

    if (currentLine.length > 0) {
      this.paginatedText.push(currentLine.trim())
    }

    this.containerHeight = this.paginatedText.length * this.lineHeight + 40 + (this.closeButton && this.closeButton.height ? this.closeButton.height : 0)
    this.setCloseButtonPosition()
  }

  draw() {
    if(this.active) {
      drawBox({
        c: this.gameRef.ctx,
        x: this.x - 20,
        y: this.y - 20 - 18,
        width: this.containerWidth + 40,
        height: this.containerHeight + 40,
        strokeWidth: 2,
        strokeColor: this.containerBorderColor,
        fillColor: this.containerFillColor
      })

      this.paginatedText.map((x, idx) => {
        drawText({
          c: this.gameRef.ctx,
          x: this.x + (this.align === 'center' ? this.containerWidth / 2 : 0),
          y: this.y + idx * this.lineHeight,
          fillColor: this.fontFillColor,
          align: this.align,
          text: x,
          strokeWidth: this.strokeWidth,
          strokeColor: this.fontStrokeColor,
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
          weight: this.fontWeight,
          style: this.fontStyle
        })
      })

      this.closeButton.draw()
    }
  }

  tearDown() { }

}
