import { BasedButton } from "../BasedButton";
import { BasedObject } from "../BasedObject";
import { SliderControl } from "../controls/SliderControl";
import { drawBox, drawText } from "../libs/drawHelpers";

export default class TextContainer extends BasedObject {

  textToDisplay: string = 'DEMO TEXT';
  textLines: string[] = [];

  fontSize: number = 18;
  lineHeight: number = 24;
  fontFamily: string = 'sans-serif';
  fontWeight: string | number = 700;
  fontStyle: string;
  fontFillColor: string = 'black';
  fontStrokeColor: string = 'white';
  strokeWidth: number = 0;
  align: 'center' | 'left' | 'right' = 'left'

  containerFillColor: '#fff';
  containerBorderColor: '#fff';
  containerWidth: number = 400;
  containerHeight: number = 200;

  width: number = 400;
  height: number = 240;

  x: number = 0;
  y: number = 0;

  active: boolean = true;

  closeFunction: any = () => { }

  closeButton: any;
  closeButtonWidth: number = 100;
  closeButtonHeight: number = 30;
  closeButtonFillColor: string = '#ccc';
  closeButtonHoverColor: string = '#000';
  closeButtonFocusColor: string = '#000';
  closeButtonTextColor: string = '#fff';
  closeButtonTextHoverColor: string = '';

  maxLinesBasedOnHeight: number = 0;

  scrollBar: any;

  nextPageButton: any;

  keyDownDelay: number = 300;
  lastKeyDown: number = 0;
  nextPageKey: string = 'KeyK';

  async preload() { }
  initialize() {
    this.setupCloseButton()
    this.setupScrollBar()
    this.setupNextPageButton()
    this.onResize()
  }

  setupScrollBar() {
    this.scrollBar = new SliderControl({
      key: `${this.objectKey}-scroll-bar`,
      gameRef: this.gameRef
    })
    this.scrollBar.direction = 'vertical'
    this.scrollBar.x = this.x + this.containerWidth - 20
    this.scrollBar.y = this.y
    this.scrollBar.width = 10
    this.scrollBar.btnWidth = 20
    this.scrollBar.btnHeight = 20
    this.scrollBar.height = this.containerHeight
    this.scrollBar.minValue = 0
    this.scrollBar.maxValue = this.containerHeight
    this.scrollBar.value = 0
    this.scrollBar.tickAmount = 1
    this.scrollBar.btnColor = 'white'
    this.scrollBar.btnTextColor = 'black'
    this.scrollBar.tickFunction = () => { }
    this.scrollBar.initialize()
    this.setScrollBarPosition()
  }

  setupCloseButton() {
    this.closeButton = new BasedButton({ key: `${this.objectKey}-close-button`, gameRef: this.gameRef })
    this.closeButton.width = this.closeButtonWidth
    this.closeButton.height = this.closeButtonHeight
    this.closeButton.fillColor = this.closeButtonFillColor
    this.closeButton.textColor = this.closeButtonTextColor
    this.closeButton.textHoverColor = this.closeButtonTextHoverColor
    this.closeButton.hoverColor = this.closeButtonHoverColor
    this.closeButton.focusColor = this.closeButtonFocusColor
    this.closeButton.buttonText = 'Close'
    this.closeButton.clickFunction = () => {
      this.handleCloseFunction()
    }
    this.setCloseButtonPosition()
  }

  setupNextPageButton() {
    this.nextPageButton = new BasedButton({ key: `${this.objectKey}-next-page-button`, gameRef: this.gameRef })
    this.nextPageButton.width = this.closeButtonWidth
    this.nextPageButton.height = this.closeButtonHeight
    this.nextPageButton.fillColor = this.closeButtonFillColor
    this.nextPageButton.textColor = this.closeButtonTextColor
    this.nextPageButton.textHoverColor = this.closeButtonTextHoverColor
    this.nextPageButton.hoverColor = this.closeButtonHoverColor
    this.nextPageButton.focusColor = this.closeButtonFocusColor
    this.nextPageButton.buttonText = 'Next Page'
    this.nextPageButton.clickFunction = () => {
      this.handleNextPage()
    }
    this.setNextPageButtonPosition()
  }

  update() {
    if (this.active) {
      if (this.scrollBar.value === 0) {
        this.closeButton.update()
      }
      if (this.scrollBar.value !== 0 && this.textLines.length > this.maxLinesBasedOnHeight) {
        this.nextPageButton.update()
      }
      this.scrollBar.update()

      if(this.gameRef.pressedKeys[this.nextPageKey] && this.gameRef.lastUpdate - this.lastKeyDown > this.keyDownDelay) {
        this.lastKeyDown = this.gameRef.lastUpdate
        if (this.scrollBar.value !== 0 && this.textLines.length > this.maxLinesBasedOnHeight) {
          this.handleNextPage()
        } else {
          this.handleCloseFunction()
        }
      }
    }
  }

  handleCloseFunction() {
    this.active = false
    this.closeFunction()
  }

  onResize() {
    if (this.width > this.gameRef.gameWidth - 60) {
      this.containerWidth = this.gameRef.gameWidth - 60
    } else {
      this.containerWidth = this.width
    }

    this.x = this.gameRef.gameWidth / 2 - this.containerWidth / 2

    this.setText(this.textToDisplay)
    // this.setCloseButtonPosition()
  }

  setCloseButtonPosition() {
    if (this.closeButton) {
      this.closeButton.x = this.x + this.containerWidth - this.closeButton.width
      this.closeButton.y = this.y + this.containerHeight - 20 - this.closeButton.height
    }
  }

  setNextPageButtonPosition() {
    if (this.nextPageButton) {
      this.nextPageButton.x = this.x
      this.nextPageButton.y = this.y + this.containerHeight - 20 - this.nextPageButton.height
    }
  }

  setScrollBarPosition() {
    if (this.scrollBar) {
      this.scrollBar.x = this.x + this.containerWidth + this.scrollBar.btnWidth / 2
      this.scrollBar.height = this.height - this.scrollBar.verticalOffsetAmount() * 2
      this.scrollBar.y = this.y + this.scrollBar.height / 2 + this.scrollBar.verticalOffsetAmount()
      this.scrollBar.tickAmount = 1
      this.scrollBar.maxValue = this.textLines.length - this.maxLinesBasedOnHeight > 0 ? this.textLines.length - this.maxLinesBasedOnHeight : 0
      this.scrollBar.minValue = 0
      this.scrollBar.value = this.scrollBar.maxValue
      this.scrollBar.onResize()
    }
  }

  setText(textToSet: string) {
    this.gameRef.ctx.textAlign = this.align
    this.gameRef.ctx.font = `${this.fontStyle ? this.fontStyle + ' ' : ''}${this.fontWeight ? this.fontWeight + ' ' : ''}${this.fontSize}px ${this.fontFamily}`
    // const textSize = Math.ceil(this.gameRef.ctx.measureText('M').width)
    const safeSize = Math.ceil(this.gameRef.ctx.measureText('M').width)
    const textLength = (t: string) => Math.ceil(this.gameRef.ctx.measureText(t).width)
    let currentLine = ''
    this.textLines = []
    // const maxLineLength = Math.floor(this.containerWidth/textSize)

    this.textToDisplay = textToSet
    this.textToDisplay.split('\n').map(line => {

      line.split(' ').map(word => {
        const currentLineLength = textLength(currentLine)
        const wordLength = textLength(' ' + word)
        if (currentLineLength + wordLength < this.containerWidth) {
          currentLine += ' ' + word
        } else if (wordLength > this.containerWidth) {
          if (this.containerWidth - currentLineLength < 6 * safeSize) {
            this.textLines.push(currentLine.trim())
            currentLine = ''
          } else {
            currentLine += ' '
          }
          word.split('').map(letter => {
            const activeLineLength = textLength(currentLine)
            const availableLineSpace = this.containerWidth - activeLineLength
            if (availableLineSpace <= safeSize) {
              this.textLines.push(currentLine.trim())
              currentLine = letter
            } else if (availableLineSpace > safeSize && availableLineSpace <= safeSize * 2) {
              currentLine += '-'
              this.textLines.push(currentLine.trim())
              currentLine = letter
            } else {
              currentLine += letter
            }
          })
          if (currentLine.length > 0) {
            currentLine += ' '
          }
        } else {
          this.textLines.push(currentLine.trim())
          currentLine = word
        }
      })

      if (currentLine.length > 0) {
        this.textLines.push(currentLine.trim())
      }

      // this.textLines.push('')
      currentLine = ''

    })



    this.maxLinesBasedOnHeight = Math.floor(this.height / this.lineHeight)

    // this.containerHeight = this.textLines.length * this.lineHeight + 40 + (this.closeButton && this.closeButton.height ? this.closeButton.height : 0)
    this.containerHeight = this.height + 40 + (this.closeButton && this.closeButton.height ? this.closeButton.height : 0)
    this.setCloseButtonPosition()
    this.setScrollBarPosition()
    this.setNextPageButtonPosition()
  }

  handleNextPage() {
    this.scrollBar.tick(-this.maxLinesBasedOnHeight)
  }

  draw() {
    if (this.active) {
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

      // draw light gray box where text will be
      // drawBox({
      //   c: this.gameRef.ctx,
      //   x: this.x,
      //   y: this.y,
      //   width: this.containerWidth,
      //   height: this.height,
      //   fillColor: '#f0f0f0'
      // })

      let linesDrawn = 0
      let startPoint = this.textLines.length - this.maxLinesBasedOnHeight - this.scrollBar.value
      if (startPoint < 0) {
        startPoint = 0
      }
      this.textLines.map((x, idx) => {
        if (idx < startPoint) return
        if (linesDrawn >= this.maxLinesBasedOnHeight) return
        drawText({
          c: this.gameRef.ctx,
          x: this.x + (this.align === 'center' ? this.containerWidth / 2 : 0),
          // y: this.y + idx * this.lineHeight,
          y: this.y + (linesDrawn + 1) * this.lineHeight,
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
        linesDrawn++

      })

      if (this.textLines.length > this.maxLinesBasedOnHeight) {
        this.scrollBar.draw()
      }

      if (this.scrollBar.value === 0) {
        this.closeButton.draw()
      } else if (this.textLines.length > this.maxLinesBasedOnHeight) {
        this.nextPageButton.draw()
      }
    }
  }

  tearDown() { }

}