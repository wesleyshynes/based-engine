import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers";

export class BlastyStart extends BasedLevel {

  startButton: any;

  async preload() {
  }

  initialize() {
    this.startButton = new BasedButton({
      key: `start-button`,
      gameRef: this.gameRef,
    })
    this.startButton.fillColor = '#ce192b'
    this.startButton.x = 100
    this.startButton.y = this.gameRef.gameHeight - 100
    this.startButton.buttonText = 'Start Game'
    this.startButton.width = this.gameRef.gameWidth - 200
    this.startButton.clickFunction = () => {
      // this.gameRef.soundPlayer.playNote(900, .4, 'square')
      this.gameRef.loadLevel('blasty-1')
    }

  }

  handleSounds() {}

  update() {
    this.updateBg()
    this.handleSounds()
    this.startButton.update()
  }

  updateBg() {}

  drawBg() {}

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#eee'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.startButton.draw()

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 150,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'BLASTY MAN'
    })


  }
  tearDown() {
    this.startButton.tearDown()
  }
}
