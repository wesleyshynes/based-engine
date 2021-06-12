import { BasedLevel } from "../../../engine/BasedLevel";
import { angleBetween, distanceBetween, pointOnCircle } from "../../../engine/libs/mathHelpers";
import { Animal } from "../entities/Animal";
import { Human } from "../entities/Human";

export class WalkOne extends BasedLevel {
  human: any;
  animal: any;

  maxDistance: number = 100
  async preload() {
    this.human = new Human({key: 'human', gameRef: this.gameRef})
    this.human.x = 100
    this.human.y = 100

    this.animal = new Animal({key: 'animal', gameRef: this.gameRef})
    this.animal.x = 150
    this.animal.y = 150
  }
  initialize() {
    this.human.initialize()
  }
  handleSounds() {}

  update() {
    this.updateBg()
    this.handleSounds()
    this.human.update()
    this.animal.update()
    const leash = distanceBetween(this.human, this.animal)
    if(leash > this.maxDistance) {
      this.animal.fillColor = 'orange'
      const angle = angleBetween(this.human, this.animal)
      const location = pointOnCircle(angle, this.maxDistance)
      this.animal.x = this.human.x + location.x + this.human.velocity.x
      this.animal.y = this.human.y + location.y + this.human.velocity.y

      this.human.x += this.animal.velocity.x - this.human.velocity.x
      this.human.y += this.animal.velocity.y - this.human.velocity.y
      this.human.angerBar.tick(5)
      if(this.human.angerBar.current == this.human.angerBar.max) {
        this.animal.bonk()
        this.human.angerBar.current -= 25
      }
    } else {
      this.human.angerBar.tick(-1)
      this.animal.fillColor = 'green'
    }

    if(this.gameRef.mouseInfo.mouseDown) {
      this.animal.setTarget({
        x: this.gameRef.mouseInfo.x,
        y: this.gameRef.mouseInfo.y,
      })
    }
  }

  updateBg() {}

  drawBg() {}

  drawLeash(c: CanvasRenderingContext2D) {
    c.beginPath()
    c.moveTo(this.human.x, this.human.y)

    c.quadraticCurveTo(
      (this.human.x + this.animal.x)/2,
      (this.human.y + this.animal.y)/2 + (this.maxDistance - distanceBetween(this.human, this.animal)),
      this.animal.x, this.animal.y)
    // right rail point
    // c.closePath()
    c.strokeStyle = '#eee'
    c.lineWidth = 1
    c.stroke()
  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#333'
    this.gameRef.ctx.fill()

    this.drawLeash(this.gameRef.ctx)

    this.human.draw()
    this.animal.draw()
  }

  tearDown() {}
}
