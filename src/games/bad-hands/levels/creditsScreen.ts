import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers";
import CreditsMusic from '../../../assets/pool/music/keys-of-moon-the-success.mp3'

export default class CreditsScreen extends BasedLevel {
  backButton: any;

  bgColor: string = '#1E1B18'


  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;

  credits: any[] = []

  creditHeightOffset = 0
  creditsSpeed = 1
  creditEntryHeight = 90


  async preload() {
    // SOUND BUTTON
    this.backButton = new BasedButton({
      key: `back-button`,
      gameRef: this.gameRef,
    })
    this.backButton.fillColor = '#D8315B'
    this.backButton.hoverColor = '#3E92CC'
    this.backButton.focusColor = '#3E92CC'
    this.backButton.textColor = 'white'
    this.backButton.x = 10
    this.backButton.y = 10
    this.backButton.buttonText = '< Go Back'
    this.backButton.width = 150
    this.backButton.clickFunction = () => {
      this.gameRef.loadLevel('start-screen')
    }

    this.gameRef.drawLoading('Funky Jams', 0.5)
    this.bgSong = await this.gameRef.soundPlayer.loadSound(CreditsMusic)
    this.activeSound.playing = false
  }
  initialize() {
    this.creditHeightOffset = this.gameRef.gameHeight
    this.credits = [
      { title: 'PRODUCED BY:', name: 'Shynes Gaming', },
      { title: 'LEAD PROGRAMMER:', name: 'Chewdawg', },
      { title: 'LEAD ARTIST:', name: 'Wesley Shynes', },
      { title: '', name: '', },
      // { title: 'SOUND EFFECTS:', name: ' pulled from freesound.org', },
      // { title: 'ramstush', name: 'crunch', },
      // { title: 'Single Swoosh', name: 'Mrthenoronha', },
      // { title: '', name: '', },
      // { title: 'MUSIC:', name: 'pulled from chosic.com', },
      // { title: 'Silly Intro', name: 'Alexander Nakarada', },
      // { title: 'Fast Feel Banana', name: 'Alexander Nakarada', },
      // { title: 'Epic Song', name: 'BoxCat Games', },
      // { title: 'Tired of Life', name: 'Meydän', },
      { title: '', name: '', },
      { title: '', name: 'THANK YOU FOR PLAYING!', },
    ]
  }

  update() {
    this.handleSounds()
    this.backButton.update()
    this.creditHeightOffset -= this.creditsSpeed * this.gameRef.diffMulti
    if ( this.creditHeightOffset < -( this.creditEntryHeight * (this.credits.length + 2) )) {
      this.creditHeightOffset =  this.gameRef.gameHeight
    }
  }

  handleSounds() {
    if (!this.gameRef.soundPlayer.enabled) { return }
    if (this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = this.bgColor
    this.gameRef.ctx.fill()

    this.credits.forEach((credit, index) => {

      drawText({
        c: this.gameRef.ctx,
        x: (this.gameRef.gameWidth) / 2,
        y: index * this.creditEntryHeight + this.creditHeightOffset,
        align: 'center',
        fillColor: '#fff',
        // strokeColor: '#fff',
        // strokeWidth: 3,
        style: '',
        weight: '900',
        fontFamily: 'sans-serif',
        fontSize: this.gameRef.gameWidth < 600 ? 12 : 16,
        text: credit.title,
      })

      drawText({
        c: this.gameRef.ctx,
        x: (this.gameRef.gameWidth) / 2,
        y: index * this.creditEntryHeight + 30 + this.creditHeightOffset,
        align: 'center',
        fillColor: '#fff',
        // strokeColor: '#fff',
        // strokeWidth: 3,
        style: '',
        weight: '900',
        fontFamily: 'sans-serif',
        fontSize: this.gameRef.gameWidth < 600 ? 18 : 24,
        text: credit.name
      })
    })

    this.backButton.draw()
  }
  onResize() {
    // this.backButton.width = this.gameRef.gameWidth - 200
  }
  tearDown() {
    this.backButton.tearDown()
    if (this.activeSound.playing && this.activeSound.soundRef) {
      this.activeSound.soundRef.stop()
    }
  }

}
