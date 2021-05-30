import { BasedButton } from "../../engine/BasedButton";
import { BasedLevel } from "../../engine/BasedLevel";
import { drawText } from "../../engine/libs/drawHelpers";
import { getRandomInt } from "../../engine/libs/mathHelpers";

const customSong = [

  {f: 0, t: 0},
  {f: 150, t: .2},
  {f: 200, t: .2},
  {f: 300, t: .5},
  {f: 400, t: .2},
  {f: 300, t: .1},
  {f: 100, t: 1},

  {f: 150, t: .2},
  {f: 200, t: .1},
  {f: 150, t: .2},
  {f: 200, t: .1},
  {f: 150, t: .2},
  {f: 200, t: .1},
  {f: 150, t: .2},
  {f: 200, t: .1},

  {f: 50, t: 2},
  {f: -50, t: 3},
]

export class TroopaStart extends BasedLevel {

  startButton: any;
  highScore: number = 0
  lastScore: number = 0
  newHighScore: boolean = false

  fullScreenBtn: any;

  bgValues: any = {
    r: 64,
    g: 244,
    b: 208
  }
  colorSpeed: number = 2

  activeSound: any = {
    playing: false,
    soundRef: null,
  }

  initialize() {
    this.newHighScore = false
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
      // if(this.activeSound.playing && this.activeSound.soundRef && this.activeSound.soundRef.stop) {
      //   this.activeSound.soundRef.stop()
      // }
      this.gameRef.soundPlayer.playNote(900, .4, 'square')
      this.gameRef.loadLevel('troopa1-1')
      // alert('game started')
    }

    const bHighScore = localStorage.getItem('hi-score')
    const bLastScore = localStorage.getItem('last-score')
    if(bLastScore) {
      this.lastScore = Number(bLastScore)
    }
    if(bHighScore) {
      this.highScore = Number(bHighScore)
    }
    if(this.lastScore > this.highScore) {
      this.highScore = this.lastScore
      this.newHighScore = true
      localStorage.setItem('hi-score', `${this.highScore}`)
    }
  }

  handleSounds() {
    if(this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playCustomSound(customSong, 'square', () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }

  update() {
    this.updateBg()
    this.handleSounds()
    this.startButton.update()
  }

  updateBg() {
    let {
      r,g,b
    } = this.bgValues
    const speedFactor = this.colorSpeed * this.gameRef.diffMulti
    r += (getRandomInt(3) - 1)*speedFactor
    g += (getRandomInt(3) - 1)*speedFactor
    b += (getRandomInt(3) - 1)*speedFactor

    r = r < 0 ? 0 : r > 255 ? 255 : r
    g = g < 0 ? 0 : g > 255 ? 255 : g
    b = b < 0 ? 0 : b > 255 ? 255 : b
    this.bgValues = {
      r,g,b
    }
    // console.log(r,g,b)
  }

  drawBg() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = `rgba(${this.bgValues.r},${this.bgValues.g},${this.bgValues.b},1)`
    this.gameRef.ctx.fill()
  }

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
      y: 200,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'TROOPAS'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 275,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: this.newHighScore ? 25 : 20,
      text: `${this.newHighScore ? 'New High ' : ''}Score: ${this.lastScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 320,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 15,
      text: `Hi Score: ${this.highScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })

    /////////////////////////////////

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 200,
      align:'center',
      fillColor: '#000',
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'TROOPAS'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 275,
      align:'center',
      fillColor: '#000',
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: this.newHighScore ? 25 : 20,
      text: `${this.newHighScore ? 'New High ' : ''}Score: ${this.lastScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 320,
      align:'center',
      fillColor: '#000',
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 15,
      text: `Hi Score: ${this.highScore}`
      // text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })



    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 50,
      align:'center',
      fillColor: '#000',
      style: '',
      weight: 'bold',
      fontFamily: 'sans-serif',
      fontSize: 15,
      text: `${JSON.stringify(this.gameRef.mouseInfo)}`
    })


  }
  tearDown() {
    this.startButton.tearDown()
  }
}
