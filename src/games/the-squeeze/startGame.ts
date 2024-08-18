import { BasedGame } from "../../engine/BasedEngine"
import CreditsScreen from "./levels/creditsScreen"
import { Level01 } from "./levels/level-01"
import { Level02 } from "./levels/level-02"
import { Level03 } from "./levels/level-03"
import { StandardLevel } from "./levels/standardLevel"
import { StartScreen } from "./levels/startScreen"

export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
      { key: 'start-screen', level: StartScreen },
      { key: 'credits-screen', level: CreditsScreen },
      { key: 'standard-level', level: StandardLevel },
      { key: 'level-01', level: Level01 },
      { key: 'level-02', level: Level02 },
      { key: 'level-03', level: Level03 },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
