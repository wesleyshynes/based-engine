import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";
import Munch1 from '../../../assets/vimjam2/munch-1.mp3'
import Munch2 from '../../../assets/vimjam2/munch-2.mp3'
import { getRandomInt } from "../../../engine/libs/mathHelpers";

export class Pickup extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 10

  entityTag: string = 'pickup'
  active: boolean = false

  pickupColor: string = 'red'
  spawnRoom: string;

  onPickup: () => any = () => null
  pickupNoises: any[] = []

  async preload() {
    this.pickupNoises = []
    const noises = [Munch1, Munch2]
    for(let i = 0; i < 2; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(noises[i])
      this.pickupNoises.push(loadNoise)
    }
  }
  initialize() {}
  setOnPickup(pickupFn: () => any) {
    this.onPickup = pickupFn
  }
  playPickupNoise() {
    this.gameRef.soundPlayer.playSound(this.pickupNoises[getRandomInt(2)])
  }
  update() {}
  draw() {
    if(this.active) {
      drawCircle({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + this.x,
        y: this.gameRef.cameraPos.y + this.y,
        fillColor: this.pickupColor,
        radius: this.radius
      })
    }
  }
  tearDown() {}
}
