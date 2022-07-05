import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { createSprite, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers"
import BgMusic from '../../../assets/pool/music/Bauchamp_-_148_jucky.mp3'
import BilliardBall from "../entities/BilliardBall";
import { Ball_Layout_15, Ball_Layout_9 } from "../constants/levelConstants";
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

  balls: any[] = []
  ballSize: number = 15;

  levelWidth: number = 800
  levelHeight: number = 1000

  buttonGroup: any[] = []


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

    this.gameRef.drawLoading('Music', .5)
    this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.activeSound.playing = false
  }

  initialize() {

    this.gameRef.basedObjectRefs.gameOptions = {
      mode: 'standard'
    }
    this.gameRef.cameraZoom = 1

    this.rackBalls()

    this.startButton = new BasedButton({
      key: `start-button`,
      gameRef: this.gameRef,
    })
    this.startButton.fillColor = 'red'
    this.startButton.hoverColor = '#473B2D'
    this.startButton.focusColor = '#FFA500'
    this.startButton.textColor = 'white'
    this.startButton.enableFillColorTransition = true
    this.startButton.fillColorStart = {
      r: 255,
      g: 0,
      b: 0,
      a: 1
    }
    this.startButton.fillColorEnd = {
      r: 255,
      g: 165,
      b: 0,
      a: 1
    }
    this.startButton.x = 100
    this.startButton.y = this.gameRef.gameHeight - 280
    this.startButton.buttonText = 'Play'
    this.startButton.width = this.gameRef.gameWidth - 200
    this.startButton.clickFunction = () => {
      this.gameRef.loadLevel('standard-level')
    }

    this.buttonGroup = []

    const modeText: { [v: string]: string } = {
      '9ball': 'Nine-Ball Mode',
      'standard': 'Eight-Ball Mode',
    }
    this.gameModeButton = new BasedButton({
      key: `game-mode-button`,
      gameRef: this.gameRef,
    })
    this.gameModeButton.fillColor = '#0D6F45'
    this.gameModeButton.hoverColor = '#473B2D'
    this.gameModeButton.focusColor = '#473B2D'
    this.gameModeButton.textColor = 'white'
    this.gameModeButton.x = 100
    this.gameModeButton.y = this.gameRef.gameHeight - 200
    this.gameModeButton.buttonText = modeText[this.gameRef.basedObjectRefs.gameOptions.mode]
    this.gameModeButton.width = this.gameRef.gameWidth - 200
    this.gameModeButton.height = 50
    this.gameModeButton.clickFunction = () => {
      this.gameRef.basedObjectRefs.gameOptions.mode = this.gameRef.basedObjectRefs.gameOptions.mode === 'standard' ? '9ball' : 'standard'
      this.gameModeButton.buttonText = modeText[this.gameRef.basedObjectRefs.gameOptions.mode]
      this.rackBalls()
    }
    this.buttonGroup.push(this.gameModeButton)

    // CREDITS BUTTON
    this.creditsButton = new BasedButton({
      key: `credits-button`,
      gameRef: this.gameRef,
    })
    this.creditsButton.fillColor = '#0D6F45'
    this.creditsButton.hoverColor = '#473B2D'
    this.creditsButton.focusColor = '#473B2D'
    this.creditsButton.x = 100
    this.creditsButton.y = this.gameRef.gameHeight - 135
    this.creditsButton.buttonText = 'Credits'
    this.creditsButton.width = this.gameRef.gameWidth - 200
    this.creditsButton.height = 50
    this.creditsButton.clickFunction = () => {
      // this.gameRef.loadLevel('credits-screen')
      // alert('code in level')
    }
    this.buttonGroup.push(this.creditsButton)

    // SOUND BUTTON
    this.soundButton = new BasedButton({
      key: `sound-button`,
      gameRef: this.gameRef,
    })
    this.soundButton.fillColor = '#0D6F45'
    this.soundButton.hoverColor = '#473B2D'
    this.soundButton.focusColor = '#473B2D'
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

    this.onResize()

    this.levelLoadedTime = this.gameRef.lastUpdate
  }

  rackBalls() {
    const ballLayout = this.gameRef.basedObjectRefs.gameOptions.mode === 'standard' ? Ball_Layout_15 : Ball_Layout_9
    this.balls = (new Array(ballLayout.length)).fill(0).map((x, idx) => {
      const tempBody: BilliardBall = new BilliardBall({ key: `ball-${idx}`, gameRef: this.gameRef })
      tempBody.ballNumber = `${ballLayout[idx].number}`
      tempBody.radius = this.ballSize
      tempBody.x = 340 + (this.ballSize * 2) * (ballLayout[idx].x) + this.ballSize * (ballLayout[idx].y % 2)
      tempBody.y = 200 + (this.ballSize * 2) * (ballLayout[idx].y)
      tempBody.color = ballLayout[idx].color
      tempBody.ballType = ballLayout[idx].type
      // tempBody.color = `rgba(${idx/15 * 100 + 100},${200 - idx/15 * 100},${idx/15 * 100 + 100},1)`
      tempBody.onCollisionStart = (otherBody: any) => {
        // if (otherBody.label === 'ball' || otherBody.label === 'cue') {
        //   const hitForce = Math.abs(otherBody.angularVelocity)
        //   if (hitForce > 0.03) {
        //     this.gameRef.shakeCamera()
        //   }
        //   if (hitForce > 0.004) {
        //     this.gameRef.soundPlayer.playSound(this.ballsHiting)
        //   }
        // }
      }
      tempBody.initialize()
      // this.addToWorld(tempBody.body)
      tempBody.active = true
      return tempBody
    })
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
      this.gameModeButton.update()
      this.soundButton.update()
      this.creditsButton.update()
    }
    if (this.balls.length > 0) {
      const camFocus = {
        x: this.balls[this.balls.length - 1].body.position.x,
        y: this.balls[this.balls.length - 1].body.position.y + 10,
      }
      this.gameRef.updateCamera(camFocus, false)
    }
  }

  updateBg() { }

  onResize() {
    const heightOffset = (this.gameRef.gameHeight >= 400 ? 20 : 10)
    this.buttonGroup.forEach((x,i) => {
      x.width = this.gameRef.gameWidth - 200
      x.height = this.gameRef.gameHeight >= 400 ? 50 : 30
      x.y = this.gameRef.gameHeight - (this.buttonGroup.length - i) * (x.height + heightOffset)
    })

    this.startButton.y = this.buttonGroup[0].y - this.startButton.height - heightOffset*2
    this.startButton.width = this.gameRef.gameWidth - 200
  }

  drawBg() {
    this.balls.forEach(b => {
      if (b.active) {
        b.drawShadows()
      }
    })
    this.balls.forEach(b => {
      if (b.active) {
        b.draw()
      }
    })
  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#0B0A09'
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
      fontSize: 40,
      text: 'POOLIARDS'
    })

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
      fontSize: 40,
      text: 'POOLIARDS'
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
    if (this.activeSound.playing && this.activeSound.soundRef) {
      this.activeSound.soundRef.stop()
    }
  }
}
