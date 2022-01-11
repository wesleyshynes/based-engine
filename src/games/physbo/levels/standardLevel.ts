import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";
import { degToRad, normalizeVector, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { drawText } from "../../../engine/libs/drawHelpers";
import PhysPoly from "../entities/PhysPoly";
import { boxCollision } from "../../../engine/libs/collisionHelpers";
import PoolBreak from '../../../assets/pool/pool-break-1.mp3'
import BallsHitting from '../../../assets/pool/balls-hitting-2.mp3'
import BallInPocket from '../../../assets/pool/ball-in-pocket.mp3'
import BallRailBounce from '../../../assets/pool/ball-rail-bounce-1.mp3'
import { TouchKnob } from "../../../engine/controls/TouchKnob";


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

const lo = [
  {x: 0, y: 0},
  {x: 560, y: 0},
  {x: 560, y: 20},
  {x: 540, y: 40},
  {x: 20, y: 40},
  {x: 0, y: 20},
]

export class StandardLevel extends BasedLevel {
  physics: any
  level: any[] = [];

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
  aimKnob: any;

  async preload() {
    this.ballHit = await this.gameRef.soundPlayer.loadSound(PoolBreak)
    this.ballsHiting = await this.gameRef.soundPlayer.loadSound(BallsHitting)
    this.ballInPocket = await this.gameRef.soundPlayer.loadSound(BallInPocket)
    this.ballRailBounce = await this.gameRef.soundPlayer.loadSound(BallRailBounce)
  }

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0
    console.log(this.physics)

    this.bouncePads = [{
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
        }
      }
      tempPocket.bodyOptions = {label: 'hole', isStatic: true, isSensor: true}
      tempPocket.initialize()
      this.addToWorld(tempPocket.body)
      return tempPocket
    })

    this.level = [
      // {x: 0, y: 380, w: 400, h: 160, c: 'red', o: { label: 'ground', isStatic: true}},
      {x: 440, y: 0, w: 880, h: 160, c: 'brown', o: { label: 'wallTop', isStatic: true}},
      {x: 0, y: 500, w: 160, h: 1000, c: 'brown', o: { label: 'wallLeft', isStatic: true}},
      {x: 800, y: 500, w: 160, h: 1000, c: 'brown', o: { label: 'wallRight', isStatic: true}},
      {x: 440, y: 1000, w: 880, h: 160, c: 'brown', o: { label: 'wallBottom', isStatic: true}},
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
      {x: 5, y: 0},
      {x: 5, y: 0},
      {x: 5, y: 0},
      {x: 5, y: 0},
      {x: 5, y: 0},
      {x: 4, y: 1},
      {x: 4, y: 1},
      {x: 4, y: 1},
      {x: 4, y: 1},
      {x: 3, y: 2},
      {x: 3, y: 2},
      {x: 3, y: 2},
      {x: 2, y: 3},
      {x: 2, y: 3},
      {x: 1, y: 4},
    ]
    this.balls = (new Array(15)).fill(0).map((x,idx) => {
      const tempBody = new PhysBall({key: `ball-${idx}`, gameRef: this.gameRef})
      tempBody.radius = this.ballSize
      tempBody.x = 325 + (this.ballSize * 2) * (idx%ballLayout[idx].x) + this.ballSize*ballLayout[idx].y
      console.log(tempBody.x)
      tempBody.y = 200 + (this.ballSize*2)*(ballLayout[idx].y)
      tempBody.color = `rgba(${idx/15 * 100 + 100},${200 - idx/15 * 100},${idx/15 * 100 + 100},1)`
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
    this.aimKnob = new TouchKnob({ key: 'aim-knob', gameRef: this.gameRef })
    this.positionKnobs()
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
      alert('you win')
      this.initialize()
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
      Physics.Body.setVelocity(this.ballA.body, {
        x: 0,
        y: 0
      })
      return
    }

    this.aimKnob.update()
    if(this.aimKnob.knobActive) {
      moveX += (this.aimKnob.knobCoord.x / this.aimKnob.maxOffset) * speedFactor
      moveY += (this.aimKnob.knobCoord.y / this.aimKnob.maxOffset) * speedFactor
    }

    if(!this.aimKnob.knobActive && this.gameRef.mouseInfo.mouseDown && this.lastShot + 300 < this.gameRef.lastUpdate) {
      const nv = normalizeVector({
        x: this.gameRef.mouseInfo.x - this.ballA.body.position.x - this.gameRef.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.ballA.body.position.y - this.gameRef.cameraPos.y
      },
         40)
         console.log(this.gameRef.cameraPos, this.ballA.body.position, this.gameRef.mouseInfo, nv)
      Physics.Body.setVelocity(this.ballA.body, nv)
      this.gameRef.soundPlayer.playSound(this.ballHit)
      this.lastShot = this.gameRef.lastUpdate
      this.cameraFocus = 'cue'
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
      if(this.freeCam.y > this.levelWidth) this.freeCam.y = this.levelHeight

      this.lastCamMove = this.gameRef.lastUpdate
      // console.log(this.freeCam)
    } else if (this.cameraFocus === 'free' && this.lastCamMove + 3000 < this.gameRef.lastUpdate) {
      if(this.freeCam.x < this.ballA.body.position.x - 1) this.freeCam.x += 1 * this.gameRef.diffMulti
      if(this.freeCam.x > this.ballA.body.position.x + 1) this.freeCam.x -= 1 * this.gameRef.diffMulti

      if(this.freeCam.y < this.ballA.body.position.y - 1) this.freeCam.y += 1 * this.gameRef.diffMulti
      if(this.freeCam.y > this.ballA.body.position.y + 1) this.freeCam.y -= 1 * this.gameRef.diffMulti
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
    // this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
    // this.moveKnob.x = 0
    // this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob.width = this.aimKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.aimKnob.width
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.aimKnob.height
  }

  onResize() {
    this.positionKnobs()
    // this.swapWeaponBtn.x = this.gameRef.gameWidth - 116
  }

  drawBg() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()
  }

  draw() {

    this.drawBg()

    this.level.forEach(b => {
      b.draw()
    })

    // this.bouncePad.draw()

    this.pockets.forEach(b => {
      b.draw()
    })

    this.bouncePads.forEach(b => {
      b.draw()
    })

    this.balls.forEach(b => {
      if(b.active){
        b.draw()
      }
    })

    this.ballA.draw()

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
      y: this.gameRef.gameHeight - 80,
      align: 'left',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fillColor: '#fff',
      text: `BALLS LEFT: ${this.activeBalls}`
    })

    this.aimKnob.draw()
  }

  tearDown() {}

}
