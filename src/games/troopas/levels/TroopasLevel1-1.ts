import { BasedLevel } from "../../../engine/BasedLevel";
import { drawLine, drawText } from "../../../engine/libs/drawHelpers";
import { angleBetween, degToRad, distanceBetween, getRandomInt, pointOnCircle } from "../../../engine/libs/mathHelpers";
import { Bullet } from "../projectiles/Bullet";
import { BadTroopa } from "../troops/BadTroopa";
import { MainTroopa } from "../troops/MainTroopa";

import BoomUrl from '../../../assets/boom.ogg'

export class TroopasLevel1 extends BasedLevel {
  mainTroopa: any;
  shots: any;
  // lastShot: number = 0
  badTroopas: any;
  score: number = 0

  cameraPos: { x: number, y: number } = { x: 0, y: 0 }
  levelWidth: number = 2000
  levelHeight: number = 2000

  bgValues: any = {
    r: 64,
    g: 244,
    b: 208
  }
  colorSpeed: number = 5

  initialize() {
    this.score = 0
    this.gameRef.soundPlayer.loadSound(BoomUrl)

    this.mainTroopa = new MainTroopa({ key: 'main-troopa', gameRef: this.gameRef })
    this.mainTroopa.x = 100
    this.mainTroopa.y = 100
    this.mainTroopa.health = 10

    this.loadBaddies(10)

    this.mainTroopa.initialize()

    this.shots = new Bullet({ key: 'main-shot', gameRef: this.gameRef })
    this.shots.initialize()
  }

  loadBaddies(enemyCount: number = 10) {
    this.badTroopas = (new Array(enemyCount)).fill('').map((x: any, i: number) => {
      const newBaddie = new BadTroopa({ key: `bad-troopa-${i}`, gameRef: this.gameRef })
      newBaddie.initialize()
      newBaddie.target = this.mainTroopa
      newBaddie.x = 100 + getRandomInt(this.levelWidth)
      newBaddie.y = 100 + getRandomInt(this.levelHeight)

      if (getRandomInt(2) > 0) {
        newBaddie.radius = 16
        newBaddie.maxHealth = 3
        newBaddie.health = 3
      } else {
        newBaddie.baseSpeed = 2
        newBaddie.fastSpeed = 4
      }
      // console.log(newBaddie)
      return newBaddie
    })
  }

  update() {
    this.mainTroopa.collision = false
    this.mainTroopa.update()

    // move targeting
    if (this.gameRef.mouseInfo.mouseDown) {
      this.mainTroopa.target = {
        x: this.gameRef.mouseInfo.x - this.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.cameraPos.y,
        active: true
      }
      if (this.mainTroopa.target.x < 0) this.mainTroopa.target.x = 0
      if (this.mainTroopa.target.x > this.levelWidth) this.mainTroopa.target.x = this.levelWidth
      if (this.mainTroopa.target.y < 0) this.mainTroopa.target.y = 0
      if (this.mainTroopa.target.y > this.levelHeight) this.mainTroopa.target.y = this.levelHeight
    }

    this.updateCamera()

    let closestEnemy: any;
    let closestEnemyDistance = 1000
    let liveEnemies = 0
    this.badTroopas.forEach((x: BadTroopa, i: number) => {
      if (x.health <= 0) {
        return
      }
      x.collision = false
      x.update()
      liveEnemies++
      let distanceToPlayer = distanceBetween(this.mainTroopa, x)

      // player collision
      if (distanceToPlayer <= this.mainTroopa.radius + x.radius) {
        this.mainTroopa.collision = true
        const totalVelocity = Math.abs(x.velocity.x) + Math.abs(x.velocity.y)
        if (totalVelocity) {
          this.mainTroopa.x += x.velocity.x / totalVelocity * 10
          this.mainTroopa.y += x.velocity.y / totalVelocity * 10
        }
        // x.collision = true
        this.mainTroopa.damage(1)
        this.gameRef.soundPlayer.playNote(100, .3, 'square')
        // console.log(this.mainTroopa, totalVelocity)
      }
      if (distanceToPlayer < closestEnemyDistance) {
        closestEnemy = x
        closestEnemyDistance = distanceToPlayer
      }

      // bullet collision
      if (this.shots.active && distanceBetween(this.shots, x) <= this.shots.radius + x.radius) {
        this.shots.active = false
        x.damage(1)
        this.gameRef.soundPlayer.playNote(50, .3, 'square')
        this.score++
        const totalVelocity = Math.abs(this.shots.velocity.x) + Math.abs(this.shots.velocity.y)
        x.x += this.shots.velocity.x / totalVelocity * 10
        x.y += this.shots.velocity.y / totalVelocity * 10
      }

      // collision with other baddies
      this.badTroopas.forEach((y: BadTroopa, j: number) => {
        if (
          j !== i &&
          y.health > 0 &&
          !y.alternateTarget.active &&
          distanceBetween(y, x) <= 30
          // distanceBetween(y, x) <= (x.radius + y.radius)
        ) {
          y.alternateTarget = {
            x: y.target.x + getRandomInt(50) - 25,
            y: y.target.y + getRandomInt(50) - 25,
            active: true
          }
        }
      })
    })

    this.shots.update()
    // shoot bullet based on closest enemy and time
    if (closestEnemy) {
      // closestEnemy.collision = true
      const enemyAnglePos = pointOnCircle(angleBetween(this.mainTroopa, closestEnemy), this.mainTroopa.radius)
      const shootingPos = pointOnCircle(degToRad(this.mainTroopa.shootingHand.currentAngle), this.mainTroopa.radius)
      const shotDistance = distanceBetween(enemyAnglePos, shootingPos)
      // console.log(enemyAnglePos, shootingPos)
      if (shotDistance < 1) {
        const targetEndPoint = pointOnCircle(angleBetween(this.mainTroopa, closestEnemy), this.shots.maxDistance)

        this.shots.fire(
          this.mainTroopa.shootingHand,
          {
            x: targetEndPoint.x + this.mainTroopa.x,
            y: targetEndPoint.y + this.mainTroopa.y
          }
        )
        // this.shots.fire(this.mainTroopa, this.mainTroopa.shootingHand)
      }
      this.mainTroopa.nearestTarget = closestEnemy
    }

    // reset or next level
    if (liveEnemies === 0) {
      // this.gameRef.loadLevel('start-screen')
      this.randomizeBg()
      this.loadBaddies(this.badTroopas.length + 10)
    }

    if (this.mainTroopa.health <= 0) {
      localStorage.setItem('last-score', `${this.score}`)
      this.gameRef.loadLevel('start-screen')
    }
  }

  updateCamera() {
    this.cameraPos = {
      x: -(this.mainTroopa.x - this.gameRef.gameWidth / 2),
      y: -(this.mainTroopa.y - this.gameRef.gameHeight / 2)
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

  updateBg() {
    let {
      r, g, b
    } = this.bgValues
    const speedFactor = this.colorSpeed * this.gameRef.diffMulti
    r += (getRandomInt(3) - 1) * speedFactor
    g += (getRandomInt(3) - 1) * speedFactor
    b += (getRandomInt(3) - 1) * speedFactor

    r = r < 0 ? 0 : r > 255 ? 255 : r
    g = g < 0 ? 0 : g > 255 ? 255 : g
    b = b < 0 ? 0 : b > 255 ? 255 : b
    this.bgValues = {
      r, g, b
    }
    // console.log(r,g,b)
  }

  randomizeBg() {
    let {
      r, g, b
    } = this.bgValues
    r += getRandomInt(256)
    g += getRandomInt(256)
    b += getRandomInt(256)
    this.bgValues = {
      r, g, b
    }
  }

  drawBg() {
    // this.updateBg()
    const gridWidth = 200
    const gridHeight = 200
    const drawWidth = this.gameRef.gameWidth > this.levelWidth ? this.levelWidth : this.gameRef.gameWidth
    const drawHeight = this.gameRef.gameHeight > this.levelHeight ? this.levelHeight : this.gameRef.gameHeight

    const drawOffsetX = drawWidth == this.levelWidth ? this.cameraPos.x : this.cameraPos.x % gridWidth
    const drawOffsetY = drawHeight == this.levelHeight ? this.cameraPos.y : this.cameraPos.y % gridHeight
    for (let i = 0; i < drawWidth / gridWidth + 1; i++) {
      for (let j = 0; j < drawHeight / gridHeight + 1; j++) {
        // if(i*gridWidth > drawWidth || j*gridHeight > drawHeight) {
        //   continue
        // }
        this.gameRef.ctx.beginPath()
        const camX = (i * gridWidth - (this.cameraPos.x) + this.cameraPos.x % gridWidth) / (this.levelWidth)
        const camY = (j * gridHeight - (this.cameraPos.y) + + this.cameraPos.y % gridWidth) / (this.levelHeight)
        this.gameRef.ctx.rect(
          i * gridWidth + drawOffsetX,
          j * gridHeight + drawOffsetY,
          gridWidth + 1,
          gridHeight + 1,
          // i*gridWidth + gridWidth + 1 <= drawWidth ? gridWidth + 1 : drawWidth - (i-1)*gridWidth,
          // j*gridHeight + gridHeight + 1 <= drawHeight ? gridHeight + 1 : drawHeight - (j-1)*gridHeight,
        )
        // this.gameRef.ctx.fillStyle = `black`
        this.gameRef.ctx.fillStyle = `rgba(${(camX) * (this.bgValues.r)},${((camX + camY) / (this.levelWidth + this.levelHeight)) * (this.bgValues.g)},${(camY) * (this.bgValues.b)},1)`
        // this.gameRef.ctx.fillStyle = `rgba(${(camX)*100 + 50},${((camX + camY)/(this.levelWidth + this.levelHeight))*100 + 50},${(camY)*100 + 50},1)`
        this.gameRef.ctx.fill()
      }
    }

    for (let i = 0; i < drawWidth / gridWidth + 1; i++) {
      drawLine({
        c: this.gameRef.ctx,
        x: i * gridWidth + this.cameraPos.x % gridWidth,
        y: 0,
        toX: i * gridWidth + this.cameraPos.x % gridWidth,
        toY: this.gameRef.gameHeight,
        strokeWidth: 1,
        strokeColor: 'rgba(255,255,255,.2)'
      })
    }
    for (let j = 0; j < drawHeight / gridHeight + 1; j++) {
      drawLine({
        c: this.gameRef.ctx,
        x: 0,
        y: j * gridHeight + this.cameraPos.y % gridHeight,
        toX: this.gameRef.gameWidth,
        toY: j * gridHeight + this.cameraPos.y % gridHeight,
        strokeWidth: 1,
        strokeColor: 'rgba(255,255,255,.2)'
      })
    }
  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#eee'
    this.gameRef.ctx.fill()

    this.drawBg()

    this.mainTroopa.draw(this.cameraPos)
    this.badTroopas.forEach((x: BadTroopa) => {
      if (x.health <= 0) {
        return
      }
      x.draw(this.cameraPos)
    })

    this.shots.draw(this.cameraPos)

    if (this.mainTroopa.health > 0) {
      this.gameRef.ctx.beginPath()
      this.gameRef.ctx.rect(30, 30, (this.mainTroopa.health / 10) * 100, 10)
      this.gameRef.ctx.fillStyle = '#ce192b'
      this.gameRef.ctx.fill()
    }

    drawText({
      c: this.gameRef.ctx,
      x: 30,
      y: 60,
      align: 'left',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fillColor: '#fff',
      strokeColor: '#000',
      strokeWidth: 3,
      text: `Score: ${this.score}`
    })
    drawText({
      c: this.gameRef.ctx,
      x: 30,
      y: 60,
      align: 'left',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fillColor: '#fff',
      text: `Score: ${this.score}`
    })

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: 30,
    //   y: 90,
    //   align: 'left',
    //   fontSize: 16,
    //   fontFamily: 'sans-serif',
    //   fillColor: '#000',
    //   text: `x: ${this.mainTroopa.x}, y: ${this.mainTroopa.y}`
    // })

  }
}
