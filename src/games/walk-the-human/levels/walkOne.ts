import { BasedLevel } from "../../../engine/BasedLevel";
import { createSprite, drawImage, drawText } from "../../../engine/libs/drawHelpers";
import { angleBetween, distanceBetween, pointOnCircle, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { Animal } from "../entities/Animal";
import { Human } from "../entities/Human";
import { Pickup } from "../entities/Pickup";
import BackgroundImage from '../../../assets/walk-the-human/level-bg.jpg'

export class WalkOne extends BasedLevel {
  human: any;
  animal: any;
  bgSprite: any;

  pickupList: any[] = [];

  maxDistance: number = 100

  cameraPos: XYCoordinateType = {x: 0, y: 0}
  levelWidth: number = 2000
  levelHeight: number = 2000

  score: number = 0
  scoreSpeed: number = 100
  lastScore: number = 0
  scoreTick: number = 200

  async preload() {
    this.bgSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BackgroundImage,
      sx: 0,
      sy: 0,
      sWidth: this.gameRef.gameWidth,
      sHeight: this.gameRef.gameHeight,
      dx: 0,
      dy: 0,
      dWidth: this.gameRef.gameWidth,
      dHeight: this.gameRef.gameHeight,
      frame: 0
    })

    this.human = new Human({key: 'human', gameRef: this.gameRef})
    await this.human.preload()
    this.animal = new Animal({key: 'animal', gameRef: this.gameRef})
    await this.animal.preload()

    this.pickupList = [
      {x: 300, y: 250},
      {x: 850, y: 600},
      {x: 1150, y: 1000},
      {x: 1650, y: 1400},
    ].map((p,i) => {
      const newP = new Pickup({key: `pickup-${i}`, gameRef: this.gameRef})
      newP.x = p.x
      newP.y = p.y
      newP.onPickup = () => {
        newP.active = false
        this.score += 1000
      }
      return newP
    })

    for(let i = 0; i < this.pickupList.length; i++){
      await this.pickupList[i].preload()
    }
  }

  initialize() {
    this.score = 0

    this.human.initialize()
    this.human.x = 100
    this.human.y = 100
    this.human.target = {
      x: this.human.x,
      y: this.human.y
    }
    this.human.targetList = [
      {x: 20, y: 50},
      {x: 50, y: 150},
      {x: 200, y: 350},
      {x: 350, y: 50},
      {x: 850, y: 400},
      {x: 1250, y: 900},
      {x: 1750, y: 1500},
    ]
    this.human.onLastTarget = () => {
      localStorage.setItem('last-score-walk', `${this.score}`)
      this.gameRef.loadLevel('start-screen')
    }

    this.animal.initialize()
    this.animal.x = 150
    this.animal.y = 150
    this.animal.bonkCallback = () => {
       this.animal.target = this.human
       this.animal.activeTarget = true
       this.score -= 500
    }

    this.pickupList.forEach(p => {
      p.initialize()
    })
  }

  handleSounds() {}

  updateScore(amount: number) {
    if(this.scoreTick + this.lastScore < this.gameRef.lastUpdate) {
      this.score += amount
      if(this.score < 0) {
        this.score = 0
      }
      this.lastScore = this.gameRef.lastUpdate
    }
  }

  update() {
    this.updateBg()
    this.handleSounds()
    this.human.update()
    this.animal.update()
    const scoreDiff = this.scoreSpeed * this.gameRef.diffMulti
    const leash = distanceBetween(this.human, this.animal)
    if(leash > this.maxDistance) {
      // this.animal.fillColor = 'orange'
      const angle = angleBetween(this.human, this.animal)
      const location = pointOnCircle(angle, this.maxDistance)
      this.animal.x = this.human.x + location.x + this.human.velocity.x
      this.animal.y = this.human.y + location.y + this.human.velocity.y
      this.human.x += this.animal.velocity.x - this.human.velocity.x
      this.human.y += this.animal.velocity.y - this.human.velocity.y
      this.human.angerBar.tick(5)
      this.updateScore(-scoreDiff * 2)
      if(this.human.angerBar.current == this.human.angerBar.max) {
        this.animal.bonk()
        this.human.angerBar.current -= 25
      }
    } else {
      this.human.angerBar.tick(-1)
      // this.animal.fillColor = 'green'
      if(!this.animal.bonked) {
        this.updateScore(scoreDiff)
      }
    }
    if(this.animal.bonked) {
      this.animal.x += this.human.velocity.x
      this.animal.y += this.human.velocity.y
      // this.animal.target = this.human
      // this.animal.activeTarget = true
    }

    if(this.gameRef.mouseInfo.mouseDown && !this.animal.bonked) {
      this.animal.setTarget({
        x: this.gameRef.mouseInfo.x - this.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.cameraPos.y,
      })
    }

    const leashAngle = angleBetween(this.human, this.animal)
    this.human.leashHand = pointOnCircle(leashAngle, this.human.armLength)

    this.pickupList.forEach(p => {
      if(p.active && distanceBetween(p, this.animal) < this.animal.radius + p.radius){
        p.onPickup()
      }
    })

    this.updateCamera()
  }

  updateBg() {}

  drawBg() {
    this.bgSprite.sx = -this.cameraPos.x
    this.bgSprite.sy = -this.cameraPos.y
    drawImage(this.bgSprite)
  }

  drawLeash(c: CanvasRenderingContext2D) {
    c.beginPath()
    // c.moveTo(
    //   this.cameraPos.x + this.human.x,
    //   this.cameraPos.y + this.human.y
    // )

    c.moveTo(
      this.cameraPos.x + this.human.x + this.human.leashHand.x,
      this.cameraPos.y + this.human.y + this.human.leashHand.y
    )

    c.quadraticCurveTo(
      this.cameraPos.x + (this.human.x + this.animal.x)/2,
      this.cameraPos.y + (this.human.y + this.animal.y)/2 + (this.maxDistance - distanceBetween(this.human, this.animal)),
      this.cameraPos.x + this.animal.x,
      this.cameraPos.y + this.animal.y
    )
    // right rail point
    // c.closePath()
    c.strokeStyle = '#eee'
    c.lineWidth = 3
    c.stroke()
  }

  updateCamera() {
    this.cameraPos = {
      x: -(this.animal.x - this.gameRef.gameWidth / 2),
      y: -(this.animal.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.cameraPos.x > 0) this.cameraPos.x = 0
      if (this.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.cameraPos.y > 0) this.cameraPos.y = 0
      if (this.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#333'
    this.gameRef.ctx.fill()
    this.drawBg()

    this.pickupList.forEach(p => {
      if(p.active){
        p.draw(this.cameraPos)
      }
    })

    this.human.draw(this.cameraPos)
    this.drawLeash(this.gameRef.ctx)
    this.animal.draw(this.cameraPos)

    drawText({
      c: this.gameRef.ctx,
      x: 20,
      y: 28,
      fontSize: 16,
      fontFamily: 'sans-serif',
      fillColor: 'black',
      weight: 'bold',
      strokeColor: 'white',
      strokeWidth: 5,
      align: 'left',
      text: `Score: ${this.score > 0 ? Math.round(this.score) : 0}`
    })
  }

  tearDown() {}
}
