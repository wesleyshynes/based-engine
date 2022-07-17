import { BasedGame } from "../../engine/BasedEngine"
import CreditsScreen from "./levels/creditsScreen"
// import { LevelOne } from "./levels/levelOne"
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
    //   { key: 'level-1', level: LevelOne },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
