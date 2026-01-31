import { BasedGame } from "../../engine/BasedEngine"
import CreditsScreen from "./levels/creditsScreen"
import { Level01 } from "./levels/level-01"
import { Level02 } from "./levels/level-02"
import { Level03 } from "./levels/level-03"
import { Level04 } from "./levels/level-04"
import { Level05 } from "./levels/level-05"
import { StartScreen } from "./levels/startScreen"
import { SqueezeLevelEditor, TestableLevel } from "./editor"

export const START_LEVEL = 'level-01' 
// export const START_LEVEL = 'standard-level' 
// 
export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
      { key: 'start-screen', level: StartScreen },
      { key: 'credits-screen', level: CreditsScreen },
      { key: 'level-01', level: Level01 },
      { key: 'level-02', level: Level02 },
      { key: 'level-03', level: Level03 },
      { key: 'level-04', level: Level04 },
      { key: 'level-05', level: Level05 },
      { key: 'level-editor', level: SqueezeLevelEditor },
      { key: 'testable-level', level: TestableLevel },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
