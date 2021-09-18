import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers";
import CreditsMusic from '../../../assets/vimjam2/steakuy.mp3'

export default class CreditsScreen extends BasedLevel {
  backButton: any;

  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;


  async preload() {
    // SOUND BUTTON
    this.backButton = new BasedButton({
      key: `back-button`,
      gameRef: this.gameRef,
    })
    this.backButton.fillColor = 'yellow'
    this.backButton.hoverColor = 'orange'
    this.backButton.textColor = 'brown'
    this.backButton.x = 10
    this.backButton.y = 10
    this.backButton.buttonText = '< Go Back'
    this.backButton.width = 150
    this.backButton.clickFunction = () => {
      this.gameRef.loadLevel('start-screen')
    }

    this.gameRef.drawLoading('Music')
    this.bgSong =  await this.gameRef.soundPlayer.loadSound(CreditsMusic)
    this.activeSound.playing = false
  }
  initialize() {}
  update() {
    this.handleSounds()
    this.backButton.update()
  }
  handleSounds() {
    if(!this.gameRef.soundPlayer.enabled) { return }
    if(this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#799b1f'
    this.gameRef.ctx.fill()

    const heightBase = this.gameRef.gameHeight/5

    // PRODUCED BY //////////////////////////
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 16,
      text: 'produced by:'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase + 30,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 24,
      text: 'SHYNES GAMING'
    })

    // LEAD PROGRAMMER //////////////////////////
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*2,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 16,
      text: 'lead programmer:'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*2 + 30,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 24,
      text: 'Chewdawg'
    })

    // LEAD ARTIST //////////////////////////
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*3,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 16,
      text: 'lead artist:'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*3 + 30,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 24,
      text: 'Namio_Moia'
    })

    // SOUND ENGINEER //////////////////////////
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*4,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 16,
      text: 'sound engineer:'
    })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: heightBase*4 + 30,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '900',
      fontFamily: 'sans-serif',
      fontSize: 24,
      text: 'Kevin McKFly'
    })

    this.backButton.draw()
  }
  onResize() {
    // this.backButton.width = this.gameRef.gameWidth - 200
  }
  tearDown() {
    this.backButton.tearDown()
    if(this.activeSound.playing && this.activeSound.soundRef){
      this.activeSound.soundRef.stop()
    }
  }

}
