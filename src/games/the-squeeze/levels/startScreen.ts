import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { drawText } from "../../../engine/libs/drawHelpers"
import BgMusic from '../../../assets/the-squeeze//tunetank.com_6683_the-odds_by_boy_.mp3'
import { START_LEVEL } from "../startGame";
// import GameLogo from '../../../assets/vimjam2/monkey-meltdown-logo.png'

const FILL_COLOR = '#81B622'
const HOVER_COLOR = '#ECF87F'


// const ALT_FILL_COLOR = '#59981A'
const TEXT_COLOR = '#FFFFFF'
const TEXT_HOVER_COLOR = '#000000'
const BG_COLOR = '#333333'
export class StartScreen extends BasedLevel {

  gameTitle: string = 'The Squeeze'

  startButton: BasedButton;
  soundButton: BasedButton;
  creditsButton: BasedButton;
  resetScoreButton: BasedButton;
  editorButton: BasedButton;

  activeSound: any = {
    playing: false,
    soundRef: null,
  }

  bgSong: any;

  levelWidth: number = 800
  levelHeight: number = 600

  buttonGroup: BasedButton[] = []


  // logoSprite: any;

  levelLoadedTime: number = 0
  levelLoadedDelay: number = 1000

  currentScoreText: string = 'No current score'
  highScoreText: string = 'No high score'

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

    this.gameRef.drawLoading('Music', .5)
    this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.activeSound.playing = false
  }

  initialize() {

    this.handleScores()

    if(this.gameRef.basedObjectRefs.scores.currentScore > 0) {
      this.currentScoreText = `Current Score: ${(this.gameRef.basedObjectRefs.scores.currentScore/1000).toFixed(2)} seconds`
      if(this.gameRef.basedObjectRefs.scores.currentScore < this.gameRef.basedObjectRefs.scores.highScore || this.gameRef.basedObjectRefs.scores.highScore === 0) {
        this.highScoreText = `New High: ${(this.gameRef.basedObjectRefs.scores.currentScore/1000).toFixed(2)} seconds`
        localStorage.setItem('the-squeeze-high-score', this.gameRef.basedObjectRefs.scores.currentScore)
      }
    }

    this.gameRef.basedObjectRefs.gameOptions = {
      mode: 'standard'
    }
    this.gameRef.cameraZoom = 1

    this.startButton = new BasedButton({
      key: `start-button`,
      gameRef: this.gameRef,
    })
    this.startButton.fillColor =  FILL_COLOR
    this.startButton.hoverColor = HOVER_COLOR
    this.startButton.focusColor = HOVER_COLOR
    this.startButton.textColor = TEXT_COLOR
    this.startButton.textHoverColor = TEXT_HOVER_COLOR
    this.startButton.enableFillColorTransition = true
    this.startButton.fillColorStart = {
      r: 129,
      g: 182,
      b: 34,
      a: 1
    }
    this.startButton.fillColorEnd = {
      r: 89,
      g: 152,
      b: 26,
      a: 1
    }
    this.startButton.x = 100
    this.startButton.y = this.gameRef.gameHeight - 280
    this.startButton.buttonText = 'Play'
    this.startButton.width = this.gameRef.gameWidth - 200
    this.startButton.clickFunction = () => {
      this.gameRef.clearGameData()
      this.gameRef.basedObjectRefs.scores.currentScore = 0
      this.gameRef.loadLevel(START_LEVEL)
    }

    this.buttonGroup = []

    // CREDITS BUTTON
    this.creditsButton = new BasedButton({
      key: `credits-button`,
      gameRef: this.gameRef,
    })
    this.creditsButton.fillColor = 'black'
    this.creditsButton.hoverColor = HOVER_COLOR
    this.creditsButton.focusColor = HOVER_COLOR
    this.creditsButton.textColor = TEXT_COLOR
    this.creditsButton.textHoverColor = TEXT_HOVER_COLOR
    this.creditsButton.x = 100
    this.creditsButton.y = this.gameRef.gameHeight - 135
    this.creditsButton.buttonText = 'Credits'
    this.creditsButton.width = this.gameRef.gameWidth - 200
    this.creditsButton.height = 50
    this.creditsButton.clickFunction = () => {
      this.gameRef.loadLevel('credits-screen')
      // alert('code in level')
    }
    this.buttonGroup.push(this.creditsButton)

    // SOUND BUTTON
    this.soundButton = new BasedButton({
      key: `sound-button`,
      gameRef: this.gameRef,
    })
    this.soundButton.fillColor = 'black'
    this.soundButton.hoverColor = HOVER_COLOR
    this.soundButton.focusColor = HOVER_COLOR
    this.soundButton.textColor = TEXT_COLOR
    this.soundButton.textHoverColor = TEXT_HOVER_COLOR
    this.soundButton.x = 100
    this.soundButton.y = this.gameRef.gameHeight - 70
    this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
    this.soundButton.width = this.gameRef.gameWidth - 200
    this.soundButton.height = 50
    this.soundButton.clickFunction = () => {
      if (this.activeSound.playing && this.activeSound.soundRef && this.activeSound.soundRef.stop) {
        this.activeSound.soundRef.stop()
      }
      this.gameRef.soundPlayer.enabled = !this.gameRef.soundPlayer.enabled
      this.soundButton.buttonText = `${this.gameRef.soundPlayer.enabled ? 'Disable' : 'Enable'} Sound`
      this.activeSound.playing = false
    }
    this.buttonGroup.push(this.soundButton)

    this.resetScoreButton = new BasedButton({
      key: `reset-score-button`,
      gameRef: this.gameRef,
    })
    this.resetScoreButton.fillColor = '#111'
    this.resetScoreButton.hoverColor = HOVER_COLOR
    this.resetScoreButton.focusColor = HOVER_COLOR
    this.resetScoreButton.textColor = TEXT_COLOR
    this.resetScoreButton.textHoverColor = TEXT_HOVER_COLOR
    this.resetScoreButton.x = 100
    this.resetScoreButton.y = this.gameRef.gameHeight - 200
    this.resetScoreButton.buttonText = 'Reset Score'
    this.resetScoreButton.width = this.gameRef.gameWidth - 200
    this.resetScoreButton.height = 50
    this.resetScoreButton.clickFunction = () => {
      this.resetScores()
    }
    this.buttonGroup.push(this.resetScoreButton)

    // EDITOR BUTTON
    this.editorButton = new BasedButton({
      key: `editor-button`,
      gameRef: this.gameRef,
    })
    this.editorButton.fillColor = '#444'
    this.editorButton.hoverColor = HOVER_COLOR
    this.editorButton.focusColor = HOVER_COLOR
    this.editorButton.textColor = TEXT_COLOR
    this.editorButton.textHoverColor = TEXT_HOVER_COLOR
    this.editorButton.x = 100
    this.editorButton.y = this.gameRef.gameHeight - 200
    this.editorButton.buttonText = 'Level Editor'
    this.editorButton.width = this.gameRef.gameWidth - 200
    this.editorButton.height = 50
    this.editorButton.clickFunction = () => {
      this.gameRef.loadLevel('level-editor')
    }
    this.buttonGroup.push(this.editorButton)

    this.onResize()

    this.levelLoadedTime = this.gameRef.lastUpdate
  }

  handleScores() {
    this.currentScoreText = 'No current score'
    this.highScoreText = 'No high score'
    if(!this.gameRef.basedObjectRefs.scores) {
      this.gameRef.basedObjectRefs.scores = {
        highScore: 0,
        currentScore: 0
      }
    }
    // check local storage for the-squeeze-high-score
    const highScore = localStorage.getItem('the-squeeze-high-score')
    if (highScore) {
      this.gameRef.basedObjectRefs.scores.highScore = parseInt(highScore)
      // convert highscore from milliseconds to seconds with 2 decimal places
      this.highScoreText = `High Score: ${(this.gameRef.basedObjectRefs.scores.highScore/1000).toFixed(2)} seconds`
    }
  }

  resetScores() {
    localStorage.removeItem('the-squeeze-high-score')
    this.gameRef.basedObjectRefs.scores.highScore = 0
    this.highScoreText = 'No high score'
    this.gameRef.basedObjectRefs.scores.currentScore = 0
    this.handleScores()
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

  update() {
    this.updateBg()
    this.handleSounds()
    if (this.gameRef.lastUpdate > this.levelLoadedTime + this.levelLoadedDelay) {
      this.startButton.update()
      this.soundButton.update()
      this.creditsButton.update()
      this.resetScoreButton.update()
      this.editorButton.update()
    }
  }

  updateBg() { }

  onResize() {
    const heightOffset = (this.gameRef.gameHeight >= 400 ? 20 : 10)
    this.buttonGroup.forEach((x, i) => {
      x.width = this.gameRef.gameWidth - 200
      x.height = this.gameRef.gameHeight >= 400 ? 50 : 30
      x.y = this.gameRef.gameHeight - (this.buttonGroup.length - i) * (x.height + heightOffset)
    })

    this.startButton.y = this.buttonGroup[0].y - this.startButton.height - heightOffset * 2
    this.startButton.width = this.gameRef.gameWidth - 200
  }

  drawBg() { }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = BG_COLOR
    this.gameRef.ctx.fill()

    this.drawBg()

    this.startButton.draw()
    this.soundButton.draw()
    this.creditsButton.draw()
    this.resetScoreButton.draw()
    this.editorButton.draw()

    // rotateDraw({
    //   c: this.gameRef.ctx,
    //   x: this.gameRef.gameWidth/2 - this.logoSprite.dWidth/2,
    //   y: this.gameRef.gameHeight/4 - this.logoSprite.dHeight/2 - 20,
    //   a: 0
    // }, () => {
    //     drawImage(this.logoSprite)
    // })


    // SHADOWS
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth) / 2 + 1,
      y: this.gameRef.gameHeight / 4 + 1,
      // y: 150,
      align: 'center',
      fillColor: '#000',
      // strokeColor: '#fff',
      // strokeWidth: 3,
      style: '',
      weight: '700',
      fontFamily: 'sans-serif',
      fontSize: 32,
      text: 'THE SQUEEZE'
    })

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: (this.gameRef.gameWidth) / 2 + 1,
    //   y: this.gameRef.gameHeight / 4 + 40 + 1,
    //   // y: 150,
    //   align: 'center',
    //   fillColor: '#000',
    //   // strokeColor: '#fff',
    //   // strokeWidth: 3,
    //   style: '',
    //   weight: '700',
    //   fontFamily: 'sans-serif',
    //   fontSize: 32,
    //   text: 'ALWAYS LOSES'
    // })

    // draw current score
    if(this.currentScoreText) {
      drawText({
        c: this.gameRef.ctx,
        x: (this.gameRef.gameWidth) / 2,
        y: this.gameRef.gameHeight / 4 + 40,
        // y: 150,
        align: 'center',
        fillColor: 'orange',
        // strokeColor: '#fff',
        // strokeWidth: 3,
        style: '',
        weight: '700',
        fontFamily: 'sans-serif',
        fontSize: 16,
        // text: `Dicks out for Harambe`
        text: this.currentScoreText
      })
    }

    // draw high score
    if(this.highScoreText) {
      drawText({
        c: this.gameRef.ctx,
        x: (this.gameRef.gameWidth) / 2,
        y: this.gameRef.gameHeight / 4 + 70,
        // y: 150,
        align: 'center',
        fillColor: 'red',
        // strokeColor: '#fff',
        // strokeWidth: 3,
        style: '',
        weight: '700',
        fontFamily: 'sans-serif',
        fontSize: 16,
        // text: `Dicks out for Harambe score`
        text: this.highScoreText
      })
    }




    // LIGHT
    drawText({
      c: this.gameRef.ctx,
      x: (this.gameRef.gameWidth) / 2,
      y: this.gameRef.gameHeight / 4,
      // y: 150,
      align: 'center',
      fillColor: '#FFF',
      // strokeColor: '#fff',
      // strokeWidth: 3,
      style: '',
      weight: '700',
      fontFamily: 'sans-serif',
      fontSize: 32,
      text: 'THE SQUEEZE'
    })

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: (this.gameRef.gameWidth) / 2,
    //   y: this.gameRef.gameHeight / 4 + 40,
    //   // y: 150,
    //   align: 'center',
    //   fillColor: '#FFF',
    //   // strokeColor: '#fff',
    //   // strokeWidth: 3,
    //   style: '',
    //   weight: '700',
    //   fontFamily: 'sans-serif',
    //   fontSize: 32,
    //   text: 'ALWAYS LOSES'
    // })

  }
  tearDown() {
    this.startButton.tearDown()
    this.soundButton.tearDown()
    this.creditsButton.tearDown()
    this.editorButton.tearDown()
    if (this.activeSound.playing && this.activeSound.soundRef) {
      this.activeSound.soundRef.stop()
    }
  }
}
