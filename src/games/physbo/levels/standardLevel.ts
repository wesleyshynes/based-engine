import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";
import { normalizeVector } from "../../../engine/libs/mathHelpers";
import { drawText } from "../../../engine/libs/drawHelpers";

export class StandardLevel extends BasedLevel {
  physics: any
  level: any[] = [];

  lastPhysicsUpdate: number = 0;
  physicsRate: number = 1000/60

  ballA: any
  lastShot: number = 0
  // ground: any
  sensor: any
  itemRef: any = {}
  balls: any[] = []
  ballSize: number = 15;

  testHole: any
  testHoleSize: number = 20
  pockets: any[] = []
  pocketSize: number = 20

  levelWidth: number = 2000
  levelHeight: number = 2000

  async preload() {}

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0
    console.log(this.physics)
    // this.physics.timing.timeScale = 60/250

    this.ballA = new PhysBall({key: 'ballA', gameRef: this.gameRef})
    this.ballA.x = 300
    this.ballA.y = 800
    this.ballA.radius = this.ballSize
    this.ballA.bodyOptions.label = 'cue'
    this.ballA.color = 'white'
    this.ballA.initialize()
    this.addToWorld(this.ballA.body)

    this.pockets = [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
    ].map((spec, idx) => {
      const tempPocket = new PhysBall({key: `pocket${idx}`, gameRef: this.gameRef})
      tempPocket.x = spec.x
      tempPocket.y = spec.y
      tempPocket.radius = this.pocketSize
      tempPocket.color = 'black'
      tempPocket.onCollisionStart = (otherBody: any) => {
        console.log(otherBody)
        if(otherBody.label === 'ball') {
          this.removeFromWorld(otherBody)
          this.balls.forEach(ball => {
            if(ball.body.id === otherBody.id) {
              ball.active = false
            }
          })
        }
        if(otherBody.label === 'cue') {
          Physics.Body.setPosition(otherBody, {x: 300, y: 800})
          Physics.Body.setVelocity(otherBody, {x:0, y: 0})
        }
      }
      tempPocket.bodyOptions = {label: 'hole', isStatic: true, isSensor: true}
      tempPocket.initialize()
      this.addToWorld(tempPocket.body)
      return tempPocket
    })

    this.testHole = new PhysBall({key: 'testHole', gameRef: this.gameRef})
    this.testHole.x = 400
    this.testHole.y = 400
    this.testHole.radius = this.testHoleSize
    this.testHole.color = 'black'
    this.testHole.onCollisionStart = (otherBody: any) => {
      console.log(otherBody)
      if(otherBody.label === 'ball') {
        this.removeFromWorld(otherBody)
        this.balls.forEach(ball => {
          if(ball.body.id === otherBody.id) {
            ball.active = false
          }
        })
      }
      if(otherBody.label === 'cue') {
        Physics.Body.setPosition(otherBody, {x: 300, y: 800})
        Physics.Body.setVelocity(otherBody, {x:0, y: 0})
      }
    }
    this.testHole.bodyOptions = {label: 'hole', isStatic: true, isSensor: true}
    this.testHole.initialize()
    this.addToWorld(this.testHole.body)

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
      tempBody.x = 200 + (this.ballSize * 2) * (idx%ballLayout[idx].x) + this.ballSize*ballLayout[idx].y
      console.log(tempBody.x)
      tempBody.y = 100 + (this.ballSize*2)*(ballLayout[idx].y)
      tempBody.color = `rgba(${idx/15 * 100 + 100},${200 - idx/15 * 100},${idx/15 * 100 + 100},1)`
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      tempBody.active = true
      return tempBody
    })

    Physics.Events.on( this.physics ,'collisionStart', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
          // bodyA && bodyA.plugin && bodyA.plugin.collisionStart && bodyA.plugin.collisionStart(bodyB)
          // bodyB && bodyB.plugin && bodyB.plugin.collisionStart && bodyB.plugin.collisionStart(bodyA)
          bodyA.plugin.collisionStart(bodyB)
          bodyB.plugin.collisionStart(bodyA)
        })
    })
    Physics.Events.on( this.physics ,'collisionEnd', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
          // bodyA && bodyA.plugin && bodyA.plugin.collisionEnd && bodyA.plugin.collisionEnd(bodyB)
          // bodyB && bodyB.plugin && bodyB.plugin.collisionEnd && bodyB.plugin.collisionEnd(bodyA)
          bodyA.plugin.collisionEnd(bodyB)
          bodyB.plugin.collisionEnd(bodyA)
        })
    })
  }

  handleKeys() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = 1

    let moveX = 0
    let moveY = 0
    const multiplier = this.gameRef.fps/60
    const velocityO = 60/this.gameRef.fps
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

    if(this.gameRef.mouseInfo.mouseDown && this.lastShot + 300 < this.gameRef.lastUpdate) {
      const nv = normalizeVector({
        x: this.gameRef.mouseInfo.x - this.ballA.body.position.x - this.gameRef.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.ballA.body.position.y - this.gameRef.cameraPos.y
      },
         40)
         console.log(this.gameRef.cameraPos, this.ballA.body.position, this.gameRef.mouseInfo, nv)
      Physics.Body.setVelocity(this.ballA.body, nv)
      this.lastShot = this.gameRef.lastUpdate
    }

    if((Math.abs(moveX) || Math.abs(moveY))) {
      if (pressedKeys['KeyC']) {
        if (Math.abs(this.ballA.body.velocity.y) < 0.001 && Math.abs(this.ballA.body.velocity.x) < 0.001 && this.lastShot + 300 < this.gameRef.lastUpdate) {
          const nv = normalizeVector({x: moveX, y: moveY}, 40)
          // console.log(nv, this.gameRef.updateDiff, this.gameRef.fps, this.gameRef.diffMulti)
          // console.log(multiplier, 1/multiplier, velocityO)
          Physics.Body.setVelocity(this.ballA.body, nv)
          // Physics.Body.applyForce(this.ballA.body,{x: this.ballA.body.position.x, y: this.ballA.body.position.y}, nv)
          this.lastShot = this.gameRef.lastUpdate
        } else {
          // console.log(this.ballA.body.velocity)
        }
      } else {
        Physics.Body.setVelocity(this.ballA.body, {
          x: moveX * 10,
          y: moveY * 10
        })
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
  }

  handlePhysics() {
    if(this.gameRef.fps < 61) {
      Physics.Engine.update(this.physics, this.gameRef.updateDiff)
      this.lastPhysicsUpdate = this.gameRef.lastUpdate
    } else {
      if(this.gameRef.lastUpdate - this.lastPhysicsUpdate >= this.physicsRate ) {
        // Physics.Engine.update(this.physics, this.gameRef.updateDiff)
        Physics.Engine.update(this.physics, this.gameRef.lastUpdate - this.lastPhysicsUpdate)
        this.lastPhysicsUpdate = this.gameRef.lastUpdate
      }
    }
  }

  updateCamera() {
    const cameraTarget = this.ballA.body.position
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

  onResize() {}

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

    this.pockets.forEach(b => {
      b.draw()
    })

    this.testHole.draw()
    let ballCount = 0
    this.balls.forEach(b => {
      if(b.active){
        b.draw()
      } else {
        ballCount++
      }
    })

    // this.ballA.color = Math.abs(this.ballA.body.velocity.y) < 0.001 && Math.abs(this.ballA.body.velocity.x) < 0.001 ? 'blue' : 'orange'
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
      text: `BALLS LEFT: ${this.balls.length - ballCount}`
    })


  }

  tearDown() {}

}
