import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers"
import BgMusic from '../../../assets/vimjam2/poopytime34.mp3'

export class StartScreen extends BasedLevel {

  startButton: any;
  soundButton: any;
  creditsButton: any;

  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;

  async preload() {
    this.bgSong =  await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.activeSound.playing = false
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
      this.gameRef.loadLevel('level-1')
    }

    // SOUND BUTTON
    this.soundButton = new BasedButton({
      key: `sound-button`,
      gameRef: this.gameRef,
    })
    this.soundButton.fillColor = '#333'
    this.soundButton.hoverColor = '#000'
    this.soundButton.x = 100
    this.soundButton.y = this.gameRef.gameHeight - 30
    this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
    this.soundButton.width = this.gameRef.gameWidth - 200
    this.soundButton.height = 20
    this.soundButton.fontSize = 12
    this.soundButton.clickFunction = () => {
      if(this.activeSound.playing && this.activeSound.soundRef && this.activeSound.soundRef.stop) {
        this.activeSound.soundRef.stop()
      }
      this.gameRef.soundPlayer.enabled = !this.gameRef.soundPlayer.enabled
      this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
      this.activeSound.playing = false
    }
  }

  handleSounds() {
    if(this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }

  update() {
    this.handleSounds()
    this.updateBg()
    this.handleSounds()
    this.startButton.update()
    this.soundButton.update()
  }

  updateBg() {}

  onResize() {
    this.startButton.y = this.gameRef.gameHeight - 100
    this.startButton.width = this.gameRef.gameWidth - 200

    this.soundButton.y = this.gameRef.gameHeight - 30
    this.soundButton.width = this.gameRef.gameWidth - 200
  }

  drawBg() {}

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#799b1f'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.startButton.draw()
    this.soundButton.draw()

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
      text: 'MONKEY'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 190,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'MELTDOWN'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: 300,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 10,
      text: JSON.stringify(this.gameRef.touchInfo)
    })


  }
  tearDown() {
    this.startButton.tearDown()
    this.soundButton.tearDown()
    if(this.activeSound.playing && this.activeSound.soundRef){
      this.activeSound.soundRef.stop()
    }
  }
}
