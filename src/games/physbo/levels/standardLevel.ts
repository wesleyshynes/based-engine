import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";
import { degToRad, normalizeVector, radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { drawBox, drawCircle, drawLine, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
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


const generatePad = (width: number = 520, height: number = 50, chamfer: number = 30) => {
  return [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height/2},
    {x: width - chamfer, y: height},
    {x: chamfer, y: height},
    {x: 0, y: height/2},
  ]
}

export class StandardLevel extends BasedLevel {
  physics: any
  level: any[] = [];
  levelColor = '#222'
  levelDecor: any[] = [
    {x: 80, y: 80, w: 640, h: 25, c: this.levelColor},
    {x: 80, y: 80, w: 25, h: 840, c: this.levelColor},
    {x: 695, y: 80, w: 25, h: 840, c: this.levelColor},
    {x: 80, y: 895, w: 640, h: 25, c: this.levelColor},
  ];

  lastPhysicsUpdate: number = 0;
  physicsRate: number = 1000/60

  // SOUNDS
  ballHit: any
  ballsHiting: any
  ballInPocket: any
  ballRailBounce: any

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
  lastCamMove: number = 0
  cameraFocus: any = 'cue'

  // Interface stuff
  moveKnob: any;
  shootButton: any;
  aimTarget: any;
  powerMeter: any;
  powerGain: number = 1;
  phase: string = 'aim';
  activeAim: boolean = false;

  miniMapButton: any;

  miniMapActive: boolean = false;
  // scaleFactor: number = 1;

  textBox: any;

  async preload() {
    this.ballHit = await this.gameRef.soundPlayer.loadSound(PoolBreak)
    this.ballsHiting = await this.gameRef.soundPlayer.loadSound(BallsHitting)
    this.ballInPocket = await this.gameRef.soundPlayer.loadSound(BallInPocket)
    this.ballRailBounce = await this.gameRef.soundPlayer.loadSound(BallRailBounce)

    // SETUP DIFFERENT SPRITES AND ADD THEM TO VARIABLES
    // this.sprite = await createSprite({
    //   c: this.gameRef.ctx,
    //   sprite: MonkeySpriteUrl,
    //   sx: 0,
    //   sy: 0,
    //   sWidth: 56,
    //   sHeight: 56,
    //   dx: 0,
    //   dy: 0,
    //   dWidth: 56,
    //   dHeight: 56,
    //   frame: 0,
    //   lastUpdate: 0,
    //   updateDiff: 1000 / 60 * 10
    // })

  }

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0
    // console.log(this.physics)

    this.bouncePads = [
      {
        x: 140,
        y: 80,
        a: 0,
        v: generatePad(520, 50, 30)
      },
      {
        x: 660,
        y: 920,
        a: 180,
        v: generatePad(520, 50, 30)
      },
      {
        x: 720,
        y: 140,
        a: 90,
        v: generatePad(330, 50, 20)
      },
      {
        x: 720,
        y: 530,
        a: 90,
        v: generatePad(330, 50, 20)
      },
      {
        x: 80,
        y: 470,
        a: 270,
        v: generatePad(330, 50, 20)
      },
      {
        x: 80,
        y: 860,
        a: 270,
        v: generatePad(330, 50, 20)
      }
    ].map((spec, idx) => {
      const tempPad = new PhysPoly({key: `bouncePad-${idx}`, gameRef: this.gameRef})
      tempPad.x = spec.x
      tempPad.y = spec.y
      tempPad.color = '#333'
      tempPad.angle = spec.a
      tempPad.vertices = spec.v
      tempPad.bodyOptions = { label: 'bouncePadA', isStatic: true}
      tempPad.onCollisionStart = (otherBody: any) => {
        if(otherBody.label === 'ball' || otherBody.label === 'cue') {
          this.gameRef.soundPlayer.playSound(this.ballRailBounce)
        }
      }
      tempPad.initialize()
      Physics.Body.setPosition(tempPad.body, {x: tempPad.x, y: tempPad.y})
      Physics.Body.setAngle(tempPad.body, degToRad(tempPad.angle))
      this.addToWorld(tempPad.body)
      return tempPad
    })

    this.ballA = new PhysBall({key: 'ballA', gameRef: this.gameRef})
    this.ballA.x = 400
    this.ballA.y = 700
    this.ballA.radius = this.ballSize
    this.ballA.bodyOptions.label = 'cue'
    this.ballA.color = 'white'
    this.ballA.onCollisionStart = (otherBody: any) => {
      if(otherBody.label === 'ball') {
        if(Math.abs(otherBody.force.x) + Math.abs(otherBody.force.y) > .5) {
          this.gameRef.soundPlayer.playSound(this.ballsHiting)
        }
      }
    }
    this.ballA.initialize()
    this.addToWorld(this.ballA.body)

    this.pockets = [
      { x: 110, y: 110 },
      { x: 690, y: 110 },
      { x: 100, y: 500 },
      { x: 700, y: 500 },
      { x: 110, y: 890 },
      { x: 690, y: 890 },
    ].map((spec, idx) => {
      const tempPocket = new PhysBall({key: `pocket${idx}`, gameRef: this.gameRef})
      tempPocket.x = spec.x
      tempPocket.y = spec.y
      tempPocket.radius = this.pocketSize
      tempPocket.color = 'black'
      tempPocket.onCollisionStart = (otherBody: any) => {
        console.log(otherBody)
        if(otherBody.label === 'ball') {
          this.gameRef.soundPlayer.playSound(this.ballInPocket)
          this.removeFromWorld(otherBody)
          this.balls.forEach(ball => {
            if(ball.body.id === otherBody.id) {
              ball.active = false
            }
          })
        }
        if(otherBody.label === 'cue') {
          this.gameRef.soundPlayer.playSound(this.ballInPocket)
          Physics.Body.setPosition(otherBody, {x: 400, y: 700})
          Physics.Body.setVelocity(otherBody, {x:0, y: 0})
          this.cameraFocus = 'cue'
          if(this.textBox) {
            this.textBox.setText('You Scratched!')
            this.textBox.closeFunction = () => {
              this.lastShot = this.gameRef.lastUpdate
            }
            this.textBox.active = true
          }
        }
      }
      tempPocket.bodyOptions = {label: 'hole', isStatic: true, isSensor: true}
      tempPocket.initialize()
      this.addToWorld(tempPocket.body)
      return tempPocket
    })

    this.level = [
      // {x: 0, y: 380, w: 400, h: 160, c: 'red', o: { label: 'ground', isStatic: true}},
      {x: 400, y: 0, w: 960, h: 160, c: this.levelColor, o: { label: 'wallTop', isStatic: true}},
      {x: 0, y: 500, w: 160, h: 1000, c: this.levelColor, o: { label: 'wallLeft', isStatic: true}},
      {x: 800, y: 500, w: 160, h: 1000, c: this.levelColor, o: { label: 'wallRight', isStatic: true}},
      {x: 400, y: 1000, w: 960, h: 160, c: this.levelColor, o: { label: 'wallBottom', isStatic: true}},
      // {x: 400, y: 380, w: 400, h: 60, c: 'white', o: { label: 'sensorSample', isStatic: true, isSensor: true}},
    ].map( (spec, idx) => {
      const tempBody = new PhysBox({ key: `box${idx}`, gameRef: this.gameRef})
      tempBody.x = spec.x
      tempBody.y = spec.y
      tempBody.width = spec.w
      tempBody.height = spec.h
      tempBody.bodyOptions = spec.o
      tempBody.color = spec.c
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      return tempBody
    })

    const ballLayout = [
      {x: 5, y: 0, type: 'stripe', color: 'purple', number: 12},
      {x: 5, y: 0, type: 'solid', color: 'red', number: 3},
      {x: 5, y: 0, type: 'stripe', color: 'orange', number: 13},
      {x: 5, y: 0, type: 'stripe', color: 'brown', number: 15},
      {x: 5, y: 0, type: 'solid', color: 'green', number: 9},
      {x: 4, y: 1, type: 'solid', color: 'purple', number: 4},
      {x: 4, y: 1, type: 'stripe', color: 'green', number: 14},
      {x: 4, y: 1, type: 'solid', color: 'brown', number: 7},
      {x: 4, y: 1, type: 'stripe', color: 'yellow', number: 6},
      {x: 3, y: 2, type: 'stripe', color: 'blue', number: 10},
      {x: 3, y: 2, type: 'solid', color: 'black', number: 8},
      {x: 3, y: 2, type: 'solid', color: 'blue', number: 2},
      {x: 2, y: 3, type: 'solid', color: 'orange', number: 5},
      {x: 2, y: 3, type: 'stripe', color: 'red', number: 11},
      {x: 1, y: 4, type: 'solid', color: 'yellow', number: 1},
    ]
    this.balls = (new Array(15)).fill(0).map((x,idx) => {
      const tempBody = new BilliardBall({key: `ball-${idx}`, gameRef: this.gameRef})
      // const tempBody = new PhysBall({key: `ball-${idx}`, gameRef: this.gameRef})
      tempBody.ballNumber = `${ballLayout[idx].number}`
      // tempBody.ballNumber = `${idx}`
      tempBody.radius = this.ballSize
      tempBody.x = 325 + (this.ballSize * 2) * (idx%ballLayout[idx].x) + this.ballSize*ballLayout[idx].y
      console.log(tempBody.x)
      tempBody.y = 200 + (this.ballSize*2)*(ballLayout[idx].y)
      tempBody.color = ballLayout[idx].color
      tempBody.ballType = ballLayout[idx].type
      // tempBody.color = `rgba(${idx/15 * 100 + 100},${200 - idx/15 * 100},${idx/15 * 100 + 100},1)`
      tempBody.onCollisionStart = (otherBody: any) => {
        if(otherBody.label === 'ball' || otherBody.label === 'cue') {
          if(Math.abs(otherBody.force.x) + Math.abs(otherBody.force.y) > .5) {
            this.gameRef.soundPlayer.playSound(this.ballsHiting)
          }
        }
      }
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      tempBody.active = true
      return tempBody
    })

    Physics.Events.on( this.physics ,'collisionStart', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
          bodyA.plugin.collisionStart(bodyB)
          bodyB.plugin.collisionStart(bodyA)
        })
    })
    Physics.Events.on( this.physics ,'collisionEnd', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
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
    this.shootButton.height = 90
    this.shootButton.width = 100
    this.shootButton.x = 30
    this.shootButton.y = this.gameRef.gameHeight - 120
    this.shootButton.clickFunction = () => {
      this.shootBall()
    }

    this.miniMapButton = new BasedButton({ key: 'mini-map-button', gameRef: this.gameRef})
    this.miniMapButton.fillColor = 'red'
    this.miniMapButton.hoverColor = 'black'
    this.miniMapButton.textColor = 'white'
    this.miniMapButton.buttonText = 'TABLE'
    this.miniMapButton.height = 40
    this.miniMapButton.width = 60
    this.miniMapButton.x = this.gameRef.gameWidth - 80
    this.miniMapButton.y = 20
    this.miniMapButton.clickFunction = () => {
      this.miniMapActive = !this.miniMapActive
      this.lastShot = this.gameRef.lastUpdate
      if(!this.miniMapActive) {
        this.miniMapButton.buttonText = 'TABLE'
        if(this.aimTarget.active) {
          this.freeCam.x = this.aimTarget.x
          this.freeCam.y = this.aimTarget.y
          this.cameraFocus = 'freeCam'
        } else {
          this.cameraFocus = 'cue'
        }
      } else {
        this.miniMapButton.buttonText = 'ZOOM'
      }
    }


    this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
    this.moveKnob.height = 160
    this.moveKnob.width = 160
    this.positionKnobs()

    this.aimTarget = new ShotTarget({key: 'aim-target', gameRef: this.gameRef})
    // this.aimTarget.setTarget(this.balls[this.balls.length-1].body.position)

    this.freeCam.x = this.balls[this.balls.length-1].body.position.x
    this.freeCam.y = this.balls[this.balls.length-1].body.position.y
    this.cameraFocus = 'free'

    this.powerMeter = new PowerBar({ key: 'power-meter', gameRef: this.gameRef})
    this.powerMeter.x = this.gameRef.gameWidth/2
    this.powerMeter.y = 50;

    this.lastShot = this.gameRef.lastUpdate
    this.phase = 'aim'

    this.textBox = new TextContainer({key: 'text-container', gameRef: this.gameRef})
    this.textBox.setText('Sally sells seashells by the seashore, she also likes superlongwordthatshouldbebrokenupbecauseitiswaytoolongtofitononeline to go out whoring at night')
    this.textBox.y = 80
    this.textBox.x = 80
    this.textBox.active = false
    this.textBox.closeFunction = () => {}
    this.textBox.initialize()
  }

  checkGame() {
    const cueBox = {
      x: this.ballA.body.position.x - this.ballSize,
      y: this.ballA.body.position.y - this.ballSize,
      w: this.ballSize * 2,
      h: this.ballSize * 2
    }
    if(!boxCollision(cueBox, this.levelBounds)) {
      Physics.Body.setPosition(this.ballA.body, {x: 400, y: 700})
      Physics.Body.setVelocity(this.ballA.body, {x:0, y: 0})
    }
    this.activeBalls = 0
    this.balls.map(x => {
      if(x.active) {
        this.activeBalls++
      }
    })
    if(this.activeBalls === 0) {
      // alert('you win')
      // this.initialize()
      this.textBox.setText('Congratulations, You win!')
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
    if(this.textBox.active) {
      return
    }

    if(!this.activeAim) {
      this.shootButton.update()
      this.moveKnob.update()
      this.miniMapButton.update()
    }

    if(this.phase === 'power') {
      const ticked = this.powerMeter.tick(this.powerGain)
      if(ticked) {
        this.powerGain = this.powerMeter.current === this.powerMeter.max ? -Math.abs(this.powerGain) : this.powerMeter.current === 0 ? Math.abs(this.powerGain) : this.powerGain
      }
    }

    if(this.moveKnob.knobActive) {
      moveX += (this.moveKnob.knobCoord.x / this.moveKnob.maxOffset) * speedFactor
      moveY += (this.moveKnob.knobCoord.y / this.moveKnob.maxOffset) * speedFactor
    }

    if(!this.moveKnob.knobActive && !this.shootButton.hovered && !this.miniMapButton.hovered &&
      this.gameRef.mouseInfo.mouseDown && this.lastShot + 300 < this.gameRef.lastUpdate) {

        this.aimTarget.setTarget({
          x: (this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x)/this.gameRef.cameraZoom,
          y: (this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y)/this.gameRef.cameraZoom
        })

        if(this.gameRef.mouseInfo.x < 40) {
          moveX -= speedFactor
        }
        if(this.gameRef.mouseInfo.x > this.gameRef.gameWidth - 40) {
          moveX += speedFactor
        }
        if(this.gameRef.mouseInfo.y < 40) {
          moveY -= speedFactor
        }
        if(this.gameRef.mouseInfo.y > this.gameRef.gameHeight - 40) {
          moveY += speedFactor
        }
      // }

      this.activeAim = true
    } else {
      this.activeAim = false
    }

    if((Math.abs(moveX) || Math.abs(moveY))) {
      if(this.cameraFocus !== 'free') {
        this.freeCam = {
          x: this.ballA.body.position.x,
          y: this.ballA.body.position.y
        }
        this.cameraFocus = 'free'
      }
      this.freeCam.x += moveX * this.gameRef.diffMulti
      if(this.freeCam.x < 0) this.freeCam.x = 0
      if(this.freeCam.x > this.levelWidth) this.freeCam.x = this.levelWidth
      this.freeCam.y += moveY * this.gameRef.diffMulti
      if(this.freeCam.y < 0) this.freeCam.y = 0
      if(this.freeCam.y > this.levelHeight) this.freeCam.y = this.levelHeight

      this.lastCamMove = this.gameRef.lastUpdate
      // console.log(this.freeCam)
    } else if (this.cameraFocus === 'free' && this.lastCamMove + 10000 < this.gameRef.lastUpdate) {
      if(this.freeCam.x < this.ballA.body.position.x - 1) this.freeCam.x += 1 * this.gameRef.diffMulti
      if(this.freeCam.x > this.ballA.body.position.x + 1) this.freeCam.x -= 1 * this.gameRef.diffMulti

      if(this.freeCam.y < this.ballA.body.position.y - 1) this.freeCam.y += 1 * this.gameRef.diffMulti
      if(this.freeCam.y > this.ballA.body.position.y + 1) this.freeCam.y -= 1 * this.gameRef.diffMulti
    }
  }

  shootBall() {
    if(!this.moveKnob.knobActive && this.aimTarget.active && this.lastShot + 300 < this.gameRef.lastUpdate) {

      if(this.phase === 'aim') {
        this.powerMeter.current = 1
        this.powerMeter.powerGain = Math.abs(this.powerGain)
        this.lastShot = this.gameRef.lastUpdate
        this.phase = 'power'
      } else {
        const nv = normalizeVector({
          x: this.aimTarget.x - this.ballA.body.position.x,
          y: this.aimTarget.y - this.ballA.body.position.y
        }, 60 * this.powerMeter.current/this.powerMeter.max)
        Physics.Body.setVelocity(this.ballA.body, nv)
        this.gameRef.soundPlayer.playSound(this.ballHit)
        this.lastShot = this.gameRef.lastUpdate
        this.cameraFocus = 'cue'
        this.aimTarget.clearTarget()
        this.phase = 'aim'
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
    this.handleKeys()
    this.handlePhysics()
    this.updateCamera()
    this.checkGame()
  }

  handlePhysics() {
    if(this.gameRef.fps < 61) {
      Physics.Engine.update(this.physics, this.gameRef.updateDiff)
      // this.lastPhysicsUpdate = this.gameRef.lastUpdate
    } else {
      if(this.gameRef.lastUpdate - this.lastPhysicsUpdate >= this.physicsRate ) {
        // Physics.Engine.update(this.physics, this.gameRef.updateDiff)
        Physics.Engine.update(this.physics, this.gameRef.lastUpdate - this.lastPhysicsUpdate)
        this.lastPhysicsUpdate = this.gameRef.lastUpdate
      }
    }
  }

  updateCamera() {

    if(this.miniMapActive) {
      if(this.gameRef.gameWidth > this.gameRef.gameHeight) {
        this.gameRef.cameraZoom = this.gameRef.gameHeight/this.levelBounds.h
      } else {
        this.gameRef.cameraZoom = this.gameRef.gameWidth/this.levelBounds.w
      }
      this.gameRef.cameraPos = {
        x: this.gameRef.gameWidth/2 - (this.levelBounds.w/2 * this.gameRef.cameraZoom),
        y: this.gameRef.gameHeight/2 - (this.levelBounds.h/2 * this.gameRef.cameraZoom)
      }
      return
    }
    this.gameRef.cameraZoom = 1
    const cameraTarget = this.cameraFocus === 'cue' ? this.ballA.body.position : this.freeCam
    this.gameRef.cameraPos = {
      x: -(cameraTarget.x - this.gameRef.gameWidth / 2),
      y: -(cameraTarget.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.gameRef.cameraPos.x > 0) this.gameRef.cameraPos.x = 0
      if (this.gameRef.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.gameRef.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.gameRef.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.gameRef.cameraPos.y > 0) this.gameRef.cameraPos.y = 0
      if (this.gameRef.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.gameRef.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.gameRef.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  positionKnobs() {
    this.shootButton.y = this.gameRef.gameHeight - 120

    this.miniMapButton.x = this.gameRef.gameWidth - 80

    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
    this.moveKnob.x = this.gameRef.gameWidth - this.moveKnob.width
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height
  }

  onResize() {
    this.positionKnobs()
    this.textBox.onResize()
    this.powerMeter.x = this.gameRef.gameWidth/2
  }

  drawBg() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()
  }

  drawLevel() {

    drawBox({
      c: this.gameRef.ctx,
      x: 0 + this.gameRef.cameraPos.x,
      y: 0 + this.gameRef.cameraPos.y,
      width: this.levelBounds.w * this.gameRef.cameraZoom,
      height: this.levelBounds.h * this.gameRef.cameraZoom,
      fillColor: '#777'
    })

    this.level.forEach(b => {
      b.draw()
    })

    this.levelDecor.forEach(b => {
      drawBox({
        c: this.gameRef.ctx,
        x: b.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: b.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        width: b.w * this.gameRef.cameraZoom,
        height: b.h * this.gameRef.cameraZoom,
        fillColor: '#333'
      })
    })

    this.pockets.forEach(b => {
      drawCircle({
        c: this.gameRef.ctx,
        x: b.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: b.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        radius: b.radius * this.gameRef.cameraZoom,
        fillColor: 'black'
      })
    })

    this.bouncePads.forEach(b => {
      b.draw()
    })

    this.balls.forEach(b => {
      if(b.active){
        b.draw()
      }
    })

    if(this.aimTarget.active) {
      drawLine({
        c: this.gameRef.ctx,
        x: this.ballA.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.ballA.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        toX: this.aimTarget.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        toY: this.aimTarget.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        strokeColor: 'red',
        strokeWidth: 1
      })

      drawCircle({
        c: this.gameRef.ctx,
        x: this.aimTarget.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
        y: this.aimTarget.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
        radius: this.aimTarget.radius * this.gameRef.cameraZoom,
        fillColor: 'red'
      })
    }

    this.ballA.draw()
  }

  draw() {

    this.drawBg()

    this.drawLevel()

    if(!this.activeAim && !this.miniMapActive) {
      this.moveKnob.draw()
    }
    if(!this.activeAim){
      this.miniMapButton.draw()
      if(this.aimTarget.active) {
        this.shootButton.draw()
      }
    }
    if(this.phase === 'power') {
      this.powerMeter.draw()
    } else {
      drawText({
        c: this.gameRef.ctx,
        x: 30,
        y: 60,
        align: 'left',
        fontSize: 16,
        fontFamily: 'sans-serif',
        fillColor: '#fff',
        text: `FPS: ${Math.round(this.gameRef.fps)}`
      })

      drawText({
        c: this.gameRef.ctx,
        x: 30,
        y: 40,
        // y: this.gameRef.gameHeight - 80,
        align: 'left',
        fontSize: 16,
        fontFamily: 'sans-serif',
        fillColor: '#fff',
        text: `BALLS LEFT: ${this.activeBalls}`
      })
    }


    this.textBox.draw()
  }

  tearDown() {}

}
