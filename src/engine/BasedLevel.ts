import { BasedGame } from "../engine/BasedEngine";


export interface BasedLevelType {
  levelKey: string;
  gameRef: BasedGame;
  levelWidth: number;
  levelHeight: number;
  preload: () => Promise<void>;
  initialize: () => void;
  update: () => void;
  onResize: () => void;
  draw: () => void;
}

export class BasedLevel {
  levelKey: string;
  gameRef: BasedGame;
  levelWidth: number;
  levelHeight: number;

  constructor(levelSettings: { key: string, gameRef: BasedGame }) {
    this.levelKey = levelSettings.key
    this.gameRef = levelSettings.gameRef
    this.initialize = this.initialize.bind(this)
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.tearDown = this.tearDown.bind(this)
  }
  async preload() {}
  initialize() { }
  update() { }
  draw() { }
  resetLevel() {
    this.gameRef.loadLevel(this.levelKey)
  }
  onResize() { }
  tearDown() { }
}
