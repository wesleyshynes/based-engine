import { BasedGame } from "../../engine/BasedEngine"
import { LevelOne } from "./levels/levelOne"
import { StartScreen } from "./levels/startScreen"

export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
      { key: 'start-screen', level: StartScreen },
      { key: 'level-1', level: LevelOne },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
