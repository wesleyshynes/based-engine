import { BasedGame } from "../../engine/BasedEngine"
import CreditsScreen from "./levels/creditsScreen"
import { Level01 } from "./levels/level-01"
import { StartScreen } from "./levels/startScreen"

export const START_LEVEL = 'level-01' 
// export const START_LEVEL = 'standard-level' 


export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
      { key: 'start-screen', level: StartScreen },
      { key: 'credits-screen', level: CreditsScreen },
      { key: 'level-01', level: Level01 },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
