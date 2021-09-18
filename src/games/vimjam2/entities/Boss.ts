import Baddie from "./Baddie";
import BossMonkeySprite from '../../../assets/vimjam2/BigMonkey.png'
import { createSprite, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import Hurt1 from '../../../assets/vimjam2/monkey-1.mp3'
import Hurt2 from '../../../assets/vimjam2/monkey-2.mp3'
import Hurt3 from '../../../assets/vimjam2/monkey-3.mp3'
import HowlerYell from '../../../assets/vimjam2/howler-monkey-scream.mp3'

export default class Boss extends Baddie {
  radius: number = 32
  speed: number = 3

  health: number = 200

  dead: boolean = false;

  deathTime: number = 0
  deathTimer: number = 4000

  ressurectionYell: any;

  async preload() {

    this.deathTimer = 4000
    this.speed = 3
    this.dead = false

    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BossMonkeySprite,
      sx: 0,
      sy: 0,
      sWidth: 72,
      sHeight: 72,
      dx: 0,
      dy: 0,
      dWidth: 72,
      dHeight: 72,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })
    this.noises = []
    const loadNoises = [Hurt1, Hurt2, Hurt3]
    for(let i = 0; i < 3; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(loadNoises[i])
      this.noises.push(loadNoise)
    }

    this.ressurectionYell = await this.gameRef.soundPlayer.loadSound(HowlerYell)
  }

  handleRessurection() {
    if(this.gameRef.lastUpdate > this.deathTime + this.deathTimer) {
      this.healthBar.tick(this.health)
      this.dead = false
      this.gameRef.soundPlayer.playSound(this.ressurectionYell)
      this.speed += .1
      this.deathTimer += 1000
    }
  }

  update() {
    if (this.healthBar.current === 0) {
      if(this.dead === false) {
        this.dead = true
        this.deathTime = this.gameRef.lastUpdate
      }
      this.handleRessurection()
      return
    }
    if (!this.tileMap.visitedRooms[this.spawnRoom] && this.healthBar.current === this.healthBar.max) {
      return
    }

    this.chaseTarget()

    this.healthBar.x = this.x
    this.healthBar.y = this.y
  }

  draw() {
    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: this.x + this.gameRef.cameraPos.x,
    //   y: this.y + this.gameRef.cameraPos.y,
    //   radius: this.radius,
    //   fillColor: this.color
    // })

    rotateDraw({
      c: this.gameRef.ctx,
      x: (this.dead ? this.sprite.dHeight : 0) + this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.radius : -this.radius),
      y: this.gameRef.cameraPos.y + this.y - this.radius,
      a: this.dead ? 90 : 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    this.healthBar.current > 0 && this.healthBar.current < this.health && this.healthBar.draw()
  }
}
