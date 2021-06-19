import { BasedGame } from "../../engine/BasedEngine"
import { TroopasLevel1 } from "./levels/TroopasLevel1-1"
import { TroopaStart } from "./TroopaStart"

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
      // Troopas
      { key: 'start-screen', level: TroopaStart },
      { key: 'troopa1-1', level: TroopasLevel1 },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
