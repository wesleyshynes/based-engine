import { BasedButton } from "../../engine/BasedButton";
import { BasedLevel } from "../../engine/BasedLevel";
import { drawText } from "../../engine/libs/drawHelpers";

export class StartLevel extends BasedLevel {

  startButton: any;

  initialize() {
    this.startButton = new BasedButton({
      key: `start-button`,
      gameRef: this.gameRef,
    })
    this.startButton.x = 100
    this.startButton.y = 500
    this.startButton.width = this.gameRef.gameWidth - 200
    this.startButton.clickFunction = () => {
      this.gameRef.loadLevel('level-one')
    }
  }
  update() {
    this.startButton.update()
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#eee'
    this.gameRef.ctx.fill()

    this.startButton.draw()

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 200,
      align:'center',
      fillColor: '#000',
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 30,
      text: 'Feeshy'
    })


  }
  tearDown() {
    this.startButton.tearDown()
  }
}
