import Baddie from "./Baddie";
import BossMonkeySprite from '../../../assets/vimjam2/BigMonkey_noHand.png'
// import BossMonkeySprite from '../../../assets/vimjam2/BigMonkey.png'
import { createSprite, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import Hurt1 from '../../../assets/vimjam2/monkey-1.mp3'
import Hurt2 from '../../../assets/vimjam2/monkey-2.mp3'
import Hurt3 from '../../../assets/vimjam2/monkey-3.mp3'
import HowlerYell from '../../../assets/vimjam2/howler-monkey-scream.mp3'
import { MeleeWeapon } from "./MeleeWeapon";
import { distanceBetween, getRandomInt, XYCoordinateType } from "../../../engine/libs/mathHelpers";

export default class Boss extends Baddie {
  radius: number = 32
  speed: number = 3

  health: number = 200

  dead: boolean = false;

  deathTime: number = 0
  deathTimer: number = 4000

  ressurectionYell: any;

  meleeWeapon: any;
  swingCoolDown: number = 500
  lastSwing: number = 0
  swingTarget: any;

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

    this.meleeWeapon = new MeleeWeapon({ key: 'melee-weapon-boss', gameRef: this.gameRef })
    this.meleeWeapon.radius = 36
    await this.meleeWeapon.preload()

    this.noises = []
    const loadNoises = [Hurt1, Hurt2, Hurt3]
    for (let i = 0; i < 3; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(loadNoises[i])
      this.noises.push(loadNoise)
    }
    this.ressurectionYell = await this.gameRef.soundPlayer.loadSound(HowlerYell)
  }

  initialize() {
    this.baddieDefaultInitialize()
    this.meleeWeapon.initialize()
    this.meleeWeapon.yOffset = -10
    this.meleeWeapon.moveTo(this)
  }

  handleRessurection() {
    if (this.gameRef.lastUpdate > this.deathTime + this.deathTimer) {
      this.healthBar.tick(this.health)
      this.dead = false
      this.gameRef.soundPlayer.playSound(this.ressurectionYell)
      this.speed += .1
      this.deathTimer += 1000
      this.chasing = true
      this.pathList = []
    }
  }

  weaponHitBox() {
    return {
      x: this.meleeWeapon.hitBox.x + this.meleeWeapon.x,
      y: this.meleeWeapon.hitBox.y + this.meleeWeapon.y,
      entityTag: 'baddieWeapon',
      objectKey: `${this.objectKey}-weapon`,
      radius: this.meleeWeapon.hitBoxRadius,
      active: !this.dead
    }
  }

  handleSwing() {
    if (this.gameRef.lastUpdate > this.lastSwing + this.swingCoolDown) {
      this.meleeWeapon.target = {
        x: this.x + (getRandomInt(2) > 0 ? -300 : 300),
        y: this.y + (getRandomInt(2) > 0 ? -300 : 300),
      }
      this.lastSwing = this.gameRef.lastUpdate
    }
  }

  drawArm(armOffset: XYCoordinateType = { x: 0, y: 0 }) {
    const c = this.gameRef.ctx
    const cameraPos = this.gameRef.cameraPos
    const maxDistance = 20

    const hand = {
      x: this.meleeWeapon.x + this.meleeWeapon.handPos.x,
      y: this.meleeWeapon.y + this.meleeWeapon.handPos.y
    }
    const shoulder = {
      x: this.x + armOffset.x,
      y: this.y + armOffset.y
    }
    c.beginPath()

    c.moveTo(
      cameraPos.x + shoulder.x,
      cameraPos.y + shoulder.y
    )
    c.quadraticCurveTo(
      cameraPos.x + (hand.x + shoulder.x) / 2,
      cameraPos.y + (hand.y + shoulder.y) / 2 + (Math.min(maxDistance, distanceBetween(hand, shoulder))),
      cameraPos.x + hand.x,
      cameraPos.y + hand.y
    )

    // right rail point
    // c.closePath()
    c.strokeStyle = '#703429'
    c.lineWidth = 10
    c.stroke()
  }

  update() {
    if (this.healthBar.current === 0) {
      if (this.dead === false) {
        this.pathList = []
        this.dead = true
        this.deathTime = this.gameRef.lastUpdate
      }
      this.handleRessurection()
      return
    }
    if (!this.tileMap.visitedRooms[this.spawnRoom] && this.healthBar.current === this.healthBar.max) {
      return
    }

    // this.meleeWeapon.target = this.target
    this.meleeWeapon.onTarget && this.handleSwing()
    this.meleeWeapon.update()

    this.chaseTarget()

    this.meleeWeapon.moveTo(this)

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
      x: (this.dead ? this.sprite.dHeight : 0) + this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.sprite.dWidth/2 : -this.sprite.dWidth/2),
      y: this.gameRef.cameraPos.y + this.y - this.sprite.dHeight/2,
      a: this.dead ? 90 : 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })
    if(!this.dead){
      this.drawArm({x: -22, y: -8})
      this.drawArm({x: 22, y: -8})
    }
    this.meleeWeapon.draw()

    this.healthBar.current > 0 && this.healthBar.current < this.health && this.healthBar.draw()
  }
}
