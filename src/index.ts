import { BasedGame } from "./engine/BasedEngine";
import { TroopasLevel1 } from "./games/troopas/levels/TroopasLevel1-1";
import { TroopaStart } from "./games/troopas/TroopaStart";
import './assets/style.scss';

// import { LevelOneBase, OtherLevel } from "./levels/gameLevels";
// import { StartLevel } from "./levels/startLevel";

function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    // width: window.innerWidth > 600 ? 600: window.innerWidth,
    // width: 400,
    height: window.innerHeight,
    // height: window.innerHeight > 800 ? 800 : window.innerHeight,
    // height: 600,
    levels: [
      // { key: 'start-level', level: StartLevel },
      // { key: 'new-level-1', level: OtherLevel },
      // { key: 'level-one', level: LevelOneBase }
      { key: 'start-screen', level: TroopaStart },
      { key: 'troopa1-1', level: TroopasLevel1 },
    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}

const startBtn = document.getElementById('start-game')
const audioP: any = document.getElementById('audio-b')
// const fakeSound = new Audio()
// const fakeSound = new Audio('https://www.dizzisternberg.co.uk/music/Picts.mp3')
if(startBtn && audioP && audioP) {
  startBtn.addEventListener('click', () => {
    // fakeSound.muted = false
    // fakeSound.play()
    audioP.play()
    startGame()
    startBtn.remove()
    setTimeout(() => {
      audioP.remove()
    }, 500)
    // audioP.remove()
  })

}

// openFullscreen(newGame.canvasElement)
//
// function openFullscreen(elem: any) {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }
