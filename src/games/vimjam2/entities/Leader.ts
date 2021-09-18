import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import LeaderMonkeySprite from '../../../assets/vimjam2/MonkeyBoss_4.png'

export default class Leader extends BasedObject {

  x: number = 0
  y: number = 0

  radius: number = 32

  color: string = 'yellow'

  message: string = 'Bring Bananas!'
  sprite: any;

  async preload(){
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: LeaderMonkeySprite,
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
  }

  initialize(){}

  update(){}

  draw(){
    // drawCircle({
    //   c: this.gameRef.ctx,
    //   x: this.x + this.gameRef.cameraPos.x,
    //   y: this.y + this.gameRef.cameraPos.y,
    //   radius: this.radius,
    //   fillColor: this.color
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

    if(this.message) {
      drawText({
        c: this.gameRef.ctx,
        x: this.x + this.gameRef.cameraPos.x,
        y: this.y + this.gameRef.cameraPos.y - this.radius - 16,
        align:'center',
        fillColor: '#000',
        strokeColor: '#fff',
        strokeWidth: 3,
        style: '',
        weight: '900',
        fontFamily: 'sans-serif',
        fontSize: 16,
        text: this.message
      })
    }
  }

  tearDown(){}
}
