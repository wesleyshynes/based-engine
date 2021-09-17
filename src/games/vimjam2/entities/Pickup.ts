import { BasedObject } from "../../../engine/BasedObject";
import { drawCircle } from "../../../engine/libs/drawHelpers";

export class Pickup extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 10

  entityTag: string = 'pickup'
  active: boolean = false

  pickupColor: string = 'red'
  spawnRoom: string;

  onPickup: () => any = () => null

  async preload() {}
  initialize() {}
  setOnPickup(pickupFn: () => any) {
    this.onPickup = pickupFn
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
