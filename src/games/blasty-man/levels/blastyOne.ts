import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";

import * as Physics from 'matter-js'
import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spider: any;

  physics: any
  boxA: any
  boxB: any
  ground: any

  async preload() {
    this.bMan = new BlastMan({key: 'blast-man', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spider = new BlastSpider({key: 'blast-spider', gameRef: this.gameRef})
    this.spider.x = 200
    this.spider.y = 200
    await this.spider.preload()
  }

  initialize() {
    this.bMan.initialize()
    this.spider.initialize()

    this.physics = Physics.Engine.create()
    this.physics.world.gravity.y = 0
    this.boxA = Physics.Bodies.rectangle(100, 100, 40, 40);
    this.boxB = Physics.Bodies.rectangle(130, 50, 40, 40);
    this.ground = Physics.Bodies.rectangle(0, 380, 810, 60, { isStatic: true });
    const physicsGroup:any = [this.boxA, this.boxB, this.ground]
    // Physics.Composite.create()
    Physics.Composite.add(this.physics.world, physicsGroup)
    Physics.Body.applyForce(this.boxB, this.boxB.position, {x: -.1, y: .1})
    // Physics.Composite.add(this.physics, physicsGroup)
  }

  handleSounds() { }

  update() {
    this.updateBg()
    this.handleSounds()

    this.bMan.update()
    this.spider.update()

    Physics.Engine.update(this.physics, this.gameRef.updateDiff)
    // console.log(this.boxA)
  }

  updateBg() { }

  drawBg() { }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.bMan.draw()
    this.spider.draw()

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
        fillColor: 'red'
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

  tearDown() { }
}
