import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";
import { angleBetween, degToRad, normalizeVector, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { createSprite, drawBox, drawCircle, drawImage, drawLine, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import PhysPoly from "../entities/PhysPoly";
import { boxCollision } from "../../../engine/libs/collisionHelpers";
import PoolBreak from '../../../assets/pool/pool-break-1.mp3'
import BallsHitting from '../../../assets/pool/balls-hitting-2.mp3'
import BallInPocket from '../../../assets/pool/ball-in-pocket.mp3'
import BallRailBounce from '../../../assets/pool/ball-rail-bounce-1.mp3'
import { TouchKnob } from "../../../engine/controls/TouchKnob";
import { ShotTarget } from "../entities/ShotTarget";
import { BasedButton } from "../../../engine/BasedButton";
import { PowerBar } from "../ui/PowerBar";
import TextContainer from "../ui/TextContainer";
import BilliardBall from "../entities/BilliardBall";
import { getTimeStamp } from "../../../engine/libs/interfaceHelpers";
import { Ball_Layout_15, Ball_Layout_9, Standard_Bounce_Pads, Standard_Level, Standard_Pockets } from "../constants/levelConstants";
import BgMusic from '../../../assets/pool/music/Twin-Musicom-64-Sundays.mp3'
import LoseMusic from '../../../assets/pool/music/Monplaisir_-_12_-_Weird_serious_jingle_of_death.mp3'
import FeltSpriteUrl from '../../../assets/pool/pool-felt.jpg'
import TableTopSpriteUrl from '../../../assets/pool/table-top.png'
import PoolStickSpriteUrl from '../../../assets/pool/pool-stick.png'
import { SliderControl } from "../../../engine/controls/SliderControl";

export class StandardLevel extends BasedLevel {
  physics: any
  level: any[] = [];
  levelColor = '#402118'//'#222'
  levelDecor: any[] = [
    { x: 80, y: 80, w: 640, h: 25, c: this.levelColor },
    { x: 80, y: 80, w: 25, h: 840, c: this.levelColor },
    { x: 695, y: 80, w: 25, h: 840, c: this.levelColor },
    { x: 80, y: 895, w: 640, h: 25, c: this.levelColor },
  ];

  lastPhysicsUpdate: number = 0;
  physicsRate: number = 1000 / 60

  // SOUNDS
  ballHit: any
  ballsHiting: any
  ballInPocket: any
  ballRailBounce: any

  // MUSIC
  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;
  loseSong: any;

  ballA: any
  lastShot: number = 0
  // ground: any
  sensor: any
  itemRef: any = {}
  balls: any[] = []
  ballSize: number = 15;
  activeBalls: number = 0;

  pockets: any[] = []
  pocketSize: number = 30

  bouncePads: any[] = [];

  levelWidth: number = 800
  levelHeight: number = 1000

  levelBounds: any = {
    x: 0,
    y: 0,
    w: 800,
    h: 1000
  }

  freeCam: XYCoordinateType = {
    x: 0,
    y: 0
  }

  cameraShake: XYCoordinateType = {
    x: 0,
    y: 0
  }
  shakeCount: number = 0
  shakeAmount: number = 0

  lastCamMove: number = 0
  cameraFocus: any = 'cue'
  gameZoom: number = 1

  fastestBall: any = null

  // Interface stuff
  sliderControl: any;
  moveKnob: any;
  shootButton: any;
  aimTarget: any;
  powerMeter: any;
  powerGain: number = 2;
  phase: string = 'aim';
  activeAim: boolean = false;

  miniMapButton: any;

  miniMapActive: boolean = true;
  // scaleFactor: number = 1;

  textBox: any;

  // GRAPHICS RELATED
  poolFeltSprite: any;
  tableTopSprite: any;
  poolStickSprite: any;

  // SCORE RELATED STUFF
  startTime: number = 0
  winTime: number = 0
  gameState: string = 'playing'

  toastMessages: { text: string, duration: number }[] = []

  async preload() {
    this.gameRef.drawLoading('Pool Break', .1)
    this.ballHit = await this.gameRef.soundPlayer.loadSound(PoolBreak)
    this.gameRef.drawLoading('Ball Noises', .2)
    this.ballsHiting = await this.gameRef.soundPlayer.loadSound(BallsHitting)
    this.gameRef.drawLoading('Pocket Noises', .3)
    this.ballInPocket = await this.gameRef.soundPlayer.loadSound(BallInPocket)
    this.gameRef.drawLoading('Rail Bounces', .4)
    this.ballRailBounce = await this.gameRef.soundPlayer.loadSound(BallRailBounce)

    this.gameRef.drawLoading('Snazzy Music', .6)
    this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.gameRef.drawLoading('The Pool Hall', .7)
    this.loseSong = await this.gameRef.soundPlayer.loadSound(LoseMusic)
    this.activeSound.playing = false

    this.gameRef.drawLoading('Turning on Lights', .8)
    // SETUP DIFFERENT SPRITES AND ADD THEM TO VARIABLES
    this.poolFeltSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: FeltSpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: 800,
      sHeight: 1000,
      dx: 0,
      dy: 0,
      dWidth: 800,
      dHeight: 1000,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })

    this.poolStickSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: PoolStickSpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: 25,
      sHeight: 450,
      dx: 0,
      dy: 0,
      dWidth: 25,
      dHeight: 450,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })

    this.gameRef.drawLoading('Racking Balls', .8)
    this.tableTopSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: TableTopSpriteUrl,
      sx: 0,
      sy: 0,
      sWidth: 800,
      sHeight: 1000,
      dx: 0,
      dy: 0,
      dWidth: 800,
      dHeight: 1000,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })

  }

  initialize() {
    this.gameState = 'playing'

    // this.physics = Physics.Engine.create({
    //   constraintIterations: 10
    // })
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0

    this.bouncePads = Standard_Bounce_Pads.map((spec, idx) => {
      const tempPad = new PhysPoly({ key: `bouncePad-${idx}`, gameRef: this.gameRef })
      tempPad.x = spec.x
      tempPad.y = spec.y
      tempPad.color = '#333'
      tempPad.angle = spec.a
      tempPad.vertices = spec.v
      tempPad.bodyOptions = { label: 'bouncePadA', isStatic: true }
      tempPad.onCollisionStart = (otherBody: any) => {
        if (otherBody.label === 'ball' || otherBody.label === 'cue') {
          this.gameRef.soundPlayer.playSound(this.ballRailBounce)
        }
      }
      tempPad.initialize()
      Physics.Body.setPosition(tempPad.body, { x: tempPad.x, y: tempPad.y })
      Physics.Body.setAngle(tempPad.body, degToRad(tempPad.angle))
      this.addToWorld(tempPad.body)
      return tempPad
    })

    this.ballA = new PhysBall({ key: 'ballA', gameRef: this.gameRef })
    this.ballA.x = 400
    this.ballA.y = 700
    this.ballA.radius = this.ballSize
    this.ballA.bodyOptions.label = 'cue'
    this.ballA.color = 'white'
    this.ballA.onCollisionStart = (otherBody: any) => {
      if (otherBody.label === 'ball') {
        const hitForce = Math.abs(otherBody.angularVelocity)
        if (hitForce > 0.03) {
          this.shakeCamera()
        }
        if (hitForce > 0.004) {
          this.gameRef.soundPlayer.playSound(this.ballsHiting)
        }

      }
    }
    this.ballA.initialize()
    this.addToWorld(this.ballA.body)

    this.pockets = Standard_Pockets.map((spec, idx) => {
      const tempPocket: PhysBall = new PhysBall({ key: `pocket${idx}`, gameRef: this.gameRef })
      tempPocket.x = spec.x
      tempPocket.y = spec.y
      tempPocket.radius = this.pocketSize - 10
      // tempPocket.radius = this.pocketSize - 5
      tempPocket.color = 'black'
      tempPocket.onCollisionStart = (otherBody: any) => {
        console.log(otherBody)
        if (otherBody.label === 'ball') {
          this.addToast('Ball Sunk!')
          this.gameRef.soundPlayer.playSound(this.ballInPocket)
          Physics.Body.setVelocity(otherBody, { x: 0, y: 0 })
          this.shakeCamera()
          this.removeFromWorld(otherBody)
          this.balls.forEach(ball => {
            if (ball.body.id === otherBody.id) {
              ball.active = false
            }
          })
        }
        if (otherBody.label === 'cue') {
          this.gameRef.soundPlayer.playSound(this.ballInPocket)
          this.ballA.active = false
          this.removeFromWorld(otherBody)
          Physics.Body.setPosition(otherBody, { x: 400, y: 700 })
          Physics.Body.setVelocity(otherBody, { x: 0, y: 0 })
          this.shakeCamera()
          this.cameraFocus = 'cue'
          // if (this.textBox) {
          //   this.textBox.setText('You Scratched!')
          //   this.textBox.closeFunction = () => {
          //     this.lastShot = this.gameRef.lastUpdate
          //   }
          //   this.textBox.active = true
          // }
          this.addToast('Scratched!')
        }
      }
      tempPocket.bodyOptions = { label: 'hole', isStatic: true, isSensor: true }
      tempPocket.initialize()
      tempPocket.radius = this.pocketSize
      this.addToWorld(tempPocket.body)
      return tempPocket
    })

    this.level = Standard_Level.map((spec, idx) => {
      const tempBody = new PhysBox({ key: `box${idx}`, gameRef: this.gameRef })
      tempBody.x = spec.x
      tempBody.y = spec.y
      tempBody.width = spec.w
      tempBody.height = spec.h
      tempBody.bodyOptions = spec.o
      tempBody.color = this.levelColor
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      return tempBody
    })

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
        if (otherBody.label === 'ball' || otherBody.label === 'cue') {
          const hitForce = Math.abs(otherBody.angularVelocity)
          if (hitForce > 0.03) {
            this.shakeCamera()
          }
          if (hitForce > 0.004) {
            this.gameRef.soundPlayer.playSound(this.ballsHiting)
          }
        }
      }
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      tempBody.active = true
      return tempBody
    })

    Physics.Events.on(this.physics, 'collisionStart', (event: any) => {
      event.pairs.map((pair: any) => {
        const { bodyA, bodyB } = pair
        bodyA.plugin.collisionStart(bodyB)
        bodyB.plugin.collisionStart(bodyA)
      })
    })
    Physics.Events.on(this.physics, 'collisionEnd', (event: any) => {
      event.pairs.map((pair: any) => {
        const { bodyA, bodyB } = pair
        bodyA.plugin.collisionEnd(bodyB)
        bodyB.plugin.collisionEnd(bodyA)
      })
    })

    // UI
    this.shootButton = new BasedButton({
      key: `shoot-button`,
      gameRef: this.gameRef,
    })
    this.shootButton.fillColor = 'red'
    this.shootButton.hoverColor = 'black'
    this.shootButton.textColor = 'white'
    this.shootButton.buttonText = 'SHOOT'
    this.shootButton.height = 50
    this.shootButton.width = 80
    this.shootButton.x = 30
    this.shootButton.y = this.gameRef.gameHeight - 80
    this.shootButton.clickFunction = () => {
      this.shootBall()
    }
    this.shootButton.holdFunction = () => {
      this.chargeBall()
    }

    this.miniMapButton = new BasedButton({ key: 'mini-map-button', gameRef: this.gameRef })
    this.miniMapButton.fillColor = 'rgba(0,0,0,0.5)'
    this.miniMapButton.hoverColor = 'black'
    this.miniMapButton.textColor = 'white'
    this.miniMapButton.buttonText = 'Zoom In'
    this.miniMapButton.height = 25
    this.miniMapButton.width = 105
    this.miniMapButton.x = this.gameRef.gameWidth - 125
    this.miniMapButton.y = 20
    this.miniMapButton.clickFunction = () => {
      this.miniMapActive = !this.miniMapActive
      this.lastShot = this.gameRef.lastUpdate
      if (!this.miniMapActive) {
        this.miniMapButton.buttonText = 'View Table'
        if (this.aimTarget.active) {
          this.freeCam.x = this.aimTarget.x
          this.freeCam.y = this.aimTarget.y
          this.cameraFocus = 'freeCam'
        } else {
          this.cameraFocus = 'cue'
        }
      } else {
        this.miniMapButton.buttonText = 'Zoom In'
      }
    }

    this.sliderControl = new SliderControl({ key: 'slider-control', gameRef: this.gameRef })
    this.sliderControl.direction = 'vertical'
    this.sliderControl.width = 10
    this.sliderControl.height = 100
    this.sliderControl.btnWidth = 10
    this.sliderControl.btnHeight = 10
    this.sliderControl.btnColor = 'rgb(0,0,0,0)'
    this.sliderControl.x = this.gameRef.gameWidth - 20
    this.sliderControl.y = this.gameRef.gameHeight / 2
    this.sliderControl.tickFunction = () => {
      this.lastShot = this.gameRef.lastUpdate
    }
    this.sliderControl.initialize()

    this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
    this.moveKnob.height = 160
    this.moveKnob.width = 160
    this.positionKnobs()

    this.aimTarget = new ShotTarget({ key: 'aim-target', gameRef: this.gameRef })

    this.freeCam.x = this.balls[this.balls.length - 1].body.position.x
    this.freeCam.y = this.balls[this.balls.length - 1].body.position.y
    this.cameraFocus = 'free'

    this.powerMeter = new PowerBar({ key: 'power-meter', gameRef: this.gameRef })
    this.powerMeter.x = this.gameRef.gameWidth / 2
    this.powerMeter.y = 37.5;
    this.powerMeter.height = 10;


    this.lastShot = this.gameRef.lastUpdate
    this.phase = 'aim'

    this.textBox = new TextContainer({ key: 'text-container', gameRef: this.gameRef })
    this.textBox.setText('Sally sells seashells by the seashore, she also likes superlongwordthatshouldbebrokenupbecauseitiswaytoolongtofitononeline to go out whoring at night')
    this.textBox.y = 80
    this.textBox.x = 80
    this.textBox.active = false
    this.textBox.closeFunction = () => { }
    this.textBox.fontFillColor = 'white'
    this.textBox.fontStrokeColor = 'black'
    this.textBox.containerFillColor = 'black'
    this.textBox.containerBorderColor = 'black'
    this.textBox.initialize()

    // SCORE INITIALIZATION
    this.startTime = this.gameRef.lastUpdate
    this.winTime = 0
  }

  checkGame() {
    const cueBox = {
      x: this.ballA.body.position.x - this.ballSize,
      y: this.ballA.body.position.y - this.ballSize,
      w: this.ballSize * 2,
      h: this.ballSize * 2
    }
    if (!boxCollision(cueBox, this.levelBounds)) {
      console.log(this.ballA.body)
      Physics.Body.setPosition(this.ballA.body, { x: 400, y: 700 })
      Physics.Body.setVelocity(this.ballA.body, { x: 0, y: 0 })
    }
    this.activeBalls = 0
    this.fastestBall = this.ballA.active && Math.abs(this.ballA.body.angularVelocity) > 0.001 ? this.ballA : null
    let eightBallSunk = false
    this.balls.map(x => {
      if (x.active) {
        this.activeBalls++
        const ballSpeed = Math.abs(x.body.angularVelocity)
        if (!this.fastestBall && ballSpeed > 0.001) {
          this.fastestBall = x
        } else if (this.fastestBall && ballSpeed > Math.abs(this.fastestBall.angularVelocity)) {
          this.fastestBall = x
        }
      } else if (x.ballNumber === '8') {
        eightBallSunk = true
      }
    })
    if (!this.ballA.active && !this.fastestBall) {
      this.addToWorld(this.ballA.body)
      Physics.Body.setPosition(this.ballA.body, { x: 400, y: 700 })
      Physics.Body.setVelocity(this.ballA.body, { x: 0, y: 0 })
      this.ballA.active = true
    }
    if (this.activeBalls === 0) {
      // win condition
      if (this.winTime === 0) {
        this.winTime = this.gameRef.lastUpdate - this.startTime
      }
      this.textBox.setText(`Congratulations, You win! Your time was: ${getTimeStamp(this.winTime)}`)
      this.textBox.closeFunction = () => {
        this.gameRef.loadLevel('start-screen')
      }
      this.textBox.active = true
    } else if (eightBallSunk) {
      // lose condition
      if (this.gameState !== 'lose') {
        this.activeSound.soundRef.stop()
      }
      this.gameState = 'lose'
      this.textBox.setText('You lose!')

      this.textBox.closeFunction = () => {
        this.gameRef.loadLevel('start-screen')
      }
      this.textBox.active = true
    }
  }

  handleKeys() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = 10

    let moveX = 0
    let moveY = 0

    if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
      moveX -= speedFactor
    }
    if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
      moveX += speedFactor
    }
    if ((pressedKeys['KeyW'] || pressedKeys['ArrowUp'])) {
      moveY -= speedFactor
    }
    if ((pressedKeys['KeyS'] || pressedKeys['ArrowDown'])) {
      moveY += speedFactor
    }
    if (pressedKeys['KeyX']) {
      this.shootBall()
    }

    this.textBox.update()
    if (this.textBox.active) {
      return
    }

    if (!this.activeAim) {
      this.shootButton.update()
      // this.moveKnob.update()
      this.miniMapButton.update()
      this.sliderControl.update()
    }

    if (this.phase === 'power') {
      const ticked = this.powerMeter.tick(this.powerGain)
      if (ticked) {
        this.powerGain = this.powerMeter.current === this.powerMeter.max ? -Math.abs(this.powerGain) : this.powerMeter.current === 0 ? Math.abs(this.powerGain) : this.powerGain
      }
    }

    if (this.moveKnob.knobActive) {
      moveX += (this.moveKnob.knobCoord.x / this.moveKnob.maxOffset) * speedFactor
      moveY += (this.moveKnob.knobCoord.y / this.moveKnob.maxOffset) * speedFactor
    }

    if (!this.fastestBall && this.ballA.active && !this.sliderControl.hovered && !this.moveKnob.knobActive && !this.shootButton.hovered && !this.miniMapButton.hovered &&
      this.gameRef.mouseInfo.mouseDown && this.lastShot + 300 < this.gameRef.lastUpdate) {

      this.aimTarget.setTarget({
        x: (this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x) / this.gameRef.cameraZoom,
        y: (this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y) / this.gameRef.cameraZoom
      })

      if (this.gameRef.mouseInfo.x < 40) {
        moveX -= speedFactor
      }
      if (this.gameRef.mouseInfo.x > this.gameRef.gameWidth - 40) {
        moveX += speedFactor
      }
      if (this.gameRef.mouseInfo.y < 40) {
        moveY -= speedFactor
      }
      if (this.gameRef.mouseInfo.y > this.gameRef.gameHeight - 40) {
        moveY += speedFactor
      }
      // }

      this.activeAim = true
    } else {
      this.activeAim = false
    }

    if ((Math.abs(moveX) || Math.abs(moveY))) {
      if (this.cameraFocus !== 'free') {
        this.freeCam = {
          x: this.ballA.body.position.x,
          y: this.ballA.body.position.y
        }
        this.cameraFocus = 'free'
      }
      this.freeCam.x += moveX * this.gameRef.diffMulti
      if (this.freeCam.x < 0) this.freeCam.x = 0
      if (this.freeCam.x > this.levelWidth) this.freeCam.x = this.levelWidth
      this.freeCam.y += moveY * this.gameRef.diffMulti
      if (this.freeCam.y < 0) this.freeCam.y = 0
      if (this.freeCam.y > this.levelHeight) this.freeCam.y = this.levelHeight

      this.lastCamMove = this.gameRef.lastUpdate
      // console.log(this.freeCam)
    } else if (this.cameraFocus === 'free' && this.lastCamMove + 10000 < this.gameRef.lastUpdate) {
      if (this.freeCam.x < this.ballA.body.position.x - 1) this.freeCam.x += 1 * this.gameRef.diffMulti
      if (this.freeCam.x > this.ballA.body.position.x + 1) this.freeCam.x -= 1 * this.gameRef.diffMulti

      if (this.freeCam.y < this.ballA.body.position.y - 1) this.freeCam.y += 1 * this.gameRef.diffMulti
      if (this.freeCam.y > this.ballA.body.position.y + 1) this.freeCam.y -= 1 * this.gameRef.diffMulti
    }
  }

  chargeBall() {
    if (!this.moveKnob.knobActive && this.aimTarget.active && this.lastShot + 300 < this.gameRef.lastUpdate) {
      if (this.phase === 'aim') {
        this.powerMeter.current = 1
        this.powerMeter.powerGain = Math.abs(this.powerGain)
        this.lastShot = this.gameRef.lastUpdate
        this.phase = 'power'
      }
    }
  }

  shootBall() {
    if (!this.moveKnob.knobActive && this.aimTarget.active && this.lastShot + 300 < this.gameRef.lastUpdate) {
      if (this.phase === 'aim') {
        this.powerMeter.current = 1
        this.powerMeter.powerGain = Math.abs(this.powerGain)
        this.lastShot = this.gameRef.lastUpdate
        this.phase = 'power'
      } else {
        const forceAmount = .03
        const nv = normalizeVector({
          x: this.aimTarget.x - this.ballA.body.position.x,
          y: this.aimTarget.y - this.ballA.body.position.y
        }, forceAmount * this.powerMeter.current / this.powerMeter.max)
        Physics.Body.applyForce(this.ballA.body, this.ballA.body.position, nv)
        // Physics.Body.setVelocity(this.ballA.body, nv)
        this.gameRef.soundPlayer.playSound(this.ballHit)
        this.lastShot = this.gameRef.lastUpdate
        this.cameraFocus = 'cue'
        this.aimTarget.clearTarget()
        this.phase = 'aim'
        this.shakeCamera(100)
      }
    }
  }

  addToWorld(bodyRef: any) {
    Physics.Composite.add(this.physics.world, bodyRef)
  }

  removeFromWorld(bodyRef: any) {
    Physics.Composite.remove(this.physics.world, bodyRef)
  }

  update() {
    this.handleSounds()
    this.handleKeys()
    this.handlePhysics()
    this.updateCamera()
    this.checkGame()
    this.handleToasts()
  }

  handleSounds() {
    if (!this.gameRef.soundPlayer.enabled) { return }
    if (this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.gameState === 'lose' ? this.loseSong : this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }

  handlePhysics() {
    if (this.gameRef.fps < 65) {
      const tick = (this.physicsRate / this.gameRef.updateDiff) * this.gameRef.updateDiff
      Physics.Engine.update(this.physics, tick)
      // Physics.Engine.update(this.physics, this.gameRef.updateDiff)
      this.balls.map(x => {
        x.updateRollOffset()
      })
      this.lastPhysicsUpdate = this.gameRef.lastUpdate
    } else {
      if (this.gameRef.lastUpdate - this.lastPhysicsUpdate >= this.physicsRate) {
        Physics.Engine.update(this.physics, this.gameRef.lastUpdate - this.lastPhysicsUpdate)
        this.lastPhysicsUpdate = this.gameRef.lastUpdate
        this.balls.map(x => {
          x.updateRollOffset()
        })
      }
    }
  }

  addToast(text: string, duration: number = 2000) {
    this.toastMessages.push({
      text: text,
      duration: duration,
    })
  }

  handleToasts() {
    if (this.toastMessages.length > 0) {
      this.toastMessages = this.toastMessages.map(x => {
        return {
          ...x,
          duration: x.duration - this.gameRef.updateDiff
        }
      }).filter(x => {
        return x.duration > 0
      })
    }
  }

  shakeCamera(amount: number = 50) {
    this.shakeCount = amount
  }

  handleCameraShake() {
    if (this.shakeCount <= 0) {
      this.cameraShake.x = 0
      this.cameraShake.y = 0
      this.shakeCount = 0
    } else {
      this.cameraShake.x = this.cameraShake.x ? -this.cameraShake.x : 2
      this.cameraShake.y = this.cameraShake.y ? -this.cameraShake.y : 2
      this.shakeCamera(this.shakeCount - this.gameRef.updateDiff)
    }
  }

  updateCamera() {

    this.handleCameraShake()
    const camShakeAmount = {
      x: this.shakeCount ? this.cameraShake.x : 0,
      y: this.shakeCount ? this.cameraShake.y : 0
    }

    if (this.miniMapActive || !this.ballA.active) {
      if (this.gameRef.gameWidth > this.gameRef.gameHeight) {
        this.gameRef.cameraZoom = this.gameRef.gameHeight / this.levelBounds.h
      } else {
        this.gameRef.cameraZoom = this.gameRef.gameWidth / this.levelBounds.w
      }
      this.gameRef.cameraPos = {
        x: this.gameRef.gameWidth / 2 - (this.levelBounds.w / 2 * this.gameRef.cameraZoom) + camShakeAmount.x,
        y: this.gameRef.gameHeight / 2 - (this.levelBounds.h / 2 * this.gameRef.cameraZoom) + camShakeAmount.y
      }
      return
    }

    this.gameRef.cameraZoom = this.sliderControl.value
    // this.gameRef.cameraZoom = this.gameZoom

    const cameraTarget = this.cameraFocus === 'cue' ? this.ballA.body.position : this.freeCam
    this.gameRef.cameraPos = {
      x: this.gameRef.gameWidth / 2 - (cameraTarget.x * this.gameRef.cameraZoom),
      y: this.gameRef.gameHeight / 2 - (cameraTarget.y * this.gameRef.cameraZoom)
    }
    // Camera X position
    if (this.gameRef.gameWidth < this.levelWidth * this.gameRef.cameraZoom) {
      if (this.gameRef.cameraPos.x > 0) {
        this.gameRef.cameraPos.x = 0
      }
      if (this.gameRef.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * this.gameRef.cameraZoom * -1) {
        this.gameRef.cameraPos.x = -(this.levelWidth * this.gameRef.cameraZoom - this.gameRef.gameWidth)
      }
    } else {
      this.gameRef.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth * this.gameRef.cameraZoom) / 2
    }
    // Camera Y Position
    if (this.gameRef.gameHeight < this.levelHeight * this.gameRef.cameraZoom) {
      if (this.gameRef.cameraPos.y > 0) {
        this.gameRef.cameraPos.y = 0
      }
      if (this.gameRef.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1 * this.gameRef.cameraZoom) {
        this.gameRef.cameraPos.y = -(this.levelHeight * this.gameRef.cameraZoom - this.gameRef.gameHeight)
      }
    } else {
      this.gameRef.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight * this.gameRef.cameraZoom) / 2
    }
    this.gameRef.cameraPos.x += camShakeAmount.x
    this.gameRef.cameraPos.y += camShakeAmount.y
  }

  positionKnobs() {
    this.shootButton.y = this.gameRef.gameHeight - 80

    this.miniMapButton.x = this.gameRef.gameWidth - 125

    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
    this.moveKnob.x = this.gameRef.gameWidth - this.moveKnob.width
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.sliderControl.x = this.gameRef.gameWidth - 30
    this.sliderControl.y = this.gameRef.gameHeight / 2
    this.sliderControl.onResize()
  }

  onResize() {
    this.positionKnobs()
    this.textBox.onResize()
    this.powerMeter.x = this.gameRef.gameWidth / 2
  }

  drawBg() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#4d204e'
    this.gameRef.ctx.fill()
  }

  drawLevel() {

    // drawBox({
    //   c: this.gameRef.ctx,
    //   x: 0 + this.gameRef.cameraPos.x,
    //   y: 0 + this.gameRef.cameraPos.y,
    //   width: this.levelBounds.w * this.gameRef.cameraZoom,
    //   height: this.levelBounds.h * this.gameRef.cameraZoom,
    //   fillColor: '#0c6640' // '#777'
    // })
    //
    // this.level.forEach(b => {
    //   b.draw()
    // })
    //
    // this.levelDecor.forEach(b => {
    //   drawBox({
    //     c: this.gameRef.ctx,
    //     x: b.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
    //     y: b.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
    //     width: b.w * this.gameRef.cameraZoom,
    //     height: b.h * this.gameRef.cameraZoom,
    //     fillColor: '#333'
    //   })
    // })

    // Green Felt
    drawImage({
      ...this.poolFeltSprite,
      dx: 0 + this.gameRef.cameraPos.x,
      dy: 0 + this.gameRef.cameraPos.y,
      dWidth: this.levelBounds.w * this.gameRef.cameraZoom,
      dHeight: this.levelBounds.h * this.gameRef.cameraZoom
    })

    this.pockets.forEach(b => {
      b.draw()
    })

    if (this.ballA.active) {
      this.ballA.drawShadows()
    }
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

    // this.bouncePads.forEach(b => {
    //   b.draw()
    // })

    // TABLE TOP
    drawImage({
      ...this.tableTopSprite,
      dx: 0 + this.gameRef.cameraPos.x,
      dy: 0 + this.gameRef.cameraPos.y,
      dWidth: this.levelBounds.w * this.gameRef.cameraZoom,
      dHeight: this.levelBounds.h * this.gameRef.cameraZoom
    })

    if (this.aimTarget.active) {
      drawLine({
        c: this.gameRef.ctx,
        x: this.ballA.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.ballA.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        toX: this.aimTarget.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        toY: this.aimTarget.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        strokeColor: 'red',
        strokeWidth: 1
      })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.ballA.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.ballA.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        a: angleBetween(this.ballA.body.position, this.aimTarget, true) + 90,
      }, () => {
        const powerOffset = this.powerMeter.current / this.powerMeter.max
        const powerOffsetDistance = 60 * powerOffset
        drawImage({
          ...this.poolStickSprite,
          dx: (-25 * this.gameRef.cameraZoom) / 2,
          dy: (20 + powerOffsetDistance) * this.gameRef.cameraZoom,
          dWidth: 25 * this.gameRef.cameraZoom,
          dHeight: 450 * this.gameRef.cameraZoom
        })
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: this.aimTarget.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.aimTarget.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        radius: this.aimTarget.radius * this.gameRef.cameraZoom,
        fillColor: 'red'
      })
    }
    if (this.ballA.active) {
      this.ballA.draw()
    }
  }

  drawInterface() {
    if (!this.activeAim && !this.miniMapActive) {
      // this.moveKnob.draw()
      this.sliderControl.draw()
    }
    if (!this.activeAim) {
      this.miniMapButton.draw()
      if (this.aimTarget.active) {
        this.shootButton.draw()
      }
    }
    if (this.phase === 'power') {
      this.powerMeter.draw()
    } else {
      drawText({
        c: this.gameRef.ctx,
        x: 20,
        y: 30,
        // y: this.gameRef.gameHeight - 80,
        align: 'left',
        fontSize: 16,
        fontFamily: 'sans-serif',
        fillColor: '#fff',
        text: `BALLS: ${this.activeBalls}`
      })

      drawText({
        c: this.gameRef.ctx,
        x: 20,
        y: 50,
        // y: this.gameRef.gameHeight - 80,
        align: 'left',
        fontSize: 16,
        fontFamily: 'sans-serif',
        fillColor: '#fff',
        text: `TIME: ${getTimeStamp(this.gameRef.lastUpdate - this.startTime)}`
      })

      // const cameraTarget = this.cameraFocus === 'cue' ? this.ballA.body.position : this.freeCam
      // drawText({
      //   c: this.gameRef.ctx,
      //   x: 30,
      //   y: 80,
      //   align: 'left',
      //   fontSize: 16,
      //   fontFamily: 'sans-serif',
      //   fillColor: '#fff',
      //   text: `T: ${this.fastestBall ? this.fastestBall.body.angularVelocity : 'none'}`
      //   // text: `FPS: ${Math.round(this.gameRef.fps)}`
      // })
      // //
      // drawText({
      //   c: this.gameRef.ctx,
      //   x: 30,
      //   y: 100,
      //   align: 'left',
      //   fontSize: 16,
      //   fontFamily: 'sans-serif',
      //   fillColor: '#fff',
      //   // text: `T: ${this.cameraFocus}`
      //   // text: `T: ${Math.floor(this.gameRef.cameraPos.x)}, ${Math.floor(this.gameRef.cameraPos.y)}`
      //   text: `FPS: ${Math.round(this.gameRef.fps)}`
      // })

      if (this.fastestBall) {
        drawText({
          c: this.gameRef.ctx,
          x: this.gameRef.gameWidth / 2,
          y: this.gameRef.gameHeight / 2 + 50,
          align: 'center',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fillColor: 'rgba(255,255,255, 0.5)',
          text: `Balls in motion...`
          // text: `FPS: ${Math.round(this.gameRef.fps)}`
        })
      } else if (!this.aimTarget.active && this.gameRef.lastUpdate - 300 > this.lastShot) {
        drawText({
          c: this.gameRef.ctx,
          x: this.gameRef.gameWidth / 2 + 1,
          y: this.gameRef.gameHeight / 2 + 1 + 50,
          align: 'center',
          fontSize: 24,
          fontFamily: 'sans-serif',
          weight: 'bold',
          fillColor: '#000',
          text: `Take aim.`
          // text: `FPS: ${Math.round(this.gameRef.fps)}`
        })
        drawText({
          c: this.gameRef.ctx,
          x: this.gameRef.gameWidth / 2,
          y: this.gameRef.gameHeight / 2 + 50,
          align: 'center',
          fontSize: 24,
          fontFamily: 'sans-serif',
          weight: 'bold',
          fillColor: '#fff',
          text: `Take aim.`
          // text: `FPS: ${Math.round(this.gameRef.fps)}`
        })
      }
    }

    if (this.toastMessages.length) {
      this.toastMessages.forEach((toast, idx) => {
        const toastOpacity = toast.duration > 1000 ? 1 : toast.duration / 1000
        const toastOffset = toast.duration > 1000 ? 0 : ((1000 - toast.duration) / 1000) * 24
        drawText({
          c: this.gameRef.ctx,
          x: this.gameRef.gameWidth / 2 + 1,
          y: 200 + (idx * 24) + 1 - toastOffset,
          align: 'center',
          fontSize: 24,
          fontFamily: 'sans-serif',
          weight: 'bold',
          fillColor: `rgba(0,0,0,${toastOpacity})`,
          text: toast.text
        })
        drawText({
          c: this.gameRef.ctx,
          x: this.gameRef.gameWidth / 2,
          y: 200 + (idx * 24) - toastOffset,
          align: 'center',
          fontSize: 24,
          fontFamily: 'sans-serif',
          weight: 'bold',
          fillColor: `rgba(255,255,255,${toastOpacity})`,
          text: toast.text
        })
      })
    }
    this.textBox.draw()
  }

  draw() {
    this.drawBg()
    this.drawLevel()
    this.drawInterface()
  }

  tearDown() {
    if (this.activeSound.playing && this.activeSound.soundRef) {
      this.activeSound.soundRef.stop()
    }
  }

}
