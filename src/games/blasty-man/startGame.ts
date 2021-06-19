import { BasedGame } from "../../engine/BasedEngine"
import { BlastyLevelOne } from "./levels/blastyOne"
import { BlastyStart } from "./levels/startBlasty"

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
      // Blasty man
      { key: 'start-screen', level: BlastyStart },
      { key: 'blasty-1', level: BlastyLevelOne },

    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
