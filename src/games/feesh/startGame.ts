import { BasedGame } from "../../engine/BasedEngine"
import { LevelOneBase, OtherLevel } from "./levels/gameLevels"
import { StartLevel } from "./levels/startLevel"

export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    // width: window.innerWidth > 400 ? 400: window.innerWidth,
    // width: 400,
    height: window.innerHeight,
    // height: window.innerHeight > 400 ? 400 : window.innerHeight,
    // height: 600,
    levels: [
      // Feeshy
      { key: 'start-level', level: StartLevel },
      { key: 'new-level-1', level: OtherLevel },
      { key: 'level-one', level: LevelOneBase },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
