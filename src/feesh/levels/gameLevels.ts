import { BasedLevel } from "../../engine/BasedLevel"
import { FeeshObject } from "../entities/feeshObject";
import { MovingBox } from "../entities/movingBoxObject";


export class LevelOneBase extends BasedLevel {
  testBox: any;
  feesh: any;

  initialize() {
    this.testBox = new MovingBox({ key: 'player', gameRef: this.gameRef })
    this.testBox.initialize()

    this.feesh = new FeeshObject({ key: 'feesh', gameRef: this.gameRef })
    this.feesh.initialize()
  }
  update() {
    this.testBox.update()
    this.feesh.update()
    if (this.testBox.x > this.gameRef.gameWidth - 20) {
      // this.gameRef.gameActive = false
      this.gameRef.loadLevel('new-level-1')
    }
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#eee'
    this.gameRef.ctx.fill()

    this.testBox.draw()
    this.feesh.draw()
  }
}

export class OtherLevel extends LevelOneBase {

  testBox: any;
  feesh: any;

  initialize() {
    this.testBox = new MovingBox({ key: 'player', gameRef: this.gameRef })
    this.testBox.initialize()
    this.testBox.fillColor = 'blue'

    this.feesh = new FeeshObject({ key: 'feesh', gameRef: this.gameRef })
    this.feesh.fillColor = 'blue'
    this.feesh.eyeColor = '#ce192b'
    this.feesh.tailLength = 100
    this.feesh.tailWhip = 40
    this.feesh.initialize()
  }

  update() {
    const speedFactor = this.testBox.speed * this.gameRef.diffMulti
    this.testBox.x += speedFactor

    this.feesh.update()

    if (this.testBox.x > this.gameRef.gameWidth - 20) {
      this.gameRef.loadLevel('level-one')
    }
  }
  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#eee'
    this.gameRef.ctx.fill()

    this.testBox.draw()
    this.feesh.draw()
  }
}
