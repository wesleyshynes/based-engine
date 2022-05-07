import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { createSprite, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers"
import BgMusic from '../../../assets/vimjam2/steakuy.mp3'
// import GameLogo from '../../../assets/vimjam2/monkey-meltdown-logo.png'

export class StartScreen extends BasedLevel {

  startButton: any;
  gameModeButton: any;
  soundButton: any;
  creditsButton: any;

  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;

  // logoSprite: any;

  levelLoadedTime: number = 0
  levelLoadedDelay: number = 1000

  async preload() {

    // this.gameRef.drawLoading('Logo')
    // this.logoSprite = await await createSprite({
    //   c: this.gameRef.ctx,
    //   sprite: GameLogo,
    //   sx: 0,
    //   sy: 0,
    //   sWidth: 284,
    //   sHeight: 72,
    //   dx: 0,
    //   dy: 0,
    //   dWidth: 284,
    //   dHeight: 72,
    //   frame: 0,
    // })

    this.gameRef.drawLoading('Music')
    this.bgSong =  await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.activeSound.playing = false
  }

  initialize() {

    this.gameRef.basedObjectRefs.gameOptions = {
      mode: 'standard'
    }

    this.startButton = new BasedButton({
      key: `start-button`,
      gameRef: this.gameRef,
    })
    this.startButton.fillColor = 'red'
    this.startButton.hoverColor = 'black'
    this.startButton.textColor = 'white'
    this.startButton.x = 100
    this.startButton.y = this.gameRef.gameHeight - 200
    this.startButton.buttonText = 'Play'
    this.startButton.width = this.gameRef.gameWidth - 200
    this.startButton.clickFunction = () => {
      this.gameRef.loadLevel('standard-level')
    }

    this.gameModeButton = new BasedButton({
      key: `game-mode-button`,
      gameRef: this.gameRef,
    })
    this.gameModeButton.fillColor = 'red'
    this.gameModeButton.hoverColor = 'black'
    this.gameModeButton.textColor = 'white'
    this.gameModeButton.x = 100
    this.gameModeButton.y = this.gameRef.gameHeight - 300
    this.gameModeButton.buttonText = this.gameRef.basedObjectRefs.gameOptions.mode.toUpperCase()
    this.gameModeButton.width = this.gameRef.gameWidth - 200
    this.gameModeButton.clickFunction = () => {
      this.gameRef.basedObjectRefs.gameOptions.mode = this.gameRef.basedObjectRefs.gameOptions.mode === 'standard' ? '9ball' : 'standard'
      this.gameModeButton.buttonText = this.gameRef.basedObjectRefs.gameOptions.mode.toUpperCase()
    }

    // CREDITS BUTTON
    this.creditsButton = new BasedButton({
      key: `credits-button`,
      gameRef: this.gameRef,
    })
    this.creditsButton.fillColor = 'red'
    this.creditsButton.hoverColor = 'black'
    this.creditsButton.textColor = 'white'
    this.creditsButton.x = 100
    this.creditsButton.y = this.gameRef.gameHeight - 135
    this.creditsButton.buttonText = 'Credits'
    this.creditsButton.width = this.gameRef.gameWidth - 200
    this.creditsButton.clickFunction = () => {
      // this.gameRef.loadLevel('credits-screen')
      // alert('code in level')
    }

    // SOUND BUTTON
    this.soundButton = new BasedButton({
      key: `sound-button`,
      gameRef: this.gameRef,
    })
    this.soundButton.fillColor = 'red'
    this.soundButton.hoverColor = 'black'
    this.soundButton.textColor = 'white'
    this.soundButton.x = 100
    this.soundButton.y = this.gameRef.gameHeight - 70
    this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
    this.soundButton.width = this.gameRef.gameWidth - 200
    this.soundButton.clickFunction = () => {
      if(this.activeSound.playing && this.activeSound.soundRef && this.activeSound.soundRef.stop) {
        this.activeSound.soundRef.stop()
      }
      this.gameRef.soundPlayer.enabled = !this.gameRef.soundPlayer.enabled
      this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
      this.activeSound.playing = false
    }

    this.levelLoadedTime = this.gameRef.lastUpdate
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

  update() {
    this.updateBg()
    // this.handleSounds()
    if(this.gameRef.lastUpdate > this.levelLoadedTime + this.levelLoadedDelay) {
      this.gameModeButton.update()
      this.startButton.update()
      this.soundButton.update()
      this.creditsButton.update()
    }
  }

  updateBg() {}

  onResize() {

    this.gameModeButton.y = this.gameRef.gameHeight - 300
    this.gameModeButton.width = this.gameRef.gameWidth - 200

    this.startButton.y = this.gameRef.gameHeight - 200
    this.startButton.width = this.gameRef.gameWidth - 200

    this.creditsButton.y = this.gameRef.gameHeight - 135
    this.creditsButton.width = this.gameRef.gameWidth - 200

    this.soundButton.y = this.gameRef.gameHeight - 70
    this.soundButton.width = this.gameRef.gameWidth - 200
  }

  drawBg() {}

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#333'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.gameModeButton.draw()
    this.startButton.draw()
    this.soundButton.draw()
    this.creditsButton.draw()

    // rotateDraw({
    //   c: this.gameRef.ctx,
    //   x: this.gameRef.gameWidth/2 - this.logoSprite.dWidth/2,
    //   y: this.gameRef.gameHeight/4 - this.logoSprite.dHeight/2 - 20,
    //   a: 0
    // }, () => {
    //     drawImage(this.logoSprite)
    // })

    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth)/2,
      y: this.gameRef.gameHeight/4,
      // y: 150,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '700',
      fontFamily: 'sans-serif',
      fontSize: 40,
      text: 'POOL'
    })
    //
    // drawText({
    //   c: this.gameRef.ctx,
    //   x: (this.gameRef.gameWidth)/2,
    //   y: 190,
    //   align:'center',
    //   fillColor: '#000',
    //   strokeColor: '#fff',
    //   strokeWidth: 3,
    //   style: '',
    //   weight: '900',
    //   fontFamily: 'sans-serif',
    //   fontSize: 40,
    //   text: 'MELTDOWN'
    // })

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: (this.gameRef.gameWidth)/2,
    //   y: 300,
    //   align:'center',
    //   fillColor: '#000',
    //   strokeColor: '#fff',
    //   strokeWidth: 3,
    //   style: '',
    //   weight: '900',
    //   fontFamily: 'sans-serif',
    //   fontSize: 10,
    //   text: JSON.stringify(this.gameRef.touchInfo)
    // })


  }
  tearDown() {
    this.startButton.tearDown()
    this.soundButton.tearDown()
    this.creditsButton.tearDown()
    if(this.activeSound.playing && this.activeSound.soundRef){
      this.activeSound.soundRef.stop()
    }
  }
}
