import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween } from "../../../engine/libs/mathHelpers";
import { MainTroopa } from "./MainTroopa";

export class BadTroopa extends MainTroopa {

  speed: number = 1
  baseSpeed: number = 1
  fastSpeed: number = 3
  aggroRange: number = 250
  radius: number = 20
  health: number = 2
  maxHealth: number = 2
  damageBuffer: number = 100
  alternateTarget: { x: number, y: number, active: boolean } = { x: 0, y: 0, active: false };
  healthColors: string[] = ['#000', '#ce192b', 'pink']

  initialize() {
    this.health = 2
  }

  update() {
    if(distanceBetween(this, this.target) < this.aggroRange) {
      this.speed = this.fastSpeed
      this.alternateTarget.active = false
    } else {
      this.speed = this.baseSpeed
    }
    if (this.alternateTarget.active) {
      this.moveTo(this.alternateTarget, () => {
        this.alternateTarget.active = false
      })
    } else {
      this.moveTo(this.target)
    }
  }

  draw(cameraOffset: { x: number, y: number } = { x: 0, y: 0 }) {
    drawCircle({
      c: this.gameRef.ctx,
      x: cameraOffset.x + this.x,
      y: cameraOffset.y + this.y,
      radius: this.radius,
      fillColor: `rgb(255,0,${this.maxHealth - this.health >= 0 ? (this.maxHealth - this.health) / this.maxHealth * 255 : 0})`,
      strokeWidth: 2,
      strokeColor: 'rgba(255,255,255,.5)'
    })

  }
}
