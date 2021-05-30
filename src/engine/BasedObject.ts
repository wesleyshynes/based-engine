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
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.tearDown = this.tearDown.bind(this)
  }
  initialize() { }
  update() { }
  draw() { }
  tearDown() { }
}
