import { BasedGame } from "../engine/BasedEngine";


export interface BasedLevelType {
  levelKey: string;
  gameRef: BasedGame;
  initialize: () => void;
  update: () => void;
  draw: () => void;
}

export class BasedLevel {
  levelKey: string;
  gameRef: BasedGame;

  constructor(levelSettings: { key: string, gameRef: BasedGame }) {
    this.levelKey = levelSettings.key
    this.gameRef = levelSettings.gameRef
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
