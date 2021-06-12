import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers";

export class WalkTheHumanStart extends BasedLevel {

  startButton: any;

  highScore: number = 0
  lastScore: number = 0
  newHighScore: boolean = false

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
      this.gameRef.soundPlayer.playNote(900, .4, 'square')
      this.gameRef.loadLevel('walk-1')
    }
    this.newHighScore = false
    const bHighScore = localStorage.getItem('hi-score-walk')
    const bLastScore = localStorage.getItem('last-score-walk')
    if(bLastScore) {
      this.lastScore = Number(bLastScore)
    }
    if(bHighScore) {
      this.highScore = Number(bHighScore)
    }
    if(this.lastScore > this.highScore) {
      this.highScore = this.lastScore
      this.newHighScore = true
      localStorage.setItem('hi-score-walk', `${this.highScore}`)
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
      y: 100,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'WALK'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 140,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'THE HUMAN'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 185,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: this.newHighScore ? 20 : 16,
      text: `${this.newHighScore ? 'New High ' : ''}Score: ${this.lastScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 210,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 16,
      text: `Hi Score: ${this.highScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })


  }
  tearDown() {
    this.startButton.tearDown()
  }
}
