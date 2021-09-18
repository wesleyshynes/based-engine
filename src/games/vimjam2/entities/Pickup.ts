import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import Munch1 from '../../../assets/vimjam2/munch-1.mp3'
import Munch2 from '../../../assets/vimjam2/munch-2.mp3'
import Fruit1 from '../../../assets/vimjam2/DragonFruit.png'
import Fruit2 from '../../../assets/vimjam2/Mango.png'
import { getRandomInt } from "../../../engine/libs/mathHelpers";

export class Pickup extends BasedObject {
  x: number = 0
  y: number = 0
  radius: number = 12

  entityTag: string = 'pickup'
  active: boolean = false

  pickupColor: string = 'red'
  spawnRoom: string;

  onPickup: () => any = () => null
  pickupNoises: any[] = []

  sprite: any;
  sprites: any[] = [Fruit1, Fruit2]
  spriteChoice: number = 0;

  async preload() {
    this.pickupNoises = []
    const noises = [Munch1, Munch2]
    for(let i = 0; i < 2; i++) {
      const loadNoise = await this.gameRef.soundPlayer.loadSound(noises[i])
      this.pickupNoises.push(loadNoise)
    }

    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: this.sprites[this.spriteChoice],
      sx: 0,
      sy: 0,
      sWidth: 12,
      sHeight: 12,
      dx: 0,
      dy: 0,
      dWidth: 24,
      dHeight: 24,
      frame: 0,
      lastUpdate: 0,
      updateDiff: 1000 / 60 * 10
    })
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
      // drawCircle({
      //   c: this.gameRef.ctx,
      //   x: this.gameRef.cameraPos.x + this.x,
      //   y: this.gameRef.cameraPos.y + this.y,
      //   fillColor: this.pickupColor,
      //   radius: this.radius
      // })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.radius : -this.radius),
        y: this.gameRef.cameraPos.y + this.y - this.radius,
        a: 0
      }, () => {
        // this.sprite.flipX = this.velocity.x < 0
        drawImage(this.sprite)
      })
    }
  }
  tearDown() {}
}
