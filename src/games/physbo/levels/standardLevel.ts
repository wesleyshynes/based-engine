import { BasedLevel } from "../../../engine/BasedLevel";
import Physics from 'matter-js';
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";
import { normalizeVector } from "../../../engine/libs/mathHelpers";

export class StandardLevel extends BasedLevel {
  physics: any
  level: any[] = [];

  ballA: any
  lastShot: number = 0
  // ground: any
  sensor: any
  itemRef: any = {}
  balls: any[] = []
  ballSize: number = 15;

  levelWidth: number = 2000
  levelHeight: number = 2000

  async preload() {}

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0

    this.ballA = new PhysBall({key: 'ballA', gameRef: this.gameRef})
    this.ballA.x = 300
    this.ballA.y = 800
    this.ballA.radius = this.ballSize
    this.ballA.initialize()
    this.addToWorld(this.ballA.body)

    this.level = [
      {x: 0, y: 380, w: 400, h: 160, c: 'red', o: { label: 'ground', isStatic: true}},

      {x: 1000, y: 0, w: 2000, h: 160, c: 'brown', o: { label: 'wallTop', isStatic: true}},
      {x: 0, y: 970, w: 160, h: 2000, c: 'brown', o: { label: 'wallLeft', isStatic: true}},
      {x: 2000, y: 970, w: 160, h: 2000, c: 'brown', o: { label: 'wallRight', isStatic: true}},
      {x: 1000, y: 2000, w: 2000, h: 160, c: 'brown', o: { label: 'wallBottom', isStatic: true}},

      {x: 400, y: 380, w: 400, h: 60, c: 'white', o: { label: 'sensorSample', isStatic: true, isSensor: true}},
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
      tempBody.color = 'red'
      tempBody.initialize()
      this.addToWorld(tempBody.body)
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

    if((Math.abs(moveX) || Math.abs(moveY))) {
      if (pressedKeys['KeyC']) {
        if (Math.abs(this.ballA.body.velocity.y) < 0.001 && Math.abs(this.ballA.body.velocity.x) < 0.001 && this.lastShot + 300 < this.gameRef.lastUpdate) {
          Physics.Body.applyForce(this.ballA.body,{x: this.ballA.body.position.x, y: this.ballA.body.position.y},normalizeVector({x: moveX, y: moveY}))  }
          this.lastShot = this.gameRef.lastUpdate
      } else {
        Physics.Body.setVelocity(this.ballA.body, {
          x: moveX,
          y: moveY
        })
      }
    }
  }

  addToWorld(bodyRef: any) {
    Physics.Composite.add(this.physics.world, bodyRef)
  }

  update() {
    this.handleKeys()
    Physics.Engine.update(this.physics, this.gameRef.updateDiff)
    this.updateCamera()
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

    this.balls.forEach(b => {
      b.draw()
    })

    this.ballA.color = Math.abs(this.ballA.body.velocity.y) < 0.001 && Math.abs(this.ballA.body.velocity.x) < 0.001 ? 'blue' : 'orange'
    this.ballA.draw()
  }

  tearDown() {}

}
