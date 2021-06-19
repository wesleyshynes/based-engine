import { BasedGame } from "../../engine/BasedEngine"
import { WalkTheHumanStart } from "./levels/startWalk"
import { WalkOne } from "./levels/walkOne"

export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    // width: window.innerWidth,
    width: window.innerWidth > 400 ? 400: window.innerWidth,
    // width: 400,
    // height: window.innerHeight,
    height: window.innerHeight > 400 ? 400 : window.innerHeight,
    // height: 600,
    levels: [
      // Walk the human
      { key: 'start-screen', level: WalkTheHumanStart },
      { key: 'walk-1', level: WalkOne },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
