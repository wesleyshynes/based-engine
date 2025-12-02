import { BasedGame } from "../../engine/BasedEngine"
import { BlackJack } from "./levels/blackJack"
import { CardBattle } from "./levels/cardBattle"
import CreditsScreen from "./levels/creditsScreen"
import { Level01 } from "./levels/level-01"
import { Overworld } from "./levels/overworld"
import { StartScreen } from "./levels/startScreen"

// export const START_LEVEL = 'card-battle' 
// export const START_LEVEL = 'overworld' 
// export const START_LEVEL = 'level-01' 
export const START_LEVEL = 'black-jack' 


export function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
      { key: 'start-screen', level: StartScreen },
      { key: 'credits-screen', level: CreditsScreen },
      { key: 'level-01', level: Level01 },
      { key: 'overworld', level: Overworld },
      { key: 'card-battle', level: CardBattle },
      { key: 'black-jack', level: BlackJack },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}
