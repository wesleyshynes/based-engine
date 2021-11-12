import { BasedLevel } from "../../../engine/BasedLevel";
import * as Physics from 'matter-js'
import { drawBox, drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class LevelOne extends BasedLevel {
  physics: any
  boxA: any
  boxAColor: string = 'red'
  boxB: any
  ballA: any
  ground: any
  sensor: any
  itemRef: any = {}
  async preload() {}

  initialize() {
    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0
    this.boxA = Physics.Bodies.rectangle(100, 100, 40, 40, {
      density: 1,
      label: 'boxA'
    });
    this.itemRef[this.boxA.id] = {
      props: {
        color: 'red',
        touch: 0,
        collisionStartHandler: (ref: any, ref2: any) => {
          ref.props.touch++
          ref.props.color = ref.props.touch > 0 ? 'orange' : 'red'
        },
        collisionEndHandler: (ref: any, ref2: any) => {
          ref.props.touch--
          ref.props.color = ref.props.touch > 0 ? 'orange' : 'red'
        }
      },
      bod: this.boxA
    }
    this.boxB = Physics.Bodies.rectangle(130, 50, 40, 40, {
      inertia: Infinity,
      density: 5,
      label: 'boxB'
    });
    this.ballA = Physics.Bodies.circle(300,300,20,{
      label: 'ballA',
    });
    this.ground = Physics.Bodies.rectangle(0, 380, 810, 60, { isStatic: true });
    this.sensor = Physics.Bodies.rectangle(400, 380, 810, 60, { isStatic: true, isSensor: true });
    const physicsGroup: any = [this.boxA, this.boxB, this.ballA, this.ground, this.sensor]
    // Physics.Composite.create()
    Physics.Composite.add(this.physics.world, physicsGroup)
    Physics.Body.applyForce(this.boxB, this.boxB.position, {
      x: 0,
      y: .1
    })
    // Physics.Composite.add(this.physics, physicsGroup)
    Physics.Events.on( this.physics ,'collisionStart', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
          console.log('==== COLLISION START ====')
          // console.log(bodyA, bodyB)
          // if(bodyA.label === 'boxA' || bodyB.label === 'boxA') {
          //   this.boxAColor = 'orange'
          // }
          const aHand = this.itemRef[bodyA.id]
          const bHand = this.itemRef[bodyB.id]
          if(aHand && aHand.props.collisionStartHandler) {
            aHand.props.collisionStartHandler(aHand, bHand)
          }
          if(bHand && bHand.props.collisionStartHandler) {
            aHand.props.collisionStartHandler(bHand, aHand)
          }
        })
    })
    Physics.Events.on( this.physics ,'collisionEnd', (event: any) => {
        event.pairs.map((pair:any) => {
          const {bodyA, bodyB} = pair
          console.log('==== COLLISION END ====')
          console.log(bodyA, bodyB)
          // if(bodyA.label === 'boxA' || bodyB.label === 'boxA') {
          //   this.boxAColor = 'red'
          // }
          const aHand = this.itemRef[bodyA.id]
          const bHand = this.itemRef[bodyB.id]
          if(aHand && aHand.props.collisionEndHandler) {
            aHand.props.collisionEndHandler(aHand, bHand)
          }
          if(bHand && bHand.props.collisionEndHandler) {
            aHand.props.collisionEndHandler(bHand, aHand)
          }
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
    if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
      moveY -= speedFactor
    }
    if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
      moveY += speedFactor
    }
    // if (pressedKeys['KeyX']) {
    //   this.player.switchMode(this.player.mode === 'melee' ? 'shoot' : 'melee')
    // }

    // Physics.Body.applyForce(this.boxB, this.boxB.position, {
    //   x: moveX,
    //   y: moveY
    // })

    Physics.Body.setVelocity(this.boxB, {
      x: moveX,
      y: moveY
    })


  }

  update() {
    this.handleKeys()
    Physics.Engine.update(this.physics, this.gameRef.updateDiff)
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

    drawBox({
      c: this.gameRef.ctx,
      x: this.sensor.position.x - 405,
      y: this.sensor.position.y - 30,
      width: 810,
      height: 60,
      fillColor: 'white'
    })

    drawCircle({
      c: this.gameRef.ctx,
      x: this.ballA.position.x,
      y: this.ballA.position.y,
      radius: 20,
      fillColor: 'yellow'
    })

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.boxA.position.x,
      y: this.boxA.position.y,
      a: radToDeg(this.boxA.angle)
    }, () => {

      drawBox({
        c: this.gameRef.ctx,
        x: -20,
        y: -20,
        width: 40,
        height: 40,
        fillColor: this.itemRef[this.boxA.id].props.color,
        // fillColor: 'red',
      })
    })

    rotateDraw({
      c: this.gameRef.ctx,
      x: this.boxB.position.x,
      y: this.boxB.position.y,
      a: radToDeg(this.boxB.angle)
    }, () => {
      drawBox({
        c: this.gameRef.ctx,
        x: -20,
        y: -20,
        width: 40,
        height: 40,
        fillColor: 'blue'
      })
    })

    drawBox({
      c: this.gameRef.ctx,
      x: this.ground.position.x - 405,
      y: this.ground.position.y - 30,
      width: 810,
      height: 60,
      fillColor: 'brown'
    })
  }

  tearDown() {}

}
