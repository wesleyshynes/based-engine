import { BasedGame } from "./BasedEngine";

export class BasedObject {
  objectKey: string;
  x: number = 0
  y: number = 0
  gameRef: BasedGame
  constructor(objectSettings: { key: string, gameRef: BasedGame, options?: { [key: string]: any } }) {
    this.objectKey = objectSettings.key
    this.gameRef = objectSettings.gameRef
    this.initialize = this.initialize.bind(this)
    this.preload = this.preload.bind(this)
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.tearDown = this.tearDown.bind(this)
  }
  async preload() { }
  initialize() { }
  update() { }
  draw() { }
  tearDown() { }
}
