import { BasedObject } from "../../../engine/BasedObject";
import { createSprite, drawCircle, drawImage, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import LeaderMonkeySprite from '../../../assets/vimjam2/LeaderMonkeySprite.png'
// import LeaderMonkeySprite from '../../../assets/vimjam2/MonkeyBoss_4.png'

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

  update(){
    this.updateSprite()
  }

  updateSprite() {
    if (this.sprite.lastUpdate + this.sprite.updateDiff < this.gameRef.lastUpdate) {
      this.sprite.frame++
      if (this.sprite.frame > 1) {
        this.sprite.frame = 0
      }
      this.sprite.lastUpdate = this.gameRef.lastUpdate
      this.sprite.sx = this.sprite.frame * this.sprite.dWidth
    }
  }

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
      x: this.gameRef.cameraPos.x + this.x + (this.sprite.flipX ? this.sprite.dWidth/2 : -this.sprite.dWidth/2),
      y: this.gameRef.cameraPos.y + this.y - this.sprite.dHeight/2,
      a: 0
    }, () => {
      // this.sprite.flipX = this.velocity.x < 0
      drawImage(this.sprite)
    })

    if(this.message) {
      drawText({
        c: this.gameRef.ctx,
        x: this.x + this.gameRef.cameraPos.x,
        y: this.y + this.gameRef.cameraPos.y - this.sprite.dHeight/2 - 16,
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
