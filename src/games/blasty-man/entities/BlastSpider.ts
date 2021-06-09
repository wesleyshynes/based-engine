import { BasedObject } from "../../../engine/BasedObject";
import BlastySpiderUrl from '../../../assets/blasty-man/blasty-spider-concept.png'
import { createSprite, drawImage } from "../../../engine/libs/drawHelpers";

export class BlastSpider extends BasedObject {
    x: number = 0
    y: number = 0

    sprite: any;

    async preload() {
      this.sprite = await createSprite({
        c: this.gameRef.ctx,
        sprite: BlastySpiderUrl,
        sx: 0,
        sy: 0,
        sWidth: 48,
        sHeight: 32,
        dx: this.x,
        dy: this.x,
        dWidth: 48,
        dHeight: 32,
        frame: 0
      })
    }
    initialize() {}
    update() {}
    draw() {
      drawImage(this.sprite)
    }

  }
