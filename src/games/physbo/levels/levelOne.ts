import { BasedLevel } from "../../../engine/BasedLevel";
import * as Physics from 'matter-js'
import { drawBox, drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { degToRad, normalizeVector, radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../entities/PhysBox";
import PhysBall from "../entities/PhysBall";

export class LevelOne extends BasedLevel {
  physics: any

  player: any;
  boxes: any[] = [];
  level: any[] = [];
  // boxA: any
  // boxAColor: string = 'red'
  // boxB: any

  ballA: any
  ground: any
  sensor: any
  itemRef: any = {}


  levelWidth: number = 2000
  levelHeight: number = 2000

  async preload() {}

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0

    this.player = new PhysBox({key: 'player', gameRef: this.gameRef})
    this.player.x = 50
    this.player.y = 200
    this.player.width = 100
    this.player.height = 10
    this.player.bodyOptions = {
      label: 'playerBox',
      density: 10000
    }
    this.player.bodyCenter = {x: -20, y: 0}
    this.player.collisionStartFn = (o:any) => {
      this.player.color = 'red'
      console.log('FUCK')
    }
    this.player.collisionEndFn = (o: any) => {
      this.player.color = 'blue'
    }
    this.player.initialize()
    this.addToWorld(this.player.body)

    this.boxes = [
      {x: 100, y: 100, w: 40, h: 40, o: { density: 1, label: 'boxA'}},
      {x: 130, y: 70, w: 40, h: 40, o: { density: 1, label: 'boxB', inertia: Infinity}},
    ].map( (spec, idx) => {
      const tempBody = new PhysBox({ key: `box${idx}`, gameRef: this.gameRef})
      tempBody.x = spec.x
      tempBody.y = spec.y
      tempBody.width = spec.w
      tempBody.height = spec.h
      tempBody.bodyOptions = spec.o
      tempBody.initialize()
      this.addToWorld(tempBody.body)
      return tempBody
    })

    this.ballA = new PhysBall({key: 'ballA', gameRef: this.gameRef})
    this.ballA.x = 300
    this.ballA.y = 300
    this.ballA.initialize()
    this.addToWorld(this.ballA.body)

    this.level = [
      {x: 0, y: 380, w: 400, h: 60, c: 'red', o: { label: 'ground', isStatic: true}},

      {x: 1000, y: 0, w: 2000, h: 60, c: 'brown', o: { label: 'wallTop', isStatic: true}},
      {x: 0, y: 970, w: 60, h: 2000, c: 'brown', o: { label: 'wallLeft', isStatic: true}},
      {x: 2000, y: 970, w: 60, h: 2000, c: 'brown', o: { label: 'wallRight', isStatic: true}},
      {x: 1000, y: 2000, w: 2000, h: 60, c: 'brown', o: { label: 'wallBottom', isStatic: true}},

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

    const playerRotate = degToRad(25 * this.gameRef.diffMulti)
    let playerRotateSpeed = 0

    let moveX = 0
    let moveY = 0

    if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
      moveX -= speedFactor
    }
    if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
      moveX += speedFactor
    }
    if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
      moveY -= speedFactor
    }
    if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
      moveY += speedFactor
    }
    if (pressedKeys['KeyX']) {
      playerRotateSpeed -= .1
      // Physics.Body.setAngle(this.player.body, this.player.body.angle + playerRotate)
    }
    if (pressedKeys['KeyC']) {
      playerRotateSpeed += .1
      // Physics.Body.setAngle(this.player.body, this.player.body.angle - playerRotate)
    }

    // Physics.Body.applyForce(this.boxB, this.boxB.position, {
    //   x: moveX,
    //   y: moveY
    // })
    Physics.Body.setAngularVelocity(this.player.body, playerRotateSpeed)
    // Physics.Body.setAngularVelocity(this.player.body, playerRotateSpeed ? Math.PI/playerRotateSpeed : 0)

    Physics.Body.setVelocity(this.player.body, normalizeVector({
      x: moveX,
      y: moveY
    },3))


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
    const cameraTarget = this.player.body.position
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

    this.boxes.forEach(b => {
      b.draw()
    })

    this.ballA.draw()

    this.player.draw()

  }

  tearDown() {}

}
