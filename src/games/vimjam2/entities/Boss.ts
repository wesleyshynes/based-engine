import Baddie from "./Baddie";
import BossMonkeySprite from '../../../assets/vimjam2/kingMonkey.png'
import { createSprite } from "../../../engine/libs/drawHelpers";
import Hurt1 from '../../../assets/vimjam2/monkey-1.mp3'
import Hurt2 from '../../../assets/vimjam2/monkey-2.mp3'
import Hurt3 from '../../../assets/vimjam2/monkey-3.mp3'

export default class Boss extends Baddie {
  radius: number = 32
  speed: number = 3

  health: number = 200

  async preload() {
    this.sprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: BossMonkeySprite,
      sx: 0,
      sy: 0,
      sWidth: 72,
      sHeight: 70,
      dx: 0,
      dy: 0,
      dWidth: 72,
      dHeight: 70,
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
  }
}
